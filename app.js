// ═══════════════════════════════════════════════════════════════
// app.js — Application logic
// Theme toggle, resizable playground, mascot companion,
// collapsible learn sections
// ═══════════════════════════════════════════════════════════════

var state = {
  activeMode: "learn",
  visitedLessons: {},
  challengeHints: {},
  challengeStatus: {},
  activeChallenge: null,
  theme: "light",
  expandedGroups: {},   // { "Foundations": true, ... }
};

function esc(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function $(sel)  { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function getMascotSrc() {
  var img = $(".header-brand .icon img");
  return img ? img.src : "";
}


// ───────────────────────────────────────────────
// Theme toggle
// ───────────────────────────────────────────────

function setTheme(theme) {
  state.theme = theme;
  document.body.setAttribute("data-theme", theme);
  var icon = $(".theme-icon");
  if (icon) icon.textContent = theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}";
  try { localStorage.setItem("regex-theme", theme); } catch(e){}
}

function initTheme() {
  var saved = null;
  try { saved = localStorage.getItem("regex-theme"); } catch(e){}
  if (saved === "dark" || saved === "light") { setTheme(saved); }
  else { setTheme("dark"); }  // Default: dark
}


// ───────────────────────────────────────────────
// Drag-to-resize playground
// ───────────────────────────────────────────────

function initDragResize() {
  var handle = $("#dragHandle");
  var panel  = $("#playground");
  if (!handle || !panel) return;
  var dragging = false, startX, startW;

  handle.addEventListener("mousedown", function(e) {
    e.preventDefault(); dragging = true;
    startX = e.clientX; startW = panel.offsetWidth;
    handle.classList.add("dragging");
    document.body.classList.add("dragging");
  });
  document.addEventListener("mousemove", function(e) {
    if (!dragging) return;
    var newW = Math.min(700, Math.max(360, startW + (startX - e.clientX)));
    panel.style.width = newW + "px";
  });
  document.addEventListener("mouseup", function() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove("dragging");
    document.body.classList.remove("dragging");
  });
}


// ───────────────────────────────────────────────
// Progress tracking
// ───────────────────────────────────────────────

function getTotalLessons() {
  var c = 0; LESSONS.forEach(function(g){ c += g.items.length; }); return c;
}

function updateProgressBars() {
  var lb = $("#learn-progress");
  if (lb) {
    var t = getTotalLessons(), v = Object.keys(state.visitedLessons).length;
    lb.querySelector(".progress-fill").style.width = (t>0?Math.round((v/t)*100):0)+"%";
    lb.querySelector(".progress-text").textContent = v+" / "+t+" explored";
  }
  var cb = $("#challenge-progress");
  if (cb) {
    var t = CHALLENGES.length, d = Object.keys(state.challengeStatus).length;
    cb.querySelector(".progress-fill").style.width = (t>0?Math.round((d/t)*100):0)+"%";
    cb.querySelector(".progress-text").textContent = d+" / "+t+" completed";
  }
}


// ───────────────────────────────────────────────
// Pattern explainer
// ───────────────────────────────────────────────

function explainPattern(pattern) {
  if (!pattern) return [];
  var tokens = [], rem = pattern;
  while (rem.length > 0) {
    var matched = false;
    for (var i = 0; i < EXPLAIN_TOKENS.length; i++) {
      var rule = EXPLAIN_TOKENS[i], m = rem.match(rule.regex);
      if (m) {
        if (rule.build) { var b = rule.build(m); tokens.push({label:b.label,meaning:b.meaning}); }
        else { tokens.push({label:rule.label||m[0],meaning:rule.meaning||('literal "'+m[0]+'"')}); }
        rem = rem.substring(m[0].length); matched = true; break;
      }
    }
    if (!matched) { tokens.push({label:rem.charAt(0),meaning:'literal "'+rem.charAt(0)+'"'}); rem=rem.substring(1); }
  }
  return tokens;
}

function renderExplainer(pattern) {
  var el = $("#pgExplainer");
  if (!el) return;
  if (!pattern) { el.innerHTML=""; el.style.display="none"; return; }
  var tokens = explainPattern(pattern);
  if (!tokens.length) { el.style.display="none"; return; }
  var html = '<div class="explainer-label">Pattern breakdown</div><div class="explainer-tokens">';
  tokens.forEach(function(t) {
    html += '<div class="explainer-token"><span class="explainer-sym">'+esc(t.label)+'</span><span class="explainer-meaning">'+esc(t.meaning)+'</span></div>';
  });
  el.innerHTML = html+'</div>'; el.style.display="block";
}


