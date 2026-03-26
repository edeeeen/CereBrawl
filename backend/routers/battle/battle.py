import helpers.fakeGemini
import models.battle

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
    raw_text = helpers.fakeGemini.generateQuizQuestion(subject)
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
        
    return match.groupdict()