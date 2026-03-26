from db import db, dbModels
from models.quizzes import create_quiz_request, create_quiz_response

from fastapi import APIRouter

router = APIRouter(
    prefix='/quizzes',
    tags=['quizzes']
)

'''
Create an empty quiz with just a name, subject, user, and description.
Parameters:
- name: str
- subject: str
- user: str
- description: str (optional)
Returns:
- id: int (the id of the created quiz)
'''
@router.post("/addEmptyQuiz", response_model=create_quiz_response)
def create_quiz(quiz: create_quiz_request, session: db.SessionDep):
    '''
    Create an empty quiz with just a name, subject, user, and description.

    Returns the id of the created quiz.

    Still subject to change, do not use yet
    '''
    quiz_db = dbModels.DBQuizzes(**quiz.dict())
    session.add(quiz_db)
    session.commit()
    session.refresh(quiz_db)
    return create_quiz_response(id=quiz_db.id)

'''
Test request to get all quizzes.
Do not use in production, just for testing purposes.
Will be removed later.
'''
@router.get("/getAllQuizzes")
def get_all_quizzes(session: db.SessionDep):
    '''
    For testing only, do not use in production. Gets all quizzes.
    '''
    quizzes = session.query(dbModels.DBQuizzes).all()
    return quizzes