/* Writing Practice – INTERMEDIATE content (controlled writing). Same formats as content-beginner.js. */
(function () {
  "use strict";
  const { pick, shuffle } = SK;
  const L = WP.LETTERS, U = WP.UPPER, Lo = WP.LOWER;
  const CVC = [["cat", "🐱"], ["bat", "🦇"], ["mat", "🧘"], ["hat", "🎩"], ["pen", "🖊️"], ["hen", "🐔"], ["dog", "🐶"], ["sun", "☀️"], ["cup", "☕"], ["bus", "🚌"], ["pig", "🐷"], ["box", "📦"], ["bed", "🛏️"], ["fan", "🪭"], ["net", "🥅"], ["jug", "🫗"], ["fox", "🦊"], ["map", "🗺️"], ["ant", "🐜"], ["egg", "🥚"]].filter((w) => w[0].length === 3 && w[0] !== "ant" && w[0] !== "egg");
  const WORDS = [["fish", "🐟"], ["ship", "🚢"], ["frog", "🐸"], ["milk", "🥛"], ["tree", "🌳"], ["star", "⭐"], ["book", "📘"], ["duck", "🦆"], ["kite", "🪁"], ["cake", "🎂"], ["moon", "🌙"], ["ball", "⚽"], ["apple", "🍎"], ["house", "🏠"], ["train", "🚆"], ["mango", "🥭"]];
  WP.CVC = CVC; WP.WORDS = WORDS;
  const emo = (e) => `<span class="wp-emo">${e}</span>`;
  const norm = (s) => s.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();

  WP.add({
    id: "alphabet", level: "intermediate", name: "Alphabet Formation", icon: "🅰️",
    short: "Tracing every capital and small letter with stroke order, start points and arrows.",
    objective: "Form each letter correctly: right starting point, stroke order and direction.",
    skills: ["Letter formation", "Stroke order", "Letter recognition", "Spotting mistakes"],
    outcome: "The child forms letters from memory with the correct start point and direction.",
    assess: ["Starts at the right point", "Uses the right stroke order", "Letters sit on the base line", "Writes the letter without a model"],
    support: ["Trace in sand or with a finger first.", "Practise one letter family at a time.", "Use bigger lines and Show me often."],
    teacher: ["Use ‘👀 Show me’ to model the stroke order.", "Let children say the stroke: ‘down, up, round’.", "Check reversals (b/d, p/q) with the ‘Spot the wrong one’ game."],
    diff: { Easy: "Trace with arrows; one letter.", Medium: "Trace then write once on own.", Difficult: "Write from memory; spot wrongly formed letters." },
    subs: { upper: "Capital letters", lower: "Small letters", check: "Recognition and checking" },
    ws: ["alpha", "assamese"],
    acts: [
      ["Letter of the day", "lower", "PDW", 15, "Alphabet worksheet, sand tray", ["Introduce the letter with a picture and sound.", "Show the stroke order on the board.", "Trace 3 times, then write 3 times alone.", "Find the letter in a book."], "Watch, trace, then write it yourself.", null, null],
      ["Capital letter tracing", "upper", "DW", 10, "Uppercase worksheet", ["Trace capitals with straight lines first (L, T, E, F, H, I).", "Then slanting (A, K, M, N, V, W, X, Y, Z).", "Then curves (B, C, D, G, J, O, P, Q, R, S, U)."], "Start at the green dot.", null, null],
      ["Sky-writing letters", "upper", "PG", 5, "None", ["Write a big letter in the air with a straight arm.", "Children copy and say each stroke.", "Guess the letter the teacher writes in the air."], "Write the letter in the sky!", null, null],
      ["Letter recognition hunt", "check", "PDG", 8, "Letter cards around the room", ["Hide letter cards.", "Call a letter; children find and bring it.", "Use the on-screen ‘Find it’ game."], "Find the letter I say!", null, null],
      ["Spot the wrong letter", "check", "DWG", 6, "Cards with correct and reversed letters", ["Show 4 letters, one written the wrong way.", "Children find the wrong one.", "Discuss b/d and p/q."], "Which letter is written the wrong way?", null, null],
      ["Independent letter writing", "lower", "DW", 10, "Four-line paper", ["Say a letter; children write it without a model.", "Check start point and size.", "Children check with a partner."], "Write the letter I say.", null, null]
    ],
    practice: [{ id: "lab", t: "Letter lab", w: "letterlab", about: "Trace, write alone, find it and spot wrong letters for each letter.", cfg: { sets: { "Capital A–Z": U, "Small a–z": Lo } } },
      { id: "assamese", t: "Assamese letters", w: "fonttrace", about: "Trace every Assamese vowel and consonant.", cfg: { items: WP.ASSAMESE.vowels.concat(WP.ASSAMESE.consonants), font: "'Noto Sans Bengali'" } }]
  });

  const caseRound = () => { const s = shuffle(U).slice(0, 4); return { prompt: "Drag each small letter to its capital letter.", items: s.map((c) => ({ h: `<span class="wp-L sm">${c.toLowerCase()}</span>`, k: c })), bins: s.map((c) => ({ h: `<span class="wp-L">${c}</span>`, k: c })) }; };
  WP.add({
    id: "case-match", level: "intermediate", name: "Uppercase and Lowercase", icon: "🔠",
    short: "Matching capital and small letters (A–a, B–b…).",
    objective: "Know which capital and small letters belong together.",
    skills: ["Letter pairs", "Visual matching", "Letter names"],
    outcome: "The child matches all capital and small letter pairs quickly.",
    assess: ["Matches letter pairs correctly", "Names the letters", "Finds missing pairs"],
    support: ["Start with pairs that look alike (C c, O o, S s).", "Use fewer pairs.", "Say the letter name while matching."],
    teacher: ["Teach look-alike pairs first, then different ones (A a, G g, R r).", "Use the drag-and-drop game daily for 5 minutes."],
    diff: { Easy: "Look-alike pairs only.", Medium: "Mixed pairs, 4 at a time.", Difficult: "All pairs; write the missing partner." },
    subs: { match: "Matching", missing: "Missing pairs" },
    ws: ["updown"],
    acts: [
      ["Letter pair matching cards", "match", "PG", 8, "Capital and small letter cards", ["Mix the cards.", "Children find the partner of each card.", "Say both letter names."], "Find the partner letter!", null, null],
      ["Drag and drop matching", "match", "D", 6, "The on-screen game", ["Children drag small letters to the capitals.", "Repeat with new letters."], "Drag a to A.", null, null],
      ["Missing partner", "missing", "DW", 8, "Worksheet", ["Show a capital letter; children write the small one.", "Then the other way round."], "Write the partner letter.", null, null],
      ["Letter pairs memory game", "match", "PG", 10, "Letter pair cards face down", ["Turn two cards.", "Keep them if they are a capital–small pair."], "Find A and a!", null, null],
      ["Draw a line to match", "match", "W", 8, "Matching worksheet", ["Two columns of letters.", "Draw lines to match each pair."], "Draw a line from A to a.", null, null]
    ],
    practice: [
      { id: "drag", t: "Drag to match", w: "dragsort", cfg: { gen: caseRound, cols: 4 } },
      { id: "lines", t: "Draw lines to match", w: "pairs", cfg: { gen: () => { const s = shuffle(U).slice(0, 5); return { prompt: "Tap a capital letter, then its small letter.", pairs: s.map((c) => [`<span class="wp-L sm">${c}</span>`, `<span class="wp-L sm">${c.toLowerCase()}</span>`]) }; } } },
      { id: "missing", t: "Missing partner", w: "quiz", cfg: { gen: () => { const c = pick(U), up = Math.random() < .5, t = up ? c.toLowerCase() : c, opts = shuffle([t].concat(shuffle(U.filter((x) => x !== c)).slice(0, 3).map((x) => (up ? x.toLowerCase() : x)))); return { prompt: `What is the partner of <span class="wp-L">${up ? c : c.toLowerCase()}</span>?`, choices: opts.map((o) => ({ h: `<span class="wp-L">${o}</span>`, ok: o === t })) }; } } }
    ]
  });

  const GROUPS = { "c o a d g q": "coadgq", "l t i j": "ltij", "m n h r u": "mnhru", "v w x y k z": "vwxykz", "b p e f s": "bpefs" };
  WP.LETTER_GROUPS = GROUPS;
  WP.add({
    id: "letter-patterns", level: "intermediate", name: "Letter Patterns", icon: "🧩",
    short: "Letters grouped by the same writing movement: c-family, stick family, arch family, slant family.",
    objective: "Learn letters in groups that share the same movement, so one movement helps many letters.",
    skills: ["Movement families", "Letter formation", "Consistency"],
    outcome: "The child uses the same starting movement for all letters in a family.",
    assess: ["Uses the family movement (e.g. ‘over and round’ for c, a, d)", "Keeps letters the same size", "Writes the whole group correctly"],
    support: ["Teach the first letter of the group well first.", "Trace big in sand before paper."],
    teacher: ["c-family: start at the top right, go over and round.", "Stick family: start at the top, go down.", "Arch family: down, back up and over."],
    diff: { Easy: "Trace the first two letters of a group.", Medium: "Trace the whole group.", Difficult: "Write the group from memory." },
    subs: { round: "Round letters", stick: "Stick letters", arch: "Arch letters", slant: "Slant letters" },
    ws: ["lgroups"],
    acts: [
      ["c-family (c o a d g q)", "round", "PDW", 10, "Worksheet", ["Show c: over and round.", "Turn c into o, a, d, g, q.", "Trace the row."], "Over and round!", null, null],
      ["Stick family (l t i j)", "stick", "PDW", 8, "Worksheet", ["Start at the top, go straight down.", "Add the cross for t, the dot for i and j."], "Start at the top, go down!", null, null],
      ["Arch family (m n h r u)", "arch", "PDW", 10, "Worksheet", ["Down, back up, over the hill.", "m has two hills; u is an upside-down arch."], "Down, up and over the hill!", null, null],
      ["Slant family (v w x y k z)", "slant", "PDW", 8, "Worksheet", ["Slide down, slide up.", "Practise v, then w, then x."], "Slide down, slide up!", null, null],
      ["Family sorting game", "round", "G", 8, "Letter cards, 4 family boxes", ["Children sort letter cards into family boxes.", "Explain why a letter belongs."], "Which family is this letter in?", null, null]
    ],
    practice: [{ id: "groups", t: "Trace a letter family", w: "trace", cfg: { options: Object.entries(GROUPS).map(([n, s]) => ({ label: n, glyphs: s.split("").map((c) => L[c]) })), maxH: 220, tip: "Trace the family. Notice the same starting movement." } }]
  });

  WP.add({
    id: "word-formation", level: "intermediate", name: "Word Formation", icon: "🔤",
    short: "Arranging letters, filling missing letters, matching pictures and writing names of objects.",
    objective: "Build words from letters and write the names of familiar objects.",
    skills: ["Letter order", "Spelling", "Picture–word link"],
    outcome: "The child builds and writes simple words for familiar objects.",
    assess: ["Puts letters in the right order", "Fills missing letters", "Writes the object name"],
    support: ["Say the word slowly, sound by sound.", "Use 3-letter words first.", "Show the first letter."],
    teacher: ["Always say the word aloud.", "Link to the picture each time.", "Let children check with the word card."],
    diff: { Easy: "3-letter words with a picture.", Medium: "4-letter words.", Difficult: "5-letter words without a picture." },
    subs: { build: "Building words", missing: "Missing letters", write: "Writing words" },
    ws: ["wordform", "missing"],
    acts: [
      ["Arrange letters to form words", "build", "PDW", 8, "Letter cards", ["Give the letters of a word, mixed up.", "Children arrange them.", "Read the word together."], "Put the letters in order to make the word.", null, null],
      ["Fill in the missing letter", "missing", "DW", 8, "Worksheet", ["Show c_t with a cat picture.", "Children write the missing letter."], "Which letter is missing?", null, null],
      ["Match pictures with words", "build", "DWG", 8, "Picture and word cards", ["Lay out pictures and words.", "Children match them."], "Match the word to its picture.", null, null],
      ["Write the name of the object", "write", "PDW", 10, "Real objects or pictures", ["Show an object.", "Children write its name.", "Check spelling with the word card."], "Look at the picture. Write its name.", null, null],
      ["Jumbled letters race", "build", "G", 10, "Jumbled word cards", ["Teams unscramble a word.", "First correct team gets a point."], "Unscramble the word!", null, null]
    ],
    practice: [
      { id: "arrange", t: "Arrange the letters", w: "builder", cfg: { rounds: 5, gen: () => { const [w, e] = pick(WORDS); return { prompt: `${emo(e)}<br>Make the word for this picture.`, pieces: w.split(""), answer: w.split(""), sep: "", say: w }; } } },
      { id: "missing", t: "Missing letter", w: "quiz", cfg: { gen: () => { const [w, e] = pick(WORDS.concat(CVC)), k = Math.floor(Math.random() * w.length), opts = shuffle([w[k]].concat(shuffle("aeioustmnprlbcdh".split("").filter((x) => x !== w[k])).slice(0, 3))); return { prompt: `${emo(e)}<div class="wp-word">${w.split("").map((c, i) => (i === k ? "<u>_</u>" : c)).join(" ")}</div>`, say: w, choices: opts.map((o) => ({ h: `<span class="wp-L">${o}</span>`, ok: o === w[k] })) }; } } },
      { id: "match", t: "Match picture and word", w: "quiz", cfg: { gen: () => { const set = shuffle(WORDS).slice(0, 3), t = pick(set); return { prompt: `${emo(t[1])}<br>Which word is this?`, choices: set.map(([w]) => ({ h: `<span class="wp-wordbtn">${w}</span>`, ok: w === t[0] })), cols: 3 }; } } },
      { id: "write", t: "Write the object's name", w: "typecheck", cfg: { gen: () => { const [w, e] = pick(WORDS); return { prompt: `${emo(e)}<br>Write the name of this.`, say: w, answer: w, check: (v) => (norm(v) === w ? { ok: true } : { ok: false, msg: `Not quite. It has ${w.length} letters and starts with “${w[0]}”.` }) }; } } }
    ]
  });

  WP.add({
    id: "cvc", level: "intermediate", name: "CVC Words", icon: "🐱",
    short: "Three-letter words like cat, pen, dog: picture, sound, build, trace and write.",
    objective: "Read, build and write consonant–vowel–consonant words.",
    skills: ["Sounding out", "Blending", "Spelling CVC words", "Writing words"],
    outcome: "The child spells and writes CVC words from hearing them.",
    assess: ["Says each sound", "Builds the word in order", "Writes the word correctly"],
    support: ["Tap each sound on a finger.", "Use one vowel family at a time (-at, -en).", "Show the picture and say the word slowly."],
    teacher: ["Use one vowel family per day.", "Say sounds, not letter names, when building.", "Pronunciation uses the browser's voice."],
    diff: { Easy: "One vowel family; picture shown.", Medium: "Mixed vowels.", Difficult: "Write from dictation without a picture." },
    subs: { hear: "Picture and sound", build: "Build and fill", write: "Trace and write" },
    ws: ["cvc", "missing"],
    acts: [
      ["Picture and sound", "hear", "PD", 6, "CVC picture cards", ["Show a picture.", "Say the word slowly: c–a–t.", "Children repeat and tap the sounds."], "Say the sounds: c–a–t, cat!", null, null],
      ["Build the CVC word", "build", "PDG", 8, "Letter tiles", ["Say a word.", "Children build it with tiles.", "Read it back."], "Build the word with letters.", null, null],
      ["Missing vowel", "build", "DW", 8, "Worksheet", ["Show c_t, p_n, d_g.", "Children fill the vowel."], "Which vowel is missing?", null, null],
      ["Trace the word", "write", "DW", 8, "CVC worksheet", ["Trace the dotted word under the picture.", "Write it once alone."], "Trace the word, then write it.", null, null],
      ["CVC bingo", "hear", "G", 12, "Bingo cards with CVC words", ["Call a word.", "Children find and mark it.", "First full row wins."], "Listen and find the word!", null, null]
    ],
    practice: [
      { id: "listen", t: "Picture and sound", w: "quiz", cfg: { gen: () => { const set = shuffle(CVC).slice(0, 4), t = pick(set); return { prompt: "Listen. Tap the picture.", say: t[0], choices: set.map(([w, e]) => ({ h: emo(e), ok: w === t[0] })) }; } } },
      { id: "build", t: "Build the word", w: "builder", cfg: { gen: () => { const [w, e] = pick(CVC); return { prompt: `${emo(e)}<br>Build the word.`, pieces: w.split(""), answer: w.split(""), sep: "", say: w }; } } },
      { id: "vowel", t: "Missing vowel", w: "quiz", cfg: { gen: () => { const [w, e] = pick(CVC); return { prompt: `${emo(e)}<div class="wp-word">${w[0]} <u>_</u> ${w[2]}</div>`, say: w, choices: "aeiou".split("").map((v) => ({ h: `<span class="wp-L">${v}</span>`, ok: v === w[1] })), cols: 5 }; } } },
      { id: "trace", t: "Trace the word", w: "fonttrace", cfg: { items: CVC.map((w) => w[0]) } },
      { id: "write", t: "Write it", w: "typecheck", cfg: { gen: () => { const [w, e] = pick(CVC); return { prompt: `${emo(e)}<br>Listen and write the word.`, say: w, answer: w, check: (v) => (norm(v) === w ? { ok: true } : { ok: false, msg: "Say the sounds again slowly and try once more." }) }; } } }
    ]
  });

  const SPACED = ["The cat sat on the mat.", "I can see a red bus.", "My dog likes to run.", "We go to school.", "The sun is hot today.", "I have a big ball.", "She reads a book.", "The bird can fly."];
  WP.SENTENCES = SPACED;
  const badSpace = (s) => { const w = s.split(" "), k = 1 + Math.floor(Math.random() * (w.length - 1)); return pick([w.slice(0, k).join(" ") + w.slice(k).join(" ").replace(/^/, ""), s.replace(/ /g, "  ").replace(/^(\S+)  /, "$1 "), w.join("")]); };
  WP.add({
    id: "spacing", level: "intermediate", name: "Spacing and Alignment", icon: "↔️",
    short: "Letters on the line, the same size, with finger spaces between words.",
    objective: "Write with even letter size, letters sitting on the base line and spaces between words.",
    skills: ["Finger spaces", "Letter size", "Line placement"],
    outcome: "The child leaves clear spaces between words and keeps letters on the line.",
    assess: ["Leaves a finger space between words", "Letters sit on the base line", "Tall and short letters are the right height"],
    support: ["Use a ‘spaceman’ stick or finger as a spacer.", "Write on wide four-line paper.", "Highlight the base line in red."],
    teacher: ["Teach: tall letters touch the top line; short letters stay between the middle and base line.", "Praise good spacing in children's work."],
    diff: { Easy: "Copy 3-word sentences with spacing dots shown.", Medium: "Copy 5-word sentences.", Difficult: "Rewrite unspaced sentences correctly." },
    subs: { spot: "Spot spacing", rewrite: "Rewrite", lines: "Writing on lines" },
    ws: ["spacing", "copy"],
    acts: [
      ["Finger-space writing", "lines", "PW", 10, "Four-line paper, a finger or spacer stick", ["Write a short sentence.", "Put a finger after each word before the next.", "Check spaces together."], "Put your finger down. Then write the next word.", null, null],
      ["Find the correctly spaced sentence", "spot", "DW", 6, "Sentence cards", ["Show 3 versions of a sentence.", "Children pick the one with correct spaces."], "Which sentence has good spaces?", null, null],
      ["Rewrite with spaces", "rewrite", "DW", 10, "Worksheet with joined-up sentences", ["Read ‘Thecatsatonthemat’ together.", "Find the words.", "Rewrite with spaces."], "Find the words. Write them with spaces.", null, null],
      ["Tall and short letter check", "lines", "PW", 8, "Four-line paper", ["Sort letters: tall (b, d, h, k, l, t), short (a, c, e, o…), tail (g, j, p, q, y).", "Write each group on the lines."], "Tall letters touch the top line!", null, null],
      ["Spacing detectives", "spot", "G", 8, "Sentences on the board with errors", ["Teams find spacing mistakes.", "One point for each mistake fixed."], "Find the spacing mistakes!", null, null]
    ],
    practice: [
      { id: "spot", t: "Which one is spaced well?", w: "quiz", cfg: { gen: () => { const s = pick(SPACED), opts = shuffle([s, badSpace(s), badSpace(s)].filter((x, i, a) => a.indexOf(x) === i)); return { prompt: "Which sentence has the right spaces between words?", choices: opts.map((o) => ({ h: `<span class="wp-sent">${o.replace(/  /g, "&nbsp;&nbsp;&nbsp;")}</span>`, ok: o === s })), cols: 1 }; } } },
      { id: "rewrite", t: "Rewrite with spaces", w: "typecheck", cfg: { gen: () => { const s = pick(SPACED); return { prompt: `Add the spaces:<br><span class="wp-sent">${s.replace(/ /g, "")}</span>`, answer: s, check: (v) => (v.replace(/\s+/g, " ").trim() === s ? { ok: true } : v.replace(/\s/g, "") !== s.replace(/\s/g, "") ? { ok: false, msg: "Keep the same letters; only add spaces." } : { ok: false, msg: "Check where each word ends." }) }; } } },
      { id: "lines", t: "Write on the lines", w: "drawpad", cfg: { modes: ["lines"], lineText: "I can write." } }
    ]
  });

  const COPY = { Easy: ["I am happy.", "A big dog.", "I see a cat.", "My red hat."], Medium: ["The sun is very hot.", "We play in the park.", "My mother cooks rice.", "Birds sing in the trees."], Difficult: ["Rahul and Asha walk to school every day.", "The farmer works hard in the green field.", "We must drink clean water to stay healthy."] };
  WP.COPY = COPY;
  WP.add({
    id: "copy", level: "intermediate", name: "Copy Writing", icon: "📋",
    short: "Copying words and sentences neatly, on screen or on printed sheets.",
    objective: "Copy words and sentences accurately with good letter formation and spacing.",
    skills: ["Accurate copying", "Visual memory", "Neatness"],
    outcome: "The child copies a sentence accurately with correct spacing and punctuation.",
    assess: ["Copies every letter correctly", "Keeps capital letters and full stops", "Leaves spaces between words"],
    support: ["Copy one word at a time.", "Place the model right above the writing line.", "Use larger lines."],
    teacher: ["Choose difficulty, custom text, font size and ruled or unruled paper in the Worksheets tab.", "Ask children to read the sentence before copying."],
    diff: { Easy: "3–4 word sentences.", Medium: "5–6 word sentences.", Difficult: "Longer sentences and two-sentence passages." },
    subs: { screen: "On screen", paper: "On paper" },
    ws: ["copy"],
    acts: [
      ["Copy from the board", "paper", "PW", 10, "Board, notebook", ["Write a sentence on the board.", "Children read it together.", "Children copy it, checking word by word."], "Read the sentence, then copy it.", null, null],
      ["Look, say, cover, write, check", "paper", "PW", 12, "Word list, notebook", ["Look at the word and say it.", "Cover it.", "Write it from memory.", "Check and correct."], "Look, say, cover, write, check!", null, null],
      ["On-screen copy", "screen", "D", 8, "The on-screen copy tool", ["Choose a level.", "The child types the sentence exactly.", "Mistakes show in red."], "Copy the sentence exactly.", null, null],
      ["Copy-writing worksheet", "paper", "W", 10, "Printed copy sheet", ["Print a sheet with your own text.", "Children copy under each model line."], "Write it again on the lines below.", null, null],
      ["Copy relay", "paper", "G", 10, "Sentence strips", ["Each team member copies one word on the team's board.", "Correct, neat sentences win."], "Copy one word, then pass the chalk!", null, null]
    ],
    practice: [{ id: "screen", t: "Copy on screen", w: "typecheck", about: "Choose a difficulty in the box below each round.", cfg: { rounds: 4, gen: () => { const lv = pick(["Easy", "Medium", "Difficult"]), s = pick(COPY[lv]); return { prompt: `<span class="badge">${lv}</span><br><span class="wp-sent">${s}</span><br>Copy it exactly.`, answer: s, check: (v) => { const a = v.replace(/\s+/g, " ").trim(); if (a === s) return { ok: true, msg: "Perfect copy!" }; let k = 0; while (k < a.length && a[k] === s[k]) k++; return { ok: false, msg: `Check from “${s.slice(k, k + 12)}”.` }; } }; } } }]
  });

  WP.add({
    id: "dictation", level: "intermediate", name: "Dictation", icon: "🎧",
    short: "The teacher enters words or sentences; the child listens and writes.",
    objective: "Listen carefully and write words and sentences correctly.",
    skills: ["Listening", "Spelling", "Sentence writing from hearing"],
    outcome: "The child writes dictated words and short sentences with growing accuracy.",
    assess: ["Writes the dictated words correctly", "Uses capitals and full stops in sentences", "Improves over repeated lists"],
    support: ["Use fewer words and repeat each one.", "Slow the speech rate.", "Give the first letter as a hint."],
    teacher: ["Save word lists and reuse them weekly.", "‘Paper’ mode lets children write in notebooks while you mark.", "Results and mistakes are saved per child."],
    diff: { Easy: "5 CVC words.", Medium: "8 words or 3 short sentences.", Difficult: "5 sentences with punctuation." },
    subs: { words: "Word dictation", sentences: "Sentence dictation" },
    ws: ["dictation"],
    acts: [
      ["Word dictation", "words", "PDW", 10, "Word list, dictation sheet", ["Say each word twice.", "Use it in a sentence.", "Children write; then mark together."], "Listen and write the word.", null, null],
      ["Sentence dictation", "sentences", "PDW", 12, "Sentence list", ["Read the whole sentence.", "Read it in parts.", "Read it again to check."], "Listen to the sentence. Write it.", null, null],
      ["Self-check dictation", "words", "PW", 10, "Notebook, word card", ["Children write the words.", "They check against the card and correct in another colour."], "Write it. Check it. Fix it.", null, null],
      ["Dictation detectives", "words", "G", 10, "Board, team cards", ["Read a word; teams write it.", "Teams check each other's spelling."], "Listen, write and check your team's word!", null, null]
    ],
    practice: [{ id: "dict", t: "Dictation", w: "dictation", about: "Enter words, play them aloud, check, and track mistakes.", cfg: { sample: ["cat", "pen", "sun", "dog", "The bus is red."] } }]
  });

  const PICS = [["🐶⚽", "dog, ball, plays", "The dog plays with a ball."], ["👧📖", "girl, reads, book", "The girl reads a book."], ["🐦🌳", "bird, sits, tree", "The bird sits in the tree."], ["👦🚲", "boy, rides, bike", "The boy rides a bike."], ["🐱🥛", "cat, drinks, milk", "The cat drinks milk."], ["👩‍🍳🍚", "mother, cooks, rice", "Mother cooks rice."]];
  WP.add({
    id: "guided-sentences", level: "intermediate", name: "Guided Sentence Writing", icon: "🧱",
    short: "Picture sentences, missing words, word order and complete answers.",
    objective: "Write simple sentences with support: picture prompts, word banks and frames.",
    skills: ["Sentence structure", "Capital letters and full stops", "Using given words"],
    outcome: "The child writes a simple sentence about a picture using a capital letter and full stop.",
    assess: ["Starts with a capital letter", "Ends with a full stop", "Words are in the right order", "Uses the given words"],
    support: ["Give a sentence frame: ‘The ___ is ___.’", "Say the sentence aloud before writing.", "Use word cards to build it first."],
    teacher: ["Model one sentence aloud, then write it together.", "Point to capital letters and full stops in every sentence."],
    diff: { Easy: "Complete one missing word.", Medium: "Arrange words; write one sentence.", Difficult: "Write two sentences about a picture." },
    subs: { picture: "Picture sentences", order: "Word order", answer: "Complete answers" },
    ws: ["sentences", "picture"],
    acts: [
      ["Picture-based sentence", "picture", "PDW", 10, "Picture cards", ["Show a picture.", "Ask ‘Who? What doing?’", "Children write one sentence."], "Look at the picture. Write one sentence.", null, null],
      ["Complete the missing word", "picture", "DW", 8, "Worksheet", ["Show ‘The cat drinks ___.’ with a picture.", "Children fill the word."], "Which word is missing?", null, null],
      ["Arrange words in order", "order", "PDG", 8, "Word cards", ["Give mixed word cards.", "Children arrange them into a sentence.", "Add the full stop."], "Put the words in the right order.", null, null],
      ["Make a sentence with given words", "order", "DW", 10, "Word sets", ["Give 3 words (dog, ball, plays).", "Children write a sentence using all of them."], "Use all three words in one sentence.", null, null],
      ["Answer in a complete sentence", "answer", "PDW", 10, "Questions", ["Ask ‘What colour is the sky?’", "Children answer: ‘The sky is blue.’ (not just ‘blue’)."], "Answer with a full sentence.", null, null]
    ],
    practice: [
      { id: "missing", t: "Missing word", w: "quiz", cfg: { gen: () => { const [e, w, s] = pick(PICS), words = s.replace(".", "").split(" "), k = words.length - 1, opts = shuffle([words[k]].concat(shuffle(["ball", "book", "tree", "bike", "milk", "rice"].filter((x) => x !== words[k])).slice(0, 2))); return { prompt: `${emo(e)}<div class="wp-sent">${words.slice(0, k).join(" ")} ____.</div>`, choices: opts.map((o) => ({ h: `<span class="wp-wordbtn">${o}</span>`, ok: o === words[k] })), cols: 3 }; } } },
      { id: "order", t: "Words in order", w: "builder", cfg: { gen: () => { const s = pick(SPACED), w = s.replace(".", "").split(" "); w[w.length - 1] += "."; return { prompt: "Put the words in the right order.", pieces: w, answer: w, sep: " ", say: s }; } } },
      { id: "given", t: "Make a sentence with these words", w: "typecheck", cfg: { gen: () => { const [e, w, s] = pick(PICS), list = w.split(", "); return { prompt: `${emo(e)}<br>Use these words: <b>${list.join(", ")}</b>`, answer: s, multi: false, check: (v) => { const miss = list.filter((x) => !v.toLowerCase().includes(x)); if (miss.length) return { ok: false, msg: "Use the word: " + miss[0] }; if (!/^[A-Z]/.test(v)) return { ok: false, msg: "Start with a capital letter." }; if (!/[.!?]$/.test(v)) return { ok: false, msg: "End with a full stop." }; return { ok: true, msg: "Great sentence!" }; } }; } } },
      { id: "answer", t: "Answer in a full sentence", w: "typecheck", cfg: { gen: () => { const q = pick([["What colour is the sky?", "sky"], ["What do you drink?", "drink"], ["Where do you live?", "live"], ["What is your favourite fruit?", "fruit"], ["Who is your best friend?", "friend"], ["What do birds do?", "birds"]]); return { prompt: `<b>${q[0]}</b><br><span class="small muted">Answer with a full sentence.</span>`, say: q[0], answer: "A full sentence that uses words from the question, e.g. “The sky is blue.”", check: (v) => (v.split(/\s+/).length < 3 ? { ok: false, msg: "Write a full sentence, not one word." } : !/^[A-Z]/.test(v) ? { ok: false, msg: "Start with a capital letter." } : !/[.!?]$/.test(v) ? { ok: false, msg: "End with a full stop." } : !v.toLowerCase().includes(q[1]) ? { ok: false, msg: `Use the word “${q[1]}” from the question.` } : { ok: true, msg: "That is a complete sentence!" }) }; } } },
      { id: "picture", t: "Write about a picture", w: "writepad", cfg: { min: 6, prompts: PICS.map(([e, w]) => ({ title: "Picture " + e, intro: `<div class="wp-scene">${e}</div>`, questions: ["Who is in the picture?", "What are they doing?"], words: w.split(", "), min: 5 })) } }
    ]
  });
})();
