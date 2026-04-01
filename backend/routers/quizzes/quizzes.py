from typing import Annotated

from db import db
from models.login import UserResponse
from db.dbModels import Quizzes, QuizQuestions
from models.quizzes import create_quiz_request, create_quiz_response, QuizResponse
from routers.login.login import get_current_active_user
from sqlalchemy import select

from fastapi import APIRouter, Depends, HTTPException, Path
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
def create_quiz(
    quiz: create_quiz_request, 
    session: db.SessionDep,
    current_user: Annotated[UserResponse, Depends(get_current_active_user)],
):
    '''
    Create an empty quiz with just a name, subject, and description.
    The creator is automatically set to the current authenticated user.

    Returns the id of the created quiz.

    Still subject to change, do not use yet
    '''
    quiz_data = quiz.model_dump()
    quiz_data['short_id'] = generate_quiz_id()
    quiz_data['creator'] = current_user.short_id
    quiz_db = Quizzes(**quiz_data)
    session.add(quiz_db)
    session.commit()
    session.refresh(quiz_db)
    return create_quiz_response(id=quiz_db.short_id)

'''
Test request to get all quizzes.
Do not use in production, just for testing purposes.
Will be removed later.
'''
@router.get("/getAllQuizzes")
def get_all_quizzes(session: db.SessionDep) -> list[QuizResponse]:
    '''
    For testing only, do not use in production. Gets all quizzes.
    '''

    # Query all quizzes from the database
    statement = select(Quizzes)
    quizzes = session.exec(statement).scalars().all()

    return [QuizResponse(**quiz.model_dump()) for quiz in quizzes]

'''
Get a quiz by id.
Parameters:
- quiz_id: str (the short_id of the quiz)
'''
@router.get("/getQuiz/{quiz_id}")
def get_quiz_by_id(
    session: db.SessionDep,
    quiz_id: str =  Path(..., description="The id of the quiz")
) -> QuizResponse:
    '''
    Gets a quiz by id.
    '''
    # Use the short_id to query for the quiz
    statement = select(Quizzes).where(Quizzes.short_id == quiz_id)
    quiz = session.exec(statement).scalars().first()

    # Check if no quiz is found with the given id
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return QuizResponse(**quiz.model_dump())


@router.get("/getUserQuizzes/{user_id}") 
def get_user_quizzes (
    session: db.SessionDep,
    user_id: str = Path(..., description="The user id"), 
) -> list[QuizResponse]: 
    '''
    Gets all quizzes created by a user.
    '''
    statement = select(Quizzes).where(Quizzes.creator == user_id)
    quizzes = session.exec(statement).scalars().all()

    return [QuizResponse(**quiz.model_dump()) for quiz in quizzes]