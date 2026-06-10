import { useState, useEffect, useRef } from 'react'
import { Play, Copy, Check, ArrowUpRight } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { runCode } from '../runner.js'

const PENDING_KEY = 'playground-pending-load'

const DOCS = {
  'Variables': [
    {
      name: 'Variables',
      desc: 'Give a value a name so you can use it later.',
      detail: 'You can change what a variable holds at any time. Python figures out the type for you — no need to say "this is a number" or "this is text" up front.',
      ex: 'x = 10\nname = "Alice"\nis_valid = True\n\nprint(x)\nprint(name)\nprint(is_valid)',
    },
    {
      name: 'Numbers',
      desc: 'Use int for whole numbers and float for numbers with a decimal point.',
      detail: 'When you divide with /, you always get a decimal result (even if it divides evenly). Use // if you only want the whole number part.',
      ex: 'x = 5        # int\ny = 3.14     # float\nz = x + y\n\nprint(z)         # 8.14\nprint(type(x))   # <class \'int\'>\nprint(type(y))   # <class \'float\'>\nprint(10 / 2)    # 5.0  (always decimal)\nprint(10 // 2)   # 5   (whole number only)',
    },
    {
      name: 'Strings',
      desc: 'Text goes inside quotes. You can grab any single character by its position.',
      detail: 'Positions start at 0, so the first character is always [0]. You can also count from the end using negative numbers — -1 is the last character.',
      ex: 'greeting = "Hello, World!"\n\nprint(greeting[0])      # H\nprint(greeting[-1])     # !\nprint(greeting[7:12])   # World\nprint(len(greeting))    # 13',
    },
    {
      name: 'f-strings',
      desc: 'Drop a variable or calculation straight into a string by adding f before the quotes.',
      detail: 'Wrap whatever you want to insert in curly braces {}. You can put any calculation inside, not just variable names.',
      ex: 'name = "Alice"\nage = 30\n\nprint(f"Hi {name}, you are {age}")\nprint(f"Next year you\'ll be {age + 1}")\nprint(f"Name has {len(name)} letters")',
    },
    {
      name: 'Type conversion',
      desc: 'Change a value from one type to another — for example, turning the text "42" into the number 42.',
      detail: 'Python won\'t do this automatically, so you have to ask for it. If you try to convert something that doesn\'t make sense, like int("hello"), you\'ll get an error.',
      ex: 'print(int("42"))       # 42\nprint(str(100))        # "100"\nprint(float("3.14"))   # 3.14\nprint(bool(0))         # False\nprint(bool("hello"))   # True\nprint(bool([]))        # False  (empty list)',
    },
  ],
  'Operators': [
    {
      name: 'Arithmetic',
      desc: 'Do math with +, -, *, /. Use // for whole-number division, % for the remainder, and ** to raise to a power.',
      detail: '% gives you what\'s left over after dividing. For example, 7 % 3 is 1 (3 goes into 7 twice, with 1 left). It\'s handy for checking if a number is even: n % 2 == 0.',
      ex: 'print(5 + 2)    # 7\nprint(5 - 2)    # 3\nprint(5 * 2)    # 10\nprint(5 / 2)    # 2.5\nprint(5 // 2)   # 2  (whole number only)\nprint(5 % 2)    # 1  (remainder)\nprint(5 ** 2)   # 25 (power)\nprint(9 ** 0.5) # 3.0 (square root)',
    },
    {
      name: 'Comparison',
      desc: 'Compare two values. The answer is always True or False.',
      detail: 'Use == to check if two things are equal — not = which sets a variable. You\'ll use these most inside if statements and while loops.',
      ex: 'print(5 == 5)    # True\nprint(5 != 3)    # True\nprint(5 > 3)     # True\nprint(5 < 3)     # False\nprint(5 >= 5)    # True\n\nx = 7\nprint(1 < x < 10)   # True  (chained comparison)',
    },
    {
      name: 'Logical',
      desc: 'Join conditions together: and means both must be true, or means at least one must be true, not flips the answer.',
      detail: 'Read them like plain English: "x > 0 and x < 10" means x has to satisfy both conditions at once.',
      ex: 'print(True and False)   # False\nprint(True or False)    # True\nprint(not True)         # False\n\nx = 5\nprint(x > 0 and x < 10)   # True\nprint(x < 0 or x > 3)     # True',
    },
    {
      name: 'Augmented assignment',
      desc: 'A shorter way to update a variable. x += 1 does the same thing as x = x + 1.',
      detail: 'Works with all the math operators: +=, -=, *=, /=. Also works on strings and lists — name += " Jr." adds to the end of a string.',
      ex: 'x = 10\nx += 5\nprint(x)   # 15\n\nx -= 3\nprint(x)   # 12\n\nx *= 2\nprint(x)   # 24\n\ngreeting = "Hello"\ngreeting += ", World!"\nprint(greeting)',
    },
  ],
  'Strings': [
    {
      name: 'Common methods',
      desc: 'Strings come with built-in tools to change their case, trim spaces, or split into a list.',
      detail: 'These tools don\'t change the original string — they give you a new one. So "hello".upper() gives "HELLO" but "hello" stays the same.',
      ex: 'print("hello".upper())           # HELLO\nprint("HELLO".lower())           # hello\nprint("  hi  ".strip())          # hi  (no spaces)\nprint("a,b,c".split(","))        # [\'a\', \'b\', \'c\']\nprint(",".join(["a", "b", "c"])) # a,b,c',
    },
    {
      name: 'Search & replace',
      desc: 'Find where a word appears, count how many times it shows up, or swap it for something else.',
      detail: '.find() returns the position of the first match, or -1 if it\'s not found. .replace() swaps every match by default.',
      ex: 's = "hello world"\n\nprint(s.replace("l", "r"))   # herro worrd\nprint(s.find("world"))       # 6\nprint(s.find("xyz"))         # -1  (not found)\nprint(s.count("l"))          # 3',
    },
    {
      name: 'Check contents',
      desc: 'Ask yes/no questions about a string — does it start with this? Is it all digits?',
      detail: 'These all return True or False. They\'re great for checking input before you do anything with it.',
      ex: 'print("hello".startswith("he"))   # True\nprint("hello".endswith("lo"))     # True\nprint("123".isdigit())            # True\nprint("abc".isalpha())            # True\nprint("abc123".isalnum())         # True',
    },
    {
      name: 'Slicing',
      desc: 'Cut out part of a string using [start:stop]. The character at stop is not included.',
      detail: 'You can leave out start (defaults to the beginning) or stop (defaults to the end). Using [::-1] gives you the string backwards.',
      ex: 's = "hello"\n\nprint(s[1:3])    # el   (positions 1 and 2)\nprint(s[:3])     # hel  (from the start)\nprint(s[2:])     # llo  (to the end)\nprint(s[-2:])    # lo   (last 2 characters)\nprint(s[::-1])   # olleh (reversed)',
    },
  ],
  'Lists': [
    {
      name: 'Create & access',
      desc: 'A list holds multiple values in order. Get any item by its position, starting at 0.',
      detail: 'Lists can hold anything — numbers, strings, or even other lists. Positions also count from the end: -1 is the last item, -2 is the second to last.',
      ex: 'nums = [10, 20, 30, 40]\n\nprint(nums[0])     # 10\nprint(nums[-1])    # 40\nprint(nums[1:3])   # [20, 30]\nprint(len(nums))   # 4',
    },
    {
      name: 'Modify',
      desc: 'Add items to a list with .append() and remove them with .remove() or .pop().',
      detail: '.append() adds to the end. .remove() deletes the first matching value. .pop() removes the last item and gives it back to you.',
      ex: 'nums = [1, 2, 3]\n\nnums.append(4)\nprint(nums)         # [1, 2, 3, 4]\n\nnums.insert(0, 0)\nprint(nums)         # [0, 1, 2, 3, 4]\n\nnums.remove(2)\nprint(nums)         # [0, 1, 3, 4]\n\nlast = nums.pop()\nprint(last, nums)   # 4 [0, 1, 3]',
    },
    {
      name: 'Sorting',
      desc: 'Sort a list with .sort() (changes the list) or sorted() (gives you a new sorted copy).',
      detail: '.sort() changes your list permanently and gives back nothing. sorted() leaves the original alone. Both work on numbers and text.',
      ex: 'nums = [3, 1, 4, 1, 5, 9]\n\nprint(sorted(nums))    # [1, 1, 3, 4, 5, 9]  (new list)\nprint(nums)            # [3, 1, 4, 1, 5, 9]  (unchanged)\n\nnums.sort()\nprint(nums)            # [1, 1, 3, 4, 5, 9]  (changed)\n\nwords = ["banana", "apple", "cherry"]\nprint(sorted(words, key=len))  # sort by word length',
    },
    {
      name: 'List comprehensions',
      desc: 'A short way to build a new list by doing something to every item in an existing one.',
      detail: 'Read it like: "give me [this] for each [item] in [list]". Add if at the end to only include some items.',
      ex: '# square every even number from 0 to 9\nresult = [x**2 for x in range(10) if x % 2 == 0]\nprint(result)   # [0, 4, 16, 36, 64]\n\n# uppercase every word\nwords = ["hello", "world"]\nprint([w.upper() for w in words])',
    },
  ],
  'Dictionaries': [
    {
      name: 'Create & access',
      desc: 'A dictionary stores pairs of information — a key and a value. Think of it like a word and its definition.',
      detail: 'Looking up a key that doesn\'t exist with [] gives you an error. Use .get() instead to safely get None (or a backup value you choose) without crashing.',
      ex: 'person = {"name": "Alice", "age": 30}\n\nprint(person["name"])          # Alice\nprint(person.get("age"))       # 30\nprint(person.get("city"))      # None\nprint(person.get("city", "?")) # ?  (your backup)',
    },
    {
      name: 'Modify',
      desc: 'Add a new key or change an existing one by assigning to it. Delete a key with del or .pop().',
      detail: 'If the key already exists, assigning to it just updates the value. .pop() removes the key and also gives you its value back.',
      ex: 'person = {"name": "Alice", "age": 30}\n\nperson["age"] = 31\nperson["city"] = "NYC"\nprint(person)\n\nremoved = person.pop("city")\nprint(removed)    # NYC\nprint(person)',
    },
    {
      name: 'Iterate',
      desc: 'Loop through a dictionary to look at its keys, its values, or both at the same time.',
      detail: 'Looping normally gives you just the keys. Use .values() for just the values. Use .items() to get key-value pairs together, which you can split into two variables.',
      ex: 'scores = {"Alice": 92, "Bob": 87, "Carol": 95}\n\nfor name in scores:\n    print(name)\n\nprint("---")\n\nfor name, score in scores.items():\n    print(f"{name}: {score}")',
    },
    {
      name: 'Dict comprehensions',
      desc: 'Build a dictionary in one line, the same way you\'d build a list with a list comprehension.',
      detail: 'The pattern is {key: value for item in something}. Add if at the end to only include some pairs.',
      ex: '# square each number\nsquares = {n: n**2 for n in range(1, 6)}\nprint(squares)\n\n# keep only high scores\nscores = {"Alice": 92, "Bob": 65, "Carol": 88}\nhigh = {k: v for k, v in scores.items() if v >= 80}\nprint(high)',
    },
  ],
  'Control Flow': [
    {
      name: 'if / elif / else',
      desc: 'Make a decision. Run one block of code if a condition is true, a different one if it\'s false.',
      detail: 'Python uses indentation (the spaces at the start of a line) to group code into blocks — there are no curly braces. elif means "otherwise if".',
      ex: 'x = 42\n\nif x < 0:\n    print("negative")\nelif x == 0:\n    print("zero")\nelif x < 100:\n    print("small positive")\nelse:\n    print("large positive")',
    },
    {
      name: 'for loop',
      desc: 'Do something once for each item in a list, string, or range of numbers.',
      detail: 'range(5) gives you 0, 1, 2, 3, 4. Use enumerate() if you also need to know the position of each item while you loop.',
      ex: 'for i in range(5):\n    print(i)\n\nprint("---")\n\nfruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")',
    },
    {
      name: 'while loop',
      desc: 'Keep repeating something as long as a condition is still true.',
      detail: 'Make sure the condition eventually becomes false, or the loop will run forever. Good for when you don\'t know in advance how many times you need to repeat.',
      ex: 'n = 5\nfactorial = 1\n\nwhile n > 0:\n    factorial *= n\n    n -= 1\n\nprint(factorial)   # 120  (5 × 4 × 3 × 2 × 1)',
    },
    {
      name: 'break & continue',
      desc: 'break stops the loop immediately. continue skips the current step and jumps to the next one.',
      detail: 'Use break when you\'ve found what you were looking for and don\'t need to keep going. Use continue to skip over items you don\'t care about.',
      ex: '# break: stop as soon as we find 5\nfor i in range(10):\n    if i == 5:\n        print(f"found at {i}")\n        break\n\n# continue: skip odd numbers\nfor i in range(8):\n    if i % 2 != 0:\n        continue\n    print(i)',
    },
  ],
  'Functions': [
    {
      name: 'Define & call',
      desc: 'Write a function once, then use it as many times as you want. Use return to send a result back.',
      detail: 'Variables you create inside a function stay inside — they don\'t affect the rest of your program. If you don\'t write return, the function gives back None.',
      ex: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob"))\n\ndef add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)',
    },
    {
      name: 'Default parameters',
      desc: 'Give a parameter a backup value so callers don\'t have to provide it every time.',
      detail: 'If someone passes a value, it uses that. If not, it falls back to the default. Parameters with defaults must come after the ones without.',
      ex: 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))       # 9   (exp defaults to 2)\nprint(power(2, 10))   # 1024\n\ndef greet(name, greeting="Hello"):\n    print(f"{greeting}, {name}!")\n\ngreet("Alice")\ngreet("Bob", "Hi")',
    },
    {
      name: '*args and **kwargs',
      desc: '*args lets a function take any number of values. **kwargs lets it take any number of named values.',
      detail: 'The * and ** are what make this work — the names args and kwargs are just a common convention. Use *args when you want a list of things, **kwargs when you want named options.',
      ex: 'def total(*nums):\n    return sum(nums)\n\nprint(total(1, 2, 3))        # 6\nprint(total(10, 20, 30, 40)) # 100\n\ndef show(**info):\n    for k, v in info.items():\n        print(f"{k}: {v}")\n\nshow(name="Alice", age=30)',
    },
    {
      name: 'Lambda',
      desc: 'A quick, one-line function without a name. Useful when you need a simple function just once.',
      detail: 'Lambdas can only do one thing — one expression, no multiple lines. If you need more than that, use a regular def function.',
      ex: 'double = lambda x: x * 2\nprint(double(5))   # 10\n\n# sort words by their length\nwords = ["banana", "apple", "cherry", "fig"]\nprint(sorted(words, key=lambda w: len(w)))',
    },
  ],
  'Error Handling': [
    {
      name: 'try / except',
      desc: 'Put risky code inside try. If something goes wrong, the except block runs instead of crashing.',
      detail: 'Name the specific type of error you want to catch, like ValueError or IndexError. Catching all errors at once is usually a bad idea — it can hide bugs.',
      ex: 'try:\n    x = int("abc")\nexcept ValueError as e:\n    print(f"That didn\'t work: {e}")\n\n# catch different error types\ntry:\n    items = [1, 2, 3]\n    print(items[10])\nexcept IndexError:\n    print("that position doesn\'t exist")',
    },
    {
      name: 'finally & else',
      desc: 'else runs only if nothing went wrong. finally always runs, no matter what.',
      detail: 'Use finally for cleanup you always want to happen, like closing a file. Use else to make it clear which code is the "everything went fine" path.',
      ex: 'try:\n    result = 10 / 2\nexcept ZeroDivisionError:\n    print("can\'t divide by zero")\nelse:\n    print(f"result: {result}")   # only if no error\nfinally:\n    print("this always runs")',
    },
    {
      name: 'Raising exceptions',
      desc: 'Throw your own error with raise when your code receives something it can\'t handle.',
      detail: 'Pick an error type that fits the problem — ValueError for a bad value, TypeError for the wrong type. Always include a message that explains what went wrong.',
      ex: 'def divide(a, b):\n    if b == 0:\n        raise ValueError("can\'t divide by zero")\n    return a / b\n\ntry:\n    print(divide(10, 2))   # 5.0\n    print(divide(10, 0))   # raises an error\nexcept ValueError as e:\n    print(f"Error: {e}")',
    },
  ],
  'Built-ins': [
    {
      name: 'print',
      desc: 'Show values on screen. You can pass multiple things at once — it puts a space between them.',
      detail: 'Use sep= to change what goes between items. Use end= to change what\'s printed at the very end (normally a new line).',
      ex: 'print("hello", "world")           # hello world\nprint("a", "b", "c", sep="-")     # a-b-c\nprint("no newline", end="")\nprint(" same line")\n\nprint(type(42), type("hi"))',
    },
    {
      name: 'len, range, type',
      desc: 'len() counts how many items something has. range() gives a sequence of numbers. type() tells you what kind of value something is.',
      detail: 'range() doesn\'t build a full list — it generates numbers one at a time as needed. Wrap it in list() if you want to see all the numbers at once.',
      ex: 'print(len("hello"))          # 5\nprint(len([1, 2, 3, 4]))     # 4\nprint(len({"a": 1, "b": 2})) # 2\n\nprint(list(range(5)))         # [0, 1, 2, 3, 4]\nprint(list(range(2, 8, 2)))   # [2, 4, 6]\n\nprint(type(42))       # <class \'int\'>\nprint(type("hello"))  # <class \'str\'>',
    },
    {
      name: 'min / max / sum / abs',
      desc: 'Find the smallest or largest value, add up a list of numbers, or get the positive version of a number.',
      detail: 'min() and max() work on a list or on several values passed directly. sum() only works with numbers.',
      ex: 'print(min(3, 1, 4, 1, 5))    # 1\nprint(max([5, 2, 8, 1]))      # 8\nprint(sum([1, 2, 3, 4, 5]))   # 15\nprint(abs(-42))               # 42\nprint(round(3.14159, 2))      # 3.14\n\nwords = ["fig", "banana", "apple"]\nprint(min(words, key=len))    # fig  (shortest word)',
    },
    {
      name: 'enumerate & zip',
      desc: 'enumerate gives you the position and value as you loop. zip lets you loop through two lists side by side.',
      detail: 'enumerate is great when you need to know "I\'m on item number X". zip pairs up items from two lists — it stops when the shorter list runs out.',
      ex: 'fruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")\n\nprint("---")\n\nnames = ["Alice", "Bob"]\nscores = [92, 87]\nfor name, score in zip(names, scores):\n    print(f"{name} scored {score}")',
    },
    {
      name: 'map & filter',
      desc: 'map() does something to every item in a list. filter() keeps only the items that match a condition.',
      detail: 'These do the same thing as list comprehensions — it\'s a matter of style. List comprehensions are usually easier to read when you\'re starting out.',
      ex: 'nums = [1, 2, 3, 4, 5]\n\n# map: square every number\nsquares = list(map(lambda x: x**2, nums))\nprint(squares)\n\n# filter: keep only even numbers\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)\n\n# same thing with comprehensions:\nprint([x**2 for x in nums])\nprint([x for x in nums if x % 2 == 0])',
    },
  ],
}

