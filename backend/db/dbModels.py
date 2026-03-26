from sqlmodel import Field, SQLModel

'''
Model for quizzes
Does not contain questions, just the quiz metadata. 
Questions are stored in a separate table linked by quiz_id.
'''
class DBQuizzes(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    short_id: str = Field(max_length=10, unique=True, index=True) # use this one for sharing quizzes to prevent exposing internal ids
    name: str = Field(max_length=255)
    subject: str = Field(max_length=100, index=True)
    #user_id: int = Field(foreign_key="user.id")
    description: str | None = Field(default=None)
    bookmarks: int = Field(default=0)
    views: int = Field(default=0)
    create_date: str = Field(default_factory=lambda: __import__('datetime').datetime.utcnow().isoformat())

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    short_id: str = Field(max_length=10, unique=True, index=True)
    username: str = Field(max_length=255, unique=True, index=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    account_created: str = Field(default_factory=lambda: __import__('datetime').datetime.utcnow().isoformat())
    
'''
Model for quiz questions, linked to quizzes by quiz_id.
Contains the question text, options, and correct answer.
'''
class QuizQuestions(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    quiz_id: int = Field(foreign_key="dbquizzes.id")
    question_number: int = Field(default=1)
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str