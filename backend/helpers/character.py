#Original base for character class, later turned into API function. Kept here in case we want to reference it later.
import mon

class Character:
    def __init__(self, mon, hp: int):
        self.mon = mon
        self.hp = hp

    def take_damage(self, damage: int):
        if(damage < 0):
            raise ValueError("Damage cannot be negative")
        elif(damage > self.hp):
            self.hp = 0
        else:
            self.hp -= damage