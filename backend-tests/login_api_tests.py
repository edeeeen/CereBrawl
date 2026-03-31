import pytest
from fastapi.testclient import TestClient
from main import app
from db import db
from db.dbModels import Users as DBUser
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


# Login api tests

class TestLoginAPI:
    # Test that user registration works successfully
    def test_register_success(self, client_with_db, session):
        """Test successful user registration"""
        response = client_with_db.post(
            "/login/register/",
            json={"username": "testuser", "password": "password123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["short_id"]
        assert data["disabled"] == False
    
    # Test two users cannot register with the same username
    def test_register_duplicate_username(self, client_with_db, session):
        # Register first user
        client_with_db.post(
            "/login/register/",
            json={"username": "testuser", "password": "password123"}
        )
        
        # Try to register with same username
        response = client_with_db.post(
            "/login/register/",
            json={"username": "testuser", "password": "differentpassword"}
        )
        assert response.status_code == 400
        assert "Username already registered" in response.json()["detail"]
    