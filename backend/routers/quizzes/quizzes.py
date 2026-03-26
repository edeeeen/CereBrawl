from db import db, dbModels
from models.quizzes import create_quiz_request, create_quiz_response, QuizResponse
from sqlalchemy import select

from fastapi import APIRouter
import nanoid

router = APIRouter(
    prefix='/quizzes',
    tags=['quizzes']
)

def generate_quiz_id():
    # Generates a 10-character unique string
    return nanoid.generate(size=10)

'''
Create an empty quiz with just a name, subject, user, and description.
Parameters:
- name: str
- subject: str
- user: str
- description: str (optional)
Returns:
- id: str (the id of the created quiz)
'''
@router.post("/addEmptyQuiz", response_model=create_quiz_response)
def create_quiz(quiz: create_quiz_request, session: db.SessionDep):
    '''
    Create an empty quiz with just a name, subject, user, and description.

    Returns the id of the created quiz.

    Still subject to change, do not use yet
    '''
    quiz_data = quiz.model_dump()
    quiz_data['short_id'] = generate_quiz_id()
    quiz_db = dbModels.Quizzes(**quiz_data)
    session.add(quiz_db)
    session.commit()
    session.refresh(quiz_db)
    return create_quiz_response(id=quiz_db.short_id)

'''
Test request to get all quizzes.
Do not use in production, just for testing purposes.
Will be removed later.
'''
@router.get("/getAllQuizzes", response_model=list[QuizResponse])
def get_all_quizzes(session: db.SessionDep):
    '''
    For testing only, do not use in production. Gets all quizzes.
    '''
    quizzes = session.exec(select(dbModels.Quizzes)).scalars().all()

    # Convert SQLModel objects to Pydantic models
    return [QuizResponse(**q.model_dump()) for q in quizzes]


@router.get("/getQuiz/{quiz_id}")
def get_quiz_by_id(quiz_id: str, session: db.SessionDep):
    '''
    Gets a quiz by id.
    '''
    print(quiz_id)
    quiz = session.exec(select(dbModels.Quizzes).where(dbModels.Quizzes.short_id == quiz_id)).scalars().first()
    
    if quiz is None:
        return {"error": "Quiz not found"}
    return QuizResponse(**quiz.model_dump())    