const CATEGORIES = Object.keys(DOCS)

function DocCard({ item, pyodideReady, monacoTheme }) {
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [colorizedCode, setColorizedCode] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    monaco.editor.colorize(item.ex, 'python', { tabSize: 4 })
      .then(html => setColorizedCode(html))
  }, [item.ex, monacoTheme])

  async function handleRun() {
    if (isRunning || !pyodideReady) return
    setIsRunning(true)
    setOutput(null)
    try {
      const result = await runCode(item.ex)
      setOutput(result)
    } finally {
      setIsRunning(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(item.ex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleLoadInEditor() {
    try { localStorage.setItem(PENDING_KEY, item.ex) } catch {}
    window.open('/playground', '_blank')
  }

  const hasOutput = output && (output.stdout || output.stderr || output.error)

  const OUTPUT_PRE = 'font-mono text-[0.76rem] leading-[1.55] whitespace-pre-wrap m-0'

  return (
    <div className="border border-app-output-border rounded-lg overflow-hidden min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Left: explanation */}
        <div className="p-[0.85rem_1rem] bg-app-surface flex flex-col gap-[0.4rem] border-b border-app-output-border sm:w-[38%] sm:shrink-0 sm:border-b-0 sm:border-r sm:border-r-app-output-border">
          <div className="text-[0.82rem] font-bold text-app-fg mb-[0.05rem]">{item.name}</div>
          <p className="text-[0.8rem] text-app-fg leading-[1.5] m-0">{item.desc}</p>
          <p className="text-[0.76rem] text-app-muted leading-[1.55] m-0">{item.detail}</p>
        </div>

        {/* Right: code + run button + output */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ background: 'var(--monaco-bg)' }}>
          <div
            className="flex items-center justify-end gap-[0.375rem] px-2 py-[0.3rem] border-b border-app-output-border shrink-0"
            style={{ background: 'color-mix(in srgb, var(--header-bg) 60%, var(--monaco-bg))' }}
          >
            <button
              className="doc-run-btn"
              onClick={handleRun}
              disabled={!pyodideReady || isRunning}
              title={isRunning ? 'Running…' : pyodideReady ? 'Run (click)' : 'Connecting to Python…'}
            >
              <Play size={11} fill="currentColor" stroke="none" />
              <span>{isRunning ? 'Running…' : 'Run'}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">
            <div className="relative flex-1 min-w-0 overflow-hidden">
              <div className="modal-code-actions">
                <button
                  className={`modal-code-btn${copied ? ' modal-code-btn-copied' : ''}`}
                  onClick={handleCopy}
                  title="Copy code"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button
                  className="modal-code-btn modal-code-btn-load"
                  onClick={handleLoadInEditor}
                  title="Load into Editor"
                >
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <pre
                className="p-[0.7rem_0.9rem] bg-transparent font-mono text-[0.78rem] leading-[1.65] text-app-stdout whitespace-pre overflow-x-auto m-0 flex-1 min-w-0"
                dangerouslySetInnerHTML={{ __html: colorizedCode ?? item.ex }}
              />
            </div>
            <div className="w-full shrink-0 border-t border-app-output-border px-[0.9rem] py-[0.5rem] bg-app-surface overflow-y-auto min-h-[2.5rem] sm:w-[40%] sm:border-t-0 sm:border-l sm:border-l-app-output-border">
              {hasOutput ? (
                <>
                  {output.error && <pre className={`text-app-error ${OUTPUT_PRE}`}>{output.error}</pre>}
                  {output.stderr && <pre className={`text-app-stderr ${OUTPUT_PRE}`}>{output.stderr}</pre>}
                  {output.stdout && <pre className={`text-app-stdout ${OUTPUT_PRE}`}>{output.stdout}</pre>}
                </>
              ) : (
                <span className="text-[0.72rem] text-app-muted">Run to see output</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentationPage({ pyodideReady, monacoTheme }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [visibleCategory, setVisibleCategory] = useState(CATEGORIES[0])
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [visibleCategory])

  function handleCategoryChange(cat) {
    if (cat === activeCategory) return
    clearTimeout(exitTimer.current)
    setActiveCategory(cat)
    setExiting(true)
    exitTimer.current = setTimeout(() => {
      setVisibleCategory(cat)
      setExiting(false)
    }, 160)
  }

  const items = DOCS[visibleCategory] ?? []

  const CAT_BTN = 'shrink-0 px-[0.65rem] py-[0.25rem] rounded-full border text-[0.75rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap'
  const SIDEBAR_BTN = 'block w-full text-left px-[0.6rem] py-[0.3rem] rounded-md border-0 bg-transparent text-[0.8rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap'

  return (
    <div className="page-enter flex flex-col flex-1 min-h-0 overflow-hidden">

      {/* Mobile category nav (hidden on md+) */}
      <div className="flex flex-col border-b border-app-border bg-app-surface shrink-0 md:hidden">
        <div className="flex overflow-x-auto gap-[0.35rem] px-3 py-[0.45rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`${CAT_BTN} ${activeCategory === cat
                ? 'text-app-fg bg-app-btn border-app-muted'
                : 'text-app-muted border-app-output-border bg-transparent hover:text-app-fg hover:bg-app-btn'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (hidden on mobile) */}
        <aside className="bg-app-surface hidden md:flex flex-col w-44 shrink-0 border-r border-app-border overflow-y-auto">
          <div className="px-3 py-2.5 text-xs font-semibold tracking-wide uppercase text-app-muted border-b border-app-border shrink-0">
            Reference
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`${SIDEBAR_BTN} ${activeCategory === cat
                  ? 'text-app-fg bg-app-btn'
                  : 'text-app-muted hover:text-app-fg hover:bg-app-btn'}`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto min-w-0 dot-bg" ref={mainRef}>
          <div
            key={visibleCategory}
            className={`flex flex-col gap-4 p-4 sm:p-6 ${exiting ? 'doc-content-exit' : 'doc-content-enter'}`}
          >
            <h1 className="font-semibold text-base">{visibleCategory}</h1>
            {items.map(item => (
              <DocCard key={item.name} item={item} pyodideReady={pyodideReady} monacoTheme={monacoTheme} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
