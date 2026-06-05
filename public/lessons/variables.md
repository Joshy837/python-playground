---
{
  "title": "Your First Variable",
  "example": "name = \"Maya\"\nprint(name)\n\n# Try changing \"Maya\" to your own name and running again",
  "task": "Create a variable called `name` and set it to your name (or any name you like).",
  "starter": "name = \"\"\nprint(name)\n",
  "quiz": [
    {
      "question": "Which line creates a variable called name?",
      "options": ["print(name)", "name = \"Maya\"", "\"Maya\"", "name"],
      "answer": 1,
      "explanation": "The = sign stores the value on the right into the label on the left."
    }
  ],
  "tests": [
    {
      "name": "name is a non-empty string",
      "check": "isinstance(name, str) and len(name) > 0",
      "msg": "name should be a string with at least one character — wrap it in quotes"
    }
  ]
}
---

# Your First Variable

A **variable** is like a labelled box — you give it a name, and it holds a value.

```python
name = "Maya"
print(name)
```

`name` is the label. `"Maya"` is what's inside. `print` shows it on screen.

---step---
---
{
  "title": "Strings",
  "example": "pet = \"Fluffy\"\ncity = 'London'\nprint(pet)\nprint(city)",
  "task": "Create a variable called `favourite_food` and set it to your favourite food as a string.",
  "starter": "favourite_food = \"\"\nprint(favourite_food)\n",
  "quiz": [
    {
      "question": "Which of these is a string?",
      "options": ["42", "True", "\"hello\"", "3.14"],
      "answer": 2,
      "explanation": "Strings are text values wrapped in quote marks."
    }
  ],
  "tests": [
    {
      "name": "favourite_food is a non-empty string",
      "check": "isinstance(favourite_food, str) and len(favourite_food) > 0",
      "msg": "favourite_food should be a string — wrap it in quotes"
    }
  ]
}
---

# Text Values — Strings

Text in Python is called a **string**. Strings always have quote marks around them.

```python
pet = "Fluffy"
```

Single quotes work too — they mean the same thing:

```python
city = 'London'
```

---step---
---
{
  "title": "Joining Strings",
  "example": "first_name = \"Maya\"\nlast_name = \"Smith\"\nfull_name = first_name + \" \" + last_name\nprint(full_name)",
  "task": "You have `first = \"Hello\"` and `name = \"Maya\"`. Create a variable `greeting` that joins them with a space between — it should equal `\"Hello Maya\"`.",
  "starter": "first = \"Hello\"\nname = \"Maya\"\ngreeting = \"\"\n",
  "quiz": [
    {
      "question": "What does \"Hello, \" + \"world\" produce?",
      "options": ["An error", "\"Hello, \" (just the first part)", "\"Hello, world\"", "\"Helloworld\""],
      "answer": 2,
      "explanation": "+ joins two strings together into one."
    }
  ],
  "tests": [
    {
      "name": "greeting == \"Hello Maya\"",
      "check": "greeting == \"Hello Maya\"",
      "msg": "greeting should be \"Hello Maya\" — join first, a space \" \", and name with +"
    }
  ]
}
---

# Joining Strings

You can stick two strings together using `+`.

```python
first = "Hello, "
second = "Maya!"
message = first + second
print(message)
```

Output: `Hello, Maya!`

---step---
---
{
  "title": "Integers",
  "example": "age = 10\nprint(age)\n\ncoins = 25\nprint(coins)",
  "task": "Create a variable called `age` and set it to any whole number.",
  "starter": "age = 0\nprint(age)\n",
  "quiz": [
    {
      "question": "Which stores a whole number (integer)?",
      "options": ["age = \"10\"", "age = 10", "age = 10.0", "age = True"],
      "answer": 1,
      "explanation": "Integers are whole numbers — no quotes and no decimal point."
    }
  ],
  "tests": [
    {
      "name": "age is an integer",
      "check": "isinstance(age, int) and not isinstance(age, bool)",
      "msg": "age should be a whole number — no quotes, no decimal point"
    }
  ]
}
---

# Whole Numbers — Integers

Numbers in Python don't need quote marks.

```python
age = 10
print(age)
```

These are called **integers** — whole numbers with no decimal point.

---step---
---
{
  "title": "Maths",
  "example": "apples = 5\noranges = 3\n\nprint(apples + oranges)\nprint(apples - oranges)\nprint(apples * 2)",
  "task": "You have `price = 5` and `quantity = 3`. Create a variable `total` that equals price multiplied by quantity.",
  "starter": "price = 5\nquantity = 3\ntotal = 0\n",
  "quiz": [
    {
      "question": "What does 4 * 3 equal in Python?",
      "options": ["7", "12", "43", "1"],
      "answer": 1,
      "explanation": "* is the multiplication operator in Python."
    }
  ],
  "tests": [
    {
      "name": "total == 15",
      "check": "total == 15",
      "msg": "5 * 3 = 15, so total should be 15"
    }
  ]
}
---

# Maths with Numbers

Python can do maths. Use `+`, `-`, and `*`.

```python
apples = 5
oranges = 3
total = apples + oranges
print(total)
```

---step---
---
{
  "title": "Floats",
  "example": "price = 1.99\nprint(price)\n\nhalf = 0.5\nprint(price + half)",
  "task": "Create a variable called `height` and set it to any decimal number (e.g. `1.5`).",
  "starter": "height = 0.0\nprint(height)\n",
  "quiz": [
    {
      "question": "Which of these is a float?",
      "options": ["5", "\"5.0\"", "5.0", "True"],
      "answer": 2,
      "explanation": "Any number written with a decimal point — like 5.0 or 1.99 — is a float."
    }
  ],
  "tests": [
    {
      "name": "height is a positive float",
      "check": "isinstance(height, float) and height > 0",
      "msg": "height should be a float greater than 0 — include a decimal point (e.g. 1.5)"
    }
  ]
}
---

# Decimal Numbers — Floats

When a number has a decimal point, Python calls it a **float**.

```python
price = 1.99
print(price)
```

Even `1.0` is a float — the decimal point is what matters.

---step---
---
{
  "title": "Booleans",
  "example": "is_sunny = True\nhas_pet = False\n\nprint(is_sunny)\nprint(has_pet)",
  "task": "Create a variable called `is_raining` and set it to either `True` or `False`.",
  "starter": "is_raining = False\nprint(is_raining)\n",
  "quiz": [
    {
      "question": "Which is a valid Python boolean?",
      "options": ["\"True\"", "true", "True", "1"],
      "answer": 2,
      "explanation": "Python booleans are True or False — capital first letter, no quotes."
    }
  ],
  "tests": [
    {
      "name": "is_raining is a boolean",
      "check": "isinstance(is_raining, bool)",
      "msg": "is_raining should be True or False (capital T/F, no quotes)"
    }
  ]
}
---

# Yes and No — Booleans

A **boolean** is either `True` or `False`. It's used for yes/no values.

```python
is_sunny = True
has_pet = False
print(is_sunny)
```

Capital T and F — lowercase `true` and `false` won't work.
