from pydantic import BaseModel

class create_quiz_response(BaseModel):
    id: str

class QuizResponse(BaseModel):
    short_id: str
    name: str
    subject: str
    creator: str
    description: str | None = None
    bookmarks: int
    views: int
    create_date: str

class QuestionResponse(BaseModel):
    question_number: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str

class QuizWithQuestionsResponse(BaseModel):
    short_id: str
    name: str
    subject: str
    creator: str
    description: str | None = None
    bookmarks: int
    views: int
    create_date: str
    questions: list[QuestionResponse]

class QuizInfo(BaseModel):
    name: str
    subject: str
    description: str | None = None

class QuestionInput(BaseModel):
    question: str
    a: str
    b: str
    c: str
    d: str
    correct_answer: str

class create_quiz_request(BaseModel):
    quiz: QuizInfo
    questions: list[QuestionInput]