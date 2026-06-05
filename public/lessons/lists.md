---
{
  "title": "Creating a List",
  "example": "fruits = [\"apple\", \"banana\", \"cherry\"]\nprint(fruits)\nprint(len(fruits))",
  "task": "Create a list called `colours` containing `\"red\"`, `\"green\"`, and `\"blue\"`.",
  "starter": "colours = []\nprint(colours)\n",
  "quiz": [
    {
      "question": "Which syntax creates a list?",
      "options": ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "1, 2, 3"],
      "answer": 2,
      "explanation": "Lists use square brackets []."
    }
  ],
  "tests": [
    {
      "name": "colours == [\"red\", \"green\", \"blue\"]",
      "check": "colours == [\"red\", \"green\", \"blue\"]",
      "msg": "colours should be [\"red\", \"green\", \"blue\"]"
    }
  ]
}
---

# Lists

A **list** holds many values in one variable, inside square brackets `[]`.

```python
fruits = ["apple", "banana", "cherry"]
print(fruits)
```

Use `len()` to count how many items are in the list:

```python
print(len(fruits))  # 3
```

---step---
---
{
  "title": "Getting Items",
  "example": "fruits = [\"apple\", \"banana\", \"cherry\"]\nprint(fruits[0])   # first\nprint(fruits[1])   # second\nprint(fruits[-1])  # last",
  "task": "You have `animals = [\"cat\", \"dog\", \"fish\"]`. Set `first` to the first animal and `last` to the last animal using indexes.",
  "starter": "animals = [\"cat\", \"dog\", \"fish\"]\nfirst = \"not set\"\nlast = \"not set\"\n",
  "quiz": [
    {
      "question": "For pets = [\"cat\", \"dog\", \"fish\"], what is pets[0]?",
      "options": ["\"dog\"", "\"fish\"", "\"cat\"", "An error"],
      "answer": 2,
      "explanation": "Index 0 is always the first item in the list."
    }
  ],
  "tests": [
    {
      "name": "first == \"cat\"",
      "check": "first == \"cat\"",
      "msg": "first should be \"cat\" — the item at index 0"
    },
    {
      "name": "last == \"fish\"",
      "check": "last == \"fish\"",
      "msg": "last should be \"fish\" — use index -1"
    }
  ]
}
---

# Getting Items — Indexes

Each item has a number called an **index**. The first item is always index `0`.

```python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # "apple"
print(fruits[1])  # "banana"
```

Use `-1` to get the last item:

```python
print(fruits[-1])  # "cherry"
```

---step---
---
{
  "title": "Adding Items",
  "example": "animals = [\"cat\"]\nprint(\"Before:\", animals)\n\nanimals.append(\"dog\")\nanimals.append(\"fish\")\nprint(\"After:\", animals)",
  "task": "Start with `cart = []`. Use `.append()` to add `\"bread\"`, `\"milk\"`, and `\"eggs\"` — in that order.",
  "starter": "cart = []\n\n# Add \"bread\", \"milk\", and \"eggs\":\n",
  "quiz": [
    {
      "question": "What does animals.append(\"rabbit\") do?",
      "options": ["Adds \"rabbit\" to the start", "Replaces the last item", "Adds \"rabbit\" to the end", "Removes \"rabbit\""],
      "answer": 2,
      "explanation": ".append(x) always adds x to the end of the list."
    }
  ],
  "tests": [
    {
      "name": "cart == [\"bread\", \"milk\", \"eggs\"]",
      "check": "cart == [\"bread\", \"milk\", \"eggs\"]",
      "msg": "cart should be [\"bread\", \"milk\", \"eggs\"]"
    }
  ]
}
---

# Adding Items — append

Use `.append()` to add one item to the end of a list.

```python
animals = ["cat", "dog"]
animals.append("fish")
print(animals)  # ["cat", "dog", "fish"]
```

---step---
---
{
  "title": "Changing Items",
  "example": "colours = [\"red\", \"green\", \"blue\"]\nprint(\"Before:\", colours)\n\ncolours[0] = \"pink\"\nprint(\"After:\", colours)",
  "task": "You have `pets = [\"cat\", \"dog\", \"fish\"]`. Change the item at index `1` to `\"hamster\"`.",
  "starter": "pets = [\"cat\", \"dog\", \"fish\"]\n\n# Change index 1 to \"hamster\":\n",
  "quiz": [
    {
      "question": "What does colours[0] = \"yellow\" do?",
      "options": ["Adds \"yellow\" to the start", "Replaces the item at index 0 with \"yellow\"", "Removes index 0", "Adds \"yellow\" to the end"],
      "answer": 1,
      "explanation": "Index assignment replaces the item at that position."
    }
  ],
  "tests": [
    {
      "name": "pets == [\"cat\", \"hamster\", \"fish\"]",
      "check": "pets == [\"cat\", \"hamster\", \"fish\"]",
      "msg": "pets should be [\"cat\", \"hamster\", \"fish\"]"
    }
  ]
}
---

# Changing Items

Replace any item by assigning to its index:

```python
pets = ["cat", "dog", "fish"]
pets[1] = "hamster"
print(pets)  # ["cat", "hamster", "fish"]
```
