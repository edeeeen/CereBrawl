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
    
    # Test for missing fields in registration 
    # Is supposed to fail with 422 error
    # Tests both missing username and missing password 
    def test_register_missing_fields(self, client_with_db):

        # Missing password
        response = client_with_db.post(
            "/login/register/",
            json={"username": "testuser"}
        )
        assert response.status_code == 422
        
        # Missing username
        response = client_with_db.post(
            "/login/register/",
            json={"password": "password123"}
        )
        assert response.status_code == 422

    
    # Test for user login being successful
    def test_login_success(self, client_with_db, session):
        # Register user first
        client_with_db.post(
            "/login/register/",
            json={"username": "testuser", "password": "password123"}
        )
        
        # Login request
        response = client_with_db.post(
            "/login/token",
            data={"username": "testuser", "password": "password123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    # Test for login with incorrect username
    def test_login_invalid_username(self, client_with_db):
        response = client_with_db.post(
            "/login/token",
            data={"username": "nonexistent", "password": "password123"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

    # Test for incorrect password
    def test_login_wrong_password(self, client_with_db):
        # Register user
        client_with_db.post(
            "/login/register/",
            json={"username": "testuser", "password": "correctpassword"}
        )
        
        # Try login with wrong password
        response = client_with_db.post(
            "/login/token",
            data={"username": "testuser", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]


    # test for /users/me to get user info 
    def test_get_current_user_success(self, client_with_db):
        # Register and login
        register_response = client_with_db.post(
            "/login/register/",
            json={"username": "testuser", "password": "password123"}
        )
        registered_user = register_response.json()
        
        token_response = client_with_db.post(
            "/login/token",
            data={"username": "testuser", "password": "password123"}
        )
        token = token_response.json()["access_token"]
        
        # Get current user
        response = client_with_db.get(
            "/login/users/me/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["short_id"] == registered_user["short_id"]
    

    # Tests for /users/me endpoint with no token
    def test_get_current_user_no_token(self, client_with_db):
        response = client_with_db.get("/login/users/me/")
        assert response.status_code == 401
    
    # Tests for /users/me endpoint with invalid token
    def test_get_current_user_invalid_token(self, client_with_db):
        """Test getting current user with invalid token"""
        response = client_with_db.get(
            "/login/users/me/",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