// ───────────────────────────────────────────────
// Mascot messages
// ───────────────────────────────────────────────

var FETCH_MESSAGES = [
  "Fetched! Found your pattern in {n} place{s}.",
  "Got 'em! {n} match{es} found.",
  "Found {n} result{s} — nice pattern!",
  "Sniffed out {n} match{es}!",
];
var ZERO_MESSAGES = [
  "Hmm, no matches. Try adjusting your pattern.",
  "Came back empty — the pattern didn't match anything.",
  "Nothing found. Maybe check your escaping?",
];

function pickMsg(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function formatFetchMsg(count) {
  if (count===0) return pickMsg(ZERO_MESSAGES);
  return pickMsg(FETCH_MESSAGES).replace("{n}",count).replace("{s}",count!==1?"s":"").replace("{es}",count!==1?"es":"");
}


// ───────────────────────────────────────────────
// Playground engine
// ───────────────────────────────────────────────

function getFlags() {
  var f="";
  if($("#flagG").checked) f+="g";
  if($("#flagI").checked) f+="i";
  if($("#flagM").checked) f+="m";
  return f;
}

function runPlayground() {
  var pattern=$("#pgPattern").value, text=$("#pgText").value, flags=getFlags(), el=$("#pgResults"), src=getMascotSrc();
  renderExplainer(pattern);

  if (!pattern) {
    el.innerHTML='<div class="idle-state"><img src="'+src+'" alt="Rex waiting"><div class="idle-text">Type a pattern and I\'ll fetch the matches\u2026</div></div>';
    return;
  }

  try {
    var regex=new RegExp(pattern,flags), matches=[], m;
    if (flags.includes("g")) { while((m=regex.exec(text))!==null){matches.push({text:m[0],index:m.index});if(m[0].length===0)regex.lastIndex++;} }
    else { m=regex.exec(text); if(m)matches.push({text:m[0],index:m.index}); }

    var hl="",last=0;
    matches.forEach(function(match){
      hl+=esc(text.substring(last,match.index))+'<span class="match-hl">'+esc(match.text)+'</span>';
      last=match.index+match.text.length;
    });
    hl+=esc(text.substring(last));

    var html='<div class="fetch-row"><div class="fetch-mascot"><img src="'+src+'" alt="Rex"></div>';
    html+='<div class="fetch-bubble"><div class="fetch-msg"><strong>'+formatFetchMsg(matches.length)+'</strong></div></div></div>';
    html+='<div class="'+(matches.length===0?"match-count zero":"match-count")+'">'+matches.length+' match'+(matches.length!==1?'es':'')+'</div>';
    html+='<div class="highlighted-text">'+hl+'</div>';
    if(matches.length>0&&matches.length<=20){
      html+='<div class="match-badges">';
      matches.forEach(function(match){html+='<span class="match-badge">&quot;'+esc(match.text)+'&quot;</span>';});
      html+='</div>';
    }
    el.innerHTML=html;
  } catch(err) {
    el.innerHTML='<div class="fetch-row"><div class="fetch-mascot"><img src="'+src+'" alt="Rex"></div><div class="fetch-bubble"><div class="fetch-msg"><strong>Ruh roh!</strong> '+esc(err.message)+'</div></div></div>';
  }
}

function loadIntoPlayground(pattern,text) {
  $("#pgPattern").value=pattern; $("#pgText").value=text; runPlayground();
  if(window.innerWidth<1024){$("#playground").classList.add("open");$("#mobileOverlay").style.display="block";}
}


// ───────────────────────────────────────────────
// Render: Learn mode — collapsible accordion
// ───────────────────────────────────────────────

function renderLearn() {
  // Default: first group expanded
  if (Object.keys(state.expandedGroups).length === 0) {
    state.expandedGroups[LESSONS[0].group] = true;
  }

  var html = '';
  html += '<div class="progress-bar" id="learn-progress">';
  html +=   '<div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>';
  html +=   '<span class="progress-text">0 / '+getTotalLessons()+' explored</span>';
  html += '</div>';

  var num = 0;
  LESSONS.forEach(function(group) {
    var expanded = state.expandedGroups[group.group] ? true : false;
    var visitedInGroup = 0;
    group.items.forEach(function(l){ if(state.visitedLessons[l.id]) visitedInGroup++; });

    html += '<div class="accordion-group'+(expanded?' open':'')+'" data-group="'+esc(group.group)+'">';

    // Accordion header
    html += '<button class="accordion-header" data-group="'+esc(group.group)+'">';
    html += '<span class="accordion-arrow">'+(expanded?'▼':'▶')+'</span>';
    html += '<span class="accordion-title">'+group.group+'</span>';
    html += '<span class="accordion-count">'+visitedInGroup+' / '+group.items.length+'</span>';
    html += '</button>';

    // Accordion body
    html += '<div class="accordion-body"'+(expanded?'':' style="display:none"')+'>';

    group.items.forEach(function(lesson) {
      num++;
      var vis = state.visitedLessons[lesson.id] ? " visited" : "";
      html +=
        '<div class="lesson-card'+vis+'" data-lesson="'+lesson.id+'">' +
          '<div class="lesson-top-row">' +
            '<span class="lesson-number">'+num+'</span>' +
            '<span class="lesson-visited-dot'+(vis?' show':'')+'"></span>' +
          '</div>' +
          '<h3>'+lesson.title+'</h3>' +
          '<p>'+lesson.desc+'</p>' +
          '<span class="pattern-preview">'+esc(lesson.pattern)+'</span>' +
          '<button class="python-toggle" data-pyid="'+lesson.id+'">Python</button>' +
          '<div class="python-block" id="py-'+lesson.id+'">' +
            '<div class="python-header">Python equivalent</div>' +
            '<pre class="python-code">'+esc(lesson.python)+'</pre>' +
          '</div>' +
        '</div>';
    });

    html += '</div></div>'; // close body + group
  });

  $("#panel-learn").innerHTML = html;

  // Accordion toggle
  $$(".accordion-header").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var group = this.dataset.group;
      state.expandedGroups[group] = !state.expandedGroups[group];
      renderLearn();
      updateProgressBars();
    });
  });

  // Lesson card clicks
  $$(".lesson-card").forEach(function(card) {
    card.addEventListener("click", function(e) {
      if (e.target.classList.contains("python-toggle")) return;
      selectLesson(this.dataset.lesson);
    });
  });

  // Python toggles
  $$(".python-toggle").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      var block = $("#py-"+this.dataset.pyid);
      block.classList.toggle("show");
      this.classList.toggle("active");
    });
  });
}

