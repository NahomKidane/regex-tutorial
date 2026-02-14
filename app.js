// ═══════════════════════════════════════════════════════════════
// app.js — Application logic. Reads from data.js, writes to DOM.
// No content or styling lives here.
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────
// State
// ───────────────────────────────────────────────

const state = {
  activeMode: "learn",
  visitedLessons: {},     // { lessonId: true }
  challengeHints: {},     // { challengeId: hintLevel }
  challengeStatus: {},    // { challengeId: "success" }
  activeChallenge: null,  // track which challenge is being worked on
  pythonVisible: {},      // { lessonId: true }
};


// ───────────────────────────────────────────────
// Utilities
// ───────────────────────────────────────────────

function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function $(sel)  { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }


// ───────────────────────────────────────────────
// Progress tracking
// ───────────────────────────────────────────────

function getTotalLessons() {
  var count = 0;
  LESSONS.forEach(function(g) { count += g.items.length; });
  return count;
}

function getVisitedCount() {
  return Object.keys(state.visitedLessons).length;
}

function getCompletedChallenges() {
  return Object.keys(state.challengeStatus).length;
}

function updateProgressBars() {
  // Learn progress
  var learnBar = $("#learn-progress");
  if (learnBar) {
    var total = getTotalLessons();
    var visited = getVisitedCount();
    var pct = total > 0 ? Math.round((visited / total) * 100) : 0;
    learnBar.querySelector(".progress-fill").style.width = pct + "%";
    learnBar.querySelector(".progress-text").textContent = visited + " / " + total + " explored";
  }

  // Challenge progress
  var chalBar = $("#challenge-progress");
  if (chalBar) {
    var total = CHALLENGES.length;
    var done = getCompletedChallenges();
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    chalBar.querySelector(".progress-fill").style.width = pct + "%";
    chalBar.querySelector(".progress-text").textContent = done + " / " + total + " completed";
  }
}


// ───────────────────────────────────────────────
// Pattern explainer
// ───────────────────────────────────────────────

function explainPattern(pattern) {
  if (!pattern) return [];

  var tokens = [];
  var remaining = pattern;

  while (remaining.length > 0) {
    var matched = false;

    for (var i = 0; i < EXPLAIN_TOKENS.length; i++) {
      var rule = EXPLAIN_TOKENS[i];
      var m = remaining.match(rule.regex);

      if (m) {
        if (rule.build) {
          var built = rule.build(m);
          tokens.push({ label: built.label, meaning: built.meaning });
        } else {
          tokens.push({
            label: rule.label || m[0],
            meaning: rule.meaning || ("literal \"" + m[0] + "\"")
          });
        }
        remaining = remaining.substring(m[0].length);
        matched = true;
        break;
      }
    }

    // If nothing matched, consume one literal character
    if (!matched) {
      var ch = remaining.charAt(0);
      tokens.push({ label: ch, meaning: 'literal "' + ch + '"' });
      remaining = remaining.substring(1);
    }
  }

  return tokens;
}

function renderExplainer(pattern) {
  var el = $("#pgExplainer");
  if (!el) return;

  if (!pattern) {
    el.innerHTML = "";
    el.style.display = "none";
    return;
  }

  var tokens = explainPattern(pattern);
  if (tokens.length === 0) {
    el.style.display = "none";
    return;
  }

  var html = '<div class="explainer-label">Pattern breakdown</div>';
  html += '<div class="explainer-tokens">';
  tokens.forEach(function(t) {
    html +=
      '<div class="explainer-token">' +
        '<span class="explainer-sym">' + esc(t.label) + '</span>' +
        '<span class="explainer-meaning">' + esc(t.meaning) + '</span>' +
      '</div>';
  });
  html += '</div>';

  el.innerHTML = html;
  el.style.display = "block";
}


// ───────────────────────────────────────────────
// Playground engine (single instance, always on)
// ───────────────────────────────────────────────

