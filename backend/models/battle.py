from pydantic import BaseModel

class get_battle_question_response(BaseModel):
    question: str
    A: str
    B: str
    C: str
    D: str
    Answer: str
