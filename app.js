// ═══════════════════════════════════════════════════════════════
// app.js — Application logic. Reads from data.js, writes to DOM.
// No content or styling lives here.
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────
// State
// ───────────────────────────────────────────────

const state = {
  activeMode: "learn",
  challengeHints: {},   // { challengeId: hintLevel }
  challengeStatus: {},  // { challengeId: "success" | "trying" }
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
// Playground engine (single instance, always on)
// ───────────────────────────────────────────────

function getFlags() {
  let f = "";
  if ($("#flagG").checked) f += "g";
  if ($("#flagI").checked) f += "i";
  if ($("#flagM").checked) f += "m";
  return f;
}

function runPlayground() {
  const pattern = $("#pgPattern").value;
  const text    = $("#pgText").value;
  const flags   = getFlags();
  const el      = $("#pgResults");

  if (!pattern) {
    el.innerHTML =
      '<span class="pg-placeholder">Type a pattern to see matches…</span>';
    return;
  }

  try {
    const regex   = new RegExp(pattern, flags);
    const matches = [];
    let m;

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
    let hl   = "";
    let last = 0;
    matches.forEach(function (match) {
      hl += esc(text.substring(last, match.index));
      hl += '<span class="match-hl">' + esc(match.text) + "</span>";
      last = match.index + match.text.length;
    });
    hl += esc(text.substring(last));

    const countCls = matches.length === 0 ? "match-count zero" : "match-count";
    let html =
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
  let html = "";

  LESSONS.forEach(function (group) {
    html += '<div class="section-heading">' + group.group + "</div>";

    group.items.forEach(function (lesson) {
      html +=
        '<div class="lesson-card" data-lesson="' + lesson.id + '">' +
          "<h3>" + lesson.title + "</h3>" +
          "<p>"  + lesson.desc  + "</p>" +
          '<span class="pattern-preview">' + esc(lesson.pattern) + "</span>" +
        "</div>";
    });
  });

  $("#panel-learn").innerHTML = html;

  // Click delegation
  $$(".lesson-card").forEach(function (card) {
    card.addEventListener("click", function () {
      selectLesson(this.dataset.lesson);
    });
  });

  selectLesson("intro");
}

function selectLesson(id) {
  $$(".lesson-card").forEach(function (c) { c.classList.remove("active"); });
  var card = $('[data-lesson="' + id + '"]');
  if (card) card.classList.add("active");

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
  let html =
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

  let html =
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
              '<button class="btn btn-check"   data-action="check"  data-id="' + ch.id + '">Check</button>' +
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

  loadIntoPlayground("", ch.text);
  $("#pgPattern").focus();

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
  var text    = $("#pgText").value;

  if (!pattern) {
    fb.className   = "challenge-feedback feedback-tryagain";
    fb.textContent = "Enter a pattern in the playground first, then click Check.";
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
    } else {
      fb.className = "challenge-feedback feedback-tryagain";
      var msg =
        "Not quite — you found " + found.length +
        " match" + (found.length !== 1 ? "es" : "") +
        " but expected " + ch.expected.length + ".";
      if (found.length > 0) {
        msg += ' You matched: ' + found.map(function(f){ return '"'+f+'"'; }).join(", ") + ".";
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
  let html = "";

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
  ["input", "input", "change", "change", "change"].forEach(function (evt, i) {
    var ids = ["pgPattern", "pgText", "flagG", "flagI", "flagM"];
    $("#" + ids[i]).addEventListener(evt, runPlayground);
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

  // First run
  runPlayground();
});
