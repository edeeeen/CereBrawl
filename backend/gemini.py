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



userInput = input("Enter a topic for the quiz question: ")
question, options, correct_answer = parseQuestion(generateQuizQuestion(userInput))
print("Parsed Question:", question)
print("Parsed Options:")
for option in options:
    print(option)
print("Parsed Correct Answer:", correct_answer)    