function getFlags() {
  var f = "";
  if ($("#flagG").checked) f += "g";
  if ($("#flagI").checked) f += "i";
  if ($("#flagM").checked) f += "m";
  return f;
}

function runPlayground() {
  var pattern = $("#pgPattern").value;
  var text    = $("#pgText").value;
  var flags   = getFlags();
  var el      = $("#pgResults");

  // Always update explainer
  renderExplainer(pattern);

  if (!pattern) {
    el.innerHTML =
      '<span class="pg-placeholder">Type a pattern to see matches…</span>';
    return;
  }

  try {
    var regex   = new RegExp(pattern, flags);
    var matches = [];
    var m;

    if (flags.includes("g")) {
      while ((m = regex.exec(text)) !== null) {
        matches.push({ text: m[0], index: m.index });
        if (m[0].length === 0) regex.lastIndex++;
      }
    } else {
      m = regex.exec(text);
      if (m) matches.push({ text: m[0], index: m.index });
    }

    // Highlighted text
    var hl   = "";
    var last = 0;
    matches.forEach(function (match) {
      hl += esc(text.substring(last, match.index));
      hl += '<span class="match-hl">' + esc(match.text) + "</span>";
      last = match.index + match.text.length;
    });
    hl += esc(text.substring(last));

    var countCls = matches.length === 0 ? "match-count zero" : "match-count";
    var html =
      '<div class="' + countCls + '">' +
      matches.length + " match" + (matches.length !== 1 ? "es" : "") +
      "</div>";
    html += '<div class="highlighted-text">' + hl + "</div>";

    if (matches.length > 0) {
      html += '<div class="match-badges">';
      matches.forEach(function (match) {
        html +=
          '<span class="match-badge">&quot;' + esc(match.text) + '&quot;</span>';
      });
      html += "</div>";
    }

    el.innerHTML = html;
  } catch (err) {
    el.innerHTML = '<div class="pg-error">' + esc(err.message) + "</div>";
  }
}

function loadIntoPlayground(pattern, text) {
  $("#pgPattern").value = pattern;
  $("#pgText").value    = text;
  runPlayground();

  // Mobile: open playground panel
  if (window.innerWidth < 1024) {
    $("#playground").classList.add("open");
    $("#mobileOverlay").style.display = "block";
  }
}


// ───────────────────────────────────────────────
// Render: Learn mode
// ───────────────────────────────────────────────

function renderLearn() {
  var html = '';

  // Progress bar
  html += '<div class="progress-bar" id="learn-progress">';
  html +=   '<div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>';
  html +=   '<span class="progress-text">0 / ' + getTotalLessons() + ' explored</span>';
  html += '</div>';

  var lessonNum = 0;
  LESSONS.forEach(function (group) {
    html += '<div class="section-heading">' + group.group + "</div>";

    group.items.forEach(function (lesson) {
      lessonNum++;
      var visited = state.visitedLessons[lesson.id] ? " visited" : "";
      html +=
        '<div class="lesson-card' + visited + '" data-lesson="' + lesson.id + '">' +
          '<div class="lesson-top-row">' +
            '<span class="lesson-number">' + lessonNum + '</span>' +
            '<span class="lesson-visited-dot' + (visited ? ' show' : '') + '" title="Explored"></span>' +
          '</div>' +
          "<h3>" + lesson.title + "</h3>" +
          "<p>"  + lesson.desc  + "</p>" +
          '<span class="pattern-preview">' + esc(lesson.pattern) + "</span>" +
          '<button class="python-toggle" data-pyid="' + lesson.id + '" title="Show Python code">Python</button>' +
          '<div class="python-block" id="py-' + lesson.id + '">' +
            '<div class="python-header">Python equivalent</div>' +
            '<pre class="python-code">' + esc(lesson.python) + '</pre>' +
          '</div>' +
        "</div>";
    });
  });

  $("#panel-learn").innerHTML = html;

  // Click delegation — lesson cards
  $$(".lesson-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking the python toggle
      if (e.target.classList.contains("python-toggle")) return;
      selectLesson(this.dataset.lesson);
    });
  });

  // Python toggle buttons
  $$(".python-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var id = this.dataset.pyid;
      var block = $("#py-" + id);
      if (block.classList.contains("show")) {
        block.classList.remove("show");
        this.classList.remove("active");
      } else {
        block.classList.add("show");
        this.classList.add("active");
      }
    });
  });

  selectLesson("intro");
}

