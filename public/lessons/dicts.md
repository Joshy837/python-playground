---
{
  "title": "Creating a Dictionary",
  "example": "pet = {\"name\": \"Fluffy\", \"age\": 3}\nprint(pet)",
  "task": "Create a dictionary called `pet` with a `\"name\"` key set to any animal name you like.",
  "starter": "pet = {}\nprint(pet)\n",
  "quiz": [
    {
      "question": "Which creates a Python dictionary?",
      "options": ["[\"name\": \"Fluffy\"]", "(\"name\", \"Fluffy\")", "{\"name\": \"Fluffy\"}", "{\"Fluffy\"}"],
      "answer": 2,
      "explanation": "Dictionaries use curly braces {} with key: value pairs."
    }
  ],
  "tests": [
    {
      "name": "pet[\"name\"] is a string",
      "check": "isinstance(pet.get(\"name\"), str) and len(pet.get(\"name\", \"\")) > 0",
      "msg": "pet[\"name\"] should be a non-empty string"
    }
  ]
}
---

# Dictionaries

A **dictionary** stores labelled values. Each label is called a **key**.

```python
pet = {"name": "Fluffy", "age": 3}
print(pet)
```

Think of it like a pet profile — each key is a label, and each value is what's written next to it.

---step---
---
{
  "title": "Reading Values",
  "example": "pet = {\"name\": \"Fluffy\", \"age\": 3}\nprint(pet[\"name\"])\nprint(pet[\"age\"])",
  "task": "You have `pet = {\"name\": \"Fluffy\", \"age\": 3}`. Set `pet_name` to the pet's name by reading it from the dictionary.",
  "starter": "pet = {\"name\": \"Fluffy\", \"age\": 3}\npet_name = \"not set\"\n",
  "quiz": [
    {
      "question": "How do you read the value for key \"age\" from a dict called pet?",
      "options": ["pet.age", "pet(\"age\")", "pet[\"age\"]", "pet{age}"],
      "answer": 2,
      "explanation": "Use square brackets with the key in quotes: pet[\"age\"]."
    }
  ],
  "tests": [
    {
      "name": "pet_name == \"Fluffy\"",
      "check": "pet_name == \"Fluffy\"",
      "msg": "pet_name should be \"Fluffy\" — read it with pet[\"name\"]"
    }
  ]
}
---

# Reading Values

Use square brackets with the key to read its value:

```python
pet = {"name": "Fluffy", "age": 3}
print(pet["name"])  # "Fluffy"
print(pet["age"])   # 3
```

---step---
---
{
  "title": "Adding Values",
  "example": "pet = {\"name\": \"Fluffy\"}\nprint(\"Before:\", pet)\n\npet[\"colour\"] = \"orange\"\npet[\"age\"] = 3\nprint(\"After:\", pet)",
  "task": "You have `pet = {\"name\": \"Fluffy\"}`. Add a new key `\"age\"` with the value `3`.",
  "starter": "pet = {\"name\": \"Fluffy\"}\n\n# Add an \"age\" key with value 3:\n",
  "quiz": [
    {
      "question": "What does pet[\"colour\"] = \"orange\" do if \"colour\" is not already in pet?",
      "options": ["Raises an error", "Does nothing", "Adds a new \"colour\" key with value \"orange\"", "Removes \"colour\""],
      "answer": 2,
      "explanation": "Assigning to a new key adds it to the dictionary."
    }
  ],
  "tests": [
    {
      "name": "pet[\"age\"] == 3",
      "check": "pet.get(\"age\") == 3",
      "msg": "pet[\"age\"] should be 3"
    }
  ]
}
---

# Adding New Values

Add new keys to a dictionary by assigning to them:

```python
pet = {"name": "Fluffy"}
pet["colour"] = "orange"
print(pet)
```

---step---
---
{
  "title": "Iterating",
  "example": "scores = {\"Alice\": 10, \"Bob\": 8, \"Carol\": 9}\n\nfor name, score in scores.items():\n    print(name, \"scored\", score)",
  "task": "You have `scores = {\"Alice\": 10, \"Bob\": 8, \"Carol\": 9}`. Use a `for` loop with `.items()` to add all the scores up into `total`.",
  "starter": "scores = {\"Alice\": 10, \"Bob\": 8, \"Carol\": 9}\ntotal = 0\n\n# Add each score to total:\n",
  "quiz": [
    {
      "question": "Which method gives you both keys AND values when looping?",
      "options": [".keys()", ".values()", ".items()", ".pairs()"],
      "answer": 2,
      "explanation": ".items() gives you (key, value) pairs you can unpack in a for loop."
    }
  ],
  "tests": [
    {
      "name": "total == 27",
      "check": "total == 27",
      "msg": "10+8+9 = 27, so total should be 27"
    }
  ]
}
---

# Looping Through a Dictionary

Use `.items()` to loop through both keys and values at the same time:

```python
scores = {"Alice": 10, "Bob": 8}
for name, score in scores.items():
    print(name, "scored", score)
# Alice scored 10
# Bob scored 8
```

---step---
---
{
  "title": "Counting",
  "example": "words = [\"cat\", \"dog\", \"cat\", \"fish\", \"dog\", \"cat\"]\n\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\n\nprint(counts)",
  "task": "You have `animals = [\"cat\", \"dog\", \"cat\", \"fish\", \"dog\", \"cat\"]`. Count how many times each animal appears and store the result in `counts`.",
  "starter": "animals = [\"cat\", \"dog\", \"cat\", \"fish\", \"dog\", \"cat\"]\ncounts = {}\n\n# Count each animal:\n",
  "quiz": [
    {
      "question": "In counts.get(word, 0) + 1, what does the 0 do?",
      "options": ["Counts from 0 upwards", "Starts the count at 0 for a new item", "Sets the maximum count", "Resets the count each loop"],
      "answer": 1,
      "explanation": "If the word is new, .get() returns 0, so we correctly start counting from 1."
    }
  ],
  "tests": [
    {
      "name": "counts[\"cat\"] == 3",
      "check": "counts.get(\"cat\") == 3",
      "msg": "\"cat\" appears 3 times"
    },
    {
      "name": "counts[\"dog\"] == 2",
      "check": "counts.get(\"dog\") == 2",
      "msg": "\"dog\" appears 2 times"
    },
    {
      "name": "counts[\"fish\"] == 1",
      "check": "counts.get(\"fish\") == 1",
      "msg": "\"fish\" appears 1 time"
    }
  ]
}
---

# Counting Things

Dictionaries are great for counting how many times something appears:

```python
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1
```

`counts.get(item, 0)` returns the current count, or `0` if it's the first time. Then we add `1` and save it back.
