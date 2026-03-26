from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DBQuizzes(Base):
    __tablename__ = "quizzes"

    id = Column(String(255), primary_key=True, index=True)
    name = Column(String)
    subject = Column(String)
    user = Column(String)
    description = Column(String, nullable=True)
    bookmarks = Column(Integer, default=0)
    views = Column(Integer, default=0)

    def __repr__(self):
        return f"<DBQuizzes(id='{self.id}', name='{self.name}')>"


from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class DBQuizzes(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str