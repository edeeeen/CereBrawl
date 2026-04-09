from typing import Annotated

from db import db
from models.login import UserResponse
from db.dbModels import Quizzes, QuizQuestions, LikedQuizzes, Users
from models.quizzes import create_quiz_request, create_quiz_response, QuizResponse, QuestionResponse, QuizWithQuestionsResponse
from routers.login.login import get_current_active_user
from sqlalchemy import select

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Query
import nanoid
from enum import Enum

class SortBy(str, Enum):
    name = "name"
    subject = "subject"
    create_date = "create_date"
    bookmarks = "bookmarks"



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
    quiz_data['subject'] = quiz_data['subject'].lower()
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
Gets all quizzes with optional sorting and filtering by subject.
Can have limits on the number of quizzes returned.
'''
@router.get("/getQuizzes")
def get_all_quizzes(
    session: db.SessionDep,
    sort_by: SortBy | None = Query(None, description="The field to sort by (name, subject, create_date)"),
    filter_subject: str | None = Query(None, description="The field to filter by subject (biology, math, etc.).  Note: can be null"),
    limit: int | None = Query(None, description="The maximum number of quizzes to return. If no limit specificed it returns 50", ge=0, le=100)
) -> list[QuizResponse]:
    '''
    Get all quizzes with optional sorting and filtering.
    '''
    if(limit == None):
        limit = 50
    statement = select(Quizzes).limit(limit)
    
    # Apply filter if provided
    if filter_subject:
        statement = statement.where(Quizzes.subject == filter_subject.lower())
    
    # Apply sorting
    if sort_by == SortBy.name:
        statement = statement.order_by(Quizzes.name)
    elif sort_by == SortBy.subject:
        statement = statement.order_by(Quizzes.subject)
    elif sort_by == SortBy.create_date:
        statement = statement.order_by(Quizzes.create_date)
    elif sort_by == SortBy.bookmarks:
        statement = statement.order_by(Quizzes.bookmarks.desc())
    else:
        statement = statement.order_by(Quizzes.create_date)  # default
    
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

'''
Get all quizzes created by a user.
'''
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


@router.post("/likeQuiz/{quiz_id}")
def like_quiz(
    session: db.SessionDep,
    current_user: Annotated[UserResponse, Depends(get_current_active_user)],
    quiz_id: str = Path(..., description="The id of the quiz to like"),
): 
    '''
    Like a quiz. If they already liked it, unlike it.
    '''
    statement = select(LikedQuizzes).where(
        (LikedQuizzes.quiz_id == select(Quizzes.id).where(Quizzes.short_id == quiz_id).scalar_subquery()) &
        (LikedQuizzes.user_id == select(Users.id).where(Users.short_id == current_user.short_id).scalar_subquery())
    )

    statement_quiz = select(Quizzes).where(Quizzes.short_id == quiz_id)
    quiz = session.exec(statement_quiz).scalars().first()

    # Check if no quiz is found with the given id
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    # Check if the user has already liked the quiz
    if(session.exec(statement).scalars().first()):
        # User has already liked the quiz
        liked = False
        delete_statement = select(LikedQuizzes).where(
            (LikedQuizzes.quiz_id == select(Quizzes.id).where(Quizzes.short_id == quiz_id).scalar_subquery()) &
            (LikedQuizzes.user_id == select(Users.id).where(Users.short_id == current_user.short_id).scalar_subquery())
        )
        liked_quiz = session.exec(delete_statement).scalars().first()
        quiz.bookmarks -= 1
        session.delete(liked_quiz)
    else:
        # User has not liked the quiz yet
        liked = True
        new_like = LikedQuizzes(
            quiz_id=session.exec(select(Quizzes.id).where(Quizzes.short_id == quiz_id)).scalar(),
            user_id=session.exec(select(Users.id).where(Users.short_id == current_user.short_id)).scalar()
        )
        quiz.bookmarks += 1
        session.add(new_like)
    
    session.add(quiz)
    session.commit()

    return {"liked": liked}

@router.get("getUserLikedQuizzes")
def get_user_liked_quizzes(
    session: db.SessionDep,
    current_user: Annotated[UserResponse, Depends(get_current_active_user)],
) -> list[QuizResponse]:
    '''
    Get all quizzes liked by the current user.
    '''
    statement = select(Quizzes).where(
        Quizzes.id.in_(
            select(LikedQuizzes.quiz_id).where(
                LikedQuizzes.user_id == session.exec(select(Users.id).where(Users.short_id == current_user.short_id)).scalar()
            )
        )
    )

    quizzes = session.exec(statement).scalars().all()

    return [QuizResponse(**quiz.model_dump()) for quiz in quizzes]