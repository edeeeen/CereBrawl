import unittest
from fakeGemini import generateQuizQuestion, parseQuestion

class TestingGemini(unittest.TestCase):
    
    # Tests that the generated quiz question contains the expected format
    def testGenerateQuizQuestion(self):
        question = generateQuizQuestion("biology")
        self.assertIn("Question:", question)
        self.assertIn("Correct Answer:", question)

    # Tests that the parseQuestion function correctly extracts the question, options, and correct answer
    def testParseQuestion(self):
        response = "Question: What is the basic unit of life?\nA. Atom\nB. Cell\nC. Tissue\nD. Organ\nCorrect Answer: B"
        question, options, correct_answer = parseQuestion(response)
        self.assertEqual(question, "Question: What is the basic unit of life?")
        self.assertEqual(options, ["A. Atom", "B. Cell", "C. Tissue", "D. Organ"])
        self.assertEqual(correct_answer, "B")

if __name__ == "__main__":
    unittest.main()