/* Skillyfai Question Generator: subjects, topics and question banks (local, no external service).

   How a question is made
   ----------------------
   Every question is a full sentence pattern, for example "How is {K} applied in everyday life?".
   {K} = a key word, {T} = the topic, {n} = a small number.
   A pattern belongs to a Targeted Skill, a subject group (category) and one or more thinking levels:
        Q("Name two facts about {K}.", "ru", 2)   -> fits Recall (r) and Understanding (u), 2 answer lines
   For each question the generator takes a thinking level and a skill, finds patterns of that skill that suit the
   subject group and the level, and fills in a key word. With no skill ticked, it uses the general bank for the level.

   Subject groups (cat):  lang  math  sci  soc  cs  gen
   To add a subject:      add a line to SUBJECTS.
   To add questions:      add a Q(...) to BANK (skills) or LEVELQ (general level questions).
*/
(function () {
  "use strict";

  const LEVELS = { r: "Recall", u: "Understanding", a: "Application", n: "Analysis", e: "Evaluation", c: "Creative" };
  const SKILLS = { ps: "Problem Solving", rc: "Reading Comprehension", vg: "Vocabulary & Grammar", ct: "Critical Thinking", ar: "Application & Real-World", oe: "Observation & Experimentation" };
  const L_ORDER = ["r", "u", "a", "n", "e", "c"];

  /* ---------- subjects and their common topics: [topic, "key words"] ---------- */
  const SUBJECTS = [
    { name: "English", cat: "lang", topics: [["Grammar", "noun, verb, adjective, sentence"], ["Parts of Speech", "noun, verb, adjective, adverb"], ["Tenses", "present tense, past tense, future tense, verb"], ["Story Reading", "character, plot, setting, moral"],
      ["Poem", "rhyme, stanza, rhythm, poet"], ["Letter Writing", "greeting, body, closing, address"], ["Essay Writing", "introduction, paragraph, conclusion"], ["Vocabulary", "synonym, antonym, meaning, sentence"], ["Comprehension Passage", "main idea, inference, theme"]] },
    { name: "Hindi", cat: "lang", topics: [["Grammar (Vyakaran)", "noun, verb, adjective, gender"], ["Story (Kahani)", "character, plot, moral"], ["Poem (Kavita)", "rhyme, stanza, poet"], ["Letter Writing", "greeting, body, closing"], ["Essay (Nibandh)", "introduction, paragraph, conclusion"], ["Idioms and Proverbs", "idiom, proverb, meaning"], ["Synonyms and Antonyms", "synonym, antonym, meaning"]] },
    { name: "Regional Language (Assamese, Tamil, etc.)", cat: "lang", topics: [["Grammar", "noun, verb, adjective, sentence"], ["Story", "character, plot, moral"], ["Poem", "rhyme, stanza, poet"], ["Letter Writing", "greeting, body, closing"], ["Essay Writing", "introduction, paragraph, conclusion"], ["Proverbs and Idioms", "proverb, idiom, meaning"], ["Vocabulary", "synonym, antonym, meaning"]] },
    { name: "Mathematics", cat: "math", topics: [["Addition", "sum, total, addend"], ["Subtraction", "difference, borrowing, minuend"], ["Multiplication", "product, factor, table"], ["Division", "quotient, divisor, remainder"], ["Fractions", "numerator, denominator, equivalent fraction"],
      ["Decimals", "decimal point, place value, tenths"], ["Shapes and Geometry", "angle, side, perimeter"], ["Measurement", "length, weight, capacity"], ["Time and Money", "hour, minute, rupee"], ["Percentage", "percent, discount, profit"], ["Algebra", "variable, equation, expression"], ["Mensuration", "area, perimeter, volume"], ["Ratio and Proportion", "ratio, proportion, unit rate"], ["Data Handling", "mean, median, bar graph"]] },
    { name: "EVS", cat: "sci", topics: [["Plants Around Us", "root, stem, leaf, flower"], ["Animals and Their Homes", "habitat, nest, shelter"], ["Water", "source of water, clean water, saving water"], ["Air", "wind, breathing, pollution"], ["Food and Nutrition", "healthy food, balanced diet, vitamin"],
      ["Our Family and Community", "family, neighbour, helper"], ["Weather and Seasons", "summer, rain, winter"], ["Our Environment", "pollution, waste, recycle"], ["Houses and Shelter", "kutcha house, pucca house, shelter"]] },
    { name: "Science", cat: "sci", topics: [["Solar System", "Sun, Moon, planet, orbit"], ["Plants and Photosynthesis", "chlorophyll, sunlight, stomata"], ["Human Digestive System", "stomach, intestine, digestion"], ["States of Matter", "solid, liquid, gas"], ["Light", "reflection, shadow, mirror"],
      ["Sound", "vibration, pitch, echo"], ["Force and Motion", "force, speed, friction"], ["Electricity", "circuit, battery, conductor"], ["Acids and Bases", "indicator, acid, base"], ["Water Cycle", "evaporation, condensation, rainfall"], ["Natural Resources", "renewable, soil, forest"]] },
    { name: "Physics", cat: "sci", topics: [["Motion", "speed, velocity, acceleration"], ["Force and Laws of Motion", "inertia, momentum, force"], ["Work, Energy and Power", "work, kinetic energy, power"], ["Reflection and Refraction", "mirror, lens, refractive index"], ["Electricity", "current, voltage, resistance"],
      ["Magnetism", "magnetic field, pole, magnet"], ["Sound", "frequency, wavelength, echo"], ["Gravitation", "gravity, weight, free fall"], ["Heat", "temperature, conduction, expansion"]] },
    { name: "Chemistry", cat: "sci", topics: [["Atoms and Molecules", "atom, molecule, atomic mass"], ["Periodic Table", "period, group, element"], ["Acids, Bases and Salts", "pH, neutralisation, indicator"], ["Chemical Reactions", "reactant, product, balanced equation"], ["Metals and Non-metals", "conductivity, reactivity, alloy"],
      ["Carbon and Its Compounds", "hydrocarbon, bond, organic compound"], ["Structure of the Atom", "proton, neutron, electron"], ["Mole Concept", "mole, molar mass, Avogadro number"]] },
    { name: "Biology", cat: "sci", topics: [["Cell Structure", "nucleus, membrane, cytoplasm"], ["Photosynthesis", "chlorophyll, carbon dioxide, glucose"], ["Digestive System", "enzyme, stomach, absorption"], ["Respiration", "oxygen, lungs, energy"], ["Reproduction", "gamete, fertilisation, seed"],
      ["Heredity and Genetics", "gene, trait, chromosome"], ["Ecosystem", "food chain, producer, consumer"], ["Circulatory System", "heart, blood, vessel"]] },
    { name: "Social Science", cat: "soc", topics: [["Indian Constitution", "citizen, right, duty"], ["Natural Resources", "forest, soil, water"], ["Our Government", "government, minister, law"], ["Agriculture", "crop, irrigation, farmer"], ["Population", "census, density, migration"],
      ["Freedom Struggle", "movement, leader, independence"], ["Maps and Globe", "map, scale, direction"], ["Rural and Urban Life", "village, city, occupation"]] },
    { name: "History", cat: "soc", topics: [["Mughal Empire", "emperor, empire, architecture"], ["Indian Freedom Movement", "Gandhi, satyagraha, independence"], ["Indus Valley Civilisation", "Harappa, town planning, trade"], ["Medieval India", "kingdom, sultan, trade"], ["French Revolution", "liberty, monarchy, revolution"],
      ["World Wars", "alliance, war, treaty"], ["Ancient India", "Maurya, Ashoka, Buddhism"]] },
    { name: "Geography", cat: "soc", topics: [["Rivers of India", "river, tributary, delta"], ["Climate and Seasons", "monsoon, temperature, rainfall"], ["Soils", "alluvial soil, erosion, fertility"], ["Natural Vegetation", "forest, vegetation, rainfall"], ["Maps and Scale", "scale, symbol, direction"],
      ["Latitudes and Longitudes", "equator, latitude, longitude"], ["Resources", "renewable, minerals, conservation"], ["Landforms", "mountain, plateau, plain"]] },
    { name: "Civics / Political Science", cat: "soc", topics: [["The Constitution", "preamble, rights, duties"], ["Democracy", "vote, election, equality"], ["Parliament", "Lok Sabha, Rajya Sabha, law"], ["Fundamental Rights", "equality, freedom, justice"], ["Local Government (Panchayat)", "Gram Sabha, sarpanch, ward"],
      ["Judiciary", "court, judge, justice"], ["Elections", "voter, candidate, ballot"]] },
    { name: "Economics", cat: "soc", topics: [["Needs and Wants", "need, want, resource"], ["Money and Banking", "bank, deposit, loan"], ["Demand and Supply", "demand, supply, price"], ["Poverty", "income, poverty line, employment"], ["Sectors of the Economy", "agriculture, industry, services"],
      ["Consumer Rights", "consumer, quality, complaint"], ["National Income", "GDP, growth, income"]] },
    { name: "Computer Science / IT", cat: "cs", topics: [["Parts of a Computer", "monitor, CPU, keyboard, mouse"], ["MS Word", "font, format, save, table"], ["MS Excel", "cell, formula, sum, chart"], ["MS PowerPoint", "slide, animation, layout"], ["Algorithms", "step, loop, condition, flowchart"],
      ["Programming Basics (Python)", "variable, loop, print, input"], ["Internet Safety", "password, privacy, phishing"], ["Computer Networks", "router, LAN, internet"], ["HTML Basics", "tag, heading, link, image"], ["Database and SQL", "table, record, query"]] },
    { name: "Accountancy", cat: "math", topics: [["Accounting Principles", "debit, credit, asset"], ["Journal Entries", "journal, debit, credit"], ["Ledger", "ledger, account, balance"], ["Cash Book", "receipt, payment, balance"], ["Trial Balance", "debit total, credit total, error"], ["Financial Statements", "profit, balance sheet, income"], ["Depreciation", "asset, rate, book value"]] },
    { name: "Business Studies", cat: "gen", topics: [["Forms of Business Organisation", "sole proprietor, partnership, company"], ["Marketing", "product, price, promotion"], ["Principles of Management", "planning, organising, controlling"], ["Business Environment", "economy, competition, law"], ["Banking", "deposit, loan, interest"], ["Entrepreneurship", "idea, risk, enterprise"]] },
    { name: "General Knowledge (GK)", cat: "gen", topics: [["Indian States and Capitals", "state, capital, language"], ["National Symbols", "flag, anthem, emblem"], ["Famous Personalities", "leader, scientist, writer"], ["Sports", "game, player, rule"], ["Inventions and Discoveries", "invention, scientist, discovery"], ["Countries and Capitals", "country, capital, continent"], ["Important Days", "date, celebration, meaning"]] },
    { name: "Moral Science", cat: "gen", topics: [["Honesty", "truth, trust, integrity"], ["Kindness", "help, care, sharing"], ["Respect", "elders, teachers, manners"], ["Teamwork", "cooperation, sharing, unity"], ["Discipline", "rules, punctuality, self-control"], ["Caring for the Environment", "plants, cleanliness, saving water"], ["Courage", "fear, bravery, confidence"]] },
    { name: "Art & Music", cat: "gen", topics: [["Colours", "primary colour, shade, mixing"], ["Drawing and Sketching", "line, shape, shading"], ["Folk Dance", "costume, rhythm, region"], ["Indian Classical Music", "raga, taal, swar"], ["Musical Instruments", "string, percussion, wind"], ["Craft and Rangoli", "pattern, design, material"], ["Rhythm and Beat", "beat, tempo, rhythm"]] },
    { name: "Physical Education", cat: "gen", topics: [["Yoga", "asana, breathing, posture"], ["Team Games", "team, rule, referee"], ["Athletics", "race, jump, throw"], ["Fitness and Exercise", "stamina, strength, flexibility"], ["First Aid", "bandage, wound, emergency"], ["Sports Rules", "rule, foul, score"], ["Health and Nutrition", "diet, hygiene, exercise"]] },
    { name: "Sanskrit", cat: "lang", topics: [["Shabd Roop (Noun forms)", "noun, case, number"], ["Dhatu Roop (Verb forms)", "verb, tense, person"], ["Shlokas", "shloka, meaning, pronunciation"], ["Sandhi", "sandhi, joining, rule"], ["Numbers", "number, counting, word"], ["Common Words and Vocabulary", "word, meaning, sentence"]] }
  ];

  /* ---------- skill banks: BANK[skill][category] = [Q, ...] ---------- */
  const Q = (t, lv, lines) => [t, lv, lines || 2];
  const BANK = {
    ps: { /* Problem Solving: only the subject's own list is used (falls back to gen) */
      math: [Q("Solve a problem involving {T} where {K} is changed by {n}. Show your steps.", "an", 3), Q("How would you calculate {K} in {T}? Show your working.", "ra", 3), Q("State the rule or formula you would use to solve problems on {T}.", "r", 2),
        Q("Write a word problem about {T} that uses {K}, then solve it.", "ac", 3), Q("A student made a mistake while solving a problem on {T} and got the wrong {K}. Find the mistake and correct it.", "ne", 3), Q("Estimate the answer to a problem on {T} involving {K}, then check it by solving.", "ua", 3)],
      sci: [Q("How would you measure or compare {K} in an activity on {T}?", "ra", 3), Q("Solve a problem involving {T}: if {K} changes, what else changes? Explain step by step.", "an", 3), Q("Plan a step-by-step method to find out how {K} is connected to {T}.", "anc", 3),
        Q("State one rule, fact or unit you would use to study {K} in {T}.", "r", 2), Q("Design a simple test to check one idea about {K} in {T}. What will you change and what will you keep the same?", "ec", 3)],
      cs: [Q("Write the step-by-step logic (algorithm) for {T}.", "ac", 3), Q("Identify and fix the bug in a program related to {K}.", "ane", 3), Q("List the steps a computer follows to complete a task on {T}.", "ru", 3),
        Q("Write the steps to use {K} to complete a task in {T}.", "ra", 3), Q("Design a small program idea that uses {K} to solve a problem in {T}. Write its steps.", "ec", 3)],
      lang: [Q("Find and correct the mistakes in two sentences about {T} that use the word “{K}”.", "an", 3), Q("Write a jumbled sentence about {T} that uses “{K}”, then rearrange it correctly.", "ua", 2),
        Q("Write a short paragraph on {T} that uses “{K}” correctly.", "ac", 3), Q("Choose the correct form of “{K}” to complete a sentence about {T}.", "ra", 2)],
      soc: [Q("How would you use a map, timeline or table to find out more about {K} in {T}?", "an", 3), Q("What steps would you follow to find out the causes of {K} in {T}?", "an", 3),
        Q("Prepare a simple timeline or chart showing {K} in {T}.", "uac", 3), Q("Name the place, date or person linked with {K} in {T}.", "r", 2)],
      gen: [Q("How would you work out {K} in {T}? Explain step by step.", "ra", 3), Q("Solve a problem involving {T} that needs {K}. Show how you found the answer.", "an", 3),
        Q("Name one rule or fact you need to know to solve problems on {T}.", "r", 2), Q("Plan a small task or project on {T} that uses {K}. List your steps.", "ac", 3)]
    },
    rc: { /* Reading Comprehension: subject list + general list */
      lang: [Q("According to the text on {T}, what is the main idea about {K}?", "ru", 2), Q("Summarize the role of {K} in {T}.", "un", 3), Q("Find a line in the text on {T} that mentions {K}. What does it tell us?", "ra", 2),
        Q("Which sentence in the text on {T} best explains {K}? Give a reason.", "ne", 2), Q("Retell what the text on {T} says about {K} in your own words.", "u", 3)],
      soc: [Q("According to the text on {T}, what is the main function or role of {K}?", "ru", 2), Q("Summarize the role of {K} in {T}.", "un", 3), Q("According to the text on {T}, why was {K} important?", "ue", 2),
        Q("Write two facts about {K} from the text on {T}.", "r", 2), Q("What does the text on {T} suggest about the effects of {K}?", "ne", 3)],
      gen: [Q("According to the text on {T}, what is the main function of {K}?", "ru", 2), Q("Summarize the role of {K} in {T}.", "un", 3), Q("Write two facts about {K} from the text on {T}.", "r", 2),
        Q("Read the text on {T} again. What does it say about {K}? Explain in your own words.", "ua", 3)]
    },
    vg: { /* Vocabulary & Grammar */
      lang: [Q("Write a sentence about {K} in {T} in the past tense and in the future tense.", "an", 3), Q("Write a sentence about {T} with a blank in place of “{K}”, and give the answer.", "ua", 2), Q("Write two words that mean almost the same as a word used in {T}, then use both in sentences.", "ua", 3)],
      gen: [Q("Define the term {K} in the context of {T}.", "ru", 2), Q("Use {K} in a sentence describing {T}.", "ua", 2), Q("Write the meaning of {K} in simple words and give one example.", "ru", 2), Q("Write two words connected with {K} in {T}.", "r", 1)]
    },
    ct: { /* Critical Thinking */
      math: [Q("What would happen to the answer if {K} was changed? Explain with an example.", "na", 3)],
      cs: [Q("What would happen if {K} was removed from a program about {T}?", "ne", 3)],
      gen: [Q("What would happen if {K} was removed from {T}?", "ne", 3), Q("Compare and contrast {K} with another similar concept.", "ne", 3), Q("Why is {K} important for understanding {T}? Give two reasons.", "ue", 3),
        Q("Do you agree that {K} is the most important part of {T}? Justify your answer.", "e", 3), Q("Can you think of a situation where {K} does not work or apply in {T}? Explain.", "nc", 3)]
    },
    ar: { /* Application & Real-World */
      cs: [Q("How is {K} used in modern software or apps?", "ua", 3), Q("Give one example of an app or website that uses {K}.", "ra", 2), Q("Suggest one way to use {K} to make a task easier at school or at home.", "ac", 3)],
      math: [Q("Where do we use {K} when we shop, travel or measure? Give an example.", "ua", 3)],
      gen: [Q("How is {K} applied in everyday life?", "ua", 3), Q("Give a real-world example of {K} within {T}.", "ua", 3), Q("Suggest one way you could use {K} at home or in school.", "ac", 3), Q("Who uses {K} in their daily work? Explain how.", "ua", 3)]
    },
    oe: { /* Observation & Experimentation: only the subject's own list is used (falls back to gen) */
      sci: [Q("What observations can you make about {K} during a {T} experiment?", "un", 3), Q("What do you observe about {K} when you study {T} carefully? Record two observations.", "ru", 2),
        Q("What changes would you expect to see in {K} during an activity on {T}? Why?", "ane", 3), Q("Draw and label what you observe about {K} in {T}.", "ru", 3), Q("How can you find out whether your observation about {K} is correct?", "ne", 3)],
      cs: [Q("What happens on the screen when you execute {K}?", "ru", 2), Q("What do you observe on the screen when you use {K} in {T}? Describe each step.", "ua", 3), Q("Run a program that uses {K} with two different inputs. What differences do you notice?", "an", 3)],
      math: [Q("Observe the pattern in problems on {T} that involve {K}. What do you notice?", "un", 3), Q("Try {K} with two different numbers. What do you observe?", "an", 3)],
      lang: [Q("Observe how “{K}” is used in a short text on {T}. What do you notice?", "un", 3), Q("Compare how “{K}” is used in two different sentences. What do you observe?", "an", 3)],
      soc: [Q("Observe a picture, map or chart about {T}. What can you tell about {K}?", "ru", 3), Q("What differences do you observe in {K} between two places or periods in {T}?", "an", 3)],
      gen: [Q("Observe {K} carefully. What do you notice about it in relation to {T}?", "ru", 2), Q("What two things can you observe about {K} in {T}?", "r", 2)]
    }
  };
  const MERGE_GEN = { ps: false, rc: true, vg: true, ct: true, ar: true, oe: false };
  const poolFor = (skill, cat) => {
    const b = BANK[skill]; let p = (b[cat] || []).slice();
    /* Reading Comprehension for languages and social science already has a full list of its own */
    if (MERGE_GEN[skill] && cat !== "gen" && !(skill === "rc" && p.length)) p = p.concat(b.gen || []);
    return p.length ? p : (b.gen || []).slice();
  };

  /* ---------- general questions per thinking level (used when no skill is ticked, or to top up) ---------- */
  const LEVELQ = {
    r: { gen: [Q("What is {K}?", "r", 1), Q("Name two things related to {K} in {T}.", "r", 2), Q("State one important fact about {T}.", "r", 1), Q("Define {T} in one sentence.", "r", 2)],
      math: [Q("State the rule used for {T}.", "r", 2), Q("What is meant by {K} in {T}?", "r", 2), Q("Write the formula or steps used for {T}.", "r", 2)],
      cs: [Q("What is {K} in {T}?", "r", 1), Q("Name the parts or steps involved in {T}.", "r", 2), Q("State the use of {K} in {T}.", "r", 2)],
      lang: [Q("What does the word “{K}” mean?", "r", 1), Q("Name the parts or kinds of {T}.", "r", 2), Q("State one rule of {T}.", "r", 2)] },
    u: { gen: [Q("Explain {K} in your own words.", "u", 3), Q("Why is {K} important in {T}?", "u", 3), Q("Describe how {K} is connected to {T}.", "u", 3), Q("Explain the difference between {K} and another related idea.", "u", 3)],
      math: [Q("Explain the steps of {T} in your own words.", "u", 3), Q("Explain what {K} means with the help of an example.", "u", 3)] },
    a: { gen: [Q("Give an example of {K} from daily life.", "a", 2), Q("How can you use what you learned about {T}?", "a", 3), Q("Show how {K} works with a small example from {T}.", "a", 3)],
      math: [Q("Solve one example on {T} that uses {K}.", "a", 3), Q("Make up your own question on {T} and solve it.", "a", 3)],
      sci: [Q("Show {K} with a simple activity you can do with things at home.", "a", 3)],
      cs: [Q("Show the steps to do a task in {T} using {K}.", "a", 3)] },
    n: { gen: [Q("Compare {K} with another idea in {T}.", "n", 3), Q("What are the causes and effects of {K} in {T}?", "n", 3), Q("Which part of {T} is the most important? Why?", "n", 3), Q("Sort the ideas of {T} into groups and explain your groups.", "n", 3)] },
    e: { gen: [Q("Do you agree that {K} is important in {T}? Give reasons.", "e", 3), Q("Which is better: {K} or another idea from {T}? Explain.", "e", 3), Q("How could we check whether an idea about {K} is true?", "e", 3)] },
    c: { gen: [Q("Create a poster, chart or short talk on {T} that includes {K}.", "c", 3), Q("Write a new question about {K} for your classmates.", "c", 2), Q("Design a game or quiz that teaches {T}.", "c", 3), Q("Imagine {T} without {K}. Write three things that would change.", "c", 3)] }
  };
  const levelPool = (lv, cat) => (LEVELQ[lv][cat] || []).concat(cat !== "gen" ? LEVELQ[lv].gen : []);

  /* ---------- helpers ---------- */
  const hashStr = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const shuffled = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function fill(pattern, K, T, n) {
    let s = pattern.replace(/\{K\}/g, K).replace(/\{T\}/g, T).replace(/\{n\}/g, n);
    /* if the key word is the topic itself, do not say "X in X" */
    if (K.toLowerCase() === T.toLowerCase()) s = s.replace(new RegExp(escRe(K) + " (in|within|during|on|about|of) (a |the )?" + escRe(T), "i"), K);
    return s;
  }
  const keywordsOf = (v) => {
    const own = v.keywords.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean);
    if (own.length) return own;
    const def = (v.defaultKeywords || "").split(",").map((x) => x.trim()).filter(Boolean);
    return def.length ? def : [v.topic];
  };

  /* ---------- generation ----------
     seed 0  : patterns in bank order (steady default)
     seed > 0: patterns in random order with random numbers ("New questions") */
  function generate(v, seed) {
    const T = v.topic, K = keywordsOf(v), cat = v.cat || "gen", r = rng(hashStr(T.toLowerCase() + cat) + seed * 7919);
    const levels = (v.levels.length ? v.levels : ["r", "u", "a"]).slice().sort((a, b) => L_ORDER.indexOf(a) - L_ORDER.indexOf(b));
    const skills = v.skills, used = new Set(), out = [];
    let ki = seed === 0 ? 0 : Math.floor(r() * K.length);

    /* patterns used least so far come first, so the same sentence pattern is not repeated while others are unused */
    const patUse = new Map();
    const pick = (cands) => {
      const base = seed === 0 ? cands : shuffled(cands, r);
      const order = base.map((c, i) => [c, i]).sort((a, b) => (patUse.get(a[0][0]) || 0) - (patUse.get(b[0][0]) || 0) || a[1] - b[1]).map((x) => x[0]);
      for (const c of order) for (let j = 0; j < K.length; j++) {
        const kw = K[(ki + j) % K.length], text = fill(c[0], kw, T, seed === 0 ? 5 : 2 + Math.floor(r() * 8));
        if (!used.has(text)) { used.add(text); patUse.set(c[0], (patUse.get(c[0]) || 0) + 1); ki += j + 1; return { text, lines: c[2] }; }
      }
      return null;
    };
    /* every (level, skill) pair is visited in a spread-out order, so each skill meets each level */
    const combos = [];
    levels.forEach((l) => (skills.length ? skills : [null]).forEach((s) => combos.push([l, s])));
    let step = Math.max(1, Math.round(combos.length / 3)); const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    while (gcd(step, combos.length) !== 1) step++;
    for (let i = 0; i < v.count; i++) {
      const [lv, sk] = combos[(i * step) % combos.length];
      let got = null, label = sk;
      if (sk) {
        const pool = poolFor(sk, cat), fit = pool.filter((p) => p[1].includes(lv));
        got = (fit.length && pick(fit)) || pick(pool);
      }
      if (!got) { label = null; got = pick(levelPool(lv, cat)); }
      if (!got) for (const other of L_ORDER) { got = pick(levelPool(other, cat)); if (got) break; }
      if (got) out.push({ level: lv, skill: label, text: got.text, lines: got.lines });
    }
    return out.sort((a, b) => L_ORDER.indexOf(a.level) - L_ORDER.indexOf(b.level));
  }
  /* "New questions": try many seeds and keep the one sharing the fewest questions with the current list */
  function otherSeed(v, current) {
    const have = new Set(current.map((q) => q.text));
    let best = 1, bestScore = Infinity;
    for (let i = 0; i < 120; i++) {
      const s = 1 + Math.floor(Math.random() * 100000), score = generate(v, s).filter((q) => have.has(q.text)).length;
      if (score < bestScore) { best = s; bestScore = score; if (!score) break; }
    }
    return best;
  }

  /* ---------- output markup ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LINE = "________________________________________________";
  function listHTML(v, qs) {
    if (!qs.length) return '<div class="empty"><div class="e-icon">❓</div><p>No questions could be made. Try other levels or skills.</p></div>';
    return `<h2>${esc(v.topic)}: Classroom Questions</h2><div class="muted">${esc([v.subject, v.cls].filter(Boolean).join(" · "))} · ${qs.length} questions</div>
      <ol class="qg-list">${qs.map((q) => `<li>${esc(q.text)} <span class="badge">${LEVELS[q.level]}</span>${q.skill ? ` <span class="badge badge-app">${SKILLS[q.skill]}</span>` : ""}</li>`).join("")}</ol>`;
  }
  /* Worksheet: header, title, numbered questions, answer lines. Inline styles so Word keeps the layout. */
  function worksheetHTML(v, qs) {
    if (!qs.length) return "";
    return `<div class="ws" style="font-family:Arial,sans-serif">
      <p class="ws-head" style="margin:0 0 14px;font-size:12pt">Name: _______________ &nbsp;&nbsp;&nbsp; Class: _______ &nbsp;&nbsp;&nbsp; Date: _______________</p>
      <h2 style="text-align:center;margin:6px 0 2px;font-size:18pt">${esc(v.topic)} Worksheet</h2>
      <p class="ws-sub" style="text-align:center;margin:0 0 16px;color:#444;font-size:11pt">(Subject: ${esc(v.subject)})</p>
      <ol style="font-size:12pt">${qs.map((q) => `<li style="margin-bottom:14px"><p style="margin:0 0 4px">${esc(q.text)}</p>${Array.from({ length: q.lines }, () => `<div class="ws-line" style="margin:2px 0;color:#333">${LINE}</div>`).join("")}</li>`).join("")}</ol></div>`;
  }

  window.SKQuestionBank = { SUBJECTS, LEVELS, SKILLS, generate, otherSeed, listHTML, worksheetHTML };
})();
