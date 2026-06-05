---
{
  "title": "Comparing Things",
  "example": "print(10 > 5)\nprint(3 < 1)\nprint(7 == 7)\nprint(4 != 4)\n\nscore = 85\nprint(score > 50)",
  "task": "You have `score = 80`. Set `passed` to the result of checking whether score is greater than 60.",
  "starter": "score = 80\npassed = False\n",
  "quiz": [
    {
      "question": "What does 3 == 3 return?",
      "options": ["3", "False", "True", "An error"],
      "answer": 2,
      "explanation": "== checks if two values are equal. 3 equals 3, so it returns True."
    }
  ],
  "tests": [
    {
      "name": "passed == True",
      "check": "passed == True",
      "msg": "80 > 60 is True, so passed should be True"
    }
  ]
}
---

# Comparing Things

You can compare two values. The result is always `True` or `False`.

```python
print(5 > 3)   # True
print(5 < 3)   # False
print(5 == 5)  # True
```

Common comparisons:
- `>` greater than
- `<` less than
- `==` equal to (two equals signs!)
- `!=` not equal to

---step---
---
{
  "title": "if",
  "example": "score = 90\n\nif score > 80:\n    print(\"Great score!\")\n\n# Try changing score to 50 and running again",
  "task": "You have `temperature = 30`. Write an `if` that sets `message` to `\"hot\"` when temperature is greater than 25.",
  "starter": "temperature = 30\nmessage = \"unknown\"\n\n# Write your if below:\n",
  "quiz": [
    {
      "question": "What do the 4 spaces before \"print\" do?",
      "options": ["They are decoration", "They mark the line as inside the if block", "They make the line run always", "They are required at the start of every line"],
      "answer": 1,
      "explanation": "Indentation (the spaces) tells Python which lines belong inside the if block."
    }
  ],
  "tests": [
    {
      "name": "message == \"hot\"",
      "check": "message == \"hot\"",
      "msg": "temperature is 30, which is greater than 25, so message should be \"hot\""
    }
  ]
}
---

# Making a Decision — if

Use `if` to run code only when something is true.

```python
score = 90

if score > 80:
    print("Great score!")
```

The 4 spaces before `print` are called **indentation**. They tell Python this line is *inside* the `if`. If the condition is false, the indented code is skipped.

---step---
---
{
  "title": "if / else",
  "example": "weather = \"sunny\"\n\nif weather == \"sunny\":\n    print(\"Let's go outside!\")\nelse:\n    print(\"Stay inside.\")\n\n# Try changing weather to \"rainy\" and running again",
  "task": "`score` is `45`. Write an `if`/`else` to set `grade` to `\"pass\"` if score is 50 or more, or `\"fail\"` if it's less.",
  "starter": "score = 45\ngrade = \"not set\"\n",
  "quiz": [
    {
      "question": "What runs when the if condition is False?",
      "options": ["The if block still runs", "Python raises an error", "The else block runs", "Nothing runs"],
      "answer": 2,
      "explanation": "When the condition is False, Python skips the if block and runs the else block instead."
    }
  ],
  "tests": [
    {
      "name": "grade is \"fail\"",
      "check": "grade == \"fail\"",
      "msg": "score is 45, which is less than 50, so grade should be \"fail\""
    }
  ]
}
---

# if / else

Add `else` for what happens when the condition is false.

```python
temperature = 20

if temperature > 25:
    message = "hot"
else:
    message = "cool"

print(message)
```

---step---
---
{
  "title": "elif",
  "example": "score = 75\n\nif score >= 90:\n    grade = \"A\"\nelif score >= 70:\n    grade = \"B\"\nelif score >= 50:\n    grade = \"C\"\nelse:\n    grade = \"F\"\n\nprint(grade)\n# Try changing score to 95, 60, or 40",
  "task": "`score` is `75`. Use `if`/`elif`/`else` to set `grade` to `\"A\"` if 90 or more, `\"B\"` if 70 or more, or `\"C\"` otherwise.",
  "starter": "score = 75\ngrade = \"not set\"\n",
  "quiz": [
    {
      "question": "How many branches of an if/elif/else can run at most?",
      "options": ["All of them", "None of them", "Exactly one", "Two at most"],
      "answer": 2,
      "explanation": "Python checks each condition in order and runs only the first one that is True."
    }
  ],
  "tests": [
    {
      "name": "grade is \"B\"",
      "check": "grade == \"B\"",
      "msg": "score is 75 — that's 70 or more but less than 90, so grade should be \"B\""
    }
  ]
}
---

# More Choices — elif

`elif` means "else if" — it lets you check more conditions. Only the **first** match runs.

```python
score = 75

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
```
