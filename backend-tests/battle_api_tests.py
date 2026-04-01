import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app  # Import your FastAPI app instance

client = TestClient(app)

# Test Regex Success Case
def test_get_battle_question_regex_success():
    # We "mock" the AI to return a perfectly formatted string
    mock_ai_response = (
        "Question: What is 2+2?\n"
        "A. 3\nB. 4\nC. 5\nD. 6\n"
        "Correct Answer: B"
    )
    
    with patch("helpers.fakeGemini.generateQuizQuestion", return_value=mock_ai_response):
        response = client.get("/battle/generateQuestion?difficulty=1&subject=Math")
        
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "What is 2+2?"
    assert data["B"] == "4"
    assert data["Answer"] == "B"

# Test Regex Match Failure Case
def test_get_battle_question_invalid_format():
    # Mock the AI returning garbage that doesn't fit the regex
    mock_ai_response = "I am a broken AI and I forgot the format"
    
    with patch("helpers.fakeGemini.generateQuizQuestion", return_value=mock_ai_response):
        response = client.get("/battle/generateQuestion?difficulty=1&subject=Math")
    
    # This should trigger your HTTPException
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid question format"

# Test to make sure that if all the parameters aren't provided, the API returns a 422 error
def test_get_battle_question_missing_params():
    # Provide no paramaters
    response = client.get("/battle/generateQuestion")
    
    # Should return 422
    assert response.status_code == 422
    assert "detail" in response.json()

# Test an actual response is being formatted properly
def test_get_battle_question_success():
    response = client.get("/battle/generateQuestion?difficulty=1&subject=biology")
        
    assert response.status_code == 200
    data = response.json()
    assert data["question"] != None
    assert data["B"] != None
    assert data["Answer"] in ["A", "B", "C", "D"]

#Tests for HP change based on answer correctness
def testHPReturnCorrect():
    response = client.get("/battle/hpAnswerChange?answer=correct")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == -10

#Test that if the answer is wrong, no HP change occurs
def testHPReturnWrong():
    response = client.get("/battle/hpAnswerChange?answer=wrong")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == 0

def testDifficultyScaling():
    # Test that difficulty 1 returns -10 HP change for correct answer
    response = client.get("/battle/hpAnswerChange?answer=correct&difficulty=1")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == -10
    
    # Test that difficulty 2 returns -20 HP change for correct answer
    response = client.get("/battle/hpAnswerChange?answer=correct&difficulty=2")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == -20
    
    # Test that difficulty 3 returns -30 HP change for correct answer
    response = client.get("/battle/hpAnswerChange?answer=correct&difficulty=3")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == -30

def testDifficultyScalingWrong():
    # Test that difficulty 1 returns 0 HP change for wrong answer
    response = client.get("/battle/hpAnswerChange?answer=wrong&difficulty=1")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == 0
    
    # Test that difficulty 2 returns 0 HP change for wrong answer
    response = client.get("/battle/hpAnswerChange?answer=wrong&difficulty=2")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == 0
    
    # Test that difficulty 3 returns 0 HP change for wrong answer
    response = client.get("/battle/hpAnswerChange?answer=wrong&difficulty=3")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == 0

def testCriticalHit():
    # Test that a critical hit (answer=correct&critical=true) returns -20 HP change
    response = client.get("/battle/hpAnswerChange?answer=correct&critical=true")
    assert response.status_code == 200
    data = response.json()
    assert data["hpChange"] == -20




