// ═══════════════════════════════════════════════════════════════
// data.js — All content lives here. Edit lessons, references,
// and challenges without touching the UI or styling.
// ═══════════════════════════════════════════════════════════════

const LESSONS = [
  {
    group: "Foundations",
    items: [
      {
        id: "intro",
        title: "What Is Regex?",
        desc: "A regex is a pattern that describes text you want to find. Instead of searching for exact words, you describe the shape of what you're looking for — like saying \"find anything that looks like a phone number\" instead of searching for one specific number.",
        pattern: "hello",
        text: "hello world, say hello again",
        python: "import re\n\ntext = \"hello world, say hello again\"\nmatches = re.findall(r\"hello\", text)\nprint(matches)  # ['hello', 'hello']"
      },
      {
        id: "literal",
        title: "Literal Matching",
        desc: "The simplest pattern is just the text itself. Searching for 'the' finds every exact occurrence of those three letters. This is case-sensitive: 'the' won't match 'The'.",
        pattern: "the",
        text: "the quick brown fox jumps over the lazy dog",
        python: "import re\n\ntext = \"the quick brown fox jumps over the lazy dog\"\nmatches = re.findall(r\"the\", text)\nprint(matches)  # ['the', 'the']"
      },
      {
        id: "dot",
        title: "Wildcard: the Dot",
        desc: "A dot (.) matches any single character. Think of it as a blank tile in Scrabble — it can be anything. So c.t matches 'cat', 'cut', 'c@t', but not 'coat' (two characters in the middle).",
        pattern: "c.t",
        text: "cat cut cot c@t coat",
        python: "import re\n\ntext = \"cat cut cot c@t coat\"\nmatches = re.findall(r\"c.t\", text)\nprint(matches)  # ['cat', 'cut', 'cot', 'c@t']"
      }
    ]
  },
  {
    group: "Quantifiers",
    items: [
      {
        id: "plus",
        title: "One or More: +",
        desc: "The + means \"one or more of the previous thing.\" So a+ finds groups of a's: 'a', 'aa', 'aaa'. It must find at least one.",
        pattern: "a+",
        text: "a aa aaa b ba baa",
        python: "import re\n\ntext = \"a aa aaa b ba baa\"\nmatches = re.findall(r\"a+\", text)\nprint(matches)  # ['a', 'aa', 'aaa', 'a', 'aa']"
      },
      {
        id: "star",
        title: "Zero or More: *",
        desc: "The * means \"zero or more.\" Unlike +, it also matches if the character isn't there at all. lo*g matches 'lg', 'log', 'loog', etc.",
        pattern: "lo*g",
        text: "lg log loog looog",
        python: "import re\n\ntext = \"lg log loog looog\"\nmatches = re.findall(r\"lo*g\", text)\nprint(matches)  # ['lg', 'log', 'loog', 'looog']"
      },
      {
        id: "question",
        title: "Optional: ?",
        desc: "The ? makes the previous character optional (0 or 1 times). colou?r matches both 'color' (American) and 'colour' (British).",
        pattern: "colou?r",
        text: "color colour colouur",
        python: "import re\n\ntext = \"color colour colouur\"\nmatches = re.findall(r\"colou?r\", text)\nprint(matches)  # ['color', 'colour']"
      },
      {
        id: "range",
        title: "Exact Counts: {n,m}",
        desc: "Curly braces let you be precise. {3} = exactly 3, {2,4} = between 2 and 4, {3,} = 3 or more. Useful for fixed-length data like zip codes.",
        pattern: "\\d{3,5}",
        text: "12 123 1234 12345 123456",
        python: "import re\n\ntext = \"12 123 1234 12345 123456\"\nmatches = re.findall(r\"\\d{3,5}\", text)\nprint(matches)  # ['123', '1234', '12345', '12345']"
      }
    ]
  },
  {
    group: "Character Classes",
    items: [
      {
        id: "digits",
        title: "Digits: \\d",
        desc: "\\d matches any single digit (0–9). Pair it with + to match whole numbers: \\d+ finds '3', '42', '1000'. Essential for extracting amounts from financial text.",
        pattern: "\\d+",
        text: "Invoice #4521: 3 items at $15 each = $45 total",
        python: "import re\n\ntext = \"Invoice #4521: 3 items at $15 each = $45 total\"\nmatches = re.findall(r\"\\d+\", text)\nprint(matches)  # ['4521', '3', '15', '45']"
      },
      {
        id: "words",
        title: "Word Characters: \\w",
        desc: "\\w matches letters, digits, and underscores. \\w+ grabs whole words and numbers. In NLP, this is the basis for simple tokenization.",
        pattern: "\\w+",
        text: "hello_world test-case item@2 ready!",
        python: "import re\n\ntext = \"hello_world test-case item@2 ready!\"\nmatches = re.findall(r\"\\w+\", text)\nprint(matches)\n# ['hello_world', 'test', 'case', 'item', '2', 'ready']"
      },
      {
        id: "spaces",
        title: "Whitespace: \\s",
        desc: "\\s matches spaces, tabs, and newlines. \\s+ finds gaps between words. Useful for cleaning messy text with irregular spacing.",
        pattern: "\\s+",
        text: "too    many     spaces   here",
        python: "import re\n\ntext = \"too    many     spaces   here\"\n# Split on whitespace — a common NLP preprocessing step\ntokens = re.split(r\"\\s+\", text)\nprint(tokens)  # ['too', 'many', 'spaces', 'here']"
      },
      {
        id: "sets",
        title: "Custom Sets: [abc]",
        desc: "[aeiou] matches any single vowel. [a-z] matches any lowercase letter. [0-9] is the same as \\d. You can combine ranges: [a-zA-Z] matches any letter.",
        pattern: "[aeiou]",
        text: "hello world",
        python: "import re\n\ntext = \"hello world\"\nvowels = re.findall(r\"[aeiou]\", text)\nprint(vowels)  # ['e', 'o', 'o']"
      },
      {
        id: "negation",
        title: "Negated Sets: [^abc]",
        desc: "Adding ^ inside brackets means NOT. [^0-9] matches anything that isn't a digit. [^aeiou] matches consonants and other characters.",
        pattern: "[^aeiou\\s]",
        text: "hello world regex",
        python: "import re\n\ntext = \"hello world regex\"\nconsonants = re.findall(r\"[^aeiou\\s]\", text)\nprint(consonants)  # ['h', 'l', 'l', 'w', 'r', 'l', 'd', 'r', 'g', 'x']"
      }
    ]
  },
  {
    group: "Structure & Grouping",
    items: [
      {
        id: "groups",
        title: "Groups: ()",
        desc: "Parentheses group parts of a pattern together. (ha)+ matches 'ha', 'haha', 'hahaha' — the whole group repeats, not just the last character.",
        pattern: "(ha)+",
        text: "ha haha hahaha",
        python: "import re\n\ntext = \"ha haha hahaha\"\n# findall with groups returns the group content\nmatches = re.findall(r\"(ha)+\", text)\nprint(matches)  # ['ha', 'ha', 'ha']\n\n# Use finditer to see full matches\nfor m in re.finditer(r\"(ha)+\", text):\n    print(m.group())  # 'ha', 'haha', 'hahaha'"
      },
      {
        id: "or",
        title: "Alternation: |",
        desc: "The pipe | means OR. cat|dog matches either word. You can chain multiple options: cat|dog|bird.",
        pattern: "cat|dog|bird",
        text: "I have a cat, a dog, and a bird",
        python: "import re\n\ntext = \"I have a cat, a dog, and a bird\"\nanimals = re.findall(r\"cat|dog|bird\", text)\nprint(animals)  # ['cat', 'dog', 'bird']"
      },
      {
        id: "anchors",
        title: "Anchors: ^ and $",
        desc: "^ matches the start of the text (or line with multiline flag). $ matches the end. ^Hello ensures 'Hello' is at the very beginning.",
        pattern: "^Hello",
        text: "Hello world\nHello there\nSay Hello",
        python: "import re\n\ntext = \"Hello world\\nHello there\\nSay Hello\"\n\n# Without MULTILINE — only matches start of string\nprint(re.findall(r\"^Hello\", text))  # ['Hello']\n\n# With MULTILINE — matches start of each line\nprint(re.findall(r\"^Hello\", text, re.MULTILINE))\n# ['Hello', 'Hello']"
      },
      {
        id: "escape",
        title: "Escaping: \\",
        desc: "Characters like . * + ? have special meaning. To match a literal dot, use \\. — the backslash tells regex to treat the next character literally.",
        pattern: "\\$\\d+\\.\\d{2}",
        text: "Price: $9.99 and $100.00 total",
        python: "import re\n\ntext = \"Price: $9.99 and $100.00 total\"\nprices = re.findall(r\"\\$\\d+\\.\\d{2}\", text)\nprint(prices)  # ['$9.99', '$100.00']"
      }
    ]
  }
];


