from db import db
from db.dbModels import Users as DBUser
from models.login import UserResponse, Token, TokenData
import nanoid

from sqlmodel import select
from dotenv import load_dotenv
import os
from fastapi import APIRouter
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel

router = APIRouter(
    prefix='/login',
    tags=['login']
)

#https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/#install-pwdlib

load_dotenv()

SECRET_KEY = os.getenv("HASH_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")

class UserInDB(UserResponse):
    hashed_password: str


password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummypassword")

def generate_user_id():
    # Generates a 10-character unique string
    return nanoid.generate(size=10)

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(session, username: str):
    user = session.exec(select(DBUser).where(DBUser.username == username)).first()
    if user:
        print("User found in database")
        return UserInDB(short_id=user.short_id, username=user.username, hashed_password=user.password_hash, disabled=False, create_date=user.account_created)



def authenticate_user(session,username: str, password: str):
    user = get_user(session, username)
    # do this to prevent timing attacks
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: db.SessionDep):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(session, username=token_data.username)
    if user is None:
        raise credentials_exception
    return UserResponse(short_id=user.short_id, username=user.username, disabled=user.disabled, create_date=user.create_date)


async def get_current_active_user(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/token")
async def login_for_access_token(
    session: db.SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/users/me/")
async def read_users_me(
    current_user: Annotated[UserResponse, Depends(get_current_active_user)],
) -> UserResponse:
    return current_user

class UserRegister(BaseModel):
    username: str
    password: str


@router.post("/register/")
async def register_user(
    session: db.SessionDep,
    user_data: UserRegister,
) -> UserResponse:
    '''
    Register a user with a username and password.
    '''
    existing_user = session.exec(select(DBUser).where(DBUser.username == user_data.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user_data.password)
    short_id = generate_user_id()
    new_user = DBUser(username=user_data.username, password_hash=hashed_password, short_id=short_id)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return UserResponse(short_id=new_user.short_id, username=new_user.username, create_date=new_user.account_created, disabled=False)