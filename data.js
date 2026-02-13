const lessons = {
    intro: { title: "🎯 Introduction", content: "A regex is a pattern for matching text. Used to find, extract, or replace text patterns in strings." },
    simple: { title: "1. Simple Matching", content: "Search for literal text. Case-sensitive by default.\n\nExample: 'the' matches 'the' in 'The quick brown fox. the lazy dog.'" },
    dot: { title: "2. Wildcard: .", content: ". matches ANY single character.\n\nExample: 'c.t' matches 'cat', 'cut', 'cot', 'c@t'" },
    plus: { title: "3. One or More: +", content: "+ means one or more times.\n\nExample: 'a+' matches 'a', 'aa', 'aaa'" },
    star: { title: "4. Zero or More: *", content: "* means zero or more.\n\nExample: 'coo*l' matches 'col', 'cool', 'coool'" },
    question: { title: "5. Optional: ?", content: "? makes it optional (0 or 1).\n\nExample: 'colou?r' matches 'color' and 'colour'" },
    range: { title: "6. Range: {n,m}", content: "Specific counts.\n{3}=exactly 3\n{3,5}=3-5\n{3,}=3 or more" },
    digits: { title: "7. Digits: \\d", content: "\\d matches any digit (0-9).\n\nCombine with +: \\d+ finds whole numbers\n\nExample: \\d+ matches '3', '12', '100'" },
    words: { title: "8. Word: \\w", content: "\\w matches letters, digits, underscore.\n\\w+ extracts full words\n\nExample: \\w+ matches 'Hello', 'World', 'Python_rocks'" },
    spaces: { title: "9. Whitespace: \\s", content: "\\s matches spaces, tabs, newlines.\n\\s+ finds sequences of spaces\n\nExample: \\s+ matches spaces between words" },
    brackets: { title: "10. Sets: [abc]", content: "[abc] matches one character from the set.\n[a-z]=lowercase\n[0-9]=digits\n[^abc]=NOT in set\n\nExample: [aeiou] matches vowels" },
    negation: { title: "11. Negation: [^...]", content: "[^abc] matches anything NOT a, b, or c.\n[^0-9] matches non-digits.\n[^aeiou] matches consonants" },
    escape: { title: "12. Escape Character: \\", content: "Use backslash to match special characters literally.\n\n\\. = literal period\n\\* = literal asterisk\n\\$ = literal dollar\n\n\\$\\d+\\.\\d{2} matches prices like $5.99" },
    groups: { title: "13. Groups: ()", content: "() creates groups.\n\n(ab)+ matches 'ab', 'abab', 'ababab'\n(cat|dog) matches 'cat' or 'dog'" },
    or: { title: "14. OR: |", content: "| means OR.\n\ncat|dog matches either 'cat' or 'dog'\n(cat|dog)s matches 'cats' or 'dogs'" },
    anchors: { title: "15. Anchors: ^ and $", content: "^ anchors to start of string\n$ anchors to end of string\n\n^Hello matches at start\ning$ matches at end\n^[A-Z] matches capital letter at start" },
    charclasses: { title: "16. Character Classes", content: "\\d = digit (0-9)\n\\D = non-digit\n\\w = word char (letter, digit, _)\n\\W = non-word\n\\s = space\n\\S = non-space" },
    pythonflags: { title: "17. Python Flags", content: "Use flags to modify behavior:\n\nre.I (IGNORECASE) - case-insensitive\nre.M (MULTILINE) - ^ and $ match lines\nre.S (DOTALL) - . matches newlines\n\nExample: re.findall(pattern, text, flags=re.I)" }
};

