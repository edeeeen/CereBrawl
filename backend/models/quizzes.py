from pydantic import BaseModel

class create_quiz_response(BaseModel):
    id: str

class create_quiz_request(BaseModel):
    name: str 
    subject: str
    user: str
    description: str | None = None
