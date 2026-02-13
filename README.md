# Regex Workshop — AI 102

Interactive regex practice app for **AI 102: Natural Language-based Programming Techniques**.

Built for non-CS majors learning regular expressions as a text processing tool for NLP pipelines.

## Live Demo

Enable GitHub Pages on this repo (`Settings → Pages → Source: main branch`) and the app will be available at:

```
https://<your-username>.github.io/<repo-name>/
```

Embed in Canvas using an `<iframe>` or by adding the URL as an External Tool link.

## Project Structure

```
regex-workshop/
├── index.html          ← Main page (HTML shell only)
├── css/
│   └── styles.css      ← All visual design
├── js/
│   ├── data.js         ← All content (lessons, reference, challenges)
│   └── app.js          ← Application logic (rendering, playground, validation)
└── README.md
```

**Separation of concerns:**

| File | Contains | Edit when you want to… |
|------|----------|------------------------|
| `index.html` | Page structure | Add new HTML sections |
| `css/styles.css` | Colors, fonts, layout | Change the look and feel |
| `js/data.js` | Lessons, challenges, reference cards | Add/edit content |
| `js/app.js` | Playground engine, rendering, events | Change app behavior |

## Features

- **Split-panel layout** — Regex playground is always visible alongside content
- **Learn mode** — 15 structured lessons from basics to grouping
- **Reference mode** — Searchable pattern reference by category
- **Challenge mode** — 9 self-checking exercises with hints and validation
  - Starter, Intermediate, and Applied (fraud detection) difficulty levels
- **Cheat Sheet** — Printable quick reference tables
- **Responsive** — Works on desktop, tablet, and mobile (Canvas app)

## Adding Content

All content lives in `js/data.js`. To add a new lesson, add an object to the `LESSONS` array:

```javascript
{
  id: "my-lesson",
  title: "My New Lesson",
  desc: "Explanation of what this pattern does and why it matters.",
  pattern: "\\d+",
  text: "Sample text with 42 numbers in it"
}
```

To add a new challenge:

```javascript
{
  id: "c10", diff: "intermediate",
  title: "My Challenge",
  desc: "Instructions for the student.",
  text: "The test text students will work with",
  expected: ["expected", "matches"],
  hints: ["First hint", "Second hint"],
  solution: "the-answer-pattern"
}
```

## Canvas Embedding

Add to Canvas as an external page:

1. Push this repo to GitHub and enable Pages
2. In Canvas, go to the module → Add Item → External URL
3. Paste the GitHub Pages URL
4. Check "Load in a new tab" for best experience

Or embed inline:

```html
<iframe src="https://<username>.github.io/<repo>/"
        width="100%" height="800" frameborder="0"></iframe>
```

## Dependencies

None. Pure HTML/CSS/JS with Google Fonts loaded from CDN.