const patterns = {
    basics: {
        name: 'Basics',
        items: [
            { symbol: '.', meaning: 'Any single character', example: 'cat, cut, cot' },
            { symbol: '^A', meaning: 'Start of string', example: 'Apple' },
            { symbol: 'ing$', meaning: 'End of string', example: 'coding' },
            { symbol: 'cat|dog', meaning: 'OR', example: 'cats or dogs' },
            { symbol: '\\.', meaning: 'Literal period', example: '$5.99' }
        ]
    },
    quantifiers: {
        name: 'Quantifiers',
        items: [
            { symbol: 'a*', meaning: 'Zero or more', example: 'col, cool, coool' },
            { symbol: 'a+', meaning: 'One or more', example: 'a, aa, aaa' },
            { symbol: 'lo?ng', meaning: 'Optional', example: 'long, lng' },
            { symbol: '\\d{3}', meaning: 'Exactly 3', example: '123' },
            { symbol: '\\d{3,5}', meaning: '3 to 5 times', example: '123, 1234, 12345' }
        ]
    },
    charsets: {
        name: 'Character Sets',
        items: [
            { symbol: '[abc]', meaning: 'Any in set', example: 'cat, car, can' },
            { symbol: '[a-z]', meaning: 'Lowercase letter', example: 'hello' },
            { symbol: '[0-9]', meaning: 'Any digit', example: '123' },
            { symbol: '[^abc]', meaning: 'NOT a,b,c', example: 'xyz' }
        ]
    },
    classes: {
        name: 'Character Classes',
        items: [
            { symbol: '\\d', meaning: 'Digit', example: '123' },
            { symbol: '\\D', meaning: 'Non-digit', example: 'abc' },
            { symbol: '\\w', meaning: 'Word char', example: 'hello123' },
            { symbol: '\\W', meaning: 'Non-word', example: '!@#' },
            { symbol: '\\s', meaning: 'Whitespace', example: 'space' },
            { symbol: '\\S', meaning: 'Non-space', example: 'text' }
        ]
    },
    advanced: {
        name: 'Advanced',
        items: [
            { symbol: '(abc)', meaning: 'Group', example: '(cat|dog)s' },
            { symbol: 'a(?=b)', meaning: 'Lookahead', example: 'a before b' },
            { symbol: 'a(?!b)', meaning: 'Negative lookahead', example: 'a not before b' }
        ]
    }
};

const exercises = [
    { title: 'Find All Numbers', desc: 'Find all numbers', text: 'I have 3 apples, 5 oranges, 12 grapes', hint: '\\d+' },
    { title: 'Match Words', desc: 'Extract all words', text: 'Hello World How are you', hint: '\\w+' },
    { title: 'Find Prices', desc: 'Match prices', text: 'Cost: $5.99, Price: $100.00', hint: '\\$\\d+\\.\\d{2}' },
    { title: 'Phone Numbers', desc: 'Find phone patterns', text: 'Call (555) 123-4567', hint: '[\\d\\(\\)\\-\\s]+' },
    { title: 'Vowels', desc: 'Find all vowels', text: 'Hello World', hint: '[aeiou]' },
    { title: 'Uppercase', desc: 'Start with capital', text: 'Hello world Test', hint: '^[A-Z]' },
    { title: 'Consecutive a', desc: 'Multiple a in row', text: 'I have aa and aaa', hint: 'a{2,}' },
    { title: 'Email Pattern', desc: 'Match email', text: 'john@example.com', hint: '[\\w.-]+@[\\w.-]+' },
    { title: 'URLs', desc: 'Find web address', text: 'Visit https://google.com', hint: 'https?://[\\w.-]+' },
    { title: 'Hex Colors', desc: 'Color codes', text: 'Color: #FF5733 or #abc', hint: '#[a-fA-F0-9]{3,6}' },
    { title: 'Credit Card', desc: 'Card pattern', text: '4532-0151-1283-0366', hint: '\\d{4}-\\d{4}-\\d{4}-\\d{4}' },
    { title: 'Username', desc: 'Valid usernames', text: 'john_doe user123 admin', hint: '[a-zA-Z0-9_]+' }
];

const realWorld = [
    { name: '📧 Email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', example: 'john.doe@example.com' },
    { name: '☎️ Phone', pattern: '[\\d\\(\\)\\-\\.\\s]+\\d{4}', example: '(555) 123-4567' },
    { name: '🌐 URL', pattern: 'https?://[a-zA-Z0-9.-]+\\.\\w+', example: 'https://www.example.com' },
    { name: '📅 Date', pattern: '\\d{1,2}/\\d{1,2}/\\d{4}', example: '12/25/2023' },
    { name: '💳 Card', pattern: '\\d{4}[\\-\\s]\\d{4}[\\-\\s]\\d{4}[\\-\\s]\\d{4}', example: '4532-0151-1283-0366' },
    { name: '🖥️ IP Address', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', example: '192.168.1.1' },
    { name: '🎨 Hex Color', pattern: '#[a-fA-F0-9]{3,6}', example: '#FF5733' },
    { name: '👤 Username', pattern: '[a-zA-Z0-9_]{3,}', example: 'john_doe123' },
    { name: '⏰ Time', pattern: '\\d{1,2}:\\d{2}(:\\d{2})?', example: '14:30' },
    { name: '📍 Hashtag', pattern: '#\\w+', example: '#python' }
];
