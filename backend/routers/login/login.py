from db import db, dbModels

from fastapi import APIRouter

router = APIRouter(
    prefix='/login',
    tags=['login']
)

