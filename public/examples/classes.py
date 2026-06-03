class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        print(f"{self.name} says {self.sound}!")

class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "woof")

    def fetch(self, item):
        print(f"{self.name} fetches the {item}!")

dog = Dog("Rex")
dog.speak()
dog.fetch("ball")

cat = Animal("Whiskers", "meow")
cat.speak()