// ───────────────────────────────────────────────
// Reference cards by category
// ───────────────────────────────────────────────

const REFERENCE = [
  {
    cat: "Metacharacters",
    items: [
      { sym: ".",   meaning: "Any character (except newline)", pattern: "c.t",     text: "cat cut cot" },
      { sym: "^",   meaning: "Start of string/line",          pattern: "^Hello",   text: "Hello world" },
      { sym: "$",   meaning: "End of string/line",            pattern: "world$",   text: "Hello world" },
      { sym: "|",   meaning: "OR — match either side",        pattern: "cat|dog",  text: "cat and dog" },
      { sym: "\\",  meaning: "Escape special character",      pattern: "\\.",       text: "3.14 and 2.71" }
    ]
  },
  {
    cat: "Quantifiers",
    items: [
      { sym: "*",     meaning: "Zero or more",            pattern: "lo*g",       text: "lg log loog" },
      { sym: "+",     meaning: "One or more",             pattern: "a+",         text: "a aa aaa" },
      { sym: "?",     meaning: "Zero or one (optional)",  pattern: "colou?r",    text: "color colour" },
      { sym: "{n}",   meaning: "Exactly n times",         pattern: "\\d{3}",     text: "12 123 1234" },
      { sym: "{n,m}", meaning: "Between n and m times",   pattern: "\\d{2,4}",   text: "1 12 123 1234 12345" },
      { sym: "{n,}",  meaning: "n or more times",         pattern: "a{2,}",      text: "a aa aaa aaaa" }
    ]
  },
  {
    cat: "Character Classes",
    items: [
      { sym: "\\d", meaning: "Any digit (0–9)",                  pattern: "\\d+",  text: "abc 123 def 456" },
      { sym: "\\D", meaning: "Any non-digit",                    pattern: "\\D+",  text: "abc 123 def" },
      { sym: "\\w", meaning: "Word character (letter, digit, _)", pattern: "\\w+",  text: "hello_123!" },
      { sym: "\\W", meaning: "Non-word character",               pattern: "\\W+",  text: "hello world!" },
      { sym: "\\s", meaning: "Whitespace (space, tab, newline)", pattern: "\\s+",  text: "a  b\tc" },
      { sym: "\\S", meaning: "Non-whitespace",                   pattern: "\\S+",  text: "a  b  c" },
      { sym: "\\t", meaning: "Tab character explicitly",         pattern: "\\t",   text: "col1\tcol2\tcol3" },
      { sym: "\\n", meaning: "Newline character explicitly",     pattern: "\\n",   text: "line1\nline2\nline3" },
      { sym: "\\b", meaning: "Word boundary (between word and non-word)", pattern: "\\bcat\\b", text: "cat catalog catfish the cat sat" }
    ]
  },
  {
    cat: "Sets & Ranges",
    items: [
      { sym: "[abc]",   meaning: "Any one character in the set",  pattern: "[aeiou]",  text: "hello world" },
      { sym: "[a-z]",   meaning: "Range: any lowercase letter",   pattern: "[a-z]+",   text: "Hello World" },
      { sym: "[A-Z]",   meaning: "Any uppercase letter",          pattern: "[A-Z]",    text: "Hello World" },
      { sym: "[0-9]",   meaning: "Any digit (same as \\d)",       pattern: "[0-9]+",   text: "abc123" },
      { sym: "[^abc]",  meaning: "Any character NOT in the set",  pattern: "[^aeiou]", text: "hello" }
    ]
  },
  {
    cat: "Anchors & Groups",
    items: [
      { sym: "(…)",    meaning: "Capture group — treat as unit",          pattern: "(\\w+)@(\\w+)", text: "user@site" },
      { sym: "(?:…)",  meaning: "Non-capturing group",                    pattern: "(?:ab)+",       text: "ab abab ababab" },
      { sym: "(?=…)",  meaning: "Lookahead (followed by)",                pattern: "\\w+(?=ing)",   text: "running jumping" },
      { sym: "(?!…)",  meaning: "Negative lookahead — NOT followed by",   pattern: "\\d+(?!\\$)",   text: "100$ 200 300$" }
    ]
  }
];


