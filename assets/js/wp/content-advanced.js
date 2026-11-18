/* Writing Practice – ADVANCED content (independent writing). Same formats as content-beginner.js. */
(function () {
  "use strict";
  const { pick, shuffle, esc } = SK;
  const ok = (m) => ({ ok: true, msg: m }), no = (m) => ({ ok: false, msg: m });
  const capEnd = (v) => (!/^[A-Z"“]/.test(v) ? no("Start with a capital letter.") : !/[.!?]["”]?$/.test(v) ? no("End with a full stop, question mark or exclamation mark.") : null);

  const JUMBLED = ["The children are playing football in the field.", "My grandmother tells us stories at night.", "We should wash our hands before eating.", "The farmer grows rice in his field.", "A rainbow appeared after the rain.", "The little bird built a nest in the tree."];
  const SHORT = [["The dog barks.", "dog"], ["The girl sings.", "girl"], ["The car moves.", "car"], ["The flower is red.", "flower"], ["The boy runs.", "boy"]];
  const ADJ = [["The ___ elephant drank water.", ["huge", "quickly", "under"], "huge"], ["She wore a ___ dress.", ["beautiful", "slowly", "and"], "beautiful"], ["We saw a ___ snake.", ["long", "ran", "the"], "long"], ["The ___ baby slept.", ["tiny", "loudly", "was"], "tiny"], ["It was a ___ day.", ["sunny", "sing", "very"], "sunny"]];
  const JOIN = [["I was tired, ___ I went to bed early.", ["so", "but", "because"], "so"], ["I like tea ___ my brother likes coffee.", ["but", "so", "because"], "but"], ["She was happy ___ she won the race.", ["because", "but", "or"], "because"], ["Do you want rice ___ roti?", ["or", "so", "because"], "or"], ["He ran fast ___ he missed the bus.", ["but", "so", "or"], "but"]];
  const GRAM = [["She go to school every day.", "She goes to school every day."], ["They was playing in the park.", "They were playing in the park."], ["I has a red pen.", "I have a red pen."], ["He don't like milk.", "He doesn't like milk."], ["The birds is singing.", "The birds are singing."], ["Yesterday I go to the market.", "Yesterday I went to the market."]];
  const INCOMPLETE = ["When it rains,", "My favourite game is", "After school, I", "The old man was", "If I had wings,"];

  WP.add({
    id: "sentence-construction", level: "advanced", name: "Sentence Construction", icon: "🏗️",
    short: "Building, expanding, joining and correcting sentences.",
    objective: "Construct correct, interesting sentences: ordering words, adding describing words, joining ideas and fixing errors.",
    skills: ["Word order", "Adjectives", "Conjunctions", "Grammar", "Sentence expansion"],
    outcome: "The child writes correct sentences and makes them richer with adjectives and joining words.",
    assess: ["Words are in a sensible order", "Uses adjectives to add detail", "Joins ideas with and, but, because, so", "Corrects grammar errors"],
    support: ["Give word cards to move around.", "Offer a word bank of adjectives and joining words.", "Start with sentences of 4–5 words."],
    teacher: ["Model expanding: ‘The dog barks.’ → ‘The small brown dog barks loudly at night.’", "Read sentences aloud to hear if they sound right."],
    diff: { Easy: "Order 4–5 words; choose from options.", Medium: "Expand with one adjective; join two ideas.", Difficult: "Correct errors; write complex sentences." },
    subs: { build: "Building sentences", expand: "Expanding", join: "Joining", correct: "Correcting" },
    ws: ["sentences", "grammar"],
    acts: [
      ["Create sentences from given words", "build", "PDW", 10, "Word sets", ["Give 3–4 words (river, boat, slowly).", "Children write one sentence using all.", "Share and compare."], "Use all the words in one good sentence.", null, null],
      ["Arrange jumbled sentences", "build", "DWG", 8, "Sentence strips cut into words", ["Give jumbled words.", "Arrange into a sentence with the capital first and full stop last."], "Put the words in order.", null, null],
      ["Expand short sentences", "expand", "DW", 10, "Short sentences", ["Write ‘The dog barks.’", "Ask: what kind of dog? where? when? how?", "Children write the expanded sentence."], "Make the sentence longer and more interesting.", null, null],
      ["Use adjectives", "expand", "DW", 8, "Adjective word bank", ["Show a picture.", "List describing words.", "Fill gaps with the best adjective."], "Choose a describing word.", null, null],
      ["Use joining words", "join", "DWG", 8, "and, but, because, so, or cards", ["Give two short sentences.", "Join them with the best joining word."], "Join the two ideas.", null, null],
      ["Correct grammatical errors", "correct", "DW", 10, "Sentences with mistakes", ["Read each sentence aloud.", "Find what sounds wrong.", "Rewrite it correctly."], "Find the mistake and fix it.", null, null],
      ["Complete incomplete sentences", "build", "DW", 8, "Sentence starters", ["Give a starter: ‘When it rains, …’", "Children complete it sensibly."], "Finish the sentence.", null, null]
    ],
    practice: [
      { id: "jumble", t: "Arrange jumbled sentences", w: "builder", cfg: { gen: () => { const s = pick(JUMBLED), w = s.split(" "); return { prompt: "Put the words in the right order.", pieces: w, answer: w, sep: " " }; } } },
      { id: "given", t: "Create a sentence from words", w: "typecheck", cfg: { gen: () => { const set = pick([["river", "boat", "slowly"], ["teacher", "book", "class"], ["rain", "umbrella", "school"], ["market", "mother", "vegetables"], ["kite", "wind", "high"]]); return { prompt: `Use all these words in one sentence: <b>${set.join(", ")}</b>`, answer: "Any correct sentence using all the words.", check: (v) => { const m = set.filter((x) => !v.toLowerCase().includes(x)); return m.length ? no("Use the word: " + m[0]) : v.split(/\s+/).length < 5 ? no("Write a full sentence of at least 5 words.") : capEnd(v) || ok("Well built!"); } }; } } },
      { id: "expand", t: "Expand a short sentence", w: "typecheck", cfg: { gen: () => { const [s, n] = pick(SHORT); return { prompt: `Make this sentence longer and more interesting:<br><span class="wp-sent">${s}</span>`, answer: "e.g. The small brown " + n + " … (add what kind, where, when or how).", check: (v) => (!v.toLowerCase().includes(n) ? no(`Keep the word “${n}”.`) : v.split(/\s+/).length < s.split(" ").length + 3 ? no("Add at least three more words: what kind? where? when?") : capEnd(v) || ok("Much more interesting!")) }; } } },
      { id: "adj", t: "Choose the describing word", w: "quiz", cfg: { gen: () => { const [s, o, a] = pick(ADJ); return { prompt: `<span class="wp-sent">${s}</span>`, choices: shuffle(o).map((x) => ({ h: `<span class="wp-wordbtn">${x}</span>`, ok: x === a })), cols: 3 }; } } },
      { id: "join", t: "Joining words", w: "quiz", cfg: { gen: () => { const [s, o, a] = pick(JOIN); return { prompt: `<span class="wp-sent">${s}</span>`, choices: shuffle(o).map((x) => ({ h: `<span class="wp-wordbtn">${x}</span>`, ok: x === a })), cols: 3 }; } } },
      { id: "fix", t: "Correct the grammar", w: "edit", cfg: { sets: { Grammar: GRAM.map(([w, r]) => [w, r, "One word is wrong. Fix it."]) } } },
      { id: "finish", t: "Complete the sentence", w: "typecheck", cfg: { gen: () => { const s = pick(INCOMPLETE); return { prompt: `Finish this sentence:<br><span class="wp-sent">${s} …</span>`, prefill: s + " ", answer: s + " … (any sensible ending).", check: (v) => (!v.startsWith(s) ? no("Keep the beginning of the sentence.") : v.length < s.length + 8 ? no("Add a little more.") : capEnd(v) || ok("Good ending!")) }; } } }
    ]
  });

  const SCENES = [
    { title: "Playground", e: "🛝⚽🧒👧🌳☀️", q: ["What can you see?", "How many children are playing?", "What games are they playing?", "Describe the picture in five sentences."], w: ["playground", "swing", "slide", "football", "children", "happy", "sunny", "friends"] },
    { title: "Market", e: "🧺🥕🍅🍌👩‍🌾🛒", q: ["Where is this?", "What is being sold?", "Who is buying and who is selling?", "Describe the market in five sentences."], w: ["market", "vegetables", "fruits", "seller", "basket", "busy", "fresh", "price"] },
    { title: "Rainy day", e: "🌧️☂️👦🐸💧🏠", q: ["What is the weather like?", "What is the boy holding?", "What animals like the rain?", "Describe a rainy day in five sentences."], w: ["rain", "umbrella", "puddle", "wet", "clouds", "frog", "splash", "cool"] },
    { title: "Village farm", e: "🐄🌾👨‍🌾🚜🐓🏡", q: ["What animals can you see?", "What is the farmer doing?", "What grows in the field?", "Describe the farm in five sentences."], w: ["farmer", "cow", "field", "crops", "tractor", "hen", "village", "work"] },
    { title: "Birthday party", e: "🎂🎈🎁👧👦🎉", q: ["What is happening?", "What can you see on the table?", "How do the children feel?", "Describe the party in five sentences."], w: ["birthday", "cake", "balloons", "gifts", "candles", "friends", "celebrate", "happy"] },
    { title: "Railway station", e: "🚆🧳👨‍👩‍👧🕰️🎫", q: ["Where is this family?", "What are they carrying?", "Where might they be going?", "Describe the station in five sentences."], w: ["train", "platform", "luggage", "ticket", "journey", "crowd", "wait", "travel"] }
  ];
  WP.SCENES = SCENES;
  WP.add({
    id: "picture-composition", level: "advanced", name: "Picture Composition", icon: "🖼️",
    short: "Look at a picture, answer questions and describe it.",
    objective: "Describe a picture in well-organised sentences using a word bank and guiding questions.",
    skills: ["Observation", "Descriptive writing", "Vocabulary use", "Organising sentences"],
    outcome: "The child writes five or more connected sentences describing a picture.",
    assess: ["Describes what is in the picture", "Answers the guiding questions", "Uses words from the word bank", "Writes in connected sentences"],
    support: ["Talk about the picture before writing.", "Give sentence starters: ‘In the picture I can see…’", "Accept three sentences at first."],
    teacher: ["Pick a picture at random or choose one.", "Use the teacher feedback rubric after the child saves."],
    diff: { Easy: "Answer two questions in sentences.", Medium: "Write five sentences.", Difficult: "Write a full paragraph with an opening and ending." },
    subs: { describe: "Describe a picture", answer: "Answer questions" },
    ws: ["picture"],
    acts: [
      ["Describe a playground picture", "describe", "PDW", 15, "Picture, word bank", ["Show the picture.", "Discuss the questions orally.", "Children write five sentences.", "Read aloud and give feedback."], "Look carefully. Write five sentences about the picture.", null, null],
      ["Picture question answers", "answer", "DW", 10, "Picture with 4 questions", ["Children answer each question in a full sentence.", "Then join the answers into a paragraph."], "Answer each question with a full sentence.", null, null],
      ["Picture talk circle", "describe", "PG", 10, "Large picture", ["Each child says one sentence about the picture.", "The teacher writes them on the board.", "The class orders them into a paragraph."], "Say one sentence about the picture.", null, null],
      ["Picture composition worksheet", "describe", "W", 15, "Printed picture worksheet", ["Print a worksheet with a picture, questions and lines.", "Children write independently."], "Write about the picture on the lines.", null, null]
    ],
    practice: [{ id: "write", t: "Picture composition", w: "writepad", about: "Random picture, questions, word bank, writing space and teacher evaluation.", cfg: { min: 30, prompts: SCENES.map((s) => ({ title: s.title, intro: `<div class="wp-scene">${s.e}</div>`, questions: s.q, words: s.w, min: 30 })) } }]
  });

  const TOPICS = [
    ["My School", "Write about your school: its name, building, teachers, friends and what you like.", ["classroom", "teacher", "playground", "library", "friends", "learn"], ["What is the name of your school?", "What does it look like?", "Who are your teachers and friends?", "What do you like most there?"]],
    ["My Family", "Write about the people in your family and what you do together.", ["mother", "father", "grandparents", "together", "help", "love"], ["Who are the members of your family?", "What do they do?", "What do you do together?", "Why do you love your family?"]],
    ["My Best Friend", "Describe your best friend and why they are special.", ["kind", "share", "play", "help", "laugh", "trust"], ["What is your friend's name?", "What does your friend look like?", "What do you do together?", "Why is this person your best friend?"]],
    ["My Village", "Describe your village or town: places, people and work.", ["fields", "river", "market", "temple", "people", "peaceful"], ["What is the name of your village or town?", "What can you see there?", "What work do people do?", "What do you like about it?"]],
    ["My Favourite Fruit", "Write about your favourite fruit: colour, taste and why you like it.", ["juicy", "sweet", "colour", "healthy", "season", "tree"], ["Which fruit do you like most?", "What colour and shape is it?", "How does it taste?", "Why is it good for you?"]],
    ["My Favourite Teacher", "Write about a teacher you like and what you learn from them.", ["kind", "explains", "patient", "helps", "subject", "respect"], ["Who is your favourite teacher?", "What do they teach?", "How do they help you?", "What have you learned from them?"]],
    ["A Rainy Day", "Describe a rainy day: the sky, sounds, smells and what you do.", ["clouds", "thunder", "puddles", "umbrella", "cool", "smell"], ["What does the sky look like?", "What can you hear and smell?", "What do people do?", "How do you feel on a rainy day?"]]
  ];
  WP.TOPICS = TOPICS;
  WP.add({
    id: "paragraph", level: "advanced", name: "Guided Paragraph Writing", icon: "📄",
    short: "Paragraphs on familiar topics with vocabulary, guiding questions and feedback.",
    objective: "Write a well-organised paragraph with an opening sentence, supporting details and a closing sentence.",
    skills: ["Topic sentence", "Supporting details", "Closing sentence", "Vocabulary"],
    outcome: "The child writes a paragraph of 6–10 sentences on a familiar topic.",
    assess: ["Has an opening (topic) sentence", "Gives at least three details", "Ends with a closing sentence", "Uses capitals and full stops"],
    support: ["Answer the guiding questions first, then join the answers.", "Give a paragraph frame.", "Accept 4–5 sentences at first."],
    teacher: ["Explain the ‘burger’: top bun = opening, filling = details, bottom bun = ending.", "Use the word counter and rubric for feedback."],
    diff: { Easy: "4–5 sentences with a frame.", Medium: "6–8 sentences.", Difficult: "8–10 sentences with varied sentence starters." },
    subs: { guided: "Guided paragraphs", free: "Free paragraphs" },
    ws: ["paragraph"],
    acts: TOPICS.slice(0, 5).map(([t]) => [`Paragraph: ${t}`, "guided", "PDW", 20, "Topic card, vocabulary list, lined paper", ["Introduce the topic and talk about it.", "Read the guiding questions.", "Children plan in 3–4 points.", "Write the paragraph and check it."], `Write a paragraph about ${t.toLowerCase()}.`, null, null]).concat([["Paragraph burger", "free", "PG", 15, "Burger cut-outs (bun, filling, bun)", ["Write the opening sentence on the top bun.", "Three details on the fillings.", "The closing sentence on the bottom bun."], "Build your paragraph burger!", null, null]]),
    practice: [{ id: "write", t: "Paragraph writing", w: "writepad", cfg: { min: 50, prompts: TOPICS.map(([t, intro, w, q]) => ({ title: t, intro: `<p>${esc(intro)}</p>`, questions: q, words: w, min: 50 })) } }]
  });

  const CREATIVE = [
    ["Complete the story", "One morning, Meena found a tiny golden key under her pillow. She…", ["mysterious", "door", "suddenly", "whisper", "surprise"]],
    ["Imagine and write", "Imagine you woke up as a bird. Where would you fly? What would you see?", ["wings", "sky", "clouds", "free", "below"]],
    ["Write an alternative ending", "The hare stopped to sleep during the race… Write a different ending to the hare and the tortoise.", ["race", "finish", "instead", "learned", "lesson"]],
    ["Describe an imaginary character", "Invent a creature. What does it look like? Where does it live? What can it do?", ["strange", "glowing", "tail", "power", "friendly"]],
    ["An unusual situation", "What if your school bag could talk? Write what it says to you one day.", ["complain", "heavy", "books", "laugh", "secret"]],
    ["Create a short poem", "Write a 4–6 line poem about rain, the moon or your mother. Try to make lines rhyme.", ["bright", "night", "light", "sing", "spring"]]
  ];
  WP.add({
    id: "creative", level: "advanced", name: "Creative Writing", icon: "💡",
    short: "Completing stories, imagining, alternative endings, characters and poems.",
    objective: "Express ideas imaginatively and originally in writing.",
    skills: ["Imagination", "Descriptive language", "Voice", "Poetry"],
    outcome: "The child writes an original piece with imaginative ideas and descriptive words.",
    assess: ["Ideas are original", "Uses describing words", "Has a clear beginning and end", "Writing is easy to follow"],
    support: ["Talk about the idea before writing.", "Draw first, then write.", "Use the word bank."],
    teacher: ["Accept invented spelling in first drafts; focus on ideas.", "Share pieces in an ‘author's chair’."],
    diff: { Easy: "Five sentences.", Medium: "A half-page piece.", Difficult: "A full page with dialogue or a poem with rhyme." },
    subs: { story: "Story ideas", poem: "Poems", imagine: "Imagination" },
    ws: ["creative"],
    acts: CREATIVE.map(([t, p]) => [t, /poem/i.test(t) ? "poem" : /story|ending/i.test(t) ? "story" : "imagine", "PDW", 20, "Prompt card, writing paper", ["Read the prompt together.", "Brainstorm ideas on the board for 3 minutes.", "Children write independently.", "Volunteers read their work aloud."], p, null, null]),
    practice: [{ id: "write", t: "Creative writing", w: "writepad", cfg: { min: 40, prompts: CREATIVE.map(([t, p, w]) => ({ title: t, intro: `<p>${esc(p)}</p>`, words: w, min: /poem/i.test(t) ? 20 : 40 })) } }]
  });

  const CHAR = ["a clever fox", "a brave girl named Asha", "a lazy lion", "a talking tree", "a little robot", "an old fisherman"], SET = ["a deep forest", "a busy city", "a village by a river", "a school at night", "the moon", "an island"], PROB = ["got lost", "lost something precious", "had to save a friend", "found a secret door", "was stuck in a storm", "met a hungry tiger"], SOL = ["used a clever trick", "asked friends for help", "never gave up", "solved a riddle", "showed kindness", "found a map"];
  const STORIES = [["Once upon a time, a crow was very thirsty.", "He found a pot with a little water at the bottom.", "He dropped pebbles into the pot one by one.", "The water rose to the top.", "The crow drank the water and flew away happily."], ["Riya planted a small seed in a pot.", "She watered it every day.", "After a week, a green shoot came up.", "Soon it grew into a plant with a red flower.", "Riya was proud of her plant."], ["The bell rang and the children ran out to play.", "Arjun fell and hurt his knee.", "His friend Sam helped him up.", "The teacher cleaned the wound.", "Arjun thanked Sam for being a good friend."]];
  WP.add({
    id: "story", level: "advanced", name: "Story Writing", icon: "📚",
    short: "Story beginnings, characters, settings, problems and solutions, and story order.",
    objective: "Plan and write a complete story with a beginning, a problem and a solution.",
    skills: ["Story structure", "Characters and setting", "Sequencing", "Narrative writing"],
    outcome: "The child writes a story with a clear beginning, middle (problem) and end (solution).",
    assess: ["Introduces a character and setting", "Has a problem", "Has a solution and ending", "Events are in order"],
    support: ["Use the story builder cards to plan.", "Tell the story aloud first.", "Draw a 3-box comic as a plan."],
    teacher: ["Teach Beginning – Middle – End with a familiar story first.", "Use the sequencing game to practise order."],
    diff: { Easy: "Order a 5-sentence story; write 3 sentences.", Medium: "Use the story builder; write 8 sentences.", Difficult: "Write a full story with dialogue." },
    subs: { plan: "Planning", order: "Story order", write: "Writing stories" },
    ws: ["story"],
    acts: [
      ["Story beginnings", "write", "PDW", 20, "Story starter cards", ["Read a story starter.", "Children continue the story.", "Check: problem and solution?"], "Continue the story.", null, null],
      ["Character and setting selection", "plan", "DG", 10, "Character and setting cards", ["Children pick a character card and a setting card.", "They describe both in 2 sentences each."], "Choose your hero and where the story happens.", null, null],
      ["Problem and solution prompts", "plan", "PDW", 15, "Problem and solution cards", ["Pick a problem card.", "Think of a clever solution.", "Write the middle and the end."], "What goes wrong? How is it solved?", null, null],
      ["Story sequence arrangement", "order", "DWG", 8, "Story sentence strips", ["Give the sentences of a story mixed up.", "Arrange them in order.", "Read the story aloud."], "Put the story in the right order.", null, null],
      ["Independent story writing", "write", "PW", 25, "Story plan, lined paper", ["Plan with the story builder.", "Write the full story.", "Add a title."], "Write your own story!", null, null]
    ],
    practice: [
      { id: "builder", t: "Story builder", w: "writepad", about: "Pick a ready plan or press Surprise me, then write.", cfg: { min: 60, prompts: Array.from({ length: 6 }, (_, i) => { const c = CHAR[i], s = SET[(i + 2) % 6], p = PROB[(i + 1) % 6], so = SOL[(i + 3) % 6]; return { title: `${c[0].toUpperCase() + c.slice(1)} in ${s}`, intro: `<div class="wp-plan"><div><b>Character</b>${esc(c)}</div><div><b>Setting</b>${esc(s)}</div><div><b>Problem</b>${esc(p)}</div><div><b>Solution</b>${esc(so)}</div></div><p class="small">Beginning: introduce ${esc(c)} in ${esc(s)}. Middle: ${esc(c)} ${esc(p)}. End: ${esc(c)} ${esc(so)}.</p>`, words: ["Once upon a time", "One day", "Suddenly", "Then", "Finally", "In the end"], min: 60 }; }) } },
      { id: "order", t: "Story sequence", w: "builder", cfg: { rounds: 3, gen: (i) => { const s = STORIES[i % STORIES.length]; return { prompt: "Put the story in the right order.", pieces: s, answer: s, sep: " ", block: true }; } } }
    ]
  });

  const FUNC = [
    { id: "invitation", name: "Invitation", about: "Invite people to an event: what, when, where and who is inviting.", fields: [["event", "Event", "Birthday party"], ["to", "Dear …", "Dear friends"], ["date", "Date and time", "Sunday, 5 May, 4 pm"], ["place", "Place", "My house, 12 MG Road"], ["body", "Message", "Please come and celebrate with me.", 1], ["from", "From", "Riya"]],
      render: (o, f) => `<div style="text-align:center"><h3>🎉 You are invited! 🎉</h3><p><b>${f("event", "Event")}</b></p></div><p>${f("to", "Dear …")},</p><p>${f("body", "Message")}</p><p><b>Date and time:</b> ${f("date", "Date and time")}<br><b>Place:</b> ${f("place", "Place")}</p><p>From,<br>${f("from", "Your name")}</p>`,
      example: { event: "My 9th Birthday Party", to: "Dear friends", date: "Sunday, 5 May, 4:00 pm", place: "12 MG Road, Dibrugarh", body: "Please come and celebrate my birthday with games, cake and fun.", from: "Riya" } },
    { id: "message", name: "Message", about: "A short message taken for someone else: who called, what they said, time.", fields: [["date", "Date and time", "Monday, 10 am"], ["to", "To", "Mother"], ["body", "Message", "Aunt called…", 1], ["from", "From", "Rahul"]],
      render: (o, f) => `<div style="border:2px solid #333;padding:12px"><p><b>Date and time:</b> ${f("date", "Date and time")}</p><p><b>To:</b> ${f("to", "To")}</p><p>${f("body", "Message")}</p><p><b>From:</b> ${f("from", "From")}</p></div>`,
      example: { date: "Monday, 10:30 am", to: "Mother", body: "Aunt Meera called. She will visit us on Saturday evening and asked you to call her back.", from: "Rahul" } },
    { id: "notice", name: "Notice", about: "A school notice: heading NOTICE, school name, date, title, details, name and designation.", fields: [["school", "School name", "Maniram Dewan LPS"], ["date", "Date", "15 November 2026"], ["title", "Title", "Drawing Competition"], ["body", "Details (what, when, where, who)", "A drawing competition…", 1], ["name", "Name", "Prem Gupta"], ["role", "Designation", "Class Teacher"]],
      render: (o, f) => `<div style="border:2px solid #333;padding:12px"><p style="text-align:center"><b>${f("school", "School name")}</b><br><b>NOTICE</b></p><p style="text-align:right">${f("date", "Date")}</p><p style="text-align:center"><b><u>${f("title", "Title")}</u></b></p><p>${f("body", "Details")}</p><p>${f("name", "Name")}<br>${f("role", "Designation")}</p></div>`,
      example: { school: "Maniram Dewan LPS", date: "15 November 2026", title: "Drawing Competition", body: "A drawing competition will be held on 20 November 2026 in the school hall at 10 am. Students of Classes 3 to 5 may take part. Bring your own colours. Give your names to your class teacher by 18 November.", name: "Prem Gupta", role: "Class Teacher" } },
    { id: "report", name: "Short report", about: "A short report of an event: heading, by-line, what, when, where, who, and how it went.", fields: [["title", "Heading", "Sports Day at our school"], ["by", "Reported by", "Asha, Class 5"], ["what", "What happened, when and where", "Our sports day was held…", 1], ["detail", "Details and how it ended", "Races, prizes…", 1]],
      render: (o, f) => `<h3 style="text-align:center">${f("title", "Heading")}</h3><p style="text-align:center"><i>— ${f("by", "Reported by")}</i></p><p>${f("what", "What, when, where")}</p><p>${f("detail", "Details and ending")}</p>`,
      example: { title: "Sports Day at Our School", by: "Asha, Class 5", what: "Our school held its annual sports day on 12 November 2026 on the school field. All students took part.", detail: "There were running races, sack races and a tug of war. The headmaster gave prizes to the winners. Everyone enjoyed the day." } }
  ];
  WP.FUNC = FUNC;
  WP.add({
    id: "functional", level: "advanced", name: "Functional Writing", icon: "📢",
    short: "Invitations, messages, notices and short reports in the right format.",
    objective: "Write everyday texts in the correct format for their purpose.",
    skills: ["Format awareness", "Purpose and audience", "Concise writing"],
    outcome: "The child writes invitations, messages, notices and reports in the correct format.",
    assess: ["Uses the correct format", "Includes all key details (what, when, where, who)", "Language suits the reader", "Is brief and clear"],
    support: ["Give the template with labelled boxes.", "Use the ‘Fill example’ to show a model first.", "Check details with a what/when/where/who list."],
    teacher: ["Show a real notice or invitation from school first.", "Children check each other's work for missing details."],
    diff: { Easy: "Fill a template.", Medium: "Write with a checklist.", Difficult: "Write without a template." },
    subs: { invite: "Invitations", message: "Messages", notice: "Notices", report: "Reports" },
    ws: ["functional"],
    acts: [
      ["Write an invitation", "invite", "PDW", 15, "Template, coloured paper", ["Show a model invitation.", "Children write an invitation to a class event.", "Check: what, when, where, who?"], "Invite your friends to a party.", null, null],
      ["Take a message", "message", "PDW", 10, "Message pad", ["Role-play a phone call.", "Children write the message for someone else."], "Write down the message.", null, null],
      ["Write a school notice", "notice", "PDW", 15, "Notice format", ["Show the notice format.", "Children write a notice for a school event."], "Write a notice for the school board.", null, null],
      ["Write a short report", "report", "PDW", 20, "Report format", ["Discuss a recent school event.", "Children write a short report."], "Report what happened.", null, null],
      ["Format detectives", "notice", "G", 10, "Jumbled parts of a notice", ["Teams arrange parts of a notice in the right order."], "Put the notice together!", null, null]
    ],
    practice: [{ id: "tpl", t: "Guided templates", w: "template", cfg: { templates: FUNC } }]
  });

  const LETTERS = [
    { id: "informal", name: "Informal letter", about: "To a friend or relative: address, date, greeting, body, closing and name.", fields: [["addr", "Your address", "12 MG Road, Dibrugarh"], ["date", "Date", "17 November 2026"], ["greet", "Greeting", "Dear Riya,"], ["body", "Body", "I hope you are well…", 1], ["close", "Closing", "Your loving friend,"], ["name", "Your name", "Asha"]],
      render: (o, f) => `<p style="text-align:right">${f("addr", "Your address")}<br>${f("date", "Date")}</p><p>${f("greet", "Dear …,")}</p><p>${f("body", "Body of the letter")}</p><p>${f("close", "Your loving friend,")}<br>${f("name", "Your name")}</p>`,
      example: { addr: "12 MG Road\nDibrugarh, Assam", date: "17 November 2026", greet: "Dear Riya,", body: "I hope you are well. Last week we had our school sports day. I won second prize in the running race! I wish you were here to see it.\n\nPlease write back soon and tell me about your new school.", close: "Your loving friend,", name: "Asha" } },
    { id: "formal", name: "Formal letter", about: "To an officer or organisation: sender's address, date, receiver's address, subject, salutation, body, closing.", fields: [["addr", "Your address", "12 MG Road, Dibrugarh"], ["date", "Date", "17 November 2026"], ["to", "Receiver's address", "The Municipal Officer, Dibrugarh"], ["subject", "Subject", "Cleaning of the drain"], ["body", "Body", "I wish to bring to your notice…", 1], ["name", "Your name", "Asha Das"]],
      render: (o, f) => `<p>${f("addr", "Your address")}</p><p>${f("date", "Date")}</p><p>To,<br>${f("to", "Receiver's address")}</p><p><b>Subject:</b> ${f("subject", "Subject")}</p><p>Sir/Madam,</p><p>${f("body", "Body")}</p><p>Yours faithfully,<br>${f("name", "Your name")}</p>`,
      example: { addr: "12 MG Road\nDibrugarh", date: "17 November 2026", to: "The Municipal Officer\nDibrugarh Municipal Board\nDibrugarh", subject: "Cleaning of the drain in MG Road", body: "I wish to bring to your notice that the drain in our lane has been blocked for two weeks. Dirty water is spreading on the road and mosquitoes are breeding.\n\nI request you to kindly get the drain cleaned as soon as possible.", name: "Asha Das" } },
    { id: "leave", name: "Leave application", about: "To the headteacher: date, To, subject, salutation, reason and dates, closing.", fields: [["date", "Date", "17 November 2026"], ["to", "To", "The Headmaster, Maniram Dewan LPS"], ["subject", "Subject", "Leave for two days"], ["body", "Reason and dates", "I am suffering from fever…", 1], ["name", "Your name and class", "Rahul, Class 5"]],
      render: (o, f) => `<p>${f("date", "Date")}</p><p>To,<br>${f("to", "The Headmaster / Headmistress")}</p><p><b>Subject:</b> ${f("subject", "Subject")}</p><p>Respected Sir/Madam,</p><p>${f("body", "Reason and dates")}</p><p>Thanking you.<br>Yours obediently,<br>${f("name", "Your name and class")}</p>`,
      example: { date: "17 November 2026", to: "The Headmaster\nManiram Dewan LPS", subject: "Application for two days' leave", body: "I am suffering from fever since last night and the doctor has advised me to rest. Kindly grant me leave for two days, 17 and 18 November 2026.", name: "Rahul Kumar\nClass 5, Roll No. 12" } },
    { id: "request", name: "Request application", about: "A request to the headteacher (e.g. library card, sports kit).", fields: [["date", "Date", "17 November 2026"], ["to", "To", "The Headmistress"], ["subject", "Subject", "Request for a library card"], ["body", "Request and reason", "I would like to borrow books…", 1], ["name", "Your name and class", "Asha, Class 4"]],
      render: (o, f) => `<p>${f("date", "Date")}</p><p>To,<br>${f("to", "The Headmaster / Headmistress")}</p><p><b>Subject:</b> ${f("subject", "Subject")}</p><p>Respected Sir/Madam,</p><p>${f("body", "Request and reason")}</p><p>Thanking you.<br>Yours obediently,<br>${f("name", "Your name and class")}</p>`,
      example: { date: "17 November 2026", to: "The Headmistress\nManiram Dewan LPS", subject: "Request for a library card", body: "I love reading storybooks. I request you to kindly issue me a library card so that I can borrow books from the school library.", name: "Asha\nClass 4" } }
  ];
  WP.LETTER_TPL = LETTERS;
  WP.add({
    id: "letters", level: "advanced", name: "Letter and Application Writing", icon: "✉️",
    short: "Informal and formal letters, leave and request applications.",
    objective: "Write letters and applications in the correct format with polite, clear language.",
    skills: ["Letter format", "Formal and informal tone", "Polite language", "Clear purpose"],
    outcome: "The child writes informal letters, formal letters and applications in the correct format.",
    assess: ["Correct format (address, date, salutation, closing)", "Clear purpose", "Tone suits the reader", "Polite language"],
    support: ["Use the template with labelled parts.", "Show a model with ‘Fill example’.", "Colour-code the parts of a letter."],
    teacher: ["Compare informal and formal letters side by side.", "Teach closings: Yours lovingly / Yours faithfully / Yours obediently."],
    diff: { Easy: "Fill a template.", Medium: "Write with a format checklist.", Difficult: "Write without a template." },
    subs: { informal: "Informal letters", formal: "Formal letters", application: "Applications" },
    ws: ["letter"],
    acts: [
      ["Letter to a friend", "informal", "PDW", 20, "Template, lined paper", ["Show the informal format.", "Children write to a friend about a recent event."], "Write a letter to your friend.", null, null],
      ["Formal complaint letter", "formal", "PDW", 25, "Formal format", ["Discuss a local problem.", "Children write to the officer concerned."], "Write a polite letter about a problem.", null, null],
      ["Leave application", "application", "PDW", 15, "Application format", ["Show the format.", "Children write a leave application."], "Write an application for leave.", null, null],
      ["Request application", "application", "PDW", 15, "Application format", ["Children write a request (library card, sports kit)."], "Write an application with a request.", null, null],
      ["Letter parts puzzle", "informal", "G", 10, "Cut-up letter parts", ["Teams arrange parts of a letter in order."], "Put the letter together!", null, null]
    ],
    practice: [{ id: "tpl", t: "Letter templates", w: "template", cfg: { templates: LETTERS } }]
  });

  WP.add({
    id: "diary", level: "advanced", name: "Diary Writing", icon: "📔",
    short: "A daily diary with prompts, moods and saved pages.",
    objective: "Write about personal experiences and feelings regularly.",
    skills: ["Personal writing", "Past tense", "Expressing feelings", "Regular writing habit"],
    outcome: "The child writes short diary entries about their day and feelings.",
    assess: ["Writes about real events of the day", "Expresses feelings", "Uses past tense", "Writes regularly"],
    support: ["Use one prompt per day.", "Allow drawing plus one sentence.", "Model a teacher diary entry."],
    teacher: ["Keep diary time short and regular (5–10 minutes).", "Respect privacy: ask before reading aloud."],
    diff: { Easy: "One prompt, 3 sentences.", Medium: "Two prompts, 6 sentences.", Difficult: "Full entry with feelings and reasons." },
    subs: { daily: "Daily diary" },
    ws: ["diary"],
    acts: [
      ["Daily diary entry", "daily", "PDW", 10, "Diary notebook or the on-screen diary", ["Choose one prompt.", "Write about today.", "Draw a small picture if you like."], "Write about your day.", null, null],
      ["Feelings diary", "daily", "PDW", 10, "Mood chart", ["Pick the mood face for today.", "Write why you feel that way."], "How did you feel today? Why?", null, null],
      ["Weekly diary review", "daily", "P", 10, "Diary", ["Read last week's entries.", "Write what changed or what you learned."], "Read your diary. What was the best day?", null, null]
    ],
    practice: [{ id: "diary", t: "My diary", w: "diary", cfg: { min: 40, prompts: ["What did you learn today?", "What made you happy?", "What did you do with your friends?", "What would you like to do tomorrow?", "What was difficult today?", "Who helped you today?"] } }]
  });

  const EDIT = {
    "Spelling": [["I went to the libary.", "I went to the library.", "One word is spelled wrongly."], ["The elefant is big.", "The elephant is big.", "Check the animal's name."], ["We have a beutiful garden.", "We have a beautiful garden.", "One word is spelled wrongly."], ["My frend is kind.", "My friend is kind.", "One word is spelled wrongly."], ["I recieved a gift.", "I received a gift.", "Remember: i before e except after c."]],
    "Capital letters": [["my name is asha.", "My name is Asha.", "Sentences and names start with capitals."], ["we live in assam.", "We live in Assam.", "Place names need capitals."], ["on monday we went to delhi.", "On Monday we went to Delhi.", "Days and places need capitals."], ["rahul and i are friends.", "Rahul and I are friends.", "Names and ‘I’ need capitals."]],
    "Punctuation": [["Where are you going", "Where are you going?", "It is a question."], ["I bought apples bananas and grapes.", "I bought apples, bananas and grapes.", "Use commas in a list."], ["What a lovely day", "What a lovely day!", "It shows strong feeling."], ["The sun is hot", "The sun is hot.", "End the sentence properly."]],
    "Grammar": GRAM.map(([w, r]) => [w, r, "One word is wrong. Fix it."]),
    "Word order": [["school to go we.", "We go to school.", "Put the words in order."], ["is my red bag.", "My bag is red.", "Put the words in order."], ["the in birds sing morning the.", "The birds sing in the morning.", "Put the words in order."]],
    "Better sentences": [["The dog was nice. The dog was big.", "The dog was big and nice.", "Join the two sentences into one."], ["I was hungry. I ate rice.", "I was hungry, so I ate rice.", "Join with ‘so’."], ["She ran. She was late.", "She ran because she was late.", "Join with ‘because’."]]
  };
  const PARA = [["First, I wake up at six o'clock.", "Then I brush my teeth and bathe.", "After that, I eat my breakfast.", "Finally, I go to school."], ["Plants need water to grow.", "They also need sunlight.", "Their roots take water from the soil.", "So we must water our plants every day."]];
  WP.add({
    id: "editing", level: "advanced", name: "Editing and Proofreading", icon: "🔍",
    short: "Correcting spelling, capitals, punctuation, grammar, word order and paragraph order.",
    objective: "Check and improve writing by finding and fixing errors.",
    skills: ["Spelling", "Capitalisation", "Punctuation", "Grammar", "Organisation"],
    outcome: "The child finds and corrects common errors in sentences and paragraphs.",
    assess: ["Finds spelling mistakes", "Fixes capitals and punctuation", "Corrects grammar", "Orders sentences logically"],
    support: ["Tell the child how many mistakes there are.", "Work on one type of error at a time.", "Read the sentence aloud to hear errors."],
    teacher: ["Teach a simple editing checklist: Capitals, Punctuation, Spelling, Sense (CPSS).", "Use children's own drafts for editing practice."],
    diff: { Easy: "One error, type given.", Medium: "Two errors.", Difficult: "A paragraph with mixed errors." },
    subs: { spell: "Spelling", caps: "Capitals and punctuation", grammar: "Grammar and word order", organise: "Organisation" },
    ws: ["grammar"],
    acts: [
      ["Spelling correction", "spell", "DW", 8, "Sentences with errors", ["Underline the misspelled word.", "Write it correctly."], "Find the wrong spelling and fix it.", null, null],
      ["Capital letter check", "caps", "DW", 8, "Sentences", ["Circle letters that should be capitals.", "Rewrite."], "Which letters need to be capitals?", null, null],
      ["Punctuation fix", "caps", "DW", 8, "Sentences", ["Add full stops, question marks, commas."], "Add the missing punctuation.", null, null],
      ["Grammar correction", "grammar", "DW", 10, "Sentences", ["Read aloud; find what sounds wrong.", "Fix it."], "Fix the grammar mistake.", null, null],
      ["Word order", "grammar", "DWG", 8, "Jumbled sentences", ["Rearrange the words."], "Put the words in order.", null, null],
      ["Paragraph organisation", "organise", "DWG", 10, "Sentence strips of a paragraph", ["Arrange sentences in a logical order.", "Look for order words: first, then, finally."], "Put the sentences in the right order.", null, null],
      ["Editing partners", "spell", "PG", 15, "Children's own drafts, CPSS checklist", ["Swap drafts with a partner.", "Use the CPSS checklist to mark one thing to fix.", "Fix your own draft."], "Check your partner's writing kindly.", null, null]
    ],
    practice: [{ id: "edit", t: "Fix the sentence", w: "edit", cfg: { sets: EDIT } }, { id: "para", t: "Paragraph organisation", w: "builder", cfg: { rounds: 2, gen: (i) => ({ prompt: "Put the sentences in a sensible order.", pieces: PARA[i % 2], answer: PARA[i % 2], sep: " ", block: true }) } }]
  });
})();
