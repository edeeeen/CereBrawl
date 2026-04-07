from typing import Annotated

from db import db
from models.login import UserResponse
from db.dbModels import Quizzes, QuizQuestions
from models.quizzes import create_quiz_request, create_quiz_response, QuizResponse, QuizInfo, QuestionInput, QuestionResponse, QuizWithQuestionsResponse
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
@router.post("/createQuiz", response_model=create_quiz_response)
def create_quiz(
    data: create_quiz_request, 
    session: db.SessionDep,
    current_user: Annotated[UserResponse, Depends(get_current_active_user)],
):
    '''
    Create a quiz with name, subject, description, and a list of questions.
    Each question should have: question (text), a, b, c, d (options), correct_answer (A/B/C/D).
    The creator is automatically set to the current authenticated user.

    Returns the short_id of the created quiz.
    '''
    quiz_info = data.quiz
    questions = data.questions
    
    # Create the quiz
    quiz_data = quiz_info.model_dump()
    quiz_data['short_id'] = generate_quiz_id()
    quiz_data['creator'] = current_user.short_id
    quiz_db = Quizzes(**quiz_data)
    session.add(quiz_db)
    session.commit()
    session.refresh(quiz_db)
    
    # Add questions
    for i, q in enumerate(questions, start=1):
        question_data = {
            'quiz_id': quiz_db.id,
            'question_number': i,
            'question': q.question,
            'option_a': q.a,
            'option_b': q.b,
            'option_c': q.c,
            'option_d': q.d,
            'correct_answer': q.correct_answer
        }
        question_db = QuizQuestions(**question_data)
        session.add(question_db)
    
    session.commit()
    
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

Returns the quiz info along with the list of questions.
'''
@router.get("/getQuiz/{quiz_id}")
def get_quiz_by_id(
    session: db.SessionDep,
    quiz_id: str =  Path(..., description="The id of the quiz")
) -> QuizWithQuestionsResponse:
    '''
    Gets a quiz by id, including all questions and answers.
    '''
    # Use the short_id to query for the quiz
    statement = select(Quizzes).where(Quizzes.short_id == quiz_id)
    quiz = session.exec(statement).scalars().first()

    # Check if no quiz is found with the given id
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Query the questions for this quiz
    questions_statement = select(QuizQuestions).where(QuizQuestions.quiz_id == quiz.id).order_by(QuizQuestions.question_number)
    questions = session.exec(questions_statement).scalars().all()

    # Convert questions to response model
    questions_response = [
        QuestionResponse(
            question_number=q.question_number,
            question=q.question,
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d,
            correct_answer=q.correct_answer
        ) for q in questions
    ]

    return QuizWithQuestionsResponse(
        short_id=quiz.short_id,
        name=quiz.name,
        subject=quiz.subject,
        creator=quiz.creator,
        description=quiz.description,
        bookmarks=quiz.bookmarks,
        views=quiz.views,
        create_date=quiz.create_date,
        questions=questions_response
    )


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