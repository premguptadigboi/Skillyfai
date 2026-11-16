/* Skillyfai tool catalog: the single list that drives the home page, search,
   breadcrumbs and "related tools". To add a tool: add an entry here and create its page. */
window.SKILLYFAI = {
  name: "Skillyfai",
  tagline: "Smart Tools. Better Teaching. Engaged Learning.",

  sections: [
    { id: "toolkit", name: "Teacher Toolkit", icon: "🧰", tint: "var(--primary-soft)", color: "var(--primary-ink)",
      blurb: "Plan lessons, design activities and run classroom games in minutes." },
    { id: "reading", name: "Reading & Language", icon: "📖", tint: "var(--mint-soft)", color: "var(--mint)",
      blurb: "Pronunciation, phonics, word reading, fluency and vocabulary practice for children." },
    { id: "writing", name: "Writing Development", icon: "✏️", tint: "var(--coral-soft)", color: "var(--coral)",
      blurb: "Tracing, handwriting sheets, sentence building and creative writing prompts." }
  ],

  categories: [
    { id: "planning", section: "toolkit", name: "Lesson Planning", icon: "🗂️" },
    { id: "activity", section: "toolkit", name: "Activity Planning", icon: "🧩" },
    { id: "games", section: "toolkit", name: "Educational Games", icon: "🎲" },
    { id: "reading", section: "reading", name: "Reading & Language", icon: "📖" },
    { id: "writing", section: "writing", name: "Writing Development", icon: "✏️" }
  ],

  /* status: ready | app (existing Sound Friends app) | beta */
  tools: [
    // ---- Lesson planning
    { id: "lesson-plan", cat: "planning", name: "Lesson Plan Generator", icon: "📝", tint: "var(--primary-soft)",
      desc: "Generate a complete nine-section lesson plan in tables for Classes I–XII (GRR for I–VIII, Hybrid CLT + GTM for IX–XII). Print or download as PDF.",
      url: "tools/lesson-plan.html", status: "ready", keys: "lesson plan generator template grr 5e play way activity based pdf objectives" },
    { id: "learning-outcomes", cat: "planning", name: "Learning Outcomes Planner", icon: "🎯", tint: "var(--primary-soft)",
      desc: "Enter subject, class and topic to get 6–8 numbered, measurable learning outcomes.",
      url: "tools/learning-outcomes.html", status: "ready", keys: "bloom objectives outcomes swbat verbs competencies" },
    { id: "teaching-strategy", cat: "planning", name: "Teaching Strategy Planner", icon: "🧭", tint: "var(--primary-soft)",
      desc: "Get strategy suggestions that fit your class size, time, resources and topic.",
      url: "tools/teaching-strategy.html", status: "ready", keys: "pedagogy methods jigsaw think pair share inquiry" },
    { id: "question-generator", cat: "planning", name: "Classroom Question Generator", icon: "❓", tint: "var(--primary-soft)",
      desc: "Generate recall-to-creative questions for any topic, at every thinking level.",
      url: "tools/question-generator.html", status: "ready", keys: "questions hots bloom oral questioning worksheet" },

    // ---- Activity planning
    { id: "activity-planner", cat: "activity", name: "Classroom Activity Planner", icon: "🗓️", tint: "var(--sky-soft)",
      desc: "Browse ready activities by subject, time and grouping, then build an activity sheet.",
      url: "tools/activity-planner.html", status: "ready", keys: "activities warm up energiser starter plenary" },
    { id: "group-activity", cat: "activity", name: "Group Activity Creator", icon: "👥", tint: "var(--sky-soft)",
      desc: "Make fair random groups from your class list and assign roles and tasks.",
      url: "tools/group-activity.html", status: "ready", keys: "groups teams roles random roster cooperative" },
    { id: "experiential", cat: "activity", name: "Experiential Learning Activities", icon: "🌱", tint: "var(--sky-soft)",
      desc: "Plan learning-by-doing activities around the Do, Reflect, Learn and Apply cycle.",
      url: "tools/experiential-learning.html", status: "ready", keys: "kolb hands on project field trip art integrated" },
    { id: "assessment", cat: "activity", name: "Assessment Activity Planner", icon: "✅", tint: "var(--sky-soft)",
      desc: "Pick assessment methods, build a rubric and print exit tickets.",
      url: "tools/assessment-planner.html", status: "ready", keys: "rubric formative summative exit ticket evaluation" },

    // ---- Games
    { id: "game-creator", cat: "games", name: "Educational Game Creator", icon: "🏆", tint: "var(--amber-soft)",
      desc: "Create a team quiz board game with categories and points, then play it on the big screen.",
      url: "tools/game-creator.html", status: "ready", keys: "jeopardy board teams points game show" },
    { id: "quiz-maker", cat: "games", name: "Quiz Maker", icon: "🧠", tint: "var(--amber-soft)",
      desc: "Write multiple-choice quizzes, play them in class, print with answer key or share by link.",
      url: "tools/quiz-maker.html", status: "ready", keys: "mcq test quiz questions share print answer key" },
    { id: "word-match", cat: "games", name: "Word Matching Game", icon: "🔗", tint: "var(--amber-soft)",
      desc: "Turn word pairs into a tap-to-match game: words and meanings, opposites, translations.",
      url: "tools/word-match.html", status: "ready", keys: "match pairs vocabulary opposites memory game" },
    { id: "classroom-activities", cat: "games", name: "Classroom Interactive Activities", icon: "⏱️", tint: "var(--amber-soft)",
      desc: "Timer, name picker, spin wheel, dice, scoreboard and noise-level signal for the board.",
      url: "tools/classroom-activities.html", status: "ready", keys: "timer random name picker wheel dice scoreboard" },

    // ---- Reading & language
    { id: "pronunciation", cat: "reading", name: "Pronunciation Practice", icon: "🗣️", tint: "var(--mint-soft)",
      desc: "Tap letters to hear their sounds; teachers can record and tune sounds. Part of Sound Friends.",
      url: "apps/sound-friends/index.html#s1", status: "app", keys: "letter sounds alphabet record voice sound friends" },
    { id: "phonics", cat: "reading", name: "Phonics Practice", icon: "🔤", tint: "var(--mint-soft)",
      desc: "Blend sounds into words level by level, from CVC words to consonant clusters.",
      url: "apps/sound-friends/index.html#s2", status: "app", keys: "blending cvc digraph clusters sound friends" },
    { id: "word-reading", cat: "reading", name: "Word Reading Practice", icon: "🃏", tint: "var(--mint-soft)",
      desc: "Sight-word flashcards with listen, say-it-back and known/learning tracking.",
      url: "tools/word-reading.html", status: "ready", keys: "sight words flashcards dolch high frequency speak" },
    { id: "fluency", cat: "reading", name: "Reading Fluency Practice", icon: "⏳", tint: "var(--mint-soft)",
      desc: "Listen to a model reading, then time a read-aloud and get words-correct-per-minute.",
      url: "tools/reading-fluency.html", status: "ready", keys: "wcpm fluency timer passage read aloud running record" },
    { id: "vocabulary", cat: "reading", name: "Vocabulary Development", icon: "💬", tint: "var(--mint-soft)",
      desc: "Word cards with meanings and examples, word of the day and listen-and-choose games.",
      url: "tools/vocabulary.html", status: "ready", keys: "vocabulary meaning word bank synonyms word of the day" },

    // ---- Writing
    { id: "letter-writing", cat: "writing", name: "Letter Writing Practice", icon: "🔠", tint: "var(--coral-soft)",
      desc: "Trace capital and small letters on screen, or write a letter with a guided frame.",
      url: "tools/letter-writing.html", status: "ready", keys: "alphabet tracing abc letter format formal informal" },
    { id: "word-writing", cat: "writing", name: "Word Writing Practice", icon: "🖊️", tint: "var(--coral-soft)",
      desc: "Listen to a word, trace it, then write it from memory.",
      url: "tools/word-writing.html", status: "ready", keys: "word tracing spelling dictation" },
    { id: "sentence-writing", cat: "writing", name: "Sentence Writing Practice", icon: "🧱", tint: "var(--coral-soft)",
      desc: "Unjumble words into sentences, then write them with capitals and full stops.",
      url: "tools/sentence-writing.html", status: "ready", keys: "sentence builder jumbled grammar punctuation" },
    { id: "handwriting", cat: "writing", name: "Handwriting Practice", icon: "📄", tint: "var(--coral-soft)",
      desc: "Print four-line handwriting worksheets with traceable letters, words or sentences.",
      url: "tools/handwriting.html", status: "ready", keys: "worksheet printable four line tracing sheet cursive" },
    { id: "copy-writing", cat: "writing", name: "Copy Writing Activities", icon: "📋", tint: "var(--coral-soft)",
      desc: "Copy model lines and short passages, on screen or on printed sheets.",
      url: "tools/copy-writing.html", status: "ready", keys: "copy writing transcription model passage" },
    { id: "creative-writing", cat: "writing", name: "Creative Writing Prompts", icon: "💡", tint: "var(--coral-soft)",
      desc: "Story starters, picture prompts and story dice with a writing timer and word bank.",
      url: "tools/creative-writing.html", status: "ready", keys: "story prompts imagination journal story dice" }
  ],

  /* Extra entry points into the existing Sound Friends app */
  soundFriends: {
    url: "apps/sound-friends/index.html",
    parts: [
      { name: "Letters", hash: "s1" }, { name: "Blend", hash: "s2" }, { name: "Sentences", hash: "snSec" },
      { name: "Scan & Read", hash: "scSec" }, { name: "My Path", hash: "pathSec" }, { name: "Record", hash: "s5" }
    ]
  }
};