// ───────────────────────────────────────────────
// Challenge exercises (starter → intermediate → applied)
// ───────────────────────────────────────────────

const CHALLENGES = [
  // ── Starter ──
  {
    id: "c1", diff: "starter",
    title: "Find All Numbers",
    desc: "Write a pattern that matches every number in this text.",
    text: "Order #4521: 3 widgets at $15 each, shipped to 90210",
    expected: ["4521", "3", "15", "90210"],
    hints: [
      "Numbers are made of digits. What shortcut matches a digit?",
      "\\d matches one digit. How do you match one or more?"
    ],
    solution: "\\d+"
  },
  {
    id: "c2", diff: "starter",
    title: "Extract Words Only",
    desc: "Match every word (letters only, no numbers or punctuation).",
    text: "Hello World! Test-123 regex_fun",
    expected: ["Hello", "World", "Test", "regex", "fun"],
    hints: [
      "[a-zA-Z] matches a single letter.",
      "Add + to match one or more letters in a row."
    ],
    solution: "[a-zA-Z]+"
  },
  {
    id: "c3", diff: "starter",
    title: "Spot the Vowels",
    desc: "Find every individual vowel character in this sentence.",
    text: "The quick brown fox jumps over the lazy dog",
    expected: ["e", "u", "i", "o", "o", "u", "o", "e", "e", "a", "o"],
    hints: [
      "Use a character set with [...]",
      "[aeiou] matches any single vowel."
    ],
    solution: "[aeiou]"
  },
  {
    id: "c4", diff: "starter",
    title: "Find Capitalized Words",
    desc: "Match words that start with an uppercase letter.",
    text: "The Bank of America processed three Transfers for John Smith",
    expected: ["The", "Bank", "America", "Transfers", "John", "Smith"],
    hints: [
      "Uppercase starts with [A-Z], followed by lowercase letters.",
      "[A-Z][a-z]* matches a capital letter followed by zero or more lowercase."
    ],
    solution: "[A-Z][a-z]*"
  },
  {
    id: "c5", diff: "starter",
    title: "Match Three-Letter Words",
    desc: "Find all words that are exactly three letters long.",
    text: "The big red fox ran far and hid for two hrs",
    expected: ["The", "big", "red", "fox", "ran", "far", "and", "hid", "for", "two", "hrs"],
    hints: [
      "You need a word boundary \\b to avoid matching inside longer words.",
      "\\b[a-zA-Z]{3}\\b matches exactly three letters between boundaries."
    ],
    solution: "\\b[a-zA-Z]{3}\\b"
  },

  // ── Intermediate ──
  {
    id: "c6", diff: "intermediate",
    title: "Match Dollar Amounts",
    desc: "Extract prices like $9.99 or $100.00 from this receipt.",
    text: "Subtotal: $45.99, Tax: $3.68, Shipping: $5.00, Total: $54.67",
    expected: ["$45.99", "$3.68", "$5.00", "$54.67"],
    hints: [
      "Start with a literal $ (need to escape it: \\$)",
      "Then digits, a literal dot, and exactly 2 more digits."
    ],
    solution: "\\$\\d+\\.\\d{2}"
  },
  {
    id: "c7", diff: "intermediate",
    title: "Find Email Addresses",
    desc: "Write a pattern to extract the email addresses from this text.",
    text: "Contact john.doe@example.com or support@company.org for help",
    expected: ["john.doe@example.com", "support@company.org"],
    hints: [
      "Emails have: something @ something . something",
      "[\\w.]+ matches word characters and dots. Build from there."
    ],
    solution: "[\\w.]+@[\\w]+\\.[a-z]+"
  },
  {
    id: "c8", diff: "intermediate",
    title: "Match Dates (MM/DD/YYYY)",
    desc: "Find all dates in month/day/year format.",
    text: "Filed on 01/15/2024, revised 12/01/2023, due 3/5/2025",
    expected: ["01/15/2024", "12/01/2023", "3/5/2025"],
    hints: [
      "Months and days can be 1 or 2 digits: \\d{1,2}",
      "Years are 4 digits. Separate with literal slashes."
    ],
    solution: "\\d{1,2}/\\d{1,2}/\\d{4}"
  },
  {
    id: "c9", diff: "intermediate",
    title: "Extract Phone Numbers",
    desc: "Find US phone numbers in different formats.",
    text: "Call 555-123-4567 or (555) 987-6543 or 555.111.2222 today",
    expected: ["555-123-4567", "(555) 987-6543", "555.111.2222"],
    hints: [
      "Phone numbers have 3 digits, a separator, 3 digits, a separator, 4 digits.",
      "The area code might be in parentheses. Try: \\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}"
    ],
    solution: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}"
  },
  {
    id: "c10", diff: "intermediate",
    title: "Find Repeated Words",
    desc: "Find words that appear right next to themselves (e.g. 'the the').",
    text: "The the quick brown fox fox jumped over the the lazy dog",
    expected: ["the the", "fox fox", "the the"],
    hints: [
      "You need a capturing group and a backreference.",
      "\\b(\\w+)\\s+\\1\\b matches a word followed by itself."
    ],
    solution: "\\b(\\w+)\\s+\\1\\b"
  },

  // ── Applied: Fraud Detection ──
  {
    id: "c11", diff: "applied",
    title: "Structuring Transactions",
    desc: "Amounts just under $10,000 can signal structuring (splitting deposits to avoid reporting thresholds). Find all amounts between $9,000–$9,999.",
    text: "Deposit: $9,500 | Deposit: $9,999 | Deposit: $10,000 | Deposit: $9,001 | Deposit: $8,500",
    expected: ["$9,500", "$9,999", "$9,001"],
    hints: [
      "Start with \\$ then the digit 9, then a comma, then 3 digits.",
      "\\$9,\\d{3} matches $9 followed by comma and exactly 3 digits."
    ],
    solution: "\\$9,\\d{3}"
  },
  {
    id: "c12", diff: "applied",
    title: "Extract IP Addresses",
    desc: "Find all IP addresses in this server log to identify suspicious login sources.",
    text: "Login from 192.168.1.1 at 08:30, failed login from 10.0.0.255, alert from 172.16.0.1",
    expected: ["192.168.1.1", "10.0.0.255", "172.16.0.1"],
    hints: [
      "An IP is four groups of 1–3 digits separated by dots.",
      "\\d{1,3} matches 1–3 digits. Dots must be escaped: \\."
    ],
    solution: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"
  },
  {
    id: "c13", diff: "applied",
    title: "Flag Round-Dollar Transactions",
    desc: "In fraud analysis, many round-dollar amounts (like $500, $1000) can indicate automated or suspicious activity. Find amounts that end in 00.",
    text: "Transfers: $500, $1,200, $75, $3,000, $149, $10,000, $250",
    expected: ["$500", "$1,200", "$3,000", "$10,000"],
    hints: [
      "These amounts end with 00. But they might have commas in them too.",
      "Try matching \\$ then digits/commas ending in 00."
    ],
    solution: "\\$[\\d,]*00"
  },
  {
    id: "c14", diff: "applied",
    title: "Suspicious Email Domains",
    desc: "Flag email addresses from free/disposable providers often used in fraud. Match emails ending in @gmail.com, @yahoo.com, or @hotmail.com.",
    text: "Contacts: cfo@acme.com, jdoe@gmail.com, alert@company.org, temp123@yahoo.com, info@hotmail.com",
    expected: ["jdoe@gmail.com", "temp123@yahoo.com", "info@hotmail.com"],
    hints: [
      "Match word characters before @, then use alternation for the domains.",
      "[\\w.]+@(?:gmail|yahoo|hotmail)\\.com"
    ],
    solution: "[\\w.]+@(?:gmail|yahoo|hotmail)\\.com"
  },
  {
    id: "c15", diff: "applied",
    title: "Timestamp Extraction",
    desc: "Extract timestamps from this security log. Timestamps are in HH:MM:SS format (24-hour).",
    text: "[08:15:30] Login attempt | [13:45:02] Access granted | [23:59:59] Session timeout | [02:00:00] Backup started",
    expected: ["08:15:30", "13:45:02", "23:59:59", "02:00:00"],
    hints: [
      "Hours, minutes, seconds are each 2 digits separated by colons.",
      "\\d{2}:\\d{2}:\\d{2} matches the HH:MM:SS format."
    ],
    solution: "\\d{2}:\\d{2}:\\d{2}"
  },

  // ── Additional Starter ──
  {
    id: "c16", diff: "starter",
    title: "Find Words Ending in 'ing'",
    desc: "Match every word that ends with the suffix 'ing'.",
    text: "The running fox was jumping and playing while the sleeping cat watched",
    expected: ["running", "jumping", "playing", "sleeping"],
    hints: [
      "You need letters before 'ing'. What matches a letter?",
      "[a-zA-Z]+ing matches one or more letters followed by 'ing'."
    ],
    solution: "[a-zA-Z]+ing"
  },
  {
    id: "c17", diff: "starter",
    title: "Extract Hashtags",
    desc: "Find all the hashtags (# followed by word characters) in this social media text.",
    text: "Loving this #NLP course! #AI102 is great for #regex practice. See you at #UTK",
    expected: ["#NLP", "#AI102", "#regex", "#UTK"],
    hints: [
      "A hashtag starts with a literal # followed by word characters.",
      "#\\w+ matches a hash sign followed by one or more word characters."
    ],
    solution: "#\\w+"
  },

  // ── Additional Intermediate ──
  {
    id: "c18", diff: "intermediate",
    title: "Match Zip Codes",
    desc: "Extract US zip codes — either 5 digits or 5+4 format (e.g. 37916-1234).",
    text: "Ship to 37916, 90210-5678, or 10001. Not 123 or 1234567.",
    expected: ["37916", "90210-5678", "10001"],
    hints: [
      "Start with exactly 5 digits. The -XXXX part is optional.",
      "\\b\\d{5}(-\\d{4})?\\b uses a word boundary and an optional group."
    ],
    solution: "\\b\\d{5}(-\\d{4})?\\b"
  },
  {
    id: "c19", diff: "intermediate",
    title: "Find Quoted Text",
    desc: "Extract everything inside double quotes from this text.",
    text: "The report said \"suspicious activity\" was found in the \"Q3 ledger\" and flagged as \"high risk\".",
    expected: ["\"suspicious activity\"", "\"Q3 ledger\"", "\"high risk\""],
    hints: [
      "Match an opening quote, then content, then a closing quote.",
      "\"[^\"]+\" matches a quote, one or more non-quote characters, then a closing quote."
    ],
    solution: "\"[^\"]+\""
  },

  // ── Additional Applied ──
  {
    id: "c20", diff: "applied",
    title: "Detect Redacted SSNs",
    desc: "In compliance documents, SSNs are often partially redacted as XXX-XX-1234. Find all patterns that look like full or redacted SSNs.",
    text: "Records: XXX-XX-4521, 123-45-6789, XXX-XX-0001, not-a-ssn, XXX-XX-9999",
    expected: ["XXX-XX-4521", "123-45-6789", "XXX-XX-0001", "XXX-XX-9999"],
    hints: [
      "SSNs are three groups separated by dashes. Each group has letters or digits.",
      "[A-Z0-9]{3}-[A-Z0-9]{2}-\\d{4} handles both redacted and real SSNs."
    ],
    solution: "[A-Z0-9]{3}-[A-Z0-9]{2}-\\d{4}"
  }
];


