import pytest
from fastapi.testclient import TestClient
from main import app
from db import db
from db.dbModels import Users as DBUser, Quizzes, LikedQuizzes
from sqlmodel import Session, create_engine, SQLModel, select
from sqlmodel.pool import StaticPool

client = TestClient(app)

# Setup test database
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client_with_db")
def client_with_db_fixture(session):
    def get_session_override():
        return session

    app.dependency_overrides[db.get_session] = get_session_override
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="authenticated_client")
def authenticated_client_fixture(client_with_db, session):
    # Register and login a test user
    register_response = client_with_db.post(
        "/login/register/",
        json={"username": "testuser", "password": "password123"}
    )
    assert register_response.status_code == 200

    token_response = client_with_db.post(
        "/login/token",
        data={"username": "testuser", "password": "password123"}
    )
    assert token_response.status_code == 200
    token = token_response.json()["access_token"]

    # Return client with authorization header
    client_with_db.headers.update({"Authorization": f"Bearer {token}"})
    return client_with_db


class TestQuizAPI:
    # Test creating an empty quiz successfully
    def test_create_quiz_success(self, authenticated_client, session):
        quiz_payload = {
            "quiz": {
                "name": "Test Quiz",
                "subject": "Math",
                "description": "A good description",
                "difficulty": 3
            },
            "questions": [
                {
                    "question": "What is 2+2?",
                    "a": "3",
                    "b": "4",
                    "c": "5",
                    "d": "6",
                    "correct_answer": "B"
                }
            ]
        }

        response = authenticated_client.post("/quizzes/createQuiz", json=quiz_payload)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert len(data["id"]) == 10  # nanoid size=10

        created_quiz = session.exec(select(Quizzes).where(Quizzes.short_id == data["id"]).limit(1)).first()
        assert created_quiz is not None
        assert created_quiz.name == "Test Quiz"
        assert created_quiz.subject == "math"
        assert created_quiz.description == "A good description"

    # Test creating quiz without authentication
    def test_create_quiz_unauthenticated(self, client_with_db):
        quiz_payload = {
            "quiz": {
                "name": "Test Quiz",
                "subject": "Math",
                "description": "A good description"
            },
            "questions": []
        }

        response = client_with_db.post("/quizzes/createQuiz", json=quiz_payload)
        assert response.status_code == 401

    # Test creating quiz with missing required fields
    def test_create_quiz_missing_fields(self, authenticated_client):
        # missing name and subject
        response = authenticated_client.post(
            "/quizzes/createQuiz",
            json={"quiz": {"subject": "Math"}, "questions": []}
        )
        assert response.status_code == 422

        # Missing all params
        response = authenticated_client.post(
            "/quizzes/createQuiz",
            json={"questions": []}
        )
        assert response.status_code == 422

    #test liking a quiz successfully
    def test_like_quiz_success(self, authenticated_client, session):
        quiz = Quizzes(short_id="likequiz1", name="Like Quiz", subject="Test", creator="testuser")
        session.add(quiz)
        session.commit()

        # Get the test user
        user = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()

        response = authenticated_client.post("/quizzes/likeQuiz/likequiz1")
        assert response.status_code == 200
        data = response.json()
        assert data["liked"] == True

        # Check that bookmark count increased
        session.refresh(quiz)
        assert quiz.bookmarks == 1

        # Check that LikedQuizzes entry was created
        liked_entry = session.exec(select(LikedQuizzes).where(LikedQuizzes.quiz_id == quiz.id)).first()
        assert liked_entry is not None
        assert liked_entry.user_id == user.id

    def test_unlike_quiz(self, authenticated_client, session):
        quiz = Quizzes(short_id="unlikequiz1", name="Unlike Quiz", subject="Test", creator="testuser")
        session.add(quiz)
        session.commit()

        # First like the quiz
        response = authenticated_client.post("/quizzes/likeQuiz/unlikequiz1")
        assert response.status_code == 200
        data = response.json()
        assert data["liked"] == True

        # Then unlike it
        response = authenticated_client.post("/quizzes/likeQuiz/unlikequiz1")
        assert response.status_code == 200
        data = response.json()
        assert data["liked"] == False

        # Check that bookmark count decreased
        session.refresh(quiz)
        assert quiz.bookmarks == 0

        # Check that LikedQuizzes entry was removed
        liked_entry = session.exec(select(LikedQuizzes).where(LikedQuizzes.quiz_id == quiz.id)).first()
        assert liked_entry is None

    def test_like_quiz_not_found(self, authenticated_client):
        response = authenticated_client.post("/quizzes/likeQuiz/notfound123")
        assert response.status_code == 404
        assert response.json()["detail"] == "Quiz not found"

    def test_get_quizzes_sort_and_filter(self, client_with_db, session):
        # Create a user first since quizzes have foreign key to users
        user = DBUser(short_id="creator1", username="creator1user", password_hash="hash1")
        session.add(user)
        session.commit()

        quiz1 = Quizzes(short_id="q1", name="A Quiz", subject="string", creator="creator1", create_date="2026-04-07T10:00:00")
        quiz2 = Quizzes(short_id="q2", name="B Quiz", subject="string", creator="creator1", create_date="2026-04-07T11:00:00")
        quiz3 = Quizzes(short_id="q3", name="C Quiz", subject="other", creator="creator1", create_date="2026-04-07T12:00:00")
        session.add_all([quiz1, quiz2, quiz3])
        session.commit()

        response = client_with_db.get("/quizzes/getQuizzes?sort_by=name&filter_subject=string")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["short_id"] == "q1"
        assert data[1]["short_id"] == "q2"
        assert all(quiz["subject"] == "string" for quiz in data)

    def test_get_quizzes_limit(self, client_with_db, session):
        # Create a user first since quizzes have foreign key to users
        user = DBUser(short_id="creator1", username="creator1user", password_hash="hash1")
        session.add(user)
        session.commit()

        quizzes = [
            Quizzes(short_id=f"limit{i}", name=f"Quiz {i}", subject="test", creator="creator1")
            for i in range(3)
        ]
        session.add_all(quizzes)
        session.commit()

        response = client_with_db.get("/quizzes/getQuizzes?limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    # Test getting quiz by ID - success case
    def test_get_quiz_by_id_success(self, client_with_db, session):
        quiz = Quizzes(short_id="testid1234", name="Test Quiz", subject="Math", creator="creator1")
        session.add(quiz)
        session.commit()

        response = client_with_db.get("/quizzes/getQuiz/testid1234")
        assert response.status_code == 200
        data = response.json()
        assert data["short_id"] == "testid1234"
        assert data["name"] == "Test Quiz"
        assert data["subject"] == "Math"

    # Test getting quiz by ID - not found case
    def test_get_quiz_by_id_not_found(self, client_with_db):
        response = client_with_db.get("/quizzes/getQuiz/nonexistent")
        assert response.status_code == 404
        assert "Quiz not found" in response.json()["detail"]

    # Test getting user quizzes
    def test_get_user_quizzes(self, client_with_db, session):
        # Create test users
        user1 = DBUser(short_id="user1", username="user1name", password_hash="hash1")
        user2 = DBUser(short_id="user2", username="user2name", password_hash="hash2")
        session.add_all([user1, user2])
        session.commit()

        # Create test quizzes for different users
        quiz1 = Quizzes(short_id="quiz1", name="Quiz 1", subject="Math", creator="user1")
        quiz2 = Quizzes(short_id="quiz2", name="Quiz 2", subject="Science", creator="user1")
        quiz3 = Quizzes(short_id="quiz3", name="Quiz 3", subject="History", creator="user2")
        session.add(quiz1)
        session.add(quiz2)
        session.add(quiz3)
        session.commit()

        response = client_with_db.get("/quizzes/getUserQuizzes/user1")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(quiz["creator"] == "user1name" for quiz in data)

        response = client_with_db.get("/quizzes/getUserQuizzes/user2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["creator"] == "user2name"

    # Test getting user quizzes when user has no quizzes
    def test_get_user_quizzes_empty(self, client_with_db):
        response = client_with_db.get("/quizzes/getUserQuizzes/nouser")
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_get_liked_quizzes(self, authenticated_client, session):
        # Get the current user's short_id from the authenticated_client
        # First create a quiz with the testuser creator
        user = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()
        
        quiz = Quizzes(short_id="likedquiz1", name="Liked Quiz", subject="Test", creator=user.short_id)
        session.add(quiz)
        session.commit()

        # Like the quiz
        response = authenticated_client.post("/quizzes/likeQuiz/likedquiz1")
        assert response.status_code == 200

        # Get liked quizzes
        response = authenticated_client.get("/quizzes/getUserLikedQuizzes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["short_id"] == "likedquiz1"

    def test_like_quiz_unauthenticated(self, client_with_db, session):
        # Create a user and quiz
        user = DBUser(short_id="creator2", username="creator2user", password_hash="hash1")
        session.add(user)
        session.commit()

        quiz = Quizzes(short_id="testlike1", name="Test Like", subject="Test", creator="creator2")
        session.add(quiz)
        session.commit()

        # Try to like without authentication
        response = client_with_db.post("/quizzes/likeQuiz/testlike1")
        assert response.status_code == 401

    def test_get_user_liked_quizzes_empty(self, authenticated_client):
        # Get liked quizzes when user hasn't liked any
        response = authenticated_client.get("/quizzes/getUserLikedQuizzes")
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_like_multiple_quizzes(self, authenticated_client, session):
        # Create a user to be the creator
        creator = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()
        
        # Create multiple quizzes
        quizzes = []
        for i in range(3):
            quiz = Quizzes(
                short_id=f"multilike{i}", 
                name=f"Multi Like Quiz {i}", 
                subject="Test", 
                creator=creator.short_id
            )
            quizzes.append(quiz)
        session.add_all(quizzes)
        session.commit()

        # Like all quizzes
        for i in range(3):
            response = authenticated_client.post(f"/quizzes/likeQuiz/multilike{i}")
            assert response.status_code == 200
            assert response.json()["liked"] == True

        # Get all liked quizzes
        response = authenticated_client.get("/quizzes/getUserLikedQuizzes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        liked_ids = [quiz["short_id"] for quiz in data]
        assert all(f"multilike{i}" in liked_ids for i in range(3))

    def test_like_quiz_from_multiple_users(self, authenticated_client, client_with_db, session):
        # Get the first user (testuser - already authenticated)
        user1 = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()
        
        # Create a second user in the database
        user2 = DBUser(short_id="user3", username="user3name", password_hash="fakehash")
        session.add(user2)
        session.commit()

        # Create a quiz by user1
        quiz = Quizzes(short_id="multuser1", name="Multi User Like", subject="Test", creator=user1.short_id)
        session.add(quiz)
        session.commit()

        # First user likes the quiz
        response = authenticated_client.post("/quizzes/likeQuiz/multuser1")
        assert response.status_code == 200
        assert response.json()["liked"] == True

        # Check bookmark count is 1
        session.refresh(quiz)
        assert quiz.bookmarks == 1

        # Simulate second user liking the quiz by directly creating the LikedQuizzes entry
        liked_entry = LikedQuizzes(quiz_id=quiz.id, user_id=user2.id)
        session.add(liked_entry)
        quiz.bookmarks += 1
        session.add(quiz)
        session.commit()

        # Check bookmark count increased to 2
        session.refresh(quiz)
        assert quiz.bookmarks == 2

        # Verify both users have the quiz liked in the database
        liked_entries = session.exec(select(LikedQuizzes).where(LikedQuizzes.quiz_id == quiz.id)).all()
        assert len(liked_entries) == 2
        user_ids = [entry.user_id for entry in liked_entries]
        assert user1.id in user_ids
        assert user2.id in user_ids

    def test_unlike_removes_from_liked_list(self, authenticated_client, session):
        # Create a quiz
        creator = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()
        quiz = Quizzes(short_id="untest1", name="Unlike Test", subject="Test", creator=creator.short_id)
        session.add(quiz)
        session.commit()

        # Like the quiz
        response = authenticated_client.post("/quizzes/likeQuiz/untest1")
        assert response.status_code == 200
        assert response.json()["liked"] == True

        # Verify it's in liked list
        response = authenticated_client.get("/quizzes/getUserLikedQuizzes")
        data = response.json()
        assert len(data) == 1

        # Unlike the quiz
        response = authenticated_client.post("/quizzes/likeQuiz/untest1")
        assert response.status_code == 200
        assert response.json()["liked"] == False

        # Verify it's removed from liked list
        response = authenticated_client.get("/quizzes/getUserLikedQuizzes")
        data = response.json()
        assert len(data) == 0

    def test_like_quiz_updates_views(self, authenticated_client, session):
        # Create a quiz
        creator = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()
        quiz = Quizzes(short_id="viewtest1", name="View Test", subject="Test", creator=creator.short_id)
        session.add(quiz)
        session.commit()

        # Get the quiz (should increment views)
        response = authenticated_client.get("/quizzes/getQuiz/viewtest1")
        assert response.status_code == 200
        session.refresh(quiz)
        initial_views = quiz.views
        assert initial_views == 1

        # Like the quiz (should not affect views)
        response = authenticated_client.post("/quizzes/likeQuiz/viewtest1")
        assert response.status_code == 200
        session.refresh(quiz)
        assert quiz.views == initial_views  # Views should not change when liking

    def test_like_same_quiz_twice(self, authenticated_client, session):
        # Create a quiz
        creator = session.exec(select(DBUser).where(DBUser.username == "testuser")).first()
        quiz = Quizzes(short_id="twice1", name="Twice Test", subject="Test", creator=creator.short_id)
        session.add(quiz)
        session.commit()

        # Like the quiz
        response = authenticated_client.post("/quizzes/likeQuiz/twice1")
        assert response.status_code == 200
        assert response.json()["liked"] == True
        session.refresh(quiz)
        assert quiz.bookmarks == 1

        # Like the quiz again (should unlike)
        response = authenticated_client.post("/quizzes/likeQuiz/twice1")
        assert response.status_code == 200
        assert response.json()["liked"] == False
        session.refresh(quiz)
        assert quiz.bookmarks == 0

        # Like the quiz a third time (should like again)
        response = authenticated_client.post("/quizzes/likeQuiz/twice1")
        assert response.status_code == 200
        assert response.json()["liked"] == True
        session.refresh(quiz)
        assert quiz.bookmarks == 1