function selectLesson(id) {
  $$(".lesson-card").forEach(function (c) { c.classList.remove("active"); });
  var card = $('[data-lesson="' + id + '"]');
  if (card) {
    card.classList.add("active");

    // Mark visited
    if (!state.visitedLessons[id]) {
      state.visitedLessons[id] = true;
      card.classList.add("visited");
      var dot = card.querySelector(".lesson-visited-dot");
      if (dot) dot.classList.add("show");
      updateProgressBars();
    }
  }

  // Load into playground
  LESSONS.forEach(function (g) {
    g.items.forEach(function (l) {
      if (l.id === id) loadIntoPlayground(l.pattern, l.text);
    });
  });
}


// ───────────────────────────────────────────────
// Render: Reference mode
// ───────────────────────────────────────────────

function renderReference() {
  var html =
    '<input type="text" class="ref-search" id="refSearch" ' +
    'placeholder="Search patterns… (e.g. digit, start, group)">';

  REFERENCE.forEach(function (cat) {
    html += '<div class="ref-category">';
    html += "<h3>" + cat.cat + "</h3>";
    html += '<div class="ref-grid">';

    cat.items.forEach(function (item) {
      var safePattern = item.pattern.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      var safeText    = item.text.replace(/'/g, "\\'");
      html +=
        '<div class="ref-card" ' +
          'data-search="' + (item.sym + " " + item.meaning).toLowerCase() + '" ' +
          "data-pattern='" + safePattern + "' " +
          "data-text='"    + safeText    + "'>" +
          '<div class="symbol">' + esc(item.sym) + "</div>" +
          '<div class="meaning">' + item.meaning + "</div>" +
        "</div>";
    });

    html += "</div></div>";
  });

  $("#panel-reference").innerHTML = html;

  // Search filter
  $("#refSearch").addEventListener("input", function () {
    var q = this.value.toLowerCase();
    $$(".ref-card").forEach(function (card) {
      card.style.display = card.dataset.search.includes(q) ? "" : "none";
    });
  });

  // Click to load
  $$(".ref-card").forEach(function (card) {
    card.addEventListener("click", function () {
      loadIntoPlayground(
        this.dataset.pattern.replace(/\\\\/g, "\\"),
        this.dataset.text
      );
    });
  });
}


// ───────────────────────────────────────────────
// Render: Challenge mode
// ───────────────────────────────────────────────

function renderChallenges() {
  var groupLabels = {
    starter:      "Starter",
    intermediate: "Intermediate",
    applied:      "Applied — Fraud Detection"
  };

  var html = '';

  // Progress bar
  html += '<div class="progress-bar" id="challenge-progress">';
  html +=   '<div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>';
  html +=   '<span class="progress-text">0 / ' + CHALLENGES.length + ' completed</span>';
  html += '</div>';

  html +=
    '<div class="nlp-callout">' +
      "<strong>Why regex for NLP?</strong> Regular expressions are the first tool " +
      "in every text processing pipeline. In forensic accounting and fraud detection, " +
      "regex helps you extract dollar amounts, flag suspicious patterns, and parse " +
      "transaction logs automatically." +
    "</div>";

  Object.keys(groupLabels).forEach(function (diff) {
    html += '<div class="section-heading">' + groupLabels[diff] + "</div>";

    CHALLENGES.filter(function (c) { return c.diff === diff; })
      .forEach(function (ch) {
        var done = state.challengeStatus[ch.id] === "success";
        html +=
          '<div class="challenge-card' + (done ? " completed" : "") + '" ' +
            'id="card-' + ch.id + '">' +
            '<div class="challenge-header">' +
              '<span class="challenge-diff diff-' + ch.diff + '">' + ch.diff + "</span>" +
              (done ? ' <span class="challenge-status">&#10003;</span>' : "") +
            "</div>" +
            "<h3>" + ch.title + "</h3>" +
            '<div class="desc">' + ch.desc + "</div>" +
            '<div class="challenge-actions">' +
              '<button class="btn btn-primary" data-action="start"  data-id="' + ch.id + '">Try It</button>' +
              '<button class="btn btn-outline" data-action="hint"   data-id="' + ch.id + '">Hint</button>' +
              '<button class="btn btn-check"   data-action="check"  data-id="' + ch.id + '">Check Answer</button>' +
            "</div>" +
            '<div class="hint-text" id="hint-' + ch.id + '"></div>' +
            '<div class="challenge-feedback" id="fb-' + ch.id + '"></div>' +
          "</div>";
      });
  });

  $("#panel-challenge").innerHTML = html;

  // Event delegation for challenge buttons
  $$("#panel-challenge .btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id     = this.dataset.id;
      var action = this.dataset.action;
      if (action === "start") startChallenge(id);
      if (action === "hint")  showHint(id);
      if (action === "check") checkChallenge(id);
    });
  });
}

