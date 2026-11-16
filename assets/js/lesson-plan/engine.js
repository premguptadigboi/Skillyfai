/* Skillyfai Lesson Plan Generator: template-based generation engine (no AI service).
   generate(input, seed) returns a plain "plan" object with the nine sections. The page renders it.
   Architecture:
     1. resolveTopic()  – finds topic knowledge (topics.js) or builds a fallback from key words
     2. buildKit()      – turns the topic into classroom building blocks (model, guided, group, solo,
                          engage, explore, apply, hands-on, games, check), adapted to subject and class
     3. METHODS[x].build() – arranges those blocks into the exact stages of one teaching method
   A future AI provider only needs to return the same plan object. */
(function () {
  "use strict";
  const TOPICS = window.SKLessonTopics || [];

  /* ---------- reference lists (extendable) ---------- */
  const GRADES = ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];
  /* Which teaching method suits a class: GRR for Classes I–VIII, Hybrid (CLT + GTM) for Classes IX–XII */
  const methodForGrade = (label) => { const i = GRADES.indexOf(label); return i < 0 ? "" : i >= 8 ? "hybrid" : "grr"; };
  const SUBJECTS = ["English", "Mathematics", "Environmental Studies (EVS)", "Science", "Social Science", "Assamese", "Hindi"];
  const DURATIONS = [30, 35, 40, 45, 60];
  const gradeInfo = (label) => { let ci = GRADES.indexOf(label); if (ci < 0) ci = 2; return { ci, band: ci <= 1 ? 0 : ci <= 4 ? 1 : 2, label }; };

  function profile(subject) {
    const s = String(subject).toLowerCase();
    if (/english|assamese|hindi|bengali|bangla|bodo|sanskrit|urdu|nepali|language|grammar/.test(s)) return "lang";
    if (/math/.test(s)) return "math";
    if (/social|history|geograph|civics|politic|economics/.test(s)) return "soc";
    if (/evs|environment|science/.test(s)) return "sci";
    return "other";
  }

  /* ---------- helpers ---------- */
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const list = (a, last = "and") => (a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " " + last + " " + a[a.length - 1]);
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const rot = (a, n) => (a.length ? a.slice(n % a.length).concat(a.slice(0, n % a.length)) : a);
  const q = (s) => "“" + s + "”";
  const titleCase = (s) => s.trim().replace(/\s+/g, " ").replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase());
  const stage = (tp, t, p, o) => ({ tp, t, p, o });

  /* ---------- 1. topic resolution ---------- */
  function resolveTopic(topic, subject, keywords, prof) {
    const t = topic.toLowerCase();
    const kw = keywords.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean);
    const hits = TOPICS.filter((x) => x.re.test(t));
    const fits = (x) => prof === "math" ? x.kind === "math" : prof === "lang" ? x.kind !== "math" : prof === "other" ? true : x.kind === "set";
    const e = hits.find(fits);
    if (e) {
      const T = Object.assign({}, e, { topic, kw, matched: true });
      if (kw.length && T.words) T.words = [...new Set(kw.concat(T.words))];
      return T;
    }
    const kind = prof === "lang" ? "text" : prof === "math" ? "mconcept" : "concept";
    return { kind, topic, kw, matched: false, n: topic, one: topic, items: kw, words: kw };
  }

  /* ---------- 2. classroom building blocks ---------- */
  function buildKit(T, P, g, v, r, input) {
    const top = input.topic;
    if (T.kind === "set") return kitSet(T, P, g, v, top);
    if (T.kind === "math") return kitMath(T, P, g, v, r, top);
    if (T.kind === "grammar") return kitGrammar(T, P, g, v, top);
    if (T.kind === "text") return kitText(T, P, g, v, top);
    return kitConcept(T, P, g, v, top);
  }

  const interest = (P, subject) => ({ lang: `Develop interest in learning ${subject}.`, math: "Develop interest in Mathematics and numbers.",
    sci: "Develop interest in observing the world around them.", soc: "Develop interest in people, places and society around them." }[P] || `Develop interest in ${subject}.`);

  /* SET: concrete things children can see, name and talk about */
  function kitSet(T, P, g, v, top) {
    const lang = P === "lang", ex4 = list(T.items.slice(0, 4)), w4 = list(T.words.slice(0, 4));
    const fx = rot(T.f, v), K = {};
    K.model = stage(lang ? `Names of ${T.n}; new words: ${w4}` : `${cap(T.n)}: ${ex4}`,
      [`Shows pictures of ${ex4}.`, `Explains ${T.n} in simple sentences: ${q(fx[0][1])} ${q(fx[1][1])}`, lang ? `Reads the new words aloud: ${w4}.` : `Writes the key words on the board: ${w4}.`],
      ["Look at the pictures carefully.", "Listen to the teacher.", lang ? "Repeat the new words after the teacher." : "Read the key words from the board."],
      [`Pupils can name ${ex4}.`]);
    K.guided = stage(`Questions and answers on ${T.n}`,
      [`Asks simple questions about ${ex4}:`, ...fx.slice(0, 4).map((x) => q(x[0])), "Helps pupils answer in full sentences."],
      ["Answer the questions.", g.band === 0 ? "Say the answers in full sentences with the teacher." : "Answer in full sentences and add one more fact."],
      [`Pupils can answer simple questions about ${T.n}.`]);
    const groups = [
      stage(`Identifying ${T.n}`, ["Puts pupils in pairs.", `Gives each pair picture cards of ${ex4}.`, "Asks pairs to identify each picture and discuss it."],
        [`Identify the ${T.one} in each picture.`, lang ? "Tell the partner one sentence about each: “This is ___. ___.”" : `Tell the partner one fact about each ${T.one}.`],
        [`Pupils can identify ${T.n} from pictures and discuss them with a partner.`]),
      T.sort && stage(`Sorting ${T.n}`, ["Makes small groups of 4–5 pupils.", `Gives each group picture or word cards of ${T.n}.`, `Asks groups to sort the cards into ${list(T.sort)}.`],
        ["Discuss each card in the group.", `Sort the cards into ${list(T.sort)}.`, "Share the answer with the class."], [`Pupils can sort ${T.n} into ${list(T.sort)}.`]),
      lang && stage("Asking and answering in pairs", ["Puts pupils in pairs.", `Writes a model on the board: “Which ${T.one} do you like?” – “I like ___ because ___.”`, "Asks pairs to take turns."],
        ["Ask and answer in pairs.", "Use the model sentence from the board."], [`Pupils can ask and answer simple questions about ${T.n}.`])
    ].filter(Boolean);
    K.group = groups[v % groups.length];

    const freeQ = fx.slice(2, 5).map((x) => x[0]);
    const blanks = fx.slice(0, 3).map((x) => { const w = x[1].replace(/[.?!]$/, "").split(" "); return { s: w.slice(0, -1).join(" ") + " ____.", a: w[w.length - 1] }; });
    const cloze = blanks.map((b, i) => `${i + 1}. ${b.s}`).join(" ") + ` (Word box: ${blanks.map((b) => b.a).join(", ")})`;
    const SOLO = lang ? [
      [[`Write three words about ${T.n} and one sentence about your favourite ${T.one}.`, `Pupils can write three words and one sentence about ${T.n}.`],
       [`Draw your favourite ${T.one}, write its name and one sentence about it.`, `Pupils can name and write one sentence about a ${T.one}.`]],
      [[`Write 4–5 sentences about your favourite ${T.one}.`, `Pupils can write 4–5 correct sentences about a ${T.one}.`],
       [`Fill in the blanks: ${cloze}`, `Pupils can complete sentences about ${T.n} correctly.`]],
      [[`Write a paragraph of 6–8 sentences on “${top}”.`, `Pupils can write a short, well-organised paragraph on ${T.n}.`],
       [`Answer in full sentences: ${freeQ.join(" ")}`, `Pupils can answer questions about ${T.n} in full sentences.`]]
    ] : [
      [[`Draw and name three ${T.n}.`, `Pupils can draw and name three ${T.n}.`],
       [`Match pictures of ${T.n} with their names.`, `Pupils can match ${T.n} with their names.`]],
      [[`Answer in the notebook: ${freeQ.join(" ")}`, `Pupils can answer questions about ${T.n} correctly.`],
       [`Draw any two ${T.n} and write two lines about each.`, `Pupils can describe two ${T.n} in their own words.`]],
      [[`Write a short note on “${top}” with one labelled drawing.`, `Pupils can explain ${T.n} with a labelled drawing.`],
       [`Answer: ${freeQ.join(" ")} Give one example from daily life.`, `Pupils can answer and relate ${T.n} to daily life.`]]
    ];
    const solo = SOLO[g.band][v % 2];
    K.solo = stage("Individual task", ["Gives an individual task:", q(solo[0]), "Observes pupils and checks their work."],
      ["Do the task alone in the notebook.", "Show the finished work to the teacher."], [solo[1]]);
    K.soloOut = solo[1];

    K.engage = stage("Creating interest", [`Hides ${T.hookObj || "a picture of " + T.items[0]} under a cloth.`, "Lets pupils guess what it is, then shows it."],
      ["Guess what is hidden.", "Share what they already know about it."], ["Pupils show interest and share what they already know."]);
    K.explore = stage(`Exploring ${T.n}`, ["Makes small groups.", `Gives each group pictures or objects of ${T.n}.`, T.sort ? `Asks groups to find which ones are ${list(T.sort, "or")}.` : "Asks groups to find what is the same and what is different."],
      ["Look at and handle the pictures or objects.", "Discuss in groups and share what they found."], [`Pupils can observe and describe ${T.n}.`]);
    K.apply = stage("Linking to daily life", [`Asks: ${q(T.life || `Where do you see ${T.n} in your daily life?`)}`, lang ? "Asks some pupils to speak 2–3 sentences about it." : "Gives a new example and asks pupils to explain it."],
      ["Think and share examples from their own life.", lang ? "Speak 2–3 sentences in front of the class." : "Explain the new example using what they learned."],
      [`Pupils can connect ${T.n} with their daily life.`]);
    const make = T.make || `make a picture chart of ${T.n}`;
    K.hands = stage("Learning by doing", [`Gives materials: ${T.makeMat || "chart paper, pictures, glue and crayons"}.`, `Guides groups to ${make}.`, "Moves around and helps each group."],
      [cap(make) + " in groups.", lang ? `Present the work and name the ${T.n} used.` : "Present the work and explain it to the class."], [`Pupils can ${make} and talk about it.`]);

    // statements for true/false checks
    const truth = fx.slice(2, 5).map((x) => x[1]);
    let fake = null;
    const inFact = T.items.filter((i) => fx[0][1].includes(i)), it = inFact.length === 1 ? inFact[0] : null;
    if (it) { const other = T.items.find((i) => i !== it && !fx[0][1].includes(i)); if (other) fake = fx[0][1].replace(it, other); }
    K.tf = [truth[0] && [truth[0], true], fake && [fake, false], truth[1] && [truth[1], true]].filter(Boolean);
    K.games = [
      { name: "Pass the Ball", rule: `Pupils sit in a circle and pass a ball while the teacher claps. When the clapping stops, the pupil holding the ball names a ${T.one} and says one sentence about it.` },
      { name: "Picture Hunt", rule: `Picture cards of ${T.n} are hidden in the classroom. Each team finds a card, names it and sticks it on the board.` },
      T.act && { name: "Act and Guess", rule: `One pupil acts out a ${T.one} without speaking. The others guess its name and say a sentence about it.` }
    ].filter(Boolean);
    K.introQ = T.hook || [`Can you name any ${T.n}?`, `Which ${T.one} do you like the most?`, `Where do you see ${T.n}?`];
    K.endQ = [`Name any two ${T.n}.`, fx[4] ? fx[4][0] : `Where do we see ${T.n}?`, `Which ${T.one} do you like the most? Why?`];
    K.summary = `${fx[0][1]} ${fx[1][1]}`;
    K.general = [`Understand what ${T.n} are and name some of them.`, interest(P, input0.subject), lang ? `Learn new words: ${w4}.` : `Learn key words: ${w4}.`, `Understand that ${T.why}.`];
    K.specific = {
      lang: [["Listening", `Listen to the teacher and identify ${T.n} by name.`], ["Speaking", g.band === 0 ? `Say one simple sentence about a ${T.one}.` : `Speak 2–3 sentences about ${T.n}.`],
        ["Reading", `Read the words ${w4} correctly.`], ["Writing", cap(solo[1].replace(/^Pupils can /, ""))]],
      sci: [["Observation", `Observe pictures or objects and name ${ex4}.`], ["Thinking", T.sort ? `Sort ${T.n} into ${list(T.sort)}.` : `Give reasons: ${fx[1][0]}`],
        ["Communication", `Talk about ${T.n} in simple sentences.`], ["Application", `Relate ${T.n} to daily life: ${T.life || "give examples from home"}`]],
      soc: [["Observation", `Observe pictures and identify ${ex4}.`], ["Understanding", `Explain ${fx[0][0].toLowerCase().replace("?", "")} and similar facts.`],
        ["Expression", `Share ideas about ${T.n} with the class.`], ["Application", `Relate ${T.n} to their own family and community.`]],
      math: [["Observation", `Observe and count ${T.n}.`], ["Calculation", `Count and compare groups of ${T.n}.`], ["Reasoning", "Explain how they counted."], ["Problem-solving", `Solve a simple counting problem about ${T.n}.`]],
      other: [["Understanding", `Name and describe ${T.n}.`], ["Speaking", `Talk about ${T.n} in simple sentences.`], ["Thinking", `Answer: ${fx[1][0]}`], ["Application", `Relate ${T.n} to daily life.`]]
    }[P];
    return K;
  }

  /* MATHS: concept + fresh examples for the class level */
  function kitMath(T, P, g, v, r, top) {
    const K = {}, seen = new Set(), ex = [];
    for (let i = 0; ex.length < 10 && i < 80; i++) { const e = T.gen(r, g.ci); if (!seen.has(e.q)) { seen.add(e.q); ex.push(e); } }
    while (ex.length < 10) ex.push(ex[ex.length % Math.max(1, ex.length)] || { q: "—", a: "—" });
    const NAMES = ["Rima", "Arjun", "Meena"], THINGS = ["mangoes", "pencils", "marbles"];
    const st = [0, 1, 2].map((i) => { const nm = NAMES[(i + v) % 3], boy = nm === "Arjun", s = T.story(r, g.ci); return { q: s.q.replace(/\bRima\b/g, nm).replace(/\bmangoes\b/g, THINGS[(i + v) % 3]).replace(/\bHer\b/g, boy ? "His" : "Her").replace(/\bher\b/g, boy ? "him" : "her").replace(/\bshe\b/g, boy ? "he" : "she"), a: s.a }; });
    const show = (e) => /\?$/.test(e.q) && /=/.test(e.q) ? e.q.replace("?", e.a) : `${e.q.replace(/\?$/, "")} → ${e.a}`;
    const nSolo = g.band === 0 ? 4 : 5;
    K.model = stage(T.concept, [`Explains: ${q(T.concept)}`, `Shows it with ${T.manip}.`, `Solves on the board: ${show(ex[0])}; ${show(ex[1])}.`],
      [`Watch the teacher use the ${T.manip}.`, "Listen and copy the examples in the notebook."], [`Pupils can tell what ${T.n} means.`]);
    K.guided = stage(`Solving ${T.n} together`, ["Writes two new questions on the board:", q(ex[2].q), q(ex[3].q), "Solves them with pupils step by step, asking “What do we do first?”"],
      ["Solve along with the teacher.", "Say each step aloud."], [`Pupils can solve ${T.n} questions with help.`]);
    const groups = [
      stage(`Practising ${T.n} with materials`, ["Puts pupils in pairs.", `Gives each pair ${T.manip}.`, "One pupil makes a question; the partner solves it with the materials; they swap."],
        ["Make and solve questions in pairs.", "Check each other's answers."], [`Pupils can make and solve ${T.n} questions with a partner.`]),
      stage("Solving a word problem in groups", ["Makes small groups of 4–5 pupils.", `Gives a word problem: ${q(st[0].q)}`, "Asks each group to solve it and explain the method."],
        ["Discuss and solve the problem together.", "Explain the answer to the class."], [`Pupils can solve a ${T.n} word problem together and explain it.`])
    ];
    K.group = groups[v % 2];
    const soloQs = ex.slice(4, 4 + nSolo).map((e) => e.q.replace(/\s*=\s*\?$/, "").replace(/\?$/, "")).join(";  ");
    const soloTxt = `Solve: ${soloQs}.` + (g.band > 0 ? ` Word problem: ${st[1].q}` : "");
    K.solo = stage("Individual practice", ["Gives questions for individual work:", q(soloTxt), "Observes and checks answers."],
      ["Solve the questions alone in the notebook.", "Check their answers once more."], [`Pupils can solve ${nSolo} ${T.n} questions correctly on their own.`]);
    K.engage = stage("Creating interest", [`Tells a short story problem: ${q(st[2].q)}`, "Asks: “How can we find the answer?”"], ["Listen to the story.", "Suggest ways to find the answer."], ["Pupils show curiosity and share their ideas."]);
    K.explore = stage(`Finding the answer with ${T.manip.split(" ")[0]}`, ["Makes small groups.", `Gives ${T.manip}.`, "Asks groups to use them to find the answer to the story problem."],
      ["Use the materials to try different ways.", "Share their answer and method."], ["Pupils can find an answer by using materials."]);
    K.apply = stage("Using it in daily life", [`Asks: ${q(T.life)}`, `Gives a real-life problem: ${q(st[1].q)}`], ["Give examples from daily life.", "Solve the real-life problem."], [`Pupils can use ${T.n} in real-life situations.`]);
    K.hands = stage("Learning by doing", [`Gives each group ${T.manip}.`, "Calls out questions; groups show the answer with the materials and write it."],
      ["Use the materials to show each answer.", "Write the answer on a slate or paper."], [`Pupils can show ${T.n} with real materials.`]);
    const wrong = (a) => { const n = parseFloat(String(a).replace(/,/g, "")); return isNaN(n) ? null : String(n + 1); };
    const eq = [ex[5], ex[6], ex[7]].filter((e) => /= \?$/.test(e.q));
    K.tf = eq.length === 3 ? [[show(eq[0]), true], wrong(eq[1].a) ? [eq[1].q.replace("?", wrong(eq[1].a)), false] : [show(eq[1]), true], [show(eq[2]), true]] : null;
    K.games = [
      { name: "Board Race", rule: "Two teams line up. The teacher calls out a question; one pupil from each team writes the answer on the board. The first correct answer wins a point." },
      T.id === "money" ? { name: "Class Shop", rule: "A small shop is set up with price cards. Pupils buy things with toy money and work out the total and the change." }
        : T.id === "shapes" ? { name: "Shape Hunt", rule: "Teams find things in the classroom that match the shape the teacher calls out." }
        : T.id === "time" ? { name: "What's the Time?", rule: "The teacher shows a time on the clock; the first team to read it correctly wins a point." }
        : { name: "Flash Card Relay", rule: "Each team gets flash cards. A pupil picks a card, solves it, and tags the next pupil." }
    ];
    K.introQ = [`Look at these ${T.manip.split(" (")[0]}. What can we do with them?`, T.life, `Have you heard the word “${T.words[0].replace(/ \(.*/, "")}”?`];
    K.endQ = [`What does ${T.n} mean?`, ex[8].q, ex[9].q];
    K.summary = T.concept;
    K.general = [`Understand the meaning of ${T.n}.`, interest(P, input0.subject), `Learn the terms: ${list(T.words.slice(0, 4))}.`, `Understand that ${T.why}.`];
    K.specific = [["Observation", `Observe ${T.manip} and examples to understand ${T.n}.`], ["Calculation", `Solve ${T.n} questions correctly.`],
      ["Reasoning", "Explain the steps used to find the answer."], ["Problem-solving", `Solve a simple word problem on ${T.n}.`]];
    return K;
  }

  /* GRAMMAR */
  function kitGrammar(T, P, g, v, top) {
    const K = {}, pairs = !T.others.length, ex = rot(T.ex, v);
    const lefts = T.words.map((w) => w.split(" – ")[0]);
    K.model = stage(T.concept, [`Explains: ${q(T.concept)}`, `Writes on the board: ${ex.slice(0, 2).map(q).join(" ")}`, `Underlines the ${T.mark} and reads them aloud.`],
      ["Listen and look at the board.", "Read the sentences and the underlined words."], [`Pupils can tell what ${T.unit} are.`]);
    K.guided = stage(`Finding ${T.mark}`, ["Writes new examples:", ...ex.slice(2, 4).map(q), `Asks pupils to find the ${T.mark} with help.`],
      [`Find and say the ${T.mark}.`, "Come to the board and underline them."], [`Pupils can find ${T.mark} in sentences with help.`]);
    const cards = pairs ? T.words.slice(0, 6) : T.words.slice(0, 5).concat(T.others.slice(0, 3));
    const groups = [
      pairs ? stage("Matching pairs", ["Makes small groups.", `Gives cut word cards: ${list(T.words.slice(0, 5).map((w) => w.replace(" – ", " / ")))}.`, "Asks groups to match each pair."],
        ["Match the word cards in pairs.", "Read the pairs aloud."], [`Pupils can match ${T.mark} correctly.`])
        : stage("Sorting word cards", ["Makes small groups.", `Gives word cards: ${list(cards)}.`, `Asks groups to pick out the ${T.mark}.`],
        [`Sort the cards: ${T.mark} and other words.`, "Explain their choice."], [`Pupils can pick out ${T.mark} from a mix of words.`]),
      stage("Making sentences in pairs", ["Puts pupils in pairs.", `Gives each pair two ${T.mark}: ${list(T.words.slice(2, 4))}.`, "Asks pairs to make one sentence with each."],
        ["Make sentences together.", "Read them to the class."], [`Pupils can use ${T.mark} in their own sentences.`])
    ];
    K.group = groups[v % 2];
    const task = pairs ? [`Write the matching ${T.mark} for: ${lefts.join(", ")}.`, `Write three sentences using ${T.mark}.`, `Write a short paragraph and underline the ${T.mark} you use.`][g.band]
      : [`Circle the ${T.mark} in three sentences and write three ${T.mark} of your own.`, `Write five sentences and underline the ${T.mark}.`, `Write a short paragraph about your school and underline all the ${T.mark}.`][g.band];
    K.solo = stage("Individual task", ["Gives an individual task:", q(task), "Checks the work and helps where needed."], ["Do the task alone.", "Show the work to the teacher."], [`Pupils can use ${T.mark} correctly on their own.`]);
    K.soloOut = `Write ${T.mark} correctly on their own.`;
    K.engage = stage("Creating interest", [`Plays a quick game: says words aloud and pupils clap for ${T.mark}.`], ["Listen and clap.", "Guess what today's lesson is about."], ["Pupils show interest and attention."]);
    K.explore = stage(`Looking for ${T.mark}`, ["Gives each group a short printed or written passage.", `Asks groups to find words that look like the examples.`], ["Read the passage together.", "List the words they find."], [`Pupils can notice ${T.mark} in a passage.`]);
    K.apply = stage("Using it in real life", [`Asks pupils to use ${T.mark} to talk about their home or school.`], ["Speak 2–3 sentences using the words."], [`Pupils can use ${T.mark} while speaking.`]);
    K.hands = stage("Learning by doing", ["Gives chart paper and old magazines.", `Asks groups to make a chart of ${T.mark} with pictures.`], ["Cut, stick and label.", "Present the chart."], [`Pupils can make and explain a chart of ${T.mark}.`]);
    K.tf = pairs ? [[`“${T.words[0]}” is a correct pair.`, true], [`“${lefts[1]} – ${lefts[2]}” is a correct pair.`, false]]
      : [[`“${T.words[0]}” is one of the ${T.mark}.`, true], [`“${T.others[0]}” is one of the ${T.mark}.`, false], [`“${T.words[3]}” is one of the ${T.mark}.`, true]];
    K.games = [{ name: "Word Sort Race", rule: `Word cards are mixed on a table. Teams race to collect only the ${T.mark}.` },
      { name: "Stand Up, Sit Down", rule: `The teacher says words. Pupils stand up for ${T.mark} and sit down for other words.` }];
    K.introQ = [`Read this sentence: ${q(ex[0])} What do you notice?`, `Can you tell me some ${T.mark}?`, `Why do we need ${T.mark} when we speak and write?`];
    K.endQ = [`What are ${T.unit}?`, `Give two examples of ${T.mark}.`, `Find the ${T.mark}: ${ex[ex.length - 1]}`];
    K.summary = T.concept;
    K.general = [`Understand what ${T.unit} are.`, interest(P, input0.subject), `Learn and use new examples of ${T.mark}.`, `Understand that using ${T.mark} correctly helps us speak and write well.`];
    K.specific = [["Listening", `Listen to sentences and identify the ${T.mark}.`], ["Speaking", `Use ${T.mark} correctly in spoken sentences.`],
      ["Reading", `Read sentences and pick out the ${T.mark}.`], ["Writing", K.soloOut]];
    return K;
  }

  /* TEXT: a language lesson, story or poem (no textbook content is assumed) */
  function kitText(T, P, g, v, top) {
    const K = {}, kw = T.kw, nw = kw.length ? list(kw.slice(0, 5)) : "the new words";
    K.model = stage(`Reading “${top}”; meaning of new words`, [`Reads the lesson “${top}” aloud with correct pronunciation and expression.`, `Explains ${nw} with pictures, actions or examples.`, "Tells the main idea in two simple sentences."],
      ["Listen carefully and follow in the book.", "Repeat the new words."], ["Pupils can say the new words and the main idea of the lesson."]);
    K.guided = stage("Reading together", ["Reads line by line; pupils repeat (echo reading).", "Asks simple questions: “Who…?”, “What…?”, “Where…?”", "Corrects pronunciation gently."],
      ["Read aloud with the teacher.", "Answer the questions."], ["Pupils can read the lesson aloud with help and answer simple questions."]);
    const groups = [
      stage("Pair reading", ["Puts pupils in pairs.", "Asks partners to take turns reading a part aloud.", "Asks them to list new words they find."], ["Read to each other.", "Make a list of new words."], ["Pupils can read aloud fluently and find new words."]),
      stage("Group questions", ["Makes small groups.", "Gives each group 2 questions on the lesson.", "Asks groups to find the answers in the text."], ["Discuss and find the answers.", "Share answers with the class."], ["Pupils can find answers in the text together."])
    ];
    K.group = groups[v % 2];
    const task = [[`Write three new words from “${top}” and copy one sentence.`, `Draw a picture from “${top}” and write one sentence about it.`],
      [`Answer three questions on “${top}” and use two new words in sentences.`, `Write 4–5 sentences about what you liked in “${top}”.`],
      [`Write a summary of “${top}” in 5–6 sentences.`, `Write the main idea of “${top}” and the meanings of ${nw}.`]][g.band][v % 2];
    K.solo = stage("Individual task", ["Gives an individual task:", q(task), "Checks the work and gives feedback."], ["Do the task alone.", "Show the work to the teacher."], ["Pupils can complete the task on their own."]);
    K.soloOut = ["Write new words and a sentence from the lesson.", "Write answers and sentences using new words.", "Write a short summary of the lesson."][g.band];
    K.engage = stage("Creating interest", [`Shows a picture related to “${top}” and asks pupils to guess what happens in the lesson.`], ["Guess and share ideas."], ["Pupils show interest in the lesson."]);
    K.explore = stage("Looking at the lesson", ["Asks groups to look at the title and pictures in the lesson.", "Asks them to find three words they do not know."], ["Look through the lesson.", "List unknown words."], ["Pupils can find new words on their own."]);
    K.apply = stage("Linking to life", [`Asks: “What did you learn from ‘${top}’? Has something like this happened to you?”`], ["Share their ideas in 2–3 sentences."], ["Pupils can relate the lesson to their own life."]);
    K.hands = stage("Learning by doing", ["Gives chart paper and crayons.", `Asks groups to draw a scene from “${top}” and write one line under it.`], ["Draw and write in groups.", "Present to the class."], ["Pupils can show the main idea through a drawing."]);
    K.tf = null;
    K.games = [{ name: "Word Ball", rule: "Pupils pass a ball. The pupil who catches it says a new word from the lesson and its meaning." },
      { name: "Hot Seat", rule: "A pupil sits in the hot seat as a character or the writer. Others ask simple questions about the lesson." }];
    K.introQ = ["Look at this picture. What do you see?", `Have you heard or read anything about “${top}”?`, `What do you think the lesson “${top}” is about?`];
    K.endQ = ["What is the lesson about?", "Tell me two new words you learned today.", "What did you like in the lesson? Why?"];
    K.summary = `The main idea of “${top}” and the new words.`;
    K.general = [`Understand the lesson “${top}”.`, interest(P, input0.subject), kw.length ? `Learn new words: ${nw}.` : "Learn new words from the lesson.", "Understand the message of the lesson and relate it to life."];
    K.specific = [["Listening", "Listen to the lesson read aloud and answer simple questions."], ["Speaking", "Answer questions about the lesson orally in full sentences."],
      ["Reading", "Read the lesson aloud with correct pronunciation."], ["Writing", K.soloOut]];
    return K;
  }

  /* CONCEPT: any other topic, made specific through the teacher's key words */
  function kitConcept(T, P, g, v, top) {
    const K = {}, kw = T.kw, kp = kw.length ? list(kw.slice(0, 5)) : `the main ideas of ${top}`, math = P === "math";
    K.model = stage(`Meaning of ${top}; key points: ${kp}`, [`Explains ${top} using ${math ? "examples on the board" : "a simple diagram on the board and a real-life example"}.`, `Writes the key ${math ? "terms" : "points"}: ${kp}.`, math ? "Solves two examples step by step." : "Shows a picture or object related to the topic."],
      ["Watch and listen carefully.", "Copy the key points in the notebook."], [`Pupils can tell the meaning of ${top}.`]);
    K.guided = stage("Questions and practice together", [math ? "Gives two examples and solves them with pupils." : `Asks questions on ${kp}.`, "Helps pupils give complete answers."],
      [math ? "Solve along with the teacher." : "Answer the questions.", "Ask doubts."], [`Pupils can explain ${kw[0] || top} with help.`]);
    const groups = [
      stage("Group concept chart", ["Makes small groups.", `Asks each group to make a chart on ${top} with ${kw.length ? kp : "two examples"}.`], ["Discuss and make the chart.", "Present it to the class."], [`Pupils can explain ${top} with examples in a group.`]),
      stage("Pair discussion", ["Puts pupils in pairs.", `Gives each pair a question on ${top}.`, "Asks pairs to discuss and share the answer."], ["Discuss with the partner.", "Share the answer."], [`Pupils can discuss ${top} and share answers.`])
    ];
    K.group = groups[v % 2];
    const task = math ? ["Solve four simple questions on the topic.", "Solve five questions on the topic and one word problem.", "Solve five questions and explain one answer in words."][g.band]
      : [`Draw and label one picture about ${top}.`, `Answer three short questions on ${top}.`, `Write a short note on ${top} with one example from daily life.`][g.band];
    K.solo = stage("Individual task", ["Gives an individual task:", q(task), "Checks the work and helps where needed."], ["Do the task alone.", "Show the work to the teacher."], ["Pupils can complete the task correctly on their own."]);
    K.soloOut = task.replace(/\.$/, "") + ".";
    K.engage = stage("Creating interest", [`Asks a puzzling question about ${top} or shows a related object.`], ["Think and guess."], ["Pupils show curiosity about the topic."]);
    K.explore = stage(`Exploring ${top}`, ["Gives groups pictures, objects or examples.", "Asks them to find what they notice."], ["Observe and discuss.", "Share findings."], ["Pupils can observe and describe what they find."]);
    K.apply = stage("Using it in daily life", [`Asks pupils where ${top} is seen or used in daily life.`], ["Give real-life examples."], [`Pupils can relate ${top} to daily life.`]);
    K.hands = stage("Learning by doing", ["Gives chart paper, pictures and simple materials.", `Asks groups to make a model or chart that shows ${top}.`], ["Make the model or chart.", "Explain it to the class."], [`Pupils can show ${top} through a model or chart.`]);
    K.tf = null;
    K.games = [{ name: "Question Ball", rule: `Pupils pass a ball; the pupil who catches it answers a quick question on ${top}.` }, { name: "Quiz Teams", rule: `Two teams answer quick questions on ${top} for points.` }];
    K.introQ = [`What comes to your mind when you hear “${top}”?`, `Where have you seen or heard about ${top}?`, kw.length ? `Have you heard the word “${kw[0]}”?` : `Why do you think we learn about ${top}?`];
    K.endQ = [`What is ${top}?`, kw.length ? `What do you mean by “${kw[0]}”?` : `Give one example of ${top} from daily life.`, `Why is ${top} important?`];
    K.summary = `The meaning of ${top} and ${kw.length ? "the key points: " + kp : "its main ideas"}.`;
    K.general = [`Understand the main idea of ${top}.`, interest(P, input0.subject), kw.length ? `Learn key words: ${kp}.` : `Learn new terms related to ${top}.`, `Understand the importance of ${top} in daily life.`];
    const S = { lang: ["Listening", "Speaking", "Reading", "Writing"], math: ["Observation", "Calculation", "Reasoning", "Problem-solving"], sci: ["Observation", "Thinking", "Communication", "Application"], soc: ["Observation", "Understanding", "Expression", "Application"], other: ["Understanding", "Speaking", "Thinking", "Application"] }[P];
    const txt = { Listening: `Listen and identify the key points of ${top}.`, Speaking: `Talk about ${top} in simple sentences.`, Reading: `Read the key words correctly.`, Writing: K.soloOut,
      Observation: `Observe examples and pictures related to ${top}.`, Calculation: "Solve questions correctly.", Reasoning: "Explain the steps of their answers.", "Problem-solving": "Solve a simple real-life problem.",
      Thinking: `Give reasons related to ${top}.`, Communication: `Explain ${top} to a partner.`, Application: `Relate ${top} to daily life.`, Understanding: `Explain the meaning of ${top}.`, Expression: `Share ideas about ${top} with the class.` };
    K.specific = S.map((s) => [s, txt[s]]);
    return K;
  }

  /* ---------- 3. teaching methods (kept separate; never mixed) ---------- */
  const withOut = (s, extra) => stage(s.tp, s.t, s.p, s.o.concat(extra));
  const checkStage = (K, form) => {
    const T = K.tf && K.tf.length
      ? [form === "game" ? "Plays “Thumbs Up, Thumbs Down”: says sentences; pupils show thumbs up if true, thumbs down if false:" : "Says sentences; pupils say whether each is true or false:",
        ...K.tf.map(([s, ok]) => `${q(s)} (${ok ? "True" : "False"})`), "Notes pupils who need more help."]
      : [form === "game" ? "Plays a quick quiz game with three questions on the lesson." : "Asks three quick questions on the lesson.", "Checks answers and helps pupils who make mistakes."];
    return stage("Checking learning", T, [form === "game" ? "Show thumbs up or down quickly." : "Answer quickly.", "Correct their mistakes."], ["Pupils can show what they have learned correctly."]);
  };
  const METHODS = {
    grr: {
      name: "GRR – Gradual Release of Responsibility", short: "GRR",
      desc: "The teacher shows first (I Do), pupils practise with the teacher (We Do), then with classmates (You Do Together), and finally on their own (You Do Alone).",
      stages: ["Step 1: I Do (Teacher Modeling)", "Step 2: We Do (Guided Practice)", "Step 3: You Do Together (Collaborative Practice)", "Step 4: You Do Alone (Independent Practice)"],
      weights: [0.22, 0.25, 0.28, 0.25],
      build: (K) => [withOut(K.model, "Develop understanding through observation and listening."), withOut(K.guided, "Gain confidence through guided practice."),
        withOut(K.group, "Develop teamwork and communication."), withOut(K.solo, "Show individual understanding without help.")]
    },
    "5e": {
      name: "5E Learning Model", short: "5E",
      desc: "Pupils move through five stages: Engage (get curious), Explore (find out), Explain (understand), Elaborate (apply) and Evaluate (check learning).",
      stages: ["Step 1: Engage", "Step 2: Explore", "Step 3: Explain", "Step 4: Elaborate", "Step 5: Evaluate"],
      weights: [0.12, 0.22, 0.24, 0.2, 0.22],
      build: (K) => [K.engage, K.explore, stage(K.model.tp, K.model.t, K.model.p.concat(["Ask questions to clear doubts."]), K.model.o), K.apply,
        stage("Checking learning", K.solo.t, K.solo.p, K.solo.o)]
    },
    abl: {
      name: "Activity-Based Learning", short: "ABL",
      desc: "Pupils learn by doing. The teacher demonstrates with teaching-learning materials, and pupils learn through hands-on activities.",
      stages: ["Step 1: Introduction and Demonstration", "Step 2: Hands-on Activity", "Step 3: Guided Exploration", "Step 4: Individual Application", "Step 5: Assessment"],
      weights: [0.2, 0.28, 0.18, 0.2, 0.14],
      build: (K) => [K.model, K.hands, K.guided, K.solo, checkStage(K, "oral")]
    },
    play: {
      name: "Play-Way Method", short: "Play-Way",
      desc: "Pupils learn through games, songs and play. Learning is joyful, active and suited to young learners.",
      stages: ["Step 1: Introduction through Play", "Step 2: Demonstration of the Game", "Step 3: Guided Participation", "Step 4: Group Play", "Step 5: Learning Assessment"],
      weights: [0.12, 0.16, 0.22, 0.3, 0.2],
      build: (K) => {
        const G1 = K.games[0], G2 = K.games[1] || K.games[0];
        const words = /: /.test(K.model.tp) ? `Revises the words needed: ${K.model.tp.replace(/^[^:]*: /, "")}.` : "Revises the key words needed for the game.";
        const quoted = K.guided.t.filter((x) => x.startsWith("“")).slice(0, 2);
        const prompts = quoted.length ? [`Uses prompts such as ${quoted.join(" ")}`] : ["Asks simple questions on the lesson during the game."];
        return [
          stage("Warm-up game", [...K.engage.t, "Turns the guessing into a short game with claps for good guesses."], K.engage.p, K.engage.o),
          stage(`Rules of “${G1.name}”`, [`Explains the game “${G1.name}”: ${G1.rule}`, "Plays one round with two pupils to show the rules.", words],
            ["Watch the demonstration.", "Ask doubts about the rules."], ["Pupils understand the rules and the words used in the game."]),
          stage("Playing together", [`Plays “${G1.name}” with the whole class.`, ...prompts,"Helps pupils speak or answer correctly."],
            ["Take turns in the game.", "Answer and speak with the teacher's help."], K.guided.o.concat(["Take part with joy and confidence."])),
          stage(`Group game: “${G2.name}”`, ["Divides the class into groups of 5–6.", G2 === G1 ? `Groups play “${G1.name}” on their own.` : `Explains and starts “${G2.name}”: ${G2.rule}`, "Moves around and makes sure every pupil gets a turn."],
            ["Play in groups and follow the rules.", "Help team members."], ["Pupils can use what they learned while playing in a team.", "Develop teamwork and fair play."]),
          checkStage(K, "game")
        ];
      }
    },
    hybrid: {
      name: "Hybrid (CLT + GTM)", short: "Hybrid",
      desc: "For Classes IX–XII. Communicative Language Teaching (speaking and group work) is combined with the Grammar-Translation Method (text reading, meanings and drills).",
      stages: ["Step 1: Warm-up & Introduction (Communicative)", "Step 2: Reading/Text Analysis (Grammar-Translation)", "Step 3: Group Activity / Role-play (CLT)", "Step 4: Grammar Drill & Vocabulary (GTM)", "Step 5: Homework / Application"],
      weights: [0.14, 0.24, 0.24, 0.22, 0.16],
      build: (K, c) => {
        const { T, P, topic } = c, lang = P === "lang", math = P === "math";
        const w = list(((T.words && T.words.length ? T.words : T.kw && T.kw.length ? T.kw : [topic]).slice(0, 5)).map((x) => x.replace(/ \(.*\)$/, "")));
        const quoted = K.guided.t.filter((x) => x.startsWith("“")).slice(0, 2);
        const life = T.life || `How can we use what we learned about ${topic} in real life?`;
        let drill = String(K.solo.t[1] || "").replace(/[“”]/g, "").replace(/^Write a paragraph of [^.]*? on /, "Write five correct sentences on ").trim();
        if (!/[.?!]$/.test(drill)) drill += ".";
        drill = drill.replace(/([.?!])\.$/, "$1");
        const hw = lang ? `Prepare a one-minute talk on “${topic}” and write its main points, using at least five new words.`
          : math ? `Solve five more questions on ${topic} from the textbook and make one word problem of your own.`
          : `Write a short note on “${topic}” with a neat diagram and one real-life example.`;
        return [
          stage("Introducing the topic through speaking", [...K.engage.t, "Asks pupils to discuss in pairs for one minute and then speak to the class."],
            ["Talk to a partner and then share ideas with the class.", "Answer in complete sentences."], [`Pupils can speak about ${topic} with confidence.`, "Show interest and share what they already know."]),
          stage(`Key words: ${w}`, [math ? `Reads the textbook rule and a solved example on ${topic} aloud.` : `Reads the textbook text on ${topic} (or a short passage) aloud with correct pronunciation.`,
            lang ? "Explains difficult words and the meaning of key sentences. Translates them into the pupils' mother tongue to check understanding." : "Explains the key terms and, where needed, gives their meaning in the pupils' mother tongue.",
            math ? "Explains each step of the solved example." : "Analyses the text line by line and underlines the key points.",
            quoted.length ? `Asks comprehension questions: ${quoted.join(" ")}` : "Asks comprehension questions on the text."],
            ["Follow the text silently and then read aloud.", "Write the meanings of new words in the notebook.", "Answer the comprehension questions."], [`Pupils can read and understand the text on ${topic}.`, "Explain the meaning of key words and sentences."]),
          stage("Group discussion or role-play", ["Divides the class into groups of 4–5 pupils.", math ? `Gives a real-life problem to solve and explain together: ${q(life)}` : `Gives a situation for a role-play or discussion: ${q(life)}`,
            "Lets groups prepare for 3 minutes and present for 1–2 minutes each.", "Listens, supports and notes common errors to correct later."],
            [math ? "Solve the problem together and decide who explains." : "Plan the role-play or discussion and take roles.", "Present to the class.", "Listen to other groups and give one comment."], ["Pupils can express ideas about the topic in a group.", "Develop fluency, teamwork and confidence."]),
          stage(lang ? "Grammar practice and vocabulary" : "Practice drill and key terms", [`Writes the key words on the board with their meanings: ${w}.`,
            lang ? "Explains the grammar pattern in the text with an example. Gives two sentences to translate between English and the mother tongue." : "Explains the rule or pattern again with one example and corrects common errors.",
            `Gives a drill: ${drill}`, "Checks the answers and corrects mistakes."],
            ["Copy the key words and meanings.", "Do the drill in the notebook.", "Check the answers and correct the errors."], K.solo.o.concat(["Use new words and patterns accurately."])),
          stage("Homework and application", [`Asks: ${q(`How will you use what you learned about ${topic} outside the classroom?`)}`, `Gives homework: ${hw}`, "Explains how the homework will be checked."],
            ["Share one real-life use of the topic.", "Note down the homework."], [`Pupils can apply ${topic} beyond the classroom.`, "Revise and practise independently at home."])
        ];
      }
    }
  };

  /* ---------- main ---------- */
  let input0 = {};
  function generate(input, seed = 0) {
    input0 = input;
    const errors = [];
    ["teacher", "school", "subject", "grade", "topic", "duration", "method"].forEach((k) => { if (!String(input[k] || "").trim()) errors.push(k); });
    if (errors.length) { const e = new Error("Missing fields"); e.fields = errors; throw e; }
    const M = METHODS[input.method]; if (!M) throw new Error("Unknown teaching method");
    const P = profile(input.subject), g = gradeInfo(input.grade), D = parseInt(input.duration, 10) || 40;
    const topic = titleCase(input.topic);
    const T = resolveTopic(topic, input.subject, input.keywords || "", P);
    const r = rng(hash(topic + input.grade) + seed * 7919);
    const K = buildKit(T, P, g, seed, r, Object.assign({}, input, { topic }));
    const tIntro = Math.max(3, Math.round(D * 0.1)), tAnn = 1, tConc = Math.max(3, Math.round(D * 0.1)), tComp = 1;
    const tPres = D - tIntro - tAnn - tConc - tComp;
    const rows = M.build(K, { T, P, topic });
    let used = 0;
    const presentation = rows.map((s, i) => {
      const m = i === rows.length - 1 ? tPres - used : Math.max(3, Math.round(tPres * M.weights[i])); used += m;
      return { step: M.stages[i], min: m, points: s.tp, teacher: s.t, pupils: s.p, outcomes: s.o };
    });
    const aids = [...new Set(["Textbook", "Blackboard and chalk"].concat(T.aids || (T.kind === "text" ? ["Pictures related to the lesson", "New-word flash cards"] : T.kind === "concept" || T.kind === "mconcept" ? ["Chart showing the key points", "Pictures or real objects related to the topic"] : []),
      input.method === "play" ? [`Game materials: ${K.games.map((x) => x.name).join(" and ")} (ball, cards)`] : [], input.method === "abl" && T.makeMat ? [`Activity materials: ${T.makeMat}`] : [],
      input.method === "hybrid" ? ["Short text or passage for reading", "Handout or board notes for the drill"] : []))].slice(0, 6);
    const firstAid = (T.hookObj && /grr|abl/.test(input.method)) ? T.hookObj : (T.aids && T.aids[0]) ? T.aids[0].charAt(0).toLowerCase() + T.aids[0].slice(1) : "a picture related to the topic";
    const announceLine = T.kind === "text" ? `Today we will read the lesson “${topic}”.` : T.kind === "math" || T.kind === "mconcept" ? `Today we will learn about ${topic}.` : `Today we will learn about ${topic}.`;
    return {
      engine: "template", seed, matched: T.matched, kind: T.kind, profile: P,
      title: `Lesson Plan – ${input.grade}`,
      details: [["Teacher's Name", input.teacher.trim()], ["School", input.school.trim()], ["Subject", input.subject.trim()], ["Class", input.grade], ["Topic", topic], ["Duration", D + " minutes"], ["Teaching Method", M.name]],
      general: K.general,
      specific: K.specific,
      aids,
      intro: { min: tIntro, teacher: [`The teacher will introduce the topic by showing ${firstAid} and asking simple questions:`, ...K.introQ.map(q)], pupils: ["Pupils will observe, take part and answer the questions."] },
      announce: { min: tAnn, teacher: [`The teacher will announce the topic by saying, ${q(announceLine)} The teacher will write the topic on the blackboard.`], pupils: ["Pupils will listen attentively and read the topic."] },
      presentation,
      conclusion: { min: tConc, teacher: [`The teacher will summarise the lesson and revise the important points: ${K.summary}`, "The teacher will ask:", ...K.endQ.map(q)], pupils: ["Pupils will answer the questions and recall what they have learned."] },
      completion: { min: tComp, teacher: "The teacher will thank the pupils for their cooperation, rub the blackboard, collect the teaching aids, and leave the classroom." }
    };
  }

  window.SKLessonEngine = { generate, METHODS, GRADES, SUBJECTS, DURATIONS, profile, methodForGrade };
})();
