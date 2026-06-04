import { Tag, GitBranch, List, Repeat, BookOpen } from 'lucide-react'

export const NODES = [
  {
    id: 'variables',
    title: 'Variables & Types',
    icon: Tag,
    x: 100, y: 200,
    requires: [],
    description: 'Learn how to store data in variables and work with Python\'s basic types.',
    steps: [
      {
        title: 'Strings',
        description: `# Variables — Strings

A **variable** stores a value so you can use it later. You create one by writing a name, then \`=\`, then the value.

**str** is Python's type for text. Wrap the text in quotes — single \`'\` or double \`"\` both work.

\`\`\`python
name = "Alice"
print(name)        # Alice
print(type(name))  # <class 'str'>
\`\`\`

The variable \`name\` now holds the string \`"Alice"\`. You can use it anywhere you need that value — in \`print()\`, in calculations, or to build new strings.`,
        example: `name = "Alice"
print(name)
print(type(name))

# Try changing the name and running again
greeting = "Hello, " + name
print(greeting)`,
        quiz: [
          {
            question: 'Which of these creates a string variable in Python?',
            options: ['age = 25', 'name = "Alice"', 'is_active = True', 'price = 9.99'],
            answer: 1,
            explanation: 'Strings are text values wrapped in quote marks — single or double.',
          },
        ],
        task: `Create a variable called \`name\` and assign it any string value (some text wrapped in quotes).`,
        starter: `# Create a string variable:
name =
`,
        tests: [
          { name: 'name is a string', check: 'isinstance(name, str)', msg: 'name should be a str — wrap it in quotes' },
        ],
      },
      {
        title: 'Integers',
        description: `# Variables — Integers

**int** is Python's type for whole numbers — no quotes, no decimal point.

\`\`\`python
age = 25
print(age)        # 25
print(type(age))  # <class 'int'>
\`\`\`

You can use negative integers too. Python integers have no size limit — they can be as big as your memory allows.

\`\`\`python
temperature = -5
big_number = 1_000_000   # underscores are allowed for readability
\`\`\``,
        example: `age = 25
print(age)
print(type(age))

temperature = -5
print(temperature)

# Basic math with integers
print(age + 10)
print(age * 2)`,
        quiz: [
          {
            question: 'Which value is an integer in Python?',
            options: ['"25"', '25.0', '25', 'True'],
            answer: 2,
            explanation: 'Integers are whole numbers with no quotes and no decimal point.',
          },
        ],
        task: `Create a variable called \`age\` and assign it any integer value (a whole number, no quotes, no decimal point).`,
        starter: `# Create an integer variable:
age =
`,
        tests: [
          { name: 'age is an integer', check: 'isinstance(age, int) and not isinstance(age, bool)', msg: 'age should be an int (no quotes, no decimal point)' },
        ],
      },
      {
        title: 'Floats',
        description: `# Variables — Floats

**float** is Python's type for decimal numbers. A float always has a decimal point.

\`\`\`python
height = 1.75
print(height)        # 1.75
print(type(height))  # <class 'float'>
\`\`\`

Even \`1.0\` is a float — the decimal point is what determines the type, not whether there are digits after it.

\`\`\`python
pi = 3.14159
print(pi * 2)  # 6.28318
\`\`\``,
        example: `height = 1.75
print(height)
print(type(height))

pi = 3.14159
radius = 5.0
area = pi * radius * radius
print(area)`,
        quiz: [
          {
            question: 'What makes a number a float in Python?',
            options: ['It is larger than 1,000', 'It has a decimal point', 'It is negative', 'It is a whole number'],
            answer: 1,
            explanation: 'Any number with a decimal point — like 1.0 or 3.14 — is a float, regardless of its value.',
          },
        ],
        task: `Create a variable called \`height\` and assign it any float value (a number with a decimal point, e.g. \`1.75\`).`,
        starter: `# Create a float variable:
height =
`,
        tests: [
          { name: 'height is a float', check: 'isinstance(height, float)', msg: 'height should be a float — include a decimal point (e.g. 1.75)' },
        ],
      },
      {
        title: 'Booleans',
        description: `# Variables — Booleans

**bool** has exactly two values: \`True\` or \`False\`. Capital first letter, no quotes.

\`\`\`python
is_student = True
print(is_student)        # True
print(type(is_student))  # <class 'bool'>
\`\`\`

Booleans often come from comparisons — any comparison in Python produces a \`True\` or \`False\`:

\`\`\`python
print(5 > 3)   # True
print(2 == 4)  # False
print(10 != 7) # True
\`\`\``,
        example: `is_student = True
print(is_student)
print(type(is_student))

# Booleans from comparisons
print(5 > 3)
print(2 == 4)
print(10 != 7)`,
        quiz: [
          {
            question: 'Which is a valid Python boolean value?',
            options: ['"True"', 'true', 'True', '1'],
            answer: 2,
            explanation: 'Python booleans are exactly True or False — capital first letter, no quotes.',
          },
        ],
        task: `Create a variable called \`is_student\` and assign it \`True\` or \`False\` (capital first letter, no quotes).`,
        starter: `# Create a boolean variable:
is_student =
`,
        tests: [
          { name: 'is_student is a bool', check: 'isinstance(is_student, bool)', msg: 'is_student should be True or False (capital T/F, no quotes)' },
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
    description: 'Use if/elif/else to make decisions in your code.',
    steps: [
      {
        title: 'if / else',
        description: `# Conditionals — if / else

Use \`if\` to run code only when a condition is true. Use \`else\` as the fallback when it's false.

\`\`\`python
if temperature > 30:
    print("Hot!")
else:
    print("Not hot")
\`\`\`

**Indentation matters.** Python uses 4 spaces to mark what's inside the \`if\` block. Everything indented under \`if\` only runs when the condition is \`True\`.

The \`else\` block is optional — you can have an \`if\` without one.`,
        example: `temperature = 35

if temperature > 30:
    print("Hot!")
else:
    print("Not hot")

# Try changing temperature to 20 and running again`,
        quiz: [
          {
            question: 'What happens when the if condition is False and there is an else block?',
            options: [
              'The if block still runs',
              'Python raises an error',
              'The else block runs',
              'The program ends',
            ],
            answer: 2,
            explanation: 'When the condition is False, Python skips the if block and runs the else block instead.',
          },
        ],
        task: `Write a function \`is_even(n)\` that returns \`True\` if \`n\` is even, \`False\` if it's odd.

**Hint:** \`n % 2\` gives the remainder when dividing by 2. Even numbers have remainder \`0\`.`,
        starter: `def is_even(n):
    # return True if n is even, False if odd
    pass
`,
        tests: [
          { name: 'is_even(4) == True', check: 'is_even(4) == True', msg: 'is_even(4) should return True' },
          { name: 'is_even(7) == False', check: 'is_even(7) == False', msg: 'is_even(7) should return False' },
          { name: 'is_even(0) == True', check: 'is_even(0) == True', msg: 'is_even(0) should return True' },
        ],
      },
      {
        title: 'if / elif / else',
        description: `# Conditionals — if / elif / else

\`elif\` (short for "else if") lets you check multiple conditions in order. Only the **first** matching branch runs — all others are skipped.

\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
\`\`\`

You can have as many \`elif\` branches as you need. The \`else\` at the end catches everything that didn't match.`,
        example: `score = 85

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
            question: 'How many branches of an if/elif/else chain can run at most?',
            options: ['All of them', 'None of them', 'Exactly one', 'Two at most'],
            answer: 2,
            explanation: 'Python evaluates conditions in order and runs the first one that is True. The rest are always skipped.',
          },
        ],
        task: `Write a function \`classify(n)\` that returns:
- \`'positive'\` if \`n > 0\`
- \`'negative'\` if \`n < 0\`
- \`'zero'\` if \`n == 0\``,
        starter: `def classify(n):
    # return 'positive', 'negative', or 'zero'
    pass
`,
        tests: [
          { name: 'classify(5) == "positive"', check: 'classify(5) == "positive"', msg: 'classify(5) should return "positive"' },
          { name: 'classify(-3) == "negative"', check: 'classify(-3) == "negative"', msg: 'classify(-3) should return "negative"' },
          { name: 'classify(0) == "zero"', check: 'classify(0) == "zero"', msg: 'classify(0) should return "zero"' },
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
    description: 'Store and manipulate ordered collections of values.',
    steps: [
      {
        title: 'Creating a List',
        description: `# Lists — Creating

A list holds an ordered sequence of values inside square brackets \`[]\`, separated by commas.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits)       # ['apple', 'banana', 'cherry']
print(len(fruits))  # 3
\`\`\`

Lists can hold any type — strings, numbers, booleans, even other lists. You can also mix types in a single list.

\`\`\`python
mixed = [1, "hello", True, 3.14]
empty = []
\`\`\``,
        example: `fruits = ["apple", "banana", "cherry"]
print(fruits)
print(len(fruits))

# Numbers work too
scores = [95, 82, 71, 88]
print(scores)
print(len(scores))`,
        quiz: [
          {
            question: 'Which syntax correctly creates a list in Python?',
            options: ['(1, 2, 3)', '{1, 2, 3}', '[1, 2, 3]', '1, 2, 3'],
            answer: 2,
            explanation: 'Lists use square brackets []. Parentheses make a tuple, curly braces make a set or dict.',
          },
        ],
        task: `Create a list called \`numbers\` containing exactly \`[3, 1, 4, 1, 5]\`.`,
        starter: `# Create the list:
numbers =
`,
        tests: [
          { name: 'numbers == [3, 1, 4, 1, 5]', check: 'numbers == [3, 1, 4, 1, 5]', msg: 'numbers should be [3, 1, 4, 1, 5]' },
        ],
      },
      {
        title: 'Accessing by Index',
        description: `# Lists — Accessing by Index

Each item in a list has a numbered **index**. Indexing starts at \`0\`, not \`1\`.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # "apple"  — first item
print(fruits[1])   # "banana" — second item
print(fruits[2])   # "cherry" — third item
\`\`\`

**Negative indexes** count from the end:
\`\`\`python
print(fruits[-1])  # "cherry" — last item
print(fruits[-2])  # "banana" — second to last
\`\`\``,
        example: `fruits = ["apple", "banana", "cherry", "date"]
print(fruits[0])   # first
print(fruits[1])   # second
print(fruits[-1])  # last
print(fruits[-2])  # second to last`,
        quiz: [
          {
            question: 'For lst = ["a", "b", "c"], what is lst[-1]?',
            options: ['"a"', '"b"', '"c"', 'An error'],
            answer: 2,
            explanation: 'Negative indexes count from the end. -1 is always the last element.',
          },
        ],
        task: `Write a function \`first_and_last(lst)\` that returns a **new list** containing only the first and last elements of \`lst\`.

Example: \`first_and_last([10, 20, 30])\` → \`[10, 30]\``,
        starter: `def first_and_last(lst):
    # return a list containing the first and last elements
    pass
`,
        tests: [
          { name: 'first_and_last([10, 20, 30]) == [10, 30]', check: 'first_and_last([10, 20, 30]) == [10, 30]', msg: 'first_and_last([10, 20, 30]) should return [10, 30]' },
          { name: 'first_and_last([1, 2]) == [1, 2]', check: 'first_and_last([1, 2]) == [1, 2]', msg: 'first_and_last([1, 2]) should return [1, 2]' },
          { name: 'first_and_last([5, 3, 8, 1]) == [5, 1]', check: 'first_and_last([5, 3, 8, 1]) == [5, 1]', msg: 'first_and_last([5, 3, 8, 1]) should return [5, 1]' },
        ],
      },
      {
        title: 'Appending Items',
        description: `# Lists — Appending Items

Lists are **mutable** — you can change them after creation. The simplest way to grow a list is \`.append(x)\`, which adds a single item to the end.

\`\`\`python
fruits = ["apple", "banana"]
fruits.append("cherry")
print(fruits)  # ['apple', 'banana', 'cherry']
\`\`\`

Each call to \`.append()\` adds exactly one item at the end. The list grows by one each time.

\`\`\`python
nums = []
nums.append(1)
nums.append(2)
nums.append(3)
print(nums)  # [1, 2, 3]
\`\`\``,
        example: `fruits = ["apple", "banana"]
print("Before:", fruits)

fruits.append("cherry")
print("After first append:", fruits)

fruits.append("date")
print("After second append:", fruits)`,
        quiz: [
          {
            question: 'Which method adds an item to the END of a list?',
            options: ['.add()', '.push()', '.insert()', '.append()'],
            answer: 3,
            explanation: '.append(x) adds x to the end. .insert(i, x) adds at a specific position.',
          },
        ],
        task: `Write a function \`build_list(n)\` that returns a list of integers from \`1\` to \`n\` (inclusive), built by appending one item at a time.

Example: \`build_list(4)\` → \`[1, 2, 3, 4]\``,
        starter: `def build_list(n):
    # build and return a list [1, 2, ..., n] using .append()
    pass
`,
        tests: [
          { name: 'build_list(4) == [1, 2, 3, 4]', check: 'build_list(4) == [1, 2, 3, 4]', msg: 'build_list(4) should return [1, 2, 3, 4]' },
          { name: 'build_list(1) == [1]', check: 'build_list(1) == [1]', msg: 'build_list(1) should return [1]' },
          { name: 'build_list(0) == []', check: 'build_list(0) == []', msg: 'build_list(0) should return []' },
        ],
      },
      {
        title: 'Index Assignment',
        description: `# Lists — Index Assignment

You can **replace** an existing item by assigning to its index:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits[0] = "mango"
print(fruits)  # ['mango', 'banana', 'cherry']
\`\`\`

This modifies the list in place — the item at that position is overwritten. Negative indexes work here too:

\`\`\`python
fruits[-1] = "grape"
print(fruits)  # ['mango', 'banana', 'grape']
\`\`\`

Note: index assignment can only replace an existing position. Assigning to an index that doesn't exist raises an \`IndexError\` — use \`.append()\` to add new items instead.`,
        example: `fruits = ["apple", "banana", "cherry"]
print("Before:", fruits)

fruits[0] = "mango"
print("After fruits[0] = 'mango':", fruits)

fruits[-1] = "grape"
print("After fruits[-1] = 'grape':", fruits)`,
        quiz: [
          {
            question: 'What does fruits[1] = "kiwi" do?',
            options: [
              'Adds "kiwi" after index 1',
              'Replaces the item at index 1 with "kiwi"',
              'Removes the item at index 1',
              'Raises an error',
            ],
            answer: 1,
            explanation: 'Index assignment replaces the existing item at that position. It does not insert or shift other items.',
          },
        ],
        task: `Write a function \`double_list(lst)\` that returns a **new list** where every element is multiplied by 2, using index assignment to fill in the values.

Example: \`double_list([1, 2, 3])\` → \`[2, 4, 6]\`

**Hint:** Start with a copy of the list, then loop over indexes using \`range(len(lst))\`.`,
        starter: `def double_list(lst):
    # return a new list with each element doubled
    pass
`,
        tests: [
          { name: 'double_list([1, 2, 3]) == [2, 4, 6]', check: 'double_list([1, 2, 3]) == [2, 4, 6]', msg: 'double_list([1, 2, 3]) should return [2, 4, 6]' },
          { name: 'double_list([0, 5]) == [0, 10]', check: 'double_list([0, 5]) == [0, 10]', msg: 'double_list([0, 5]) should return [0, 10]' },
          { name: 'double_list([]) == []', check: 'double_list([]) == []', msg: 'double_list([]) should return []' },
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
        title: 'for loops',
        description: `# Loops — for

A \`for\` loop runs a block of code once for each item in a sequence.

\`\`\`python
for fruit in ["apple", "banana"]:
    print(fruit)
# apple
# banana
\`\`\`

Use \`range(n)\` to loop a specific number of times. \`range(5)\` produces \`0, 1, 2, 3, 4\` — starting at 0, stopping before 5.

\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4
\`\`\``,
        example: `for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

print("---")

for i in range(5):
    print(i)`,
        quiz: [
          {
            question: 'How many times does "for i in range(3):" execute?',
            options: ['2', '3', '4', 'It depends'],
            answer: 1,
            explanation: 'range(3) produces 0, 1, 2 — exactly 3 values, so the loop body runs 3 times.',
          },
        ],
        task: `Write a function \`total(lst)\` that returns the sum of all numbers in \`lst\` using a \`for\` loop.

Example: \`total([1, 2, 3, 4])\` → \`10\`

*(Don't use the built-in \`sum()\`)*`,
        starter: `def total(lst):
    # return the sum using a for loop
    pass
`,
        tests: [
          { name: 'total([1, 2, 3, 4]) == 10', check: 'total([1, 2, 3, 4]) == 10', msg: 'total([1, 2, 3, 4]) should return 10' },
          { name: 'total([]) == 0', check: 'total([]) == 0', msg: 'total([]) should return 0' },
          { name: 'total([5]) == 5', check: 'total([5]) == 5', msg: 'total([5]) should return 5' },
        ],
      },
      {
        title: 'while loops',
        description: `# Loops — while

A \`while\` loop repeats as long as a condition is \`True\`. It checks the condition before each iteration.

\`\`\`python
n = 3
while n > 0:
    print(n)
    n -= 1
# 3
# 2
# 1
\`\`\`

**Always make sure the condition eventually becomes \`False\`.** Here, \`n -= 1\` decreases \`n\` on every iteration until it reaches 0. Without that line, the loop would run forever.`,
        example: `n = 5
while n > 0:
    print(n)
    n -= 1

print("Done!")`,
        quiz: [
          {
            question: "What's the risk of a while loop if you're not careful?",
            options: [
              'It can only run once',
              'It runs forever if the condition never becomes False',
              'It uses more memory than a for loop',
              'It only works with numbers',
            ],
            answer: 1,
            explanation: 'An infinite loop runs forever because the condition is always True. Always ensure your loop has a way to exit.',
          },
        ],
        task: `Write a function \`count_down(n)\` that returns a **list** counting down from \`n\` to \`1\`.

Example: \`count_down(5)\` → \`[5, 4, 3, 2, 1]\``,
        starter: `def count_down(n):
    # return a list from n down to 1
    pass
`,
        tests: [
          { name: 'count_down(5) == [5, 4, 3, 2, 1]', check: 'count_down(5) == [5, 4, 3, 2, 1]', msg: 'count_down(5) should return [5, 4, 3, 2, 1]' },
          { name: 'count_down(1) == [1]', check: 'count_down(1) == [1]', msg: 'count_down(1) should return [1]' },
          { name: 'count_down(3) == [3, 2, 1]', check: 'count_down(3) == [3, 2, 1]', msg: 'count_down(3) should return [3, 2, 1]' },
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
    description: 'Map keys to values for fast lookups.',
    steps: [
      {
        title: 'Creating a Dictionary',
        description: `# Dictionaries — Creating

A dictionary maps **keys** to **values**. Use curly braces \`{}\` with a colon between each key and value, and commas between pairs.

\`\`\`python
person = {"name": "Alice", "age": 25}
print(person["name"])  # "Alice"
print(person["age"])   # 25
\`\`\`

Keys are usually strings. Values can be anything — strings, numbers, lists, even other dicts. You can also add new keys after creation:

\`\`\`python
person["city"] = "Singapore"
\`\`\``,
        example: `person = {"name": "Alice", "age": 25}
print(person["name"])
print(person["age"])

# Add a new key
person["city"] = "Singapore"
print(person)`,
        quiz: [
          {
            question: 'Which creates a Python dictionary?',
            options: ['[name: "Alice"]', '("name", "Alice")', '{"name": "Alice"}', '{"Alice"}'],
            answer: 2,
            explanation: 'Dictionaries use curly braces with key: value pairs. {"Alice"} is a set, not a dict.',
          },
        ],
        task: `Create a dict called \`student\` that has at least a \`"name"\` key set to any string value.`,
        starter: `# Create a dictionary with a "name" key:
student =
`,
        tests: [
          { name: 'student["name"] is a string', check: 'isinstance(student.get("name"), str)', msg: 'student["name"] should be a string' },
        ],
      },
      {
        title: 'Accessing Values',
        description: `# Dictionaries — Accessing Values

Use square brackets with the key to read a value. If the key doesn't exist, you get a \`KeyError\`.

\`\`\`python
person = {"name": "Alice", "age": 25}
print(person["name"])  # "Alice"
\`\`\`

Use \`.get(key, default)\` for a safe lookup — it returns the default instead of crashing if the key is missing:

\`\`\`python
print(person.get("city", "Unknown"))  # "Unknown"
print(person.get("name", "Unknown"))  # "Alice"
\`\`\``,
        example: `person = {"name": "Alice", "age": 25}

# Direct access
print(person["name"])

# Safe access with .get()
print(person.get("city", "Unknown"))
print(person.get("name", "Unknown"))`,
        quiz: [
          {
            question: 'What does d.get("key", 0) return if "key" is not in d?',
            options: ['Raises a KeyError', 'Returns None', 'Returns 0', 'Returns False'],
            answer: 2,
            explanation: '.get(key, default) returns the default value when the key does not exist, avoiding a KeyError.',
          },
        ],
        task: `Write a function \`get_name(d)\` that returns the value stored at key \`"name"\` in the dict \`d\`.`,
        starter: `def get_name(d):
    # return the value at key "name"
    pass
`,
        tests: [
          { name: 'get_name({"name": "Bob"}) == "Bob"', check: 'get_name({"name": "Bob"}) == "Bob"', msg: 'get_name({"name": "Bob"}) should return "Bob"' },
          { name: 'get_name({"name": "Alice", "age": 20}) == "Alice"', check: 'get_name({"name": "Alice", "age": 20}) == "Alice"', msg: 'get_name should return the value at key "name"' },
        ],
      },
      {
        title: 'Iterating',
        description: `# Dictionaries — Iterating

You can loop over a dict in several ways. The most useful is \`.items()\`, which gives you both the key and value on each iteration.

\`\`\`python
scores = {"Alice": 95, "Bob": 82}
for key, value in scores.items():
    print(key, "->", value)
# Alice -> 95
# Bob -> 82
\`\`\`

You can also use \`.keys()\` for just keys, or \`.values()\` for just values.`,
        example: `scores = {"Alice": 95, "Bob": 82, "Carol": 71}

for name, score in scores.items():
    print(name, "->", score)

print("---")
print("Names:", list(scores.keys()))
print("Scores:", list(scores.values()))`,
        quiz: [
          {
            question: 'Which method gives you both keys AND values when looping over a dict?',
            options: ['.keys()', '.values()', '.items()', '.pairs()'],
            answer: 2,
            explanation: '.items() returns (key, value) tuples that you can unpack directly in a for loop.',
          },
        ],
        task: `Write a function \`total_score(scores)\` that takes a dict mapping names to integers and returns the sum of all the score values.

Example: \`total_score({"Alice": 95, "Bob": 82})\` → \`177\``,
        starter: `def total_score(scores):
    # return the sum of all values
    pass
`,
        tests: [
          { name: 'total_score({"Alice": 95, "Bob": 82}) == 177', check: 'total_score({"Alice": 95, "Bob": 82}) == 177', msg: 'total_score({"Alice": 95, "Bob": 82}) should return 177' },
          { name: 'total_score({"x": 10}) == 10', check: 'total_score({"x": 10}) == 10', msg: 'total_score({"x": 10}) should return 10' },
          { name: 'total_score({}) == 0', check: 'total_score({}) == 0', msg: 'total_score({}) should return 0' },
        ],
      },
      {
        title: 'Word Count',
        description: `# Dictionaries — Word Count

Dicts are great for counting occurrences. Here's the standard pattern:

\`\`\`python
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1
\`\`\`

How it works: \`.get(item, 0)\` returns the current count (or \`0\` if first time seeing it), then we add \`1\` and store it back.

\`\`\`python
items = ["apple", "banana", "apple"]
# counts starts as {}
# after "apple": {"apple": 1}
# after "banana": {"apple": 1, "banana": 1}
# after "apple": {"apple": 2, "banana": 1}
\`\`\``,
        example: `items = ["apple", "banana", "apple", "cherry", "banana", "apple"]

counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1

print(counts)`,
        quiz: [
          {
            question: 'In "counts.get(item, 0) + 1", what does the 0 represent?',
            options: [
              'The count when item is seen twice',
              'The starting count for a new item',
              'The maximum allowed count',
              'A random default value',
            ],
            answer: 1,
            explanation: 'If item has not been seen yet, .get() returns 0, so we correctly start counting from 1.',
          },
        ],
        task: `Write a function \`word_count(text)\` that splits \`text\` into words and returns a dict mapping each word to how many times it appears.

Example: \`word_count("hi hi hello")\` → \`{"hi": 2, "hello": 1}\`

**Hint:** use \`text.split()\` to split by spaces.`,
        starter: `def word_count(text):
    # count occurrences of each word in text
    pass
`,
        tests: [
          { name: 'word_count("hi hi hello") == {"hi": 2, "hello": 1}', check: 'word_count("hi hi hello") == {"hi": 2, "hello": 1}', msg: 'word_count("hi hi hello") should return {"hi": 2, "hello": 1}' },
          { name: 'word_count("a b a") == {"a": 2, "b": 1}', check: 'word_count("a b a") == {"a": 2, "b": 1}', msg: 'word_count("a b a") should return {"a": 2, "b": 1}' },
          { name: 'word_count("hello") == {"hello": 1}', check: 'word_count("hello") == {"hello": 1}', msg: 'word_count("hello") should return {"hello": 1}' },
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