function selectLesson(id) {
  $$(".lesson-card").forEach(function(c){c.classList.remove("active");});
  var card = $('[data-lesson="'+id+'"]');
  if (card) {
    card.classList.add("active");
    if (!state.visitedLessons[id]) {
      state.visitedLessons[id] = true;
      card.classList.add("visited");
      var dot = card.querySelector(".lesson-visited-dot");
      if (dot) dot.classList.add("show");
      // Update group count in header
      var groupEl = card.closest(".accordion-group");
      if (groupEl) {
        var groupName = groupEl.dataset.group;
        var group = LESSONS.find(function(g){return g.group===groupName;});
        if (group) {
          var cnt = 0;
          group.items.forEach(function(l){if(state.visitedLessons[l.id])cnt++;});
          var countEl = groupEl.querySelector(".accordion-count");
          if (countEl) countEl.textContent = cnt+" / "+group.items.length;
        }
      }
      updateProgressBars();
    }
  }
  LESSONS.forEach(function(g){
    g.items.forEach(function(l){if(l.id===id)loadIntoPlayground(l.pattern,l.text);});
  });
}


// ───────────────────────────────────────────────
// Render: Reference
// ───────────────────────────────────────────────

function renderReference() {
  var html = '<input type="text" class="ref-search" id="refSearch" placeholder="Search patterns… (e.g. digit, tab, boundary)">';
  REFERENCE.forEach(function(cat) {
    html += '<div class="ref-category"><h3>'+cat.cat+'</h3><div class="ref-grid">';
    cat.items.forEach(function(item) {
      var sp = item.pattern.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
      var st = item.text.replace(/'/g,"\\'");
      html += '<div class="ref-card" data-search="'+(item.sym+" "+item.meaning).toLowerCase()+'" data-pattern=\''+sp+'\' data-text=\''+st+'\'>' +
              '<div class="symbol">'+esc(item.sym)+'</div><div class="meaning">'+item.meaning+'</div></div>';
    });
    html += '</div></div>';
  });
  $("#panel-reference").innerHTML = html;

  $("#refSearch").addEventListener("input", function(){
    var q=this.value.toLowerCase();
    $$(".ref-card").forEach(function(c){c.style.display=c.dataset.search.includes(q)?"":"none";});
  });
  $$(".ref-card").forEach(function(c){
    c.addEventListener("click", function(){
      loadIntoPlayground(this.dataset.pattern.replace(/\\\\/g,"\\"), this.dataset.text);
    });
  });
}


// ───────────────────────────────────────────────
// Render: Challenges
// ───────────────────────────────────────────────

function renderChallenges() {
  var labels={starter:"Starter",intermediate:"Intermediate",applied:"Applied — Fraud Detection"};
  var html='';
  html+='<div class="progress-bar" id="challenge-progress"><div class="progress-track"><div class="progress-fill" style="width:0%"></div></div><span class="progress-text">0 / '+CHALLENGES.length+' completed</span></div>';
  html+='<div class="nlp-callout"><strong>Why regex for NLP?</strong> Regular expressions are the first tool in every text processing pipeline. In forensic accounting and fraud detection, regex helps you extract dollar amounts, flag suspicious patterns, and parse transaction logs automatically.</div>';

  Object.keys(labels).forEach(function(diff){
    html+='<div class="section-heading">'+labels[diff]+'</div>';
    CHALLENGES.filter(function(c){return c.diff===diff;}).forEach(function(ch){
      var done=state.challengeStatus[ch.id]==="success";
      html+='<div class="challenge-card'+(done?" completed":"")+'" id="card-'+ch.id+'">' +
        '<div class="challenge-header"><span class="challenge-diff diff-'+ch.diff+'">'+ch.diff+'</span>'+(done?' <span class="challenge-status">&#10003;</span>':'')+'</div>' +
        '<h3>'+ch.title+'</h3><div class="desc">'+ch.desc+'</div>' +
        '<div class="challenge-actions">' +
          '<button class="btn btn-primary" data-action="start" data-id="'+ch.id+'">Try It</button>' +
          '<button class="btn btn-outline" data-action="hint" data-id="'+ch.id+'">Hint</button>' +
          '<button class="btn btn-check" data-action="check" data-id="'+ch.id+'">Check Answer</button>' +
        '</div>' +
        '<div class="hint-text" id="hint-'+ch.id+'"></div>' +
        '<div class="challenge-feedback" id="fb-'+ch.id+'"></div></div>';
    });
  });

  $("#panel-challenge").innerHTML=html;
  $$("#panel-challenge .btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id=this.dataset.id, action=this.dataset.action;
      if(action==="start")startChallenge(id);
      if(action==="hint")showHint(id);
      if(action==="check")checkChallenge(id);
    });
  });
}

