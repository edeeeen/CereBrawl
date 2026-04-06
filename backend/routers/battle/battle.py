import helpers.fakeGemini
import models.battle
import random

from fastapi import APIRouter, Depends, HTTPException
from fastapi import Request
from fastapi import Query

import re

router = APIRouter(
    prefix='/battle',
    tags=['battle']
)

'''
Generate a question for battle mode.
Parameters: 
- difficulty: int (1-5)
- subject: str (e.g., "biology", "history", "geography")
Returns:
- question: str
- options: dict (e.g., {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"})
- correct_answer: str (e.g., "A", "B", "C", "D")

Currently uses fake gemini, but once we are ready to show off we can swap it out.  
'''
@router.get("/generateQuestion", response_model=models.battle.get_battle_question_response)
async def get_battle_question(request: Request, 
    difficulty: int = Query(..., description="How difficult the question is from 1-5", ge=1, le=5),
    subject: str = Query(..., description="The subject of the question", min_length=1)
):
    '''
    Generate a question for a quiz.
    '''
    raw_text = helpers.fakeGemini.generateQuizQuestion(subject, difficulty)
    if(raw_text == None):
        print(f"DEBUG: Gemini returned nothing {raw_text}")
        raise HTTPException(status_code=400, detail="Invalid question format")
    raw_text = raw_text.strip()
    
    # Regex to get the question, options, and correct answer from the raw text
    pattern = (
        r"Question:\s*(?P<question>.*?)\s+"
        r"A\.\s*(?P<A>.*?)\s+"
        r"B\.\s*(?P<B>.*?)\s+"
        r"C\.\s*(?P<C>.*?)\s+"
        r"D\.\s*(?P<D>.*?)\s+"
        r"Correct Answer:\s*(?P<Answer>.*)"
    )
    
    match = re.search(pattern, raw_text, re.DOTALL | re.IGNORECASE)
    
    if not match:
        # If matching failed
        print(f"DEBUG: Failed to match this text: {raw_text}")
        raise HTTPException(status_code=400, detail="Invalid question format")
        
    return {
    "question": match.group("question").strip(),
    "A": match.group("A").strip(),
    "B": match.group("B").strip(),
    "C": match.group("C").strip(),
    "D": match.group("D").strip(),
    "Answer": match.group("Answer").strip()[-1]
}

'''
Submit an answer for battle mode and calculate HP changes.
Parameters:
- answer: str (the user's selected answer)
- correctAnswer: str (the correct answer)
- playerHP: int (the player's current HP)
- enemyHP: int (the enemy's current HP)
Returns:
- result: str (either "correct" or "wrong")
- playerHP: int (the player's updated HP)
- enemyHP: int (the enemy's updated HP)
'''
@router.post("/hpAnswerChange", response_model=models.battle.submit_battle_answer_response)
async def submit_battle_answer(data: models.battle.submit_battle_answer_request):

    selected = data.answer
    correct = data.correctAnswer
    player_hp = data.playerHP
    enemy_hp = data.enemyHP
    questions_right = data.questionsRight
    questions_wrong = data.questionsWrong
    difficulty = data.difficulty

    if selected is None or correct is None:
        raise HTTPException(status_code=400, detail="Missing data")

    crit_hit = False
    if selected == correct:
        if(random.random() < 0.1):
            enemy_hp -= 20
            crit_hit = True
            result = "correct"
            questions_right += 1
            questions_wrong = 0
            if(questions_right == 2 and difficulty < 5):
                difficulty += 1
                questions_right = 0
        else:
            enemy_hp -= 10
            result = "correct"
            questions_right += 1
            questions_wrong = 0
            if(questions_right == 2 and difficulty < 5):
                difficulty += 1
                questions_right = 0
    else:
        if(random.random() < 0.1):
            player_hp -= 20
            crit_hit = True
            result = "wrong"
            questions_wrong += 1
            questions_right = 0
            if(questions_wrong == 2 and difficulty > 1):
                difficulty -= 1
                questions_wrong = 0
        else:
            player_hp -= 10
            result = "wrong"
            questions_wrong += 1
            questions_right = 0
            if(questions_wrong == 2 and difficulty > 1):
                difficulty -= 1
                questions_wrong = 0

    return {
        "result": result,
        "playerHP": player_hp,
        "enemyHP": enemy_hp,
        "difficulty": difficulty,
        "critHit": crit_hit,
        "questionsRight": questions_right,
        "questionsWrong": questions_wrong
    }

@router.post("/useItem", response_model=models.battle.use_item_response)
async def use_item(data: models.battle.use_item_request):
    item_name = data.itemName
    player_hp = data.playerHP
    enemy_hp = data.enemyHP

    if item_name is None:
        raise HTTPException(status_code=400, detail="Missing item name")

    if item_name == "Mini Shield":
        player_hp += 10
        if player_hp > 100:
            player_hp = 100
    elif item_name == "Big Shield":
        player_hp += 20
        if player_hp > 100:
            player_hp = 100
    elif item_name == "Chug Jug":
        player_hp += 50
        if player_hp > 100:
            player_hp = 100
        
    else:
        raise HTTPException(status_code=400, detail="Invalid item name")

    return {
        "playerHP": player_hp,
        "enemyHP": enemy_hp
    }