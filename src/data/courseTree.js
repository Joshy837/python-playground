import { Tag, GitBranch, List, Repeat, BookOpen } from 'lucide-react'

// Canvas coordinates for the 5-node tree (natural px, 640×400 canvas, left-to-right)
// Column x values: 100, 320, 540  |  Row y values: 120, 280
export const NODES = [
  {
    id: 'variables',
    title: 'Variables & Types',
    icon: Tag,
    x: 100, y: 200,
    requires: [],
    description: 'Learn how to store data in variables and work with Python\'s basic types.',
    instructions: `# Variables & Types

Variables let you store and name data. Python has four basic types you'll use constantly:

- **str** — text, written in quotes: \`"hello"\`
- **int** — whole numbers: \`42\`
- **float** — decimal numbers: \`3.14\`
- **bool** — \`True\` or \`False\`

You create a variable by writing a name, then \`=\`, then a value:

\`\`\`python
name = "Alice"
age = 25
height = 1.68
is_student = True
\`\`\`

## Challenge

Create four variables:
- \`name\` — a string (your name or any name)
- \`age\` — an integer
- \`height\` — a float (e.g. \`1.75\`)
- \`is_student\` — a boolean (\`True\` or \`False\`)`,
    starter: `# Create four variables:
# name    → a string
# age     → an integer
# height  → a float
# is_student → True or False

name =
age =
height =
is_student =
`,
    tests: [
      { name: 'name is a string', check: 'isinstance(name, str)', msg: 'name should be a str (wrap it in quotes)' },
      { name: 'age is an integer', check: 'isinstance(age, int) and not isinstance(age, bool)', msg: 'age should be an int' },
      { name: 'height is a float', check: 'isinstance(height, float)', msg: 'height should be a float (e.g. 1.75)' },
      { name: 'is_student is a bool', check: 'isinstance(is_student, bool)', msg: 'is_student should be True or False' },
    ],
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    icon: GitBranch,
    x: 320, y: 120,
    requires: ['variables'],
    description: 'Use if/elif/else to make decisions in your code.',
    instructions: `# Conditionals

Conditionals let your code choose different paths based on a value.

\`\`\`python
if temperature > 30:
    print("Hot!")
elif temperature > 15:
    print("Warm")
else:
    print("Cold")
\`\`\`

Key points:
- The condition after \`if\` or \`elif\` must be \`True\` or \`False\`
- Only the **first** matching branch runs
- \`else\` is a catch-all — no condition needed

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
  {
    id: 'lists',
    title: 'Lists',
    icon: List,
    x: 320, y: 280,
    requires: ['variables'],
    description: 'Store and manipulate ordered collections of values.',
    instructions: `# Lists

A list holds an ordered sequence of values. You can mix types, but usually keep them the same.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # "apple"  (indexing starts at 0)
print(fruits[-1])  # "cherry" (last item)
print(len(fruits)) # 3

fruits.append("mango")   # add to end
fruits[1] = "blueberry"  # change an item
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
    id: 'loops',
    title: 'Loops',
    icon: Repeat,
    x: 540, y: 120,
    requires: ['conditionals'],
    description: 'Repeat actions with for and while loops.',
    instructions: `# Loops

Loops let you repeat code without copying it.

**for loop** — iterates over a sequence:
\`\`\`python
for fruit in ["apple", "banana"]:
    print(fruit)

for i in range(5):   # 0, 1, 2, 3, 4
    print(i)
\`\`\`

**while loop** — repeats as long as a condition is true:
\`\`\`python
n = 3
while n > 0:
    print(n)
    n -= 1
\`\`\`

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
  {
    id: 'dicts',
    title: 'Dictionaries',
    icon: BookOpen,
    x: 540, y: 280,
    requires: ['lists'],
    description: 'Map keys to values for fast lookups.',
    instructions: `# Dictionaries

A dictionary maps **keys** to **values**. Great for counting, grouping, and fast lookups.

\`\`\`python
person = {"name": "Alice", "age": 25}
print(person["name"])   # "Alice"
person["city"] = "NYC"  # add a new key
print(person.keys())    # dict_keys(["name", "age", "city"])
\`\`\`

You can loop over a dict too:
\`\`\`python
for key, value in person.items():
    print(key, "->", value)
\`\`\`

## Challenge

Write a function \`word_count(text)\` that takes a string, splits it into words, and returns a dict mapping each word to how many times it appears.

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
]

// Edges derived from requires
export const EDGES = NODES.flatMap(node =>
  node.requires.map(req => ({ from: req, to: node.id }))
)

export const NODE_W = 140
export const NODE_H = 52
export const CANVAS_W = 680
export const CANVAS_H = 400