// ───────────────────────────────────────────────
// Cheat sheet table data
// ───────────────────────────────────────────────

const CHEATSHEET = [
  {
    title: "Metacharacters",
    rows: [
      [".",    "Any character except newline",              "c.t → cat, cut"],
      ["^",    "Start of string (or line with m flag)",     "^Hello → Hello at start"],
      ["$",    "End of string (or line with m flag)",       "end$ → end at finish"],
      ["|",    "OR — alternation",                          "a|b → a or b"],
      ["\\\\", "Escape special character",                  "\\\\. → literal dot"]
    ]
  },
  {
    title: "Quantifiers",
    rows: [
      ["*",     "Zero or more",            "a* → \"\", a, aa, aaa"],
      ["+",     "One or more",             "a+ → a, aa, aaa"],
      ["?",     "Zero or one (optional)",  "colou?r → color, colour"],
      ["{n}",   "Exactly n times",         "\\\\d{3} → 123"],
      ["{n,m}", "Between n and m times",   "\\\\d{2,4} → 12, 123, 1234"],
      ["{n,}",  "n or more times",         "a{2,} → aa, aaa, aaaa"]
    ]
  },
  {
    title: "Character Classes",
    rows: [
      ["\\\\d", "Any digit (0–9)",                  "\\\\d+ → 42, 100"],
      ["\\\\D", "Any non-digit",                    "\\\\D+ → abc, hello"],
      ["\\\\w", "Word character (letter, digit, _)", "\\\\w+ → hello_123"],
      ["\\\\W", "Non-word character",               "\\\\W → !, @, spaces"],
      ["\\\\s", "Whitespace (space, tab, newline)",  "\\\\s+ → spaces between words"],
      ["\\\\S", "Non-whitespace",                   "\\\\S+ → words"],
      ["\\\\t", "Tab character explicitly",          "col1\\\\tcol2"],
      ["\\\\n", "Newline character explicitly",      "line1\\\\nline2"],
      ["\\\\b", "Word boundary",                     "\\\\bcat\\\\b → cat (not catalog)"]
    ]
  },
  {
    title: "Sets & Ranges",
    rows: [
      ["[abc]",    "Any one character in the set",  "[aeiou] → vowels"],
      ["[a-z]",    "Range: any lowercase letter",   "[a-z]+ → hello"],
      ["[A-Za-z]", "Any letter (upper or lower)",   "[A-Za-z]+ → Hello"],
      ["[^abc]",   "Any character NOT in the set",  "[^0-9] → non-digits"]
    ]
  },
  {
    title: "Anchors & Groups",
    rows: [
      ["(…)",    "Capture group — treat as unit",          "(ab)+ → ab, abab"],
      ["(?:…)",  "Non-capturing group",                    "(?:ab)+ (no capture)"],
      ["(?=…)",  "Lookahead — followed by",                "\\\\w+(?=ing)"],
      ["(?!…)",  "Negative lookahead — NOT followed by",   "\\\\d+(?!\\\\$)"]
    ]
  }
];


