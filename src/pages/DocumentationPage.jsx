import { useState } from 'react'

const DOCS = {
  'Variables & Types': [
    { name: 'Variables', desc: 'Store a value with a name. No type declaration needed.', ex: 'x = 10\nname = "Alice"\nis_valid = True' },
    { name: 'Numbers', desc: 'int for whole numbers, float for decimals.', ex: 'x = 5        # int\ny = 3.14     # float\nz = x + y    # 8.14' },
    { name: 'Strings', desc: 'Text wrapped in quotes. Index with [] to get a character.', ex: 'greeting = "Hello, World!"\ngreeting[0]      # "H"\nlen(greeting)    # 13' },
    { name: 'f-strings', desc: 'Embed variables directly inside a string using f"...{var}".', ex: 'name = "Alice"\nage = 30\nprint(f"Hi {name}, you are {age}")' },
    { name: 'Type conversion', desc: 'Convert between types with int(), str(), float(), etc.', ex: 'int("42")     # 42\nstr(100)      # "100"\nfloat("3.14") # 3.14' },
  ],
  'Operators': [
    { name: 'Arithmetic', desc: 'Basic math operators. // is floor division, % is remainder, ** is power.', ex: '5 + 2   # 7\n5 - 2   # 3\n5 * 2   # 10\n5 / 2   # 2.5\n5 // 2  # 2\n5 % 2   # 1\n5 ** 2  # 25' },
    { name: 'Comparison', desc: 'Compare two values. Result is True or False.', ex: '5 == 5   # True\n5 != 3   # True\n5 > 3    # True\n5 < 3    # False\n5 >= 5   # True' },
    { name: 'Logical', desc: 'Combine conditions with and, or, not.', ex: 'True and False  # False\nTrue or False   # True\nnot True        # False' },
  ],
  'Strings': [
    { name: 'Common methods', desc: 'Transform or split strings using built-in methods.', ex: '"hello".upper()          # "HELLO"\n"HELLO".lower()          # "hello"\n"  hi  ".strip()         # "hi"\n"a,b,c".split(",")       # ["a","b","c"]\n",".join(["a","b","c"])  # "a,b,c"' },
    { name: 'Search & replace', desc: 'Find or substitute parts of a string.', ex: '"hello".replace("l","r")  # "herro"\n"hello".find("e")         # 1\n"hello".count("l")        # 2' },
    { name: 'Check contents', desc: 'Test what a string starts with, ends with, or contains.', ex: '"hello".startswith("he")  # True\n"hello".endswith("lo")    # True\n"123".isdigit()           # True' },
    { name: 'Slicing', desc: 'Extract a portion of a string with [start:stop:step].', ex: 's = "hello"\ns[0]    # "h"\ns[1:3]  # "el"\ns[-1]   # "o"\ns[::-1] # "olleh"' },
  ],
  'Lists': [
    { name: 'Create & access', desc: 'Ordered collection of items. Access by index (starts at 0).', ex: 'nums = [1, 2, 3, 4]\nnums[0]   # 1\nnums[-1]  # 4\nnums[1:3] # [2, 3]' },
    { name: 'Modify', desc: 'Add, insert, or remove items from a list.', ex: 'nums.append(5)     # add to end\nnums.insert(0, 0)  # add at index\nnums.remove(3)     # remove first match\nnums.pop()         # remove & return last' },
    { name: 'Useful operations', desc: 'Common functions that work on lists.', ex: 'len([1,2,3])              # 3\nsorted([3,1,2])           # [1,2,3]\nsum([1,2,3])              # 6\n[x*2 for x in range(3)]  # [0,2,4]' },
  ],
  'Dictionaries': [
    { name: 'Create & access', desc: 'Store key-value pairs. Use .get() to avoid errors on missing keys.', ex: 'person = {"name": "Alice", "age": 30}\nperson["name"]       # "Alice"\nperson.get("age")    # 30\nperson.get("x", 0)  # 0 (default)' },
    { name: 'Modify', desc: 'Add or update a key by assigning to it. Delete with del.', ex: 'person["age"] = 31\nperson["city"] = "NYC"\ndel person["city"]' },
    { name: 'Iterate', desc: 'Loop over keys, or key-value pairs with .items().', ex: 'for key in person:\n    print(key)\n\nfor k, v in person.items():\n    print(k, v)' },
  ],
  'Control Flow': [
    { name: 'if / elif / else', desc: 'Run different code depending on a condition.', ex: 'x = 10\nif x > 0:\n    print("positive")\nelif x == 0:\n    print("zero")\nelse:\n    print("negative")' },
    { name: 'for loop', desc: 'Repeat code for each item in a sequence.', ex: 'for i in range(5):\n    print(i)  # 0 1 2 3 4\n\nfor item in ["a", "b", "c"]:\n    print(item)' },
    { name: 'while loop', desc: 'Repeat code as long as a condition is True.', ex: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1  # 3 2 1' },
    { name: 'break & continue', desc: 'break exits the loop early. continue skips to the next iteration.', ex: 'for i in range(5):\n    if i == 2: continue  # skip 2\n    if i == 4: break     # stop at 4\n    print(i)  # 0 1 3' },
  ],
  'Functions': [
    { name: 'Define & call', desc: 'Bundle reusable code into a function. Use return to send a value back.', ex: 'def greet(name):\n    return "Hello, " + name\n\ngreet("Alice")  # "Hello, Alice"' },
    { name: 'Default parameters', desc: 'Give a parameter a default value so it\'s optional when calling.', ex: 'def power(base, exp=2):\n    return base ** exp\n\npower(3)     # 9\npower(2, 10) # 1024' },
    { name: 'Lambda', desc: 'A short anonymous function written in one line.', ex: 'double = lambda x: x * 2\ndouble(5)  # 10\n\nsorted([3,1,2], key=lambda x: -x)\n# [3, 2, 1]' },
  ],
  'Error Handling': [
    { name: 'try / except', desc: 'Catch errors so your program doesn\'t crash unexpectedly.', ex: 'try:\n    x = int("abc")\nexcept ValueError:\n    print("not a number")' },
    { name: 'finally', desc: 'The finally block always runs, whether or not an error occurred.', ex: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print("Error:", e)\nfinally:\n    print("always runs")' },
  ],
  'Built-ins': [
    { name: 'Common functions', desc: 'Useful functions available everywhere without importing anything.', ex: 'print("hello")\nlen([1,2,3])     # 3\nrange(5)         # 0..4\ntype(42)         # <class \'int\'>\nabs(-5)          # 5\nround(3.14, 1)   # 3.1' },
    { name: 'min / max / sum', desc: 'Find the smallest, largest, or total of a collection.', ex: 'min(3, 1, 2)      # 1\nmax([5, 2, 8])    # 8\nsum([1, 2, 3])    # 6' },
    { name: 'enumerate & zip', desc: 'enumerate gives index + value. zip pairs up two lists.', ex: 'for i, v in enumerate(["a","b"]):\n    print(i, v)  # 0 a, 1 b\n\nfor a, b in zip([1,2], ["x","y"]):\n    print(a, b)  # 1 x, 2 y' },
  ],
}

const CATEGORIES = Object.keys(DOCS)

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function DocumentationPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  const items = DOCS[activeCategory] ?? []

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside className="doc-sidebar" style={{ width: 176, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--header-border)', overflowY: 'auto' }}>
        <div className="px-3 py-2.5 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--header-border)', flexShrink: 0 }}>
          Reference
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 8 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`doc-category-btn${activeCategory === cat ? ' doc-category-btn-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content — scrolls independently */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <div className="flex flex-col gap-4 p-6">
          <h1 className="font-semibold text-base">{activeCategory}</h1>
          {items.map(item => (
            <div key={item.name} className="doc-card">
              <div className="doc-card-header">
                <span className="doc-card-name">{item.name}</span>
                <span className="doc-card-desc">{item.desc}</span>
              </div>
              <pre
                className="doc-card-example"
                dangerouslySetInnerHTML={{ __html: escHtml(item.ex) }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