function findChallenge(id){return CHALLENGES.find(function(c){return c.id===id;});}

function startChallenge(id){
  var ch=findChallenge(id);if(!ch)return;
  state.activeChallenge=id;
  loadIntoPlayground("",ch.text);
  $("#pgPattern").focus();
  var label=$("#pgChallengeLabel");
  if(label){label.textContent="Working on: "+ch.title;label.style.display="block";}
  $$(".challenge-card").forEach(function(c){c.classList.remove("active-challenge");});
  $("#card-"+id).classList.add("active-challenge");
}

function showHint(id){
  var ch=findChallenge(id);if(!ch)return;
  var level=state.challengeHints[id]||0, el=$("#hint-"+id);
  if(level<ch.hints.length){el.textContent="Hint "+(level+1)+": "+ch.hints[level];el.classList.add("visible");state.challengeHints[id]=level+1;}
  else{el.textContent="Solution: "+ch.solution;el.classList.add("visible");}
}

function checkChallenge(id){
  var ch=findChallenge(id);if(!ch)return;
  var fb=$("#fb-"+id),pattern=$("#pgPattern").value,text=ch.text;
  if(!pattern){fb.className="challenge-feedback feedback-tryagain";fb.textContent='Click "Try It" first, then type your pattern in the playground.';return;}
  try{
    var regex=new RegExp(pattern,"g"),found=[],m;
    while((m=regex.exec(text))!==null){found.push(m[0]);if(m[0].length===0)regex.lastIndex++;}
    var es=ch.expected.slice().sort(),fs=found.slice().sort();
    var ok=es.length===fs.length&&es.every(function(v,i){return v===fs[i];});
    if(ok){
      fb.className="challenge-feedback feedback-success";
      fb.textContent="Correct! Your pattern matched all "+ch.expected.length+" expected results.";
      state.challengeStatus[id]="success";
      $("#card-"+id).classList.add("completed");
      var hdr=$("#card-"+id+" .challenge-header");
      if(hdr&&!hdr.querySelector(".challenge-status")){var sp=document.createElement("span");sp.className="challenge-status";sp.innerHTML="&#10003;";hdr.appendChild(sp);}
      updateProgressBars();
    } else {
      fb.className="challenge-feedback feedback-tryagain";
      var msg="Not quite — you found "+found.length+" match"+(found.length!==1?"es":"")+", expected "+ch.expected.length+".";
      if(found.length>0&&found.length<=8)msg+=" You matched: "+found.map(function(f){return "\u201C"+f+"\u201D";}).join(", ")+".";
      if(found.length>ch.expected.length)msg+=" Your pattern is too broad.";
      else if(found.length<ch.expected.length)msg+=" Your pattern is too narrow.";
      fb.textContent=msg;
    }
  }catch(err){fb.className="challenge-feedback feedback-tryagain";fb.textContent="Pattern error: "+err.message;}
}


