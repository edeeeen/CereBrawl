import pytest
from fastapi.testclient import TestClient
from main import app
from db import db
from db.dbModels import Users as DBUser, Quizzes
from sqlmodel import Session, create_engine, SQLModel
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
        quiz_data = {
            "name": "Test Quiz",
            "subject": "Math",
            "description": "A good description"
        }
        response = authenticated_client.post("/quizzes/addEmptyQuiz", json=quiz_data)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert len(data["id"]) == 10  # nanoid size=10

        # Verify quiz was created in database
        quiz = session.get(Quizzes, 1)
        assert quiz is not None
        assert quiz.name == "Test Quiz"
        assert quiz.subject == "Math"
        assert quiz.description == "A good description"
