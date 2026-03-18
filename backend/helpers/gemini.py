from google import genai
import os
from dotenv import load_dotenv

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

def generateQuizQuestion(topic):
    
    cont = """
Return exactly in this format:

Question: ...
A. ...
B. ...
C. ...
D. ...
Correct Answer: A/B/C/D

Generate a quiz question about """ + topic
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=cont)
    return response




def parseQuestion(response):
    lines = response.text.split("\n")
    question = lines[0]
    options = lines[1:5]
    correct_answer = lines[5].split(":")[1].strip()
    return question, options, correct_answer



def quizCreator(numQuestions, topic):
    quiz = []
    for _ in range(numQuestions):
        response = generateQuizQuestion(topic)
        question, options, correct_answer = parseQuestion(response)
        quiz.append({
            "question": question,
            "options": options,
            "correct_answer": correct_answer
        })
    return quiz


def displayingQuiz():
    numQuestions = int(input("Enter the number of quiz questions: "))
    topic = input("Enter a topic for the quiz questions: ")
    quiz = quizCreator(numQuestions, topic)

    for i, q in enumerate(quiz, start=1):
        print(f"Question {i}: {q['question']}")
        print("Options:")
        for option in q['options']:
            print(option)
        print(f"Correct Answer: {q['correct_answer']}")
        print()
    for option in option:
        print(option)
        #this doesn't work perfectly, can't test bc of the API key limit
    print("Parsed Correct Answer:", correct_answer)   

if __name__ == "__main__":
    displayingQuiz()