// ───────────────────────────────────────────────
// Render: Cheat Sheet
// ───────────────────────────────────────────────

function renderCheatSheet() {
  var html="";
  CHEATSHEET.forEach(function(section){
    html+='<table class="cheat-table"><thead><tr><th colspan="3">'+section.title+'</th></tr><tr><th>Pattern</th><th>Meaning</th><th>Example</th></tr></thead><tbody>';
    section.rows.forEach(function(r){html+='<tr><td><code>'+r[0]+'</code></td><td>'+r[1]+'</td><td class="example">'+r[2]+'</td></tr>';});
    html+='</tbody></table>';
  });
  html+='<div class="nlp-callout"><strong>Regex in your NLP toolkit:</strong> In spaCy, you can use regex patterns to define custom entity recognition rules. NLTK\'s RegexpTokenizer lets you tokenize text using regex. In scikit-learn, CountVectorizer accepts a custom token_pattern regex. Regex is the foundation of text preprocessing in every NLP pipeline you\'ll build in this course.</div>';
  $("#panel-cheatsheet").innerHTML=html;
}


// ───────────────────────────────────────────────
// Mode switching & mobile
// ───────────────────────────────────────────────

function switchMode(mode){
  state.activeMode=mode;
  $$(".mode-tab").forEach(function(t){t.classList.remove("active");});
  $('[data-mode="'+mode+'"]').classList.add("active");
  $$(".panel-section").forEach(function(p){p.classList.remove("active");});
  $("#panel-"+mode).classList.add("active");
  if(mode!=="challenge"){var l=$("#pgChallengeLabel");if(l)l.style.display="none";}
}

function closeMobilePlayground(){
  $("#playground").classList.remove("open");
  $("#mobileOverlay").style.display="none";
}


// ───────────────────────────────────────────────
// Init
// ───────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function(){
  initTheme(); initDragResize();
  renderLearn(); renderReference(); renderChallenges(); renderCheatSheet();

  ["pgPattern","pgText"].forEach(function(id){$("#"+id).addEventListener("input",runPlayground);});
  ["flagG","flagI","flagM"].forEach(function(id){$("#"+id).addEventListener("change",runPlayground);});

  $$(".mode-tab").forEach(function(tab){
    tab.addEventListener("click",function(){switchMode(this.dataset.mode);});
  });

  $("#themeToggle").addEventListener("click",function(){setTheme(state.theme==="light"?"dark":"light");});

  $("#mobileToggle").addEventListener("click",function(){
    var pg=$("#playground");
    if(pg.classList.contains("open")){closeMobilePlayground();}
    else{pg.classList.add("open");$("#mobileOverlay").style.display="block";}
  });
  $("#mobileOverlay").addEventListener("click",closeMobilePlayground);

  updateProgressBars(); runPlayground();
});