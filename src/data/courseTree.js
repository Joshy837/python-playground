import { Tag, GitBranch, List, Repeat, BookOpen } from 'lucide-react'

export const NODES = [
  {
    id: 'variables',
    title: 'Variables & Types',
    icon: Tag,
    x: 100, y: 200,
    requires: [],
    description: 'Learn how to store data in variables.',
    steps: [
      {
        title: 'Your First Variable',
        description: `# Your First Variable

A **variable** is like a labelled box — you give it a name, and it holds a value.

\`\`\`python
name = "Maya"
print(name)
\`\`\`

\`name\` is the label. \`"Maya"\` is what's inside. \`print\` shows it on screen.`,
        example: `name = "Maya"
print(name)

# Try changing "Maya" to your own name and running again`,
        quiz: [
          {
            question: 'Which line creates a variable called name?',
            options: ['print(name)', 'name = "Maya"', '"Maya"', 'name'],
            answer: 1,
            explanation: 'The = sign stores the value on the right into the label on the left.',
          },
        ],
        task: `Create a variable called \`name\` and set it to your name (or any name you like).`,
        starter: `name = ""
print(name)
`,
        tests: [
          { name: 'name is a non-empty string', check: 'isinstance(name, str) and len(name) > 0', msg: 'name should be a string with at least one character — wrap it in quotes' },
        ],
      },
      {
        title: 'Strings',
        description: `# Text Values — Strings

Text in Python is called a **string**. Strings always have quote marks around them.

\`\`\`python
pet = "Fluffy"
\`\`\`

Single quotes work too — they mean the same thing:

\`\`\`python
city = 'London'
\`\`\``,
        example: `pet = "Fluffy"
city = 'London'
print(pet)
print(city)`,
        quiz: [
          {
            question: 'Which of these is a string?',
            options: ['42', 'True', '"hello"', '3.14'],
            answer: 2,
            explanation: 'Strings are text values wrapped in quote marks.',
          },
        ],
        task: `Create a variable called \`favourite_food\` and set it to your favourite food as a string.`,
        starter: `favourite_food = ""
print(favourite_food)
`,
        tests: [
          { name: 'favourite_food is a non-empty string', check: 'isinstance(favourite_food, str) and len(favourite_food) > 0', msg: 'favourite_food should be a string — wrap it in quotes' },
        ],
      },
      {
        title: 'Joining Strings',
        description: `# Joining Strings

You can stick two strings together using \`+\`.

\`\`\`python
first = "Hello, "
second = "Maya!"
message = first + second
print(message)
\`\`\`

Output: \`Hello, Maya!\``,
        example: `first_name = "Maya"
last_name = "Smith"
full_name = first_name + " " + last_name
print(full_name)`,
        quiz: [
          {
            question: 'What does "Hello, " + "world" produce?',
            options: ['An error', '"Hello, " (just the first part)', '"Hello, world"', '"Helloworld"'],
            answer: 2,
            explanation: '+ joins two strings together into one.',
          },
        ],
        task: `You have \`first = "Hello"\` and \`name = "Maya"\`. Create a variable \`greeting\` that joins them with a space between — it should equal \`"Hello Maya"\`.`,
        starter: `first = "Hello"
name = "Maya"
greeting = ""
`,
        tests: [
          { name: 'greeting == "Hello Maya"', check: 'greeting == "Hello Maya"', msg: 'greeting should be "Hello Maya" — join first, a space " ", and name with +' },
        ],
      },
      {
        title: 'Integers',
        description: `# Whole Numbers — Integers

Numbers in Python don't need quote marks.

\`\`\`python
age = 10
print(age)
\`\`\`

These are called **integers** — whole numbers with no decimal point.`,
        example: `age = 10
print(age)

coins = 25
print(coins)`,
        quiz: [
          {
            question: 'Which stores a whole number (integer)?',
            options: ['age = "10"', 'age = 10', 'age = 10.0', 'age = True'],
            answer: 1,
            explanation: 'Integers are whole numbers — no quotes and no decimal point.',
          },
        ],
        task: `Create a variable called \`age\` and set it to any whole number.`,
        starter: `age = 0
print(age)
`,
        tests: [
          { name: 'age is an integer', check: 'isinstance(age, int) and not isinstance(age, bool)', msg: 'age should be a whole number — no quotes, no decimal point' },
        ],
      },
      {
        title: 'Maths',
        description: `# Maths with Numbers

Python can do maths. Use \`+\`, \`-\`, and \`*\`.

\`\`\`python
apples = 5
oranges = 3
total = apples + oranges
print(total)
\`\`\``,
        example: `apples = 5
oranges = 3

print(apples + oranges)
print(apples - oranges)
print(apples * 2)`,
        quiz: [
          {
            question: 'What does 4 * 3 equal in Python?',
            options: ['7', '12', '43', '1'],
            answer: 1,
            explanation: '* is the multiplication operator in Python.',
          },
        ],
        task: `You have \`price = 5\` and \`quantity = 3\`. Create a variable \`total\` that equals price multiplied by quantity.`,
        starter: `price = 5
quantity = 3
total = 0
`,
        tests: [
          { name: 'total == 15', check: 'total == 15', msg: '5 * 3 = 15, so total should be 15' },
        ],
      },
      {
        title: 'Floats',
        description: `# Decimal Numbers — Floats

When a number has a decimal point, Python calls it a **float**.

\`\`\`python
price = 1.99
print(price)
\`\`\`

Even \`1.0\` is a float — the decimal point is what matters.`,
        example: `price = 1.99
print(price)

half = 0.5
print(price + half)`,
        quiz: [
          {
            question: 'Which of these is a float?',
            options: ['5', '"5.0"', '5.0', 'True'],
            answer: 2,
            explanation: 'Any number written with a decimal point — like 5.0 or 1.99 — is a float.',
          },
        ],
        task: `Create a variable called \`height\` and set it to any decimal number (e.g. \`1.5\`).`,
        starter: `height = 0.0
print(height)
`,
        tests: [
          { name: 'height is a positive float', check: 'isinstance(height, float) and height > 0', msg: 'height should be a float greater than 0 — include a decimal point (e.g. 1.5)' },
        ],
      },
      {
        title: 'Booleans',
        description: `# Yes and No — Booleans

A **boolean** is either \`True\` or \`False\`. It's used for yes/no values.

\`\`\`python
is_sunny = True
has_pet = False
print(is_sunny)
\`\`\`

Capital T and F — lowercase \`true\` and \`false\` won't work.`,
        example: `is_sunny = True
has_pet = False

print(is_sunny)
print(has_pet)`,
        quiz: [
          {
            question: 'Which is a valid Python boolean?',
            options: ['"True"', 'true', 'True', '1'],
            answer: 2,
            explanation: 'Python booleans are True or False — capital first letter, no quotes.',
          },
        ],
        task: `Create a variable called \`is_raining\` and set it to either \`True\` or \`False\`.`,
        starter: `is_raining = False
print(is_raining)
`,
        tests: [
          { name: 'is_raining is a boolean', check: 'isinstance(is_raining, bool)', msg: 'is_raining should be True or False (capital T/F, no quotes)' },
        ],
      },
    ],
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    icon: GitBranch,
    x: 320, y: 120,
    requires: ['variables'],
    description: 'Make decisions in your code with if, elif, and else.',
    steps: [
      {
        title: 'Comparing Things',
        description: `# Comparing Things

You can compare two values. The result is always \`True\` or \`False\`.

\`\`\`python
print(5 > 3)   # True
print(5 < 3)   # False
print(5 == 5)  # True
\`\`\`

Common comparisons:
- \`>\` greater than
- \`<\` less than
- \`==\` equal to (two equals signs!)
- \`!=\` not equal to`,
        example: `print(10 > 5)
print(3 < 1)
print(7 == 7)
print(4 != 4)

score = 85
print(score > 50)`,
        quiz: [
          {
            question: 'What does 3 == 3 return?',
            options: ['3', 'False', 'True', 'An error'],
            answer: 2,
            explanation: '== checks if two values are equal. 3 equals 3, so it returns True.',
          },
        ],
        task: `You have \`score = 80\`. Set \`passed\` to the result of checking whether score is greater than 60.`,
        starter: `score = 80
passed = False
`,
        tests: [
          { name: 'passed == True', check: 'passed == True', msg: '80 > 60 is True, so passed should be True' },
        ],
      },
      {
        title: 'if',
        description: `# Making a Decision — if

Use \`if\` to run code only when something is true.

\`\`\`python
score = 90

if score > 80:
    print("Great score!")
\`\`\`

The 4 spaces before \`print\` are called **indentation**. They tell Python this line is *inside* the \`if\`. If the condition is false, the indented code is skipped.`,
        example: `score = 90

if score > 80:
    print("Great score!")

# Try changing score to 50 and running again`,
        quiz: [
          {
            question: 'What do the 4 spaces before "print" do?',
            options: ['They are decoration', 'They mark the line as inside the if block', 'They make the line run always', 'They are required at the start of every line'],
            answer: 1,
            explanation: 'Indentation (the spaces) tells Python which lines belong inside the if block.',
          },
        ],
        task: `You have \`temperature = 30\`. Write an \`if\` that sets \`message\` to \`"hot"\` when temperature is greater than 25.`,
        starter: `temperature = 30
message = "unknown"

# Write your if below:
`,
        tests: [
          { name: 'message == "hot"', check: 'message == "hot"', msg: 'temperature is 30, which is greater than 25, so message should be "hot"' },
        ],
      },
      {
        title: 'if / else',
        description: `# if / else

Add \`else\` for what happens when the condition is false.

\`\`\`python
temperature = 20

if temperature > 25:
    message = "hot"
else:
    message = "cool"

print(message)
\`\`\``,
        example: `weather = "sunny"

if weather == "sunny":
    print("Let's go outside!")
else:
    print("Stay inside.")

# Try changing weather to "rainy" and running again`,
        quiz: [
          {
            question: 'What runs when the if condition is False?',
            options: ['The if block still runs', 'Python raises an error', 'The else block runs', 'Nothing runs'],
            answer: 2,
            explanation: 'When the condition is False, Python skips the if block and runs the else block instead.',
          },
        ],
        task: `\`score\` is \`45\`. Write an \`if\`/\`else\` to set \`grade\` to \`"pass"\` if score is 50 or more, or \`"fail"\` if it's less.`,
        starter: `score = 45
grade = "not set"
`,
        tests: [
          { name: 'grade is "fail"', check: 'grade == "fail"', msg: 'score is 45, which is less than 50, so grade should be "fail"' },
        ],
      },
      {
        title: 'elif',
        description: `# More Choices — elif

\`elif\` means "else if" — it lets you check more conditions. Only the **first** match runs.

\`\`\`python
score = 75

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
\`\`\``,
        example: `score = 75

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "F"

print(grade)
# Try changing score to 95, 60, or 40`,
        quiz: [
          {
            question: 'How many branches of an if/elif/else can run at most?',
            options: ['All of them', 'None of them', 'Exactly one', 'Two at most'],
            answer: 2,
            explanation: 'Python checks each condition in order and runs only the first one that is True.',
          },
        ],
        task: `\`score\` is \`75\`. Use \`if\`/\`elif\`/\`else\` to set \`grade\` to \`"A"\` if 90 or more, \`"B"\` if 70 or more, or \`"C"\` otherwise.`,
        starter: `score = 75
grade = "not set"
`,
        tests: [
          { name: 'grade is "B"', check: 'grade == "B"', msg: "score is 75 — that's 70 or more but less than 90, so grade should be \"B\"" },
        ],
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    icon: List,
    x: 320, y: 280,
    requires: ['variables'],
    description: 'Store and work with collections of values.',
    steps: [
      {
        title: 'Creating a List',
        description: `# Lists

A **list** holds many values in one variable, inside square brackets \`[]\`.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits)
\`\`\`

Use \`len()\` to count how many items are in the list:

\`\`\`python
print(len(fruits))  # 3
\`\`\``,
        example: `fruits = ["apple", "banana", "cherry"]
print(fruits)
print(len(fruits))`,
        quiz: [
          {
            question: 'Which syntax creates a list?',
            options: ['(1, 2, 3)', '{1, 2, 3}', '[1, 2, 3]', '1, 2, 3'],
            answer: 2,
            explanation: 'Lists use square brackets [].',
          },
        ],
        task: `Create a list called \`colours\` containing \`"red"\`, \`"green"\`, and \`"blue"\`.`,
        starter: `colours = []
print(colours)
`,
        tests: [
          { name: 'colours == ["red", "green", "blue"]', check: 'colours == ["red", "green", "blue"]', msg: 'colours should be ["red", "green", "blue"]' },
        ],
      },
      {
        title: 'Getting Items',
        description: `# Getting Items — Indexes

Each item has a number called an **index**. The first item is always index \`0\`.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # "apple"
print(fruits[1])  # "banana"
\`\`\`

Use \`-1\` to get the last item:

\`\`\`python
print(fruits[-1])  # "cherry"
\`\`\``,
        example: `fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # first
print(fruits[1])   # second
print(fruits[-1])  # last`,
        quiz: [
          {
            question: 'For pets = ["cat", "dog", "fish"], what is pets[0]?',
            options: ['"dog"', '"fish"', '"cat"', 'An error'],
            answer: 2,
            explanation: 'Index 0 is always the first item in the list.',
          },
        ],
        task: `You have \`animals = ["cat", "dog", "fish"]\`. Set \`first\` to the first animal and \`last\` to the last animal using indexes.`,
        starter: `animals = ["cat", "dog", "fish"]
first = "not set"
last = "not set"
`,
        tests: [
          { name: 'first == "cat"', check: 'first == "cat"', msg: 'first should be "cat" — the item at index 0' },
          { name: 'last == "fish"', check: 'last == "fish"', msg: 'last should be "fish" — use index -1' },
        ],
      },
      {
        title: 'Adding Items',
        description: `# Adding Items — append

Use \`.append()\` to add one item to the end of a list.

\`\`\`python
animals = ["cat", "dog"]
animals.append("fish")
print(animals)  # ["cat", "dog", "fish"]
\`\`\``,
        example: `animals = ["cat"]
print("Before:", animals)

animals.append("dog")
animals.append("fish")
print("After:", animals)`,
        quiz: [
          {
            question: 'What does animals.append("rabbit") do?',
            options: ['Adds "rabbit" to the start', 'Replaces the last item', 'Adds "rabbit" to the end', 'Removes "rabbit"'],
            answer: 2,
            explanation: '.append(x) always adds x to the end of the list.',
          },
        ],
        task: `Start with \`cart = []\`. Use \`.append()\` to add \`"bread"\`, \`"milk"\`, and \`"eggs"\` — in that order.`,
        starter: `cart = []

# Add "bread", "milk", and "eggs":
`,
        tests: [
          { name: 'cart == ["bread", "milk", "eggs"]', check: 'cart == ["bread", "milk", "eggs"]', msg: 'cart should be ["bread", "milk", "eggs"]' },
        ],
      },
      {
        title: 'Changing Items',
        description: `# Changing Items

Replace any item by assigning to its index:

\`\`\`python
pets = ["cat", "dog", "fish"]
pets[1] = "hamster"
print(pets)  # ["cat", "hamster", "fish"]
\`\`\``,
        example: `colours = ["red", "green", "blue"]
print("Before:", colours)

colours[0] = "pink"
print("After:", colours)`,
        quiz: [
          {
            question: 'What does colours[0] = "yellow" do?',
            options: ['Adds "yellow" to the start', 'Replaces the item at index 0 with "yellow"', 'Removes index 0', 'Adds "yellow" to the end'],
            answer: 1,
            explanation: 'Index assignment replaces the item at that position.',
          },
        ],
        task: `You have \`pets = ["cat", "dog", "fish"]\`. Change the item at index \`1\` to \`"hamster"\`.`,
        starter: `pets = ["cat", "dog", "fish"]

# Change index 1 to "hamster":
`,
        tests: [
          { name: 'pets == ["cat", "hamster", "fish"]', check: 'pets == ["cat", "hamster", "fish"]', msg: 'pets should be ["cat", "hamster", "fish"]' },
        ],
      },
    ],
  },
  {
    id: 'loops',
    title: 'Loops',
    icon: Repeat,
    x: 540, y: 120,
    requires: ['conditionals'],
    description: 'Repeat actions with for and while loops.',
    steps: [
      {
        title: 'for — lists',
        description: `# Looping Over a List — for

A \`for\` loop runs code once for each item in a list.

\`\`\`python
animals = ["cat", "dog", "fish"]
for animal in animals:
    print(animal)
# cat
# dog
# fish
\`\`\``,
        example: `animals = ["cat", "dog", "fish"]
for animal in animals:
    print(animal)`,
        quiz: [
          {
            question: 'How many times does "for item in [1, 2, 3, 4]:" run?',
            options: ['3', '4', '5', 'It depends'],
            answer: 1,
            explanation: 'The loop runs once for each item in the list. [1, 2, 3, 4] has 4 items.',
          },
        ],
        task: `You have \`numbers = [1, 2, 3, 4, 5]\`. Use a \`for\` loop to add them all up into \`total\`.`,
        starter: `numbers = [1, 2, 3, 4, 5]
total = 0

# Add each number to total:
`,
        tests: [
          { name: 'total == 15', check: 'total == 15', msg: '1+2+3+4+5 = 15, so total should be 15' },
        ],
      },
      {
        title: 'for — range',
        description: `# Repeating a Set Number of Times — range

Use \`range(n)\` to repeat code exactly \`n\` times.

\`\`\`python
for i in range(3):
    print("Hello!")
# Hello!
# Hello!
# Hello!
\`\`\`

\`range(5)\` counts \`0, 1, 2, 3, 4\` — it starts at 0.`,
        example: `for i in range(5):
    print(i)`,
        quiz: [
          {
            question: 'What numbers does range(4) produce?',
            options: ['1, 2, 3, 4', '0, 1, 2, 3', '0, 1, 2, 3, 4', '1, 2, 3'],
            answer: 1,
            explanation: 'range(n) starts at 0 and stops before n. range(4) gives 0, 1, 2, 3.',
          },
        ],
        task: `Use a \`for\` loop with \`range\` to add up \`0 + 1 + 2 + 3 + 4\` into \`total\`.`,
        starter: `total = 0

# Use range to loop from 0 to 4:
`,
        tests: [
          { name: 'total == 10', check: 'total == 10', msg: '0+1+2+3+4 = 10, so total should be 10' },
        ],
      },
      {
        title: 'while loops',
        description: `# Looping While True — while

A \`while\` loop keeps repeating as long as its condition is \`True\`.

\`\`\`python
count = 3
while count > 0:
    print(count)
    count = count - 1
# 3
# 2
# 1
\`\`\`

Make sure the condition eventually becomes \`False\` — otherwise it loops forever!`,
        example: `count = 5
while count > 0:
    print(count)
    count = count - 1

print("Done!")`,
        quiz: [
          {
            question: "What happens if a while loop's condition never becomes False?",
            options: ['It runs once', 'It runs forever', 'Python automatically stops after 10 steps', 'It skips to the next line'],
            answer: 1,
            explanation: 'A loop that never stops is called an infinite loop. Always make sure your while loop has a way to end.',
          },
        ],
        task: `Start with \`n = 1\` and \`result = 0\`. Use a \`while\` loop to keep adding \`n\` to \`result\` and increasing \`n\` by 1, until \`n\` is greater than 5. \`result\` should end up as \`15\`.`,
        starter: `n = 1
result = 0

# Keep adding n to result while n <= 5:
`,
        tests: [
          { name: 'result == 15', check: 'result == 15', msg: '1+2+3+4+5 = 15, so result should be 15' },
          { name: 'n > 5 after the loop', check: 'n > 5', msg: 'the loop should stop when n is greater than 5' },
        ],
      },
    ],
  },
  {
    id: 'dicts',
    title: 'Dictionaries',
    icon: BookOpen,
    x: 540, y: 280,
    requires: ['lists'],
    description: 'Store labelled information with keys and values.',
    steps: [
      {
        title: 'Creating a Dictionary',
        description: `# Dictionaries

A **dictionary** stores labelled values. Each label is called a **key**.

\`\`\`python
pet = {"name": "Fluffy", "age": 3}
print(pet)
\`\`\`

Think of it like a pet profile — each key is a label, and each value is what's written next to it.`,
        example: `pet = {"name": "Fluffy", "age": 3}
print(pet)`,
        quiz: [
          {
            question: 'Which creates a Python dictionary?',
            options: ['["name": "Fluffy"]', '("name", "Fluffy")', '{"name": "Fluffy"}', '{"Fluffy"}'],
            answer: 2,
            explanation: 'Dictionaries use curly braces {} with key: value pairs.',
          },
        ],
        task: `Create a dictionary called \`pet\` with a \`"name"\` key set to any animal name you like.`,
        starter: `pet = {}
print(pet)
`,
        tests: [
          { name: 'pet["name"] is a string', check: 'isinstance(pet.get("name"), str) and len(pet.get("name", "")) > 0', msg: 'pet["name"] should be a non-empty string' },
        ],
      },
      {
        title: 'Reading Values',
        description: `# Reading Values

Use square brackets with the key to read its value:

\`\`\`python
pet = {"name": "Fluffy", "age": 3}
print(pet["name"])  # "Fluffy"
print(pet["age"])   # 3
\`\`\``,
        example: `pet = {"name": "Fluffy", "age": 3}
print(pet["name"])
print(pet["age"])`,
        quiz: [
          {
            question: 'How do you read the value for key "age" from a dict called pet?',
            options: ['pet.age', 'pet("age")', 'pet["age"]', 'pet{age}'],
            answer: 2,
            explanation: 'Use square brackets with the key in quotes: pet["age"].',
          },
        ],
        task: `You have \`pet = {"name": "Fluffy", "age": 3}\`. Set \`pet_name\` to the pet's name by reading it from the dictionary.`,
        starter: `pet = {"name": "Fluffy", "age": 3}
pet_name = "not set"
`,
        tests: [
          { name: 'pet_name == "Fluffy"', check: 'pet_name == "Fluffy"', msg: 'pet_name should be "Fluffy" — read it with pet["name"]' },
        ],
      },
      {
        title: 'Adding Values',
        description: `# Adding New Values

Add new keys to a dictionary by assigning to them:

\`\`\`python
pet = {"name": "Fluffy"}
pet["colour"] = "orange"
print(pet)
\`\`\``,
        example: `pet = {"name": "Fluffy"}
print("Before:", pet)

pet["colour"] = "orange"
pet["age"] = 3
print("After:", pet)`,
        quiz: [
          {
            question: 'What does pet["colour"] = "orange" do if "colour" is not already in pet?',
            options: ['Raises an error', 'Does nothing', 'Adds a new "colour" key with value "orange"', 'Removes "colour"'],
            answer: 2,
            explanation: 'Assigning to a new key adds it to the dictionary.',
          },
        ],
        task: `You have \`pet = {"name": "Fluffy"}\`. Add a new key \`"age"\` with the value \`3\`.`,
        starter: `pet = {"name": "Fluffy"}

# Add an "age" key with value 3:
`,
        tests: [
          { name: 'pet["age"] == 3', check: 'pet.get("age") == 3', msg: 'pet["age"] should be 3' },
        ],
      },
      {
        title: 'Iterating',
        description: `# Looping Through a Dictionary

Use \`.items()\` to loop through both keys and values at the same time:

\`\`\`python
scores = {"Alice": 10, "Bob": 8}
for name, score in scores.items():
    print(name, "scored", score)
# Alice scored 10
# Bob scored 8
\`\`\``,
        example: `scores = {"Alice": 10, "Bob": 8, "Carol": 9}

for name, score in scores.items():
    print(name, "scored", score)`,
        quiz: [
          {
            question: 'Which method gives you both keys AND values when looping?',
            options: ['.keys()', '.values()', '.items()', '.pairs()'],
            answer: 2,
            explanation: '.items() gives you (key, value) pairs you can unpack in a for loop.',
          },
        ],
        task: `You have \`scores = {"Alice": 10, "Bob": 8, "Carol": 9}\`. Use a \`for\` loop with \`.items()\` to add all the scores up into \`total\`.`,
        starter: `scores = {"Alice": 10, "Bob": 8, "Carol": 9}
total = 0

# Add each score to total:
`,
        tests: [
          { name: 'total == 27', check: 'total == 27', msg: '10+8+9 = 27, so total should be 27' },
        ],
      },
      {
        title: 'Counting',
        description: `# Counting Things

Dictionaries are great for counting how many times something appears:

\`\`\`python
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1
\`\`\`

\`counts.get(item, 0)\` returns the current count, or \`0\` if it's the first time. Then we add \`1\` and save it back.`,
        example: `words = ["cat", "dog", "cat", "fish", "dog", "cat"]

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)`,
        quiz: [
          {
            question: 'In counts.get(word, 0) + 1, what does the 0 do?',
            options: ['Counts from 0 upwards', 'Starts the count at 0 for a new item', 'Sets the maximum count', 'Resets the count each loop'],
            answer: 1,
            explanation: 'If the word is new, .get() returns 0, so we correctly start counting from 1.',
          },
        ],
        task: `You have \`animals = ["cat", "dog", "cat", "fish", "dog", "cat"]\`. Count how many times each animal appears and store the result in \`counts\`.`,
        starter: `animals = ["cat", "dog", "cat", "fish", "dog", "cat"]
counts = {}

# Count each animal:
`,
        tests: [
          { name: 'counts["cat"] == 3', check: 'counts.get("cat") == 3', msg: '"cat" appears 3 times' },
          { name: 'counts["dog"] == 2', check: 'counts.get("dog") == 2', msg: '"dog" appears 2 times' },
          { name: 'counts["fish"] == 1', check: 'counts.get("fish") == 1', msg: '"fish" appears 1 time' },
        ],
      },
    ],
  },
]

export const EDGES = NODES.flatMap(node =>
  node.requires.map(req => ({ from: req, to: node.id }))
)

export const NODE_W = 140
export const NODE_H = 52
export const CANVAS_W = 680
export const CANVAS_H = 400
