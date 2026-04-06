class Item:
    def __init__(self, name: str, isHealing: bool, isDamaging: bool, isQuestion: bool, strength: int):
        self.name = name
        self.isHealing = isHealing
        self.isDamaging = isDamaging
        self.isQuestion = isQuestion
        self.strength = strength
        
    if __name__ == "__main__":
        print("This is the Item class.")