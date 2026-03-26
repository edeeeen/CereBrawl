from pydantic import BaseModel

class create_quiz_response(BaseModel):
    id: str

class QuizResponse(BaseModel):
    id: int
    short_id: str
    name: str
    subject: str
    description: str | None = None
    bookmarks: int
    views: int
    create_date: str

class create_quiz_request(BaseModel):
    name: str 
    subject: str
    user: str
    description: str | None = None
