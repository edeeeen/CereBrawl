import pytest
from fastapi.testclient import TestClient
from main import app
from db import db
from db.dbModels import Users as DBUser, Quizzes
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
                "description": "A good description"
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
        quiz = Quizzes(short_id="like1234567", name="Like Quiz", subject="test", creator="creator1", bookmarks=0)
        session.add(quiz)
        session.commit()

        response = authenticated_client.post("/quizzes/likeQuiz/like1234567")
        assert response.status_code == 200
        assert response.json()["message"] == "Quiz liked successfully"

        updated_quiz = session.exec(select(Quizzes).where(Quizzes.short_id == "like1234567")).first()
        assert updated_quiz.bookmarks == 1

    def test_like_quiz_not_found(self, authenticated_client):
        response = authenticated_client.post("/quizzes/likeQuiz/notfound123")
        assert response.status_code == 404
        assert response.json()["detail"] == "Quiz not found"

    def test_get_quizzes_sort_and_filter(self, client_with_db, session):
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
        assert all(quiz["creator"] == "user1" for quiz in data)

        response = client_with_db.get("/quizzes/getUserQuizzes/user2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["creator"] == "user2"

    # Test getting user quizzes when user has no quizzes
    def test_get_user_quizzes_empty(self, client_with_db):
        response = client_with_db.get("/quizzes/getUserQuizzes/nouser")
        assert response.status_code == 200
        data = response.json()
        assert data == []