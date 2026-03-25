from pydantic import BaseModel

class get_battle_question_response(BaseModel):
    question: str
    A: str
    B: str
    C: str
    D: str
    Answer: str


class submit_battle_answer_request(BaseModel):
    answer: str
    correctAnswer: str
    playerHP: int
    enemyHP: int

class submit_battle_answer_response(BaseModel):
    result: str
    playerHP: int
    enemyHP: int    