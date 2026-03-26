from sqlmodel import Field, SQLModel


class DBQuizzes(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    short_id: str = Field(max_length=10, unique=True, index=True) # use this one for sharing quizzes to prevent exposing internal ids
    name: str = Field(max_length=255)
    subject: str = Field(max_length=100, index=True)
    user: str = Field(max_length=255, index=True)
    description: str | None = Field(default=None)
    bookmarks: int = Field(default=0)
    views: int = Field(default=0)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(max_length=255, unique=True, index=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)