function findChallenge(id) {
  return CHALLENGES.find(function (c) { return c.id === id; });
}

function startChallenge(id) {
  var ch = findChallenge(id);
  if (!ch) return;

  state.activeChallenge = id;
  loadIntoPlayground("", ch.text);
  $("#pgPattern").focus();

  // Update playground label
  var label = $("#pgChallengeLabel");
  if (label) {
    label.textContent = "Working on: " + ch.title;
    label.style.display = "block";
  }

  $$(".challenge-card").forEach(function (c) {
    c.classList.remove("active-challenge");
  });
  $("#card-" + id).classList.add("active-challenge");
}

function showHint(id) {
  var ch = findChallenge(id);
  if (!ch) return;

  var level = state.challengeHints[id] || 0;
  var el    = $("#hint-" + id);

  if (level < ch.hints.length) {
    el.textContent = "Hint " + (level + 1) + ": " + ch.hints[level];
    el.classList.add("visible");
    state.challengeHints[id] = level + 1;
  } else {
    el.textContent = "Solution: " + ch.solution;
    el.classList.add("visible");
  }
}

function checkChallenge(id) {
  var ch = findChallenge(id);
  if (!ch) return;

  var fb      = $("#fb-" + id);
  var pattern = $("#pgPattern").value;

  // Always validate against the challenge's own text, not whatever
  // might be in the textarea (student might have edited it).
  var text = ch.text;

  if (!pattern) {
    fb.className   = "challenge-feedback feedback-tryagain";
    fb.textContent = 'Click "Try It" first, then type your pattern in the playground.';
    return;
  }

  try {
    var regex = new RegExp(pattern, "g");
    var found = [];
    var m;
    while ((m = regex.exec(text)) !== null) {
      found.push(m[0]);
      if (m[0].length === 0) regex.lastIndex++;
    }

    var expectedSorted = ch.expected.slice().sort();
    var foundSorted    = found.slice().sort();
    var isMatch =
      expectedSorted.length === foundSorted.length &&
      expectedSorted.every(function (v, i) { return v === foundSorted[i]; });

    if (isMatch) {
      fb.className   = "challenge-feedback feedback-success";
      fb.textContent =
        "Correct! Your pattern matched all " + ch.expected.length + " expected results.";
      state.challengeStatus[id] = "success";
      $("#card-" + id).classList.add("completed");

      // Add checkmark if not already there
      var header = $("#card-" + id + " .challenge-header");
      if (header && !header.querySelector(".challenge-status")) {
        var span = document.createElement("span");
        span.className = "challenge-status";
        span.innerHTML = "&#10003;";
        header.appendChild(span);
      }

      updateProgressBars();
    } else {
      fb.className = "challenge-feedback feedback-tryagain";
      var msg =
        "Not quite — you found " + found.length +
        " match" + (found.length !== 1 ? "es" : "") +
        ", expected " + ch.expected.length + ".";
      if (found.length > 0 && found.length <= 8) {
        msg += " You matched: " + found.map(function(f){ return "\u201C" + f + "\u201D"; }).join(", ") + ".";
      }
      if (found.length > ch.expected.length) {
        msg += " Your pattern is too broad — try being more specific.";
      } else if (found.length < ch.expected.length) {
        msg += " Your pattern is too narrow — try matching more cases.";
      }
      fb.textContent = msg;
    }
  } catch (err) {
    fb.className   = "challenge-feedback feedback-tryagain";
    fb.textContent = "Pattern error: " + err.message;
  }
}


