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

class submit_battle_answer_request(BaseModel):
    answer: str
    correctAnswer: str
    playerHP: int
    enemyHP: int
    difficulty: int = 1
    questionsRight: int = 0
    questionsWrong: int = 0

class submit_battle_answer_response(BaseModel):
    result: str
    playerHP: int
    enemyHP: int
    difficulty: int
    critHit: bool
    questionsRight: int
    questionsWrong: int    

class use_item_request(BaseModel):
    itemName: str
    playerHP: int
    enemyHP: int
    
class use_item_response(BaseModel):
    result: str
    playerHP: int
    enemyHP: int
