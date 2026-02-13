let currentLesson = 'intro';
let currentPatternCat = 'basics';

function switchTab(tab) {
    document.querySelectorAll('.mode').forEach(m => m.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function updateResults() {
    const pattern = document.getElementById('pattern').value;
    const text = document.getElementById('testText').value;
    let flags = '';
    if (document.getElementById('flagG').checked) flags += 'g';
    if (document.getElementById('flagI').checked) flags += 'i';
    if (document.getElementById('flagM').checked) flags += 'm';

    try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;

        if (flags.includes('g')) {
            while ((match = regex.exec(text)) !== null) {
                matches.push({ text: match[0], index: match.index });
            }
        } else {
            match = regex.exec(text);
            if (match) {
                matches.push({ text: match[0], index: match.index });
            }
        }

        let highlighted = '';
        let lastIndex = 0;
        matches.forEach(function(m) {
            highlighted += text.substring(lastIndex, m.index);
            highlighted += '<span class="match">' + m.text + '</span>';
            lastIndex = m.index + m.text.length;
        });
        highlighted += text.substring(lastIndex);

        let badges = '';
        matches.forEach(function(m) {
            badges += '<div class="badge">"' + m.text + '"</div>';
        });

        let html = '<div class="count">Found ' + matches.length + ' match' + (matches.length !== 1 ? 'es' : '') + '</div>';
        html += '<div class="highlighted">' + highlighted + '</div>';
        if (badges) html += '<div style="margin-top: 0.8rem;">' + badges + '</div>';

        document.getElementById('results').innerHTML = html;
    } catch (err) {
        document.getElementById('results').innerHTML = '<div class="error">Error: ' + err.message + '</div>';
    }
}

function loadLesson(key) {
    currentLesson = key;
    document.querySelectorAll('.lesson-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-lesson="' + key + '"]').classList.add('active');
    const lesson = lessons[key];
    document.getElementById('lessonContent').innerHTML = '<h3>' + lesson.title + '</h3><div class="lesson-content">' + lesson.content + '</div>';
}

function loadPatterns(cat) {
    currentPatternCat = cat;
    document.querySelectorAll('.pattern-cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-cat="' + cat + '"]').classList.add('active');
    const pats = patterns[cat];
    let html = '';
    pats.items.forEach(function(p) {
        html += '<div class="card"><h4><code>' + p.symbol + '</code></h4><p>' + p.meaning + '</p><p style="color: #888;"><em>Example: ' + p.example + '</em></p></div>';
    });
    document.getElementById('patternGrid').innerHTML = html;
}

function setTest(pattern, text) {
    document.getElementById('pattern').value = pattern;
    document.getElementById('testText').value = text;
    updateResults();
}

function initPage() {
    // Lessons
    let lessonHTML = '';
    for (let key in lessons) {
        lessonHTML += '<button class="lesson-btn' + (key === 'intro' ? ' active' : '') + '" data-lesson="' + key + '" onclick="loadLesson(\'' + key + '\')">' + lessons[key].title + '</button>';
    }
    document.getElementById('lessonList').innerHTML = lessonHTML;

    // Pattern categories
    let catHTML = '';
    for (let cat in patterns) {
        catHTML += '<button class="pattern-cat-btn' + (cat === 'basics' ? ' active' : '') + '" data-cat="' + cat + '" onclick="loadPatterns(\'' + cat + '\')">' + patterns[cat].name + '</button>';
    }
    document.getElementById('patternCats').innerHTML = catHTML;

    // Practice
    let practiceHTML = '';
    exercises.forEach(function(ex) {
        practiceHTML += '<div class="card"><h4>' + ex.title + '</h4><p>' + ex.desc + '</p><p style="color: #999; font-size: 0.85rem;">Test: ' + ex.text + '</p><p style="color: #FFB84D; font-size: 0.85rem;">Hint: <code>' + ex.hint + '</code></p><button onclick="setTest(\'' + ex.hint.replace(/\\/g, '\\\\') + '\', \'' + ex.text.replace(/'/g, "\\'") + '\')">Try It</button></div>';
    });
    document.getElementById('practiceGrid').innerHTML = practiceHTML;

    // Real-world
    let rwHTML = '';
    realWorld.forEach(function(rw) {
        rwHTML += '<div class="card"><h4>' + rw.name + '</h4><p style="color: #888;"><code>' + rw.pattern + '</code></p><p style="color: #999; font-size: 0.85rem;">Example: ' + rw.example + '</p><button onclick="setTest(\'' + rw.pattern.replace(/\\/g, '\\\\') + '\', \'' + rw.example + '\')">Try It</button></div>';
    });
    document.getElementById('realworldGrid').innerHTML = rwHTML;

    // Load initial lesson and patterns
    loadLesson('intro');
    loadPatterns('basics');
    updateResults();
}

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    
    document.getElementById('pattern').addEventListener('input', updateResults);
    document.getElementById('testText').addEventListener('input', updateResults);
    document.getElementById('flagG').addEventListener('change', updateResults);
    document.getElementById('flagI').addEventListener('change', updateResults);
    document.getElementById('flagM').addEventListener('change', updateResults);
});