// ───────────────────────────────────────────────
// Render: Cheat Sheet
// ───────────────────────────────────────────────

function renderCheatSheet() {
  var html = "";

  CHEATSHEET.forEach(function (section) {
    html +=
      '<table class="cheat-table"><thead>' +
        '<tr><th colspan="3">' + section.title + "</th></tr>" +
        "<tr><th>Pattern</th><th>Meaning</th><th>Example</th></tr>" +
      "</thead><tbody>";

    section.rows.forEach(function (row) {
      html +=
        "<tr>" +
          "<td><code>" + row[0] + "</code></td>" +
          "<td>" + row[1] + "</td>" +
          '<td class="example">' + row[2] + "</td>" +
        "</tr>";
    });

    html += "</tbody></table>";
  });

  html +=
    '<div class="nlp-callout">' +
      "<strong>Regex in your NLP toolkit:</strong> " +
      "In spaCy, you can use regex patterns to define custom entity recognition rules. " +
      "NLTK's RegexpTokenizer lets you tokenize text using regex. " +
      "In scikit-learn, CountVectorizer accepts a custom token_pattern regex. " +
      "Regex is the foundation of text preprocessing in every NLP pipeline you'll " +
      "build in this course." +
    "</div>";

  $("#panel-cheatsheet").innerHTML = html;
}


// ───────────────────────────────────────────────
// Mode switching
// ───────────────────────────────────────────────

function switchMode(mode) {
  state.activeMode = mode;

  $$(".mode-tab").forEach(function (t) { t.classList.remove("active"); });
  $('[data-mode="' + mode + '"]').classList.add("active");

  $$(".panel-section").forEach(function (p) { p.classList.remove("active"); });
  $("#panel-" + mode).classList.add("active");

  // Clear challenge label when leaving challenges
  if (mode !== "challenge") {
    var label = $("#pgChallengeLabel");
    if (label) label.style.display = "none";
  }
}


// ───────────────────────────────────────────────
// Mobile playground toggle
// ───────────────────────────────────────────────

function closeMobilePlayground() {
  $("#playground").classList.remove("open");
  $("#mobileOverlay").style.display = "none";
}


// ───────────────────────────────────────────────
// Initialise everything on DOM ready
// ───────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {

  // Render all panels
  renderLearn();
  renderReference();
  renderChallenges();
  renderCheatSheet();

  // Playground live-update listeners
  var pgIds   = ["pgPattern", "pgText", "flagG", "flagI", "flagM"];
  var pgEvts  = ["input",     "input",  "change","change","change"];
  pgIds.forEach(function (id, i) {
    $("#" + id).addEventListener(pgEvts[i], runPlayground);
  });

  // Tab navigation
  $$(".mode-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchMode(this.dataset.mode);
    });
  });

  // Mobile playground toggle
  $("#mobileToggle").addEventListener("click", function () {
    var pg = $("#playground");
    if (pg.classList.contains("open")) {
      closeMobilePlayground();
    } else {
      pg.classList.add("open");
      $("#mobileOverlay").style.display = "block";
    }
  });

  $("#mobileOverlay").addEventListener("click", closeMobilePlayground);

  // Initial progress
  updateProgressBars();

  // First run
  runPlayground();
});
