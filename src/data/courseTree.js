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
        title: 'Strings & Integers',
        instructions: `# Variables — Strings & Integers

A variable stores a value. You create one by writing a name, then \`=\`, then the value.

- **str** — text wrapped in quotes: \`"hello"\`, \`'world'\`
- **int** — whole numbers: \`42\`, \`-7\`, \`0\`

\`\`\`python
name = "Alice"
age = 25
print(name, age)  # Alice 25
\`\`\`

## Challenge

Create two variables:
- \`name\` — a string (any name you like)
- \`age\` — an integer`,
        starter: `# Create two variables:
name =
age =
`,
        tests: [
          { name: 'name is a string', check: 'isinstance(name, str)', msg: 'name should be a str — wrap it in quotes' },
          { name: 'age is an integer', check: 'isinstance(age, int) and not isinstance(age, bool)', msg: 'age should be an int (no quotes, no decimal)' },
        ],
      },
      {
        title: 'Floats & Booleans',
        instructions: `# Variables — Floats & Booleans

Two more types you'll use constantly:

- **float** — decimal numbers: \`3.14\`, \`1.75\`
- **bool** — exactly \`True\` or \`False\` (capital first letter, no quotes)

\`\`\`python
height = 1.75
is_student = True
print(type(height))      # <class 'float'>
print(type(is_student))  # <class 'bool'>
\`\`\`

## Challenge

Create two variables:
- \`height\` — a float (e.g. \`1.75\`)
- \`is_student\` — a boolean (\`True\` or \`False\`)`,
        starter: `# Create two variables:
height =
is_student =
`,
        tests: [
          { name: 'height is a float', check: 'isinstance(height, float)', msg: 'height should be a float — include a decimal point (e.g. 1.75)' },
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
        instructions: `# Conditionals — if / else

Use \`if\` to run code only when a condition is true. Use \`else\` as the fallback.

\`\`\`python
if temperature > 30:
    print("Hot!")
else:
    print("Not hot")
\`\`\`

The indented block runs only when the condition is \`True\`.

## Challenge

Write a function \`is_even(n)\` that returns \`True\` if \`n\` is even, \`False\` if it's odd.

Hint: \`n % 2\` gives the remainder when dividing by 2. Even numbers have remainder \`0\`.`,
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
        instructions: `# Conditionals — if / elif / else

\`elif\` lets you check multiple conditions in sequence. Only the **first** matching branch runs.

\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
\`\`\`

## Challenge

Write a function \`classify(n)\` that returns:
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
        title: 'Creating & Accessing',
        instructions: `# Lists — Creating & Accessing

A list holds an ordered sequence of values in square brackets.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])    # "apple"  — indexing starts at 0
print(fruits[-1])   # "cherry" — last item
print(len(fruits))  # 3
\`\`\`

## Challenge

1. Create a list \`numbers\` containing \`[3, 1, 4, 1, 5]\`
2. Write a function \`first_and_last(lst)\` that returns a **new list** with the first and last elements of \`lst\``,
        starter: `numbers = [3, 1, 4, 1, 5]

def first_and_last(lst):
    # return a list containing the first and last elements
    pass
`,
        tests: [
          { name: 'numbers == [3, 1, 4, 1, 5]', check: 'numbers == [3, 1, 4, 1, 5]', msg: 'numbers should be [3, 1, 4, 1, 5]' },
          { name: 'first_and_last([10, 20, 30]) == [10, 30]', check: 'first_and_last([10, 20, 30]) == [10, 30]', msg: 'first_and_last([10, 20, 30]) should return [10, 30]' },
          { name: 'first_and_last([1, 2]) == [1, 2]', check: 'first_and_last([1, 2]) == [1, 2]', msg: 'first_and_last([1, 2]) should return [1, 2]' },
        ],
      },
      {
        title: 'Modifying Lists',
        instructions: `# Lists — Modifying

Lists are **mutable** — you can change them after creation.

\`\`\`python
fruits = ["apple", "banana"]
fruits.append("cherry")   # add to end
fruits[0] = "mango"       # replace an item
print(fruits)  # ["mango", "banana", "cherry"]
\`\`\`

## Challenge

Write a function \`double_list(lst)\` that returns a **new list** where every element is multiplied by 2.

Example: \`double_list([1, 2, 3])\` → \`[2, 4, 6]\``,
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
        instructions: `# Loops — for

A \`for\` loop runs a block of code once for each item in a sequence.

\`\`\`python
for fruit in ["apple", "banana"]:
    print(fruit)

for i in range(5):   # 0, 1, 2, 3, 4
    print(i)
\`\`\`

## Challenge

Write a function \`total(lst)\` that returns the sum of all numbers in \`lst\` using a \`for\` loop.

Example: \`total([1, 2, 3, 4])\` → \`10\`

(Don't use the built-in \`sum()\`)`,
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
        instructions: `# Loops — while

A \`while\` loop repeats as long as a condition is true.

\`\`\`python
n = 3
while n > 0:
    print(n)
    n -= 1   # without this the loop runs forever!
\`\`\`

Always make sure the condition eventually becomes \`False\`.

## Challenge

Write a function \`count_down(n)\` that returns a **list** counting down from \`n\` to \`1\`.

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
        title: 'Creating & Accessing',
        instructions: `# Dictionaries — Creating & Accessing

A dictionary maps **keys** to **values**. Use curly braces and colons.

\`\`\`python
person = {"name": "Alice", "age": 25}
print(person["name"])   # "Alice"
person["city"] = "NYC"  # add a new key
\`\`\`

## Challenge

1. Create a dict \`student\` with a \`"name"\` key (a string) and a \`"grade"\` key (an integer)
2. Write a function \`get_name(d)\` that returns the value at key \`"name"\``,
        starter: `student = {}  # add "name" and "grade" keys

def get_name(d):
    # return the value at key "name"
    pass
`,
        tests: [
          { name: 'student["name"] is a string', check: 'isinstance(student.get("name"), str)', msg: 'student["name"] should be a string' },
          { name: 'student["grade"] is an integer', check: 'isinstance(student.get("grade"), int) and not isinstance(student.get("grade"), bool)', msg: 'student["grade"] should be an integer' },
          { name: 'get_name({"name": "Bob"}) == "Bob"', check: 'get_name({"name": "Bob", "age": 20}) == "Bob"', msg: 'get_name should return the value at key "name"' },
        ],
      },
      {
        title: 'Iterating',
        instructions: `# Dictionaries — Iterating

You can loop over keys, values, or both with \`.items()\`.

\`\`\`python
scores = {"Alice": 95, "Bob": 82}
for key, value in scores.items():
    print(key, "->", value)
# Alice -> 95
# Bob -> 82
\`\`\`

## Challenge

Write a function \`total_score(scores)\` that takes a dict mapping names to integers, and returns the sum of all scores.

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
        instructions: `# Dictionaries — Word Count

Dicts are great for counting. Here's the standard pattern:

\`\`\`python
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1
\`\`\`

\`.get(key, default)\` returns the value if the key exists, or \`default\` if it doesn't.

## Challenge

Write a function \`word_count(text)\` that splits \`text\` into words and returns a dict mapping each word to how many times it appears.

Example: \`word_count("hi hi hello")\` → \`{"hi": 2, "hello": 1}\``,
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
