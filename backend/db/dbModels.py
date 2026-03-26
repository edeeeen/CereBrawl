from sqlmodel import Field, SQLModel


class DBQuizzes(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255, index=True)   
    subject: str = Field(max_length=100, index=True)
    user: str = Field(max_length=255, index=True)
    description: str | None = Field(default=None)
    bookmarks: int = Field(default=0)
    views: int = Field(default=0)
