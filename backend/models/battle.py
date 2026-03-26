from pydantic import BaseModel

class get_battle_question_response(BaseModel):
    question: str
    A: str
    B: str
    C: str
    D: str
    Answer: str

class create_quiz_request(BaseModel):
    name: str
    subject: str
    user: str
    description: str | None = None

class create_quiz_response(BaseModel):
    id: int
