from google import genai
import os

# Create client using API key from environment variable
client = genai.Client(api_key= "INSERT API KEY HERE FOR NOW!")

# Send prompt to Gemini
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
Return exactly in this format:

Question: ...
A. ...
B. ...
C. ...
D. ...
Correct Answer: A/B/C/D

Generate a quiz question about the solar system.
""",
)


print(response.text)

def parseQuestion(response):
    lines = response.text.split("\n")
    question = lines[0]
    options = lines[1:5]
    correct_answer = lines[5].split(":")[1].strip()
    return question, options, correct_answer

question, options, correct_answer = parseQuestion(response)

print("Question:", question)
print("Options:")
for option in options:
    print(option)
print("Correct Answer:", correct_answer)    
