from pydantic import BaseModel

class UserResponse(BaseModel):
    short_id: str
    username: str
    create_date: str
    disabled: bool | None = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None