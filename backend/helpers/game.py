from mon import Mon
from character import Character
import fakeGemini
import random
class game:

    def gameTurn(character1: Character, character2: Character, quiz: dict):
        print(f"\nCharacter 1 has {character1.hp} HP. Character 2 has {character2.hp} HP.")
        print(quiz["question"])
        print(quiz["options"])
        answer = input("Enter the letter of your answer: ")
        if(answer == quiz["correct_answer"][-1]):
            print("Correct! You dealt 10 damage to the opponent.")
            character2.take_damage(10)
        else:
            print("Incorrect! You took 10 damage from the opponent.")
            character1.take_damage(10)
        

        

    if __name__ == "__main__":
        character1 = Character(Mon("Raichu"), 100)
        character2 = Character(Mon("Samurott"), 100)
        

        quiz = fakeGemini.quizCreator(10, "biology")
        #print(quiz[0]["question"])
        while(character1.hp > 0 and character2.hp > 0):
            gameTurn(character1, character2, quiz[random.randint(0, 9)])
        if(character1.hp <= 0):
            print("Character 2 wins!")
        else:
            print("Character 1 wins!")
