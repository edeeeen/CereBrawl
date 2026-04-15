import random

from google import genai
import os
from dotenv import load_dotenv
import re

load_dotenv()

# Create client using API key from environment variable
client = genai.Client(api_key= os.getenv("GEMINI_KEY"))

# Send prompt to Gemini
#response = client.models.generate_content(
#    model="gemini-2.5-flash",
#    contents="""
#Return exactly in this format:

#Question: ...
#A. ...
#B. ...
#C. ...
#D. ...
#Correct Answer: A/B/C/D

#Generate a quiz question about the solar system.
#""",
#)


#print(response.text)

def geminiGeneratesFullQuiz(topic):
    
    cont = """
Generate a 25 question quiz about """ + topic + """. The questions should range in difficulty from 1 -5, with 1 being the easiest and 5 being the hardest. Generate 5 questions of each type starting with 1 ending with 5. Return exactly in this format:

Question: ...
A. ...
B. ...
C. ...
D. ...
Correct Answer: A/B/C/D

YOU MUST RETURN EXACTLY IN THE FORMAT ABOVE, FAILURE TO DO SO WILL RESULT IN AN ERROR. DO NOT RETURN ANYTHING OTHER THAN THE 25 QUESTIONS IN THE FORMAT SPECIFIED ABOVE.

"""
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=cont)
    return response

def generateQuizQuestion(fullQuiz ,difficulty):
    parsedQuizArray = re.split(r'(?=Question:)', fullQuiz.text)
    parsedQuizArray = [q.strip() for q in parsedQuizArray if q.strip()]

    if(difficulty == 1):
        return random.choice(parsedQuizArray[0:5])
    elif(difficulty == 2):
        return random.choice(parsedQuizArray[5:10])
    elif(difficulty == 3):
        return random.choice(parsedQuizArray[10:15])
    elif(difficulty == 4):
        return random.choice(parsedQuizArray[15:20])
    elif(difficulty == 5):
        return random.choice(parsedQuizArray[20:25])









#def parseQuestion(response): THIS IS OLD DOESN'T REALLY WORK ANYMORE KEEPING IT IN CASE WE WANT TO REFERENCE IT LATER
    #lines = response.text.split("\n")
    #question = lines[0]
    #options = lines[1:5]
    #correct_answer = lines[5].split(":")[1].strip()
    #return question, options, correct_answer



#def quizCreator(numQuestions, topic): THIS IS OLD DOESN'T REALLY WORK ANYMORE KEEPING IT IN CASE WE WANT TO REFERENCE IT LATER
    #quiz = []
    #for _ in range(numQuestions):
        response = generateQuizQuestion(topic)
        question, options, correct_answer = parseQuestion(response)
        quiz.append({
            "question": question,
            "options": options,
            "correct_answer": correct_answer
        })
    #return quiz


#def displayingQuiz(): THIS IS OLD DOESN'T REALLY WORK ANYMORE KEEPING IT IN CASE WE WANT TO REFERENCE IT LATER
    #numQuestions = int(input("Enter the number of quiz questions: "))
    #topic = input("Enter a topic for the quiz questions: ")
    #quiz = quizCreator(numQuestions, topic)

    #for i, q in enumerate(quiz, start=1):
        print(f"Question {i}: {q['question']}")
        print("Options:")
        for option in q['options']:
            print(option)
        print(f"Correct Answer: {q['correct_answer']}")
        print()
    #for option in option:
        print(option)
        #this doesn't work perfectly, can't test bc of the API key limit
    #print("Parsed Correct Answer:", correct_answer)   

if __name__ == "__main__":
    #displayingQuiz()
    topic = input("Enter a topic for the quiz questions: ")
    fullQuiz = geminiGeneratesFullQuiz(topic)
    difficulty = int(input("Enter a difficulty level (1-5): "))
    question = generateQuizQuestion(fullQuiz, difficulty)
    print("Full Quiz:\n", fullQuiz.text)
    print("Generated Question:\n", question)
