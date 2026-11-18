/* Skillyfai tool catalog: the single list that drives the home page, search,
   breadcrumbs and "related tools". To add a tool: add an entry here and create its page. */
window.SKILLYFAI = {
  name: "Skillyfai",
  tagline: "Smart Tools. Better Teaching. Engaged Learning.",

  sections: [
    { id: "toolkit", name: "Teacher Toolkit", icon: "🧰", tint: "var(--primary-soft)", color: "var(--primary-ink)",
      blurb: "Plan lessons, design activities and create questions, worksheets and quizzes in minutes." },
    { id: "reading", name: "Reading Practice", icon: "📖", tint: "var(--mint-soft)", color: "var(--mint)",
      blurb: "Pronunciation, blending and reading fluency practice for children." },
    { id: "writing", name: "Writing Development", icon: "✏️", tint: "var(--coral-soft)", color: "var(--coral)",
      blurb: "Tracing, handwriting sheets, sentence building and creative writing prompts." },
    { id: "tarl", name: "TARL Lesson Plans", icon: "🎯", tint: "var(--amber-soft)", color: "var(--amber)",
      blurb: "90-day Literacy and 90-day Numeracy lesson plans based on the TaRL (Teaching at the Right Level) teacher manual." }
  ],

  categories: [
    { id: "planning", section: "toolkit", name: "Lesson Planning", icon: "🗂️" },
    { id: "activity", section: "toolkit", name: "Activity Planning", icon: "🧩" },
    { id: "reading", section: "reading", name: "Reading Practice", icon: "📖" },
    { id: "writing", section: "writing", name: "Writing Development", icon: "✏️" },
    { id: "tarl", section: "tarl", name: "TARL Lesson Plans", icon: "🎯" }
  ],

  /* status: ready | beta */
  tools: [
    // ---- Lesson planning
    { id: "lesson-plan", cat: "planning", name: "Lesson Plan Generator", icon: "📝", tint: "var(--primary-soft)",
      desc: "Generate a complete nine-section lesson plan in tables for Classes I–XII (GRR for I–VIII, Hybrid CLT + GTM for IX–XII). Print or download as PDF.",
      url: "tools/lesson-plan.html", status: "ready", keys: "lesson plan generator template grr 5e play way activity based pdf objectives" },
    { id: "learning-outcomes", cat: "planning", name: "Learning Outcomes Planner", icon: "🎯", tint: "var(--primary-soft)",
      desc: "Enter subject, class and topic to get 6–8 numbered, measurable learning outcomes.",
      url: "tools/learning-outcomes.html", status: "ready", keys: "bloom objectives outcomes swbat verbs competencies" },
    { id: "question-generator", cat: "planning", name: "Question / Worksheet / MCQ Generator", icon: "❓", tint: "var(--primary-soft)",
      desc: "Create a question list, a printable worksheet or an MCQ quiz you can play, print or share. Pick the type from a menu.",
      url: "tools/question-generator.html", status: "ready", keys: "questions hots bloom oral questioning worksheet mcq quiz maker test multiple choice share print answer key play" },

    // ---- Activity planning
    { id: "activity-suite", cat: "activity", name: "Activity Planning Suite", icon: "🧩", tint: "var(--sky-soft)",
      desc: "Plan individual, group, experiential, and assessment activities all in one place.",
      url: "tools/activity-planner.html", status: "ready",
      keys: "activities activity planner warm up energiser starter plenary groups teams roles random roster cooperative experiential kolb hands on project field trip art integrated assessment rubric formative summative exit ticket evaluation" },

    // ---- Reading & language
    { id: "rd-letters", cat: "reading", name: "Letter Sounds", icon: "🔤", tint: "var(--mint-soft)",
      desc: "Tap any letter to hear its sound and a picture word.",
      url: "apps/sound-friends/index.html#s1", status: "ready", keys: "letters sounds alphabet phonics pronunciation" },
    { id: "rd-blend", cat: "reading", name: "Blending Words", icon: "🧩", tint: "var(--mint-soft)",
      desc: "Blend letter sounds together to read whole words.",
      url: "apps/sound-friends/index.html#s2", status: "ready", keys: "blend blending words phonics cvc pronunciation" },
    { id: "rd-sentences", cat: "reading", name: "Sentence Reading", icon: "📖", tint: "var(--mint-soft)",
      desc: "Read simple sentences aloud, word by word.",
      url: "apps/sound-friends/index.html#snSec", status: "ready", keys: "sentences reading aloud" },
    { id: "rd-scan", cat: "reading", name: "Scan & Read", icon: "📷", tint: "var(--mint-soft)",
      desc: "Read pages from your own book or a photo, with each word read aloud.",
      url: "apps/sound-friends/index.html#scSec", status: "ready", keys: "scan read photo book ocr" },
    { id: "rd-record", cat: "reading", name: "Record & Listen", icon: "🎙️", tint: "var(--mint-soft)",
      desc: "Record your voice and listen back to check your pronunciation.",
      url: "apps/sound-friends/index.html#s5", status: "ready", keys: "record voice listen pronunciation" },
    { id: "fluency", cat: "reading", name: "Reading Fluency Practice", icon: "⏳", tint: "var(--mint-soft)",
      desc: "Listen to a model reading, then time a read-aloud and get words-correct-per-minute.",
      url: "tools/reading-fluency.html", status: "ready", keys: "wcpm fluency timer passage read aloud running record" },

    // ---- Writing
    { id: "writing-practice", cat: "writing", name: "Writing Practice", icon: "✍️", tint: "var(--coral-soft)",
      desc: "Beginner, intermediate and advanced writing: 28 skill areas with interactive practice, an activity generator, A4 worksheets and progress tracking.",
      url: "writing-practice/index.html", status: "ready", keys: "writing practice pre-writing gross motor fine motor pencil grip scribbling strokes curves alphabet assamese cvc dictation paragraph story diary letter application editing worksheet generator progress" },
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
      url: "tools/creative-writing.html", status: "ready", keys: "story prompts imagination journal story dice" },

    // ---- TARL
    { id: "tarl-literacy", cat: "tarl", name: "TARL Literacy Lesson Plans", icon: "📖", tint: "var(--amber-soft)",
      desc: "90 daily TARL literacy lesson plans: pick a day, generate the plan, then print it or save it as a PDF.",
      url: "tarl/literacy.html", status: "ready", keys: "tarl teaching at the right level literacy 90 day lesson plan story sound symbol mind mapping reading assessment baseline midline endline" },
    { id: "tarl-numeracy", cat: "tarl", name: "TARL Numeracy Lesson Plans", icon: "🔢", tint: "var(--amber-soft)",
      desc: "90 daily TARL numeracy lesson plans: stick bundles, number sense and word problems, for any day from 1 to 90.",
      url: "tarl/numeracy.html", status: "ready", keys: "tarl teaching at the right level numeracy maths math 90 day lesson plan number sense word problems stick bundle assessment baseline midline endline" }
  ],

  /* Extra entry points into the existing Sound Friends app */
  soundFriends: {
    url: "apps/sound-friends/index.html",
    parts: [
      { name: "Letters", hash: "s1" }, { name: "Blend", hash: "s2" }, { name: "Sentences", hash: "snSec" },
      { name: "Scan & Read", hash: "scSec" }, { name: "Record", hash: "s5" }
    ]
  }
};