// ───────────────────────────────────────────────
// Pattern explainer — token dictionary
// ───────────────────────────────────────────────

const EXPLAIN_TOKENS = [
  { regex: /^\\\$/, label: "\\$",     meaning: "literal dollar sign" },
  { regex: /^\\\./, label: "\\.",     meaning: "literal dot" },
  { regex: /^\\\\/, label: "\\\\",   meaning: "literal backslash" },
  { regex: /^\\d/,  label: "\\d",    meaning: "any digit (0–9)" },
  { regex: /^\\D/,  label: "\\D",    meaning: "any non-digit" },
  { regex: /^\\w/,  label: "\\w",    meaning: "any word character (letter, digit, _)" },
  { regex: /^\\W/,  label: "\\W",    meaning: "any non-word character" },
  { regex: /^\\s/,  label: "\\s",    meaning: "any whitespace" },
  { regex: /^\\S/,  label: "\\S",    meaning: "any non-whitespace" },
  { regex: /^\\b/,  label: "\\b",    meaning: "word boundary" },
  { regex: /^\\t/,  label: "\\t",    meaning: "tab character" },
  { regex: /^\\n/,  label: "\\n",    meaning: "newline character" },
  { regex: /^\\1/,  label: "\\1",    meaning: "backreference to group 1" },

  { regex: /^\{(\d+),(\d+)\}/, label: null, meaning: null, build: function(m){ return { label: "{"+m[1]+","+m[2]+"}", meaning: "between "+m[1]+" and "+m[2]+" times" }; } },
  { regex: /^\{(\d+),\}/,      label: null, meaning: null, build: function(m){ return { label: "{"+m[1]+",}", meaning: m[1]+" or more times" }; } },
  { regex: /^\{(\d+)\}/,       label: null, meaning: null, build: function(m){ return { label: "{"+m[1]+"}", meaning: "exactly "+m[1]+" times" }; } },

  { regex: /^\[([^\]]*)\]/, label: null, meaning: null, build: function(m){
      var inner = m[1]; var neg = inner.charAt(0) === "^";
      if (neg) inner = inner.substring(1);
      return { label: "["+m[1]+"]", meaning: (neg ? "any character NOT in: " : "any one of: ") + inner };
    }
  },

  { regex: /^\((\?\:)/, label: "(?:",  meaning: "non-capturing group start" },
  { regex: /^\((\?=)/,  label: "(?=",  meaning: "lookahead (followed by…)" },
  { regex: /^\((\?!)/,  label: "(?!",  meaning: "negative lookahead (NOT followed by…)" },
  { regex: /^\(/,        label: "(",    meaning: "group start" },
  { regex: /^\)/,        label: ")",    meaning: "group end" },

  { regex: /^\^/, label: "^", meaning: "start of string/line" },
  { regex: /^\$/, label: "$", meaning: "end of string/line" },
  { regex: /^\|/, label: "|", meaning: "OR" },
  { regex: /^\./,  label: ".",  meaning: "any character (except newline)" },
  { regex: /^\+\?/, label: "+?", meaning: "one or more (lazy)" },
  { regex: /^\*\?/, label: "*?", meaning: "zero or more (lazy)" },
  { regex: /^\+/,  label: "+",  meaning: "one or more" },
  { regex: /^\*/,  label: "*",  meaning: "zero or more" },
  { regex: /^\?/,  label: "?",  meaning: "optional (0 or 1)" }
];