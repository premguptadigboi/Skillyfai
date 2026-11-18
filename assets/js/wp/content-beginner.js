/* Writing Practice – BEGINNER content (writing readiness).
   Activity format: [title, subcategory, types (P Physical, D Digital, W Worksheet, G Classroom game), minutes, materials,
                     teacher steps[], child instruction, observation checklist[]?, expected outcome?, objective?]
   To add an activity: add one array to `acts`. To add a practice: add {id, t, w (widget), cfg}. */
(function () {
  "use strict";
  const pick = SK.pick, shuffle = SK.shuffle;
  const COLORS = [["Red", "#e5484d"], ["Blue", "#2f8ee0"], ["Green", "#2aa876"], ["Yellow", "#f5c400"]];
  const dot = (c, s = 40) => `<span class="wp-bead" style="--c:${c};width:${s}px;height:${s}px"></span>`;
  const G = WP.GLYPHS, row = (k, n) => Array.from({ length: n }, () => G[k].s);

  /* ---------------------------------------------- A. BEFORE PENCIL GRIP ---------------------------------------------- */
  WP.add({
    id: "gross-motor", level: "beginner", stage: "before", name: "Gross Motor Activities", icon: "🏃",
    short: "Big body movements that build shoulder strength and body control.",
    objective: "Develop large muscle coordination, shoulder stability, arm movements and overall body control.",
    skills: ["Shoulder stability", "Balance", "Arm control", "Body awareness", "Following instructions"],
    outcome: "The child moves with better control and balance, and can keep the shoulder steady while moving the arm.",
    assess: ["Moves with control without falling or bumping", "Uses both sides of the body", "Follows a two-step instruction", "Keeps going for the whole activity"],
    support: ["Hold the child's hand or let them use a wall for support.", "Show each movement first and do it together.", "Shorten the distance and give more rest breaks."],
    teacher: ["Use an open, safe space with no sharp corners.", "Warm up for 2 minutes first.", "Praise effort and control, not speed."],
    diff: { Easy: "Shorter distance, bigger ball, more support.", Medium: "Normal distance; add one extra movement.", Difficult: "Longer distance, smaller ball, or add a time challenge." },
    subs: { ball: "Ball skills", balance: "Balance and walking", arms: "Arms and shoulders", rhythm: "Rhythm and instructions" },
    ws: ["obs-gross"],
    acts: [
      ["Ball throwing and catching", "ball", "PG", 10, "A soft ball or bean bag", ["Stand 2 metres apart facing the child.", "Show how to throw underarm with one hand.", "Throw gently to the child's chest; the child catches with two hands.", "Take 10 turns, then step back one step."], "Look at the ball. Catch it with two hands. Throw it back.", ["Watches the ball", "Catches with two hands", "Throws towards the target"], "The child throws and catches a soft ball with growing accuracy."],
      ["Crawling through a pathway", "balance", "PG", 10, "Chairs, a table, a long cloth or mats", ["Make a pathway under tables and between chairs.", "Show how to crawl on hands and knees with a flat back.", "The child crawls from start to finish twice.", "Add a tunnel or a turn when the child is ready."], "Crawl on your hands and knees. Go under and around!", ["Weight on both hands", "Moves arms and legs in turn", "Finishes the path"], "Stronger shoulders and arms from carrying body weight on the hands."],
      ["Walking on a straight line", "balance", "PG", 8, "Chalk or tape line (3 metres)", ["Draw or tape a straight line on the floor.", "Walk it first, heel to toe, arms out.", "The child walks forward, then backward.", "Make it harder: carry a bean bag on the head."], "Walk on the line. Keep your feet on it!", ["Feet stay on the line", "Arms used for balance", "Looks ahead"], "Better balance and body control."],
      ["Balancing activities", "balance", "PG", 8, "A cushion, a low beam or a line", ["Stand on one foot while counting to 5.", "Swap feet.", "Try standing on a cushion.", "Play ‘freeze’: stop and balance when the music stops."], "Stand on one foot. Count to 5!", ["Balances 3–5 seconds", "Uses both feet in turn", "Recovers without falling"], "The child holds a still position, which helps a steady sitting posture for writing."],
      ["Large arm movements", "arms", "PG", 6, "Ribbons or scarves (optional)", ["Stand with space around each child.", "Wave a ribbon up high, down low, side to side.", "Make big windmills with straight arms.", "Do each movement with the left and the right arm."], "Make big waves with your ribbon! Up, down, side to side.", ["Moves the whole arm from the shoulder", "Uses both arms", "Copies the movement"], "Freer shoulder movement and wider range of arm motion."],
      ["Drawing large circles in the air", "arms", "PDG", 5, "None (or a ribbon)", ["Show a big circle in the air with a straight arm.", "Draw circles clockwise, then anticlockwise.", "Draw circles with both arms together.", "Draw a giant sun, then a small ball."], "Draw a giant circle in the air. Now a small one!", ["Smooth circle shape", "Changes direction when asked", "Keeps the elbow straight for big circles"], "Practice of the round movements used later for letters like o, a, c."],
      ["Following movement instructions", "rhythm", "PDG", 8, "Open space", ["Give one instruction at a time: ‘Touch your toes’, ‘Jump two times’.", "Move to two-step instructions.", "Let a child be the leader.", "Use the on-screen ‘Follow my instructions’ game."], "Listen carefully and do what I say!", ["Follows one-step instructions", "Follows two-step instructions", "Waits for the signal"], "Better listening and body control together."],
      ["Wall-pushing activities", "arms", "P", 5, "A strong wall", ["Stand an arm's length from the wall.", "Put both palms flat on the wall at shoulder height.", "Push hard for 5 seconds, then relax. Repeat 5 times.", "Try wall push-ups: bend elbows and push back."], "Push the wall! Push, push, push… and relax.", ["Palms flat", "Pushes with both arms", "Keeps body straight"], "Stronger shoulders and arms that steady the hand for writing."],
      ["Reaching and touching targets", "arms", "PG", 8, "Paper stars stuck on a wall at different heights", ["Stick stars high, low, left and right.", "Call a colour; the child stretches to touch that star.", "Cross the body: touch a left star with the right hand.", "Make it a team relay."], "Find the red star and touch it!", ["Reaches across the body", "Stretches fully", "Touches the right target"], "Better shoulder reach and crossing the middle of the body."],
      ["Rhythm and movement activities", "rhythm", "PDG", 8, "A drum, clapping or the on-screen rhythm tool", ["Clap a steady beat.", "Children march, clap or stamp to the beat.", "Change the speed: slow, then fast.", "Try patterns: clap-clap-stamp."], "Clap and march with the beat!", ["Keeps to the beat", "Changes speed when the beat changes", "Copies the pattern"], "Better timing and coordination of both sides of the body."]
    ],
    practice: [
      { id: "coach", t: "Movement Coach", w: "coach", about: "Step-by-step movement routines read aloud, with a timer for each step.", cfg: { routines: [
        { name: "Big arm warm-up", steps: [{ e: "🙆", t: "Stretch both arms up high.", s: 8 }, { e: "🌀", t: "Draw big circles in the air with your right arm.", s: 10, anim: "spin" }, { e: "🌀", t: "Now big circles with your left arm.", s: 10, anim: "spin" }, { e: "🌊", t: "Wave your arms like the sea.", s: 8 }, { e: "🧱", t: "Push your hands together hard. Relax.", s: 8 }] },
        { name: "Balance time", steps: [{ e: "🦩", t: "Stand on your right foot like a flamingo.", s: 8 }, { e: "🦩", t: "Now stand on your left foot.", s: 8 }, { e: "🚶", t: "Walk on a straight line, heel to toe.", s: 12 }, { e: "🧘", t: "Stand still like a tree. Arms up!", s: 8 }] },
        { name: "Wall power", steps: [{ e: "🧱", t: "Stand in front of the wall. Hands flat.", s: 6 }, { e: "💪", t: "Push the wall hard!", s: 6 }, { e: "😌", t: "Relax.", s: 4 }, { e: "💪", t: "Push again, stronger!", s: 6 }, { e: "🙌", t: "Shake your hands loose.", s: 5 }] }] } },
      { id: "simon", t: "Follow my instructions", w: "commands", about: "Random movement commands read aloud. The teacher marks each one.", cfg: { rounds: 8, commands: [["🙌", "Stretch your arms up high."], ["👣", "Jump two times."], ["🦶", "Stand on one foot."], ["👏", "Clap three times."], ["🌀", "Draw a big circle in the air."], ["🐻", "Walk like a bear on hands and feet."], ["👃", "Touch your nose, then your toes."], ["↔️", "Touch your left knee with your right hand."], ["🐸", "Jump like a frog."], ["🌊", "Wave both arms side to side."]] } },
      { id: "rhythm", t: "Rhythm and movement", w: "metronome", about: "A steady beat with movement patterns. Change the speed.", cfg: { secs: 60, patterns: [{ name: "Clap", beats: [["👏", "Clap"]] }, { name: "March", beats: [["🦵", "Left"], ["🦵", "Right"]] }, { name: "Clap-clap-stamp", beats: [["👏", "Clap"], ["👏", "Clap"], ["🦶", "Stamp"]] }, { name: "Arms up-down", beats: [["🙌", "Up"], ["👇", "Down"]] }] } },
      { id: "obs", t: "Gross motor observation", w: "checklist", about: "Record what you see. Saved to the child's progress.", cfg: { title: "Gross motor observation", items: ["Catches a ball with two hands", "Walks along a straight line", "Balances on one foot for 3 seconds", "Draws big arm circles smoothly", "Follows two-step movement instructions"] } }
    ]
  });

  const SEEDS = () => { const items = []; COLORS.forEach(([n, c]) => { for (let i = 0; i < 3; i++) items.push({ h: dot(c, 34), k: n }); }); return { prompt: "Sort the seeds by colour. Drag each seed into the bowl of the same colour.", items, bins: COLORS.map(([n, c]) => ({ h: `${dot(c, 26)} <b>${n}</b>`, k: n })) }; };
  const SIZE = () => { const emo = shuffle(["🍎", "⚽", "🌸", "🐟", "⭐", "🍪"]).slice(0, 3), items = []; emo.forEach((e) => { items.push({ h: `<span style="font-size:2.6rem">${e}</span>`, k: "big" }, { h: `<span style="font-size:1.1rem">${e}</span>`, k: "small" }); }); return { prompt: "Big ones go in the big box. Small ones in the small box.", items, bins: [{ h: "📦 <b>Big</b>", k: "big" }, { h: "<span style='font-size:.8em'>📦</span> <b>Small</b>", k: "small" }] }; };
  const TWEEZ = () => ({ prompt: "Use one finger like tweezers: move each tiny bead carefully into the jar.", items: Array.from({ length: 8 }, () => ({ h: dot(pick(COLORS)[1], 18), k: "jar" })), bins: [{ h: "🫙 <b>Jar</b>", k: "jar" }] });
  WP.add({
    id: "fine-motor", level: "beginner", stage: "before", name: "Fine Motor Activities", icon: "🤏",
    short: "Small finger and hand movements: tearing, rolling, threading, picking.",
    objective: "Strengthen the small muscles of the fingers, hands and wrists.",
    skills: ["Finger strength", "Pincer grasp", "Two hands working together", "Wrist control"],
    outcome: "Stronger, more controlled fingers that are ready to hold a crayon and pencil.",
    assess: ["Uses thumb and fingertips (pincer grasp)", "Uses both hands together", "Finishes the task without giving up", "Controls force (not too hard, not too soft)"],
    support: ["Use bigger objects and softer materials.", "Hold the paper or container steady for the child.", "Break the task into shorter turns with rest."],
    teacher: ["Sit children at a table with feet flat on the floor.", "Show the finger movement slowly first.", "Watch small objects carefully with young children (choking risk)."],
    diff: { Easy: "Big objects, soft materials, fewer items.", Medium: "Medium objects; sort by one rule.", Difficult: "Small objects, time challenge, or sort by two rules." },
    subs: { paper: "Paper work", dough: "Dough and clay", pick: "Picking and sorting", life: "Daily-life skills" },
    ws: ["fill", "finger"],
    acts: [
      ["Paper tearing", "paper", "PW", 10, "Old newspaper or coloured paper, glue, an outline sheet", ["Show how to hold paper with both thumbs on top.", "Tear long strips slowly, then small pieces.", "Stick the pieces inside an outline (use the ‘Fill the shape’ worksheet)."], "Hold the paper. Tear it into small pieces.", ["Thumbs on top while tearing", "Tears small pieces", "Sticks pieces inside the outline"], "Better finger strength and two-hand coordination."],
      ["Paper folding", "paper", "P", 10, "Square paper", ["Fold paper in half, matching the corners.", "Press the fold with a fingernail.", "Fold again into a small square.", "Make a simple boat or fan."], "Match the corners. Press the fold flat.", ["Matches edges", "Presses the fold", "Follows steps in order"], "Precise finger movements and following a sequence."],
      ["Paper crumpling", "paper", "PG", 5, "Scrap paper", ["Give each child a sheet.", "Crumple it into a tight ball using one hand only.", "Swap hands.", "Throw the balls into a bin from a line."], "Squeeze the paper into a small ball with one hand!", ["Uses one hand", "Makes a tight ball", "Uses each hand"], "Stronger hand muscles."],
      ["Playdough squeezing", "dough", "P", 8, "Playdough or soft dough", ["Give a ball of dough to each child.", "Squeeze it hard in one hand, then the other.", "Pinch small pieces off with the thumb and first finger.", "Make 10 small balls."], "Squeeze the dough. Now pinch tiny pieces.", ["Squeezes with the whole hand", "Pinches with fingertips", "Makes small balls"], "Stronger grip and fingertip control."],
      ["Playdough rolling", "dough", "P", 8, "Playdough, a board", ["Roll the dough into a long snake with flat palms.", "Roll small balls between the palms.", "Make shapes: circle, line, letters.", "Roll tiny balls with fingertips."], "Roll a long snake. Now a tiny ball!", ["Rolls with flat palms", "Makes even snakes", "Rolls tiny balls with fingers"], "Hand control and pressure control."],
      ["Clay modelling", "dough", "P", 15, "Clay or dough, simple tools", ["Show a model (fruit, animal, cup).", "Children pinch, roll and press to make it.", "Add details with fingertips or a stick.", "Children talk about their model."], "Make your own fruit or animal with clay.", ["Uses pinch, roll and press", "Adds small details", "Talks about the model"], "Stronger fingers and creative hand use."],
      ["Bead threading", "pick", "PDG", 10, "Big beads, thick string (tape the end)", ["Show how to hold the bead in one hand and the string in the other.", "Thread 5 beads.", "Copy a colour pattern (use the on-screen bead game).", "Use smaller beads when ready."], "Hold the bead. Push the string through the hole.", ["Holds bead and string with both hands", "Threads without help", "Copies a pattern"], "Two-hand coordination and pincer grasp."],
      ["Picking small objects", "pick", "PDG", 8, "Buttons, beans, small blocks; a bowl", ["Scatter objects on a tray.", "Pick up one at a time with thumb and first finger.", "Drop each into a bowl.", "Count them together."], "Pick up one bean with two fingers. Put it in the bowl.", ["Uses pincer grasp", "Picks one at a time", "Releases into the bowl"], "A neat pincer grasp, the base of pencil holding."],
      ["Sorting seeds and pulses", "pick", "PDG", 10, "Mixed seeds and pulses (rajma, chana, moong), 3 bowls", ["Mix 3 kinds of seeds on a tray.", "Show one of each kind.", "Sort them into bowls by type or colour.", "Try the on-screen ‘Sort the seeds’ game."], "Put the same seeds in the same bowl.", ["Sorts correctly", "Uses fingertips", "Keeps working until done"], "Fine finger control and sorting by what they see."],
      ["Transferring objects using fingers", "pick", "PG", 8, "Two bowls, cotton balls or pom-poms", ["Put cotton balls in one bowl.", "Move them one by one to the other bowl.", "Use the thumb and first finger only.", "Race a friend gently."], "Move each ball to the other bowl with two fingers.", ["Pincer grasp", "Steady movement", "Completes the transfer"], "Better finger control."],
      ["Using child-safe tweezers", "pick", "PDG", 10, "Plastic tweezers or tongs, pom-poms, an egg tray", ["Show how to hold tweezers like a pencil.", "Pick a pom-pom and drop it into an egg-tray hole.", "Fill all holes, then empty them.", "Try smaller objects."], "Squeeze the tweezers. Pick it up. Drop it in!", ["Holds tweezers correctly", "Controls the squeeze", "Drops in the right place"], "Strength and control in the same fingers used for writing."],
      ["Sponge squeezing", "life", "P", 6, "Sponges, two bowls of water", ["Soak the sponge in one bowl.", "Squeeze all the water into the other bowl.", "Use one hand, then the other.", "See who empties the bowl first."], "Squeeze the sponge hard! Move the water.", ["Squeezes strongly", "Uses both hands in turn", "Keeps water in the bowl"], "Stronger hand grip."],
      ["Peg clipping", "life", "PG", 8, "Clothes pegs, a paper plate or cardboard strip", ["Show how to open a peg with thumb and first finger.", "Clip pegs around the edge of a plate.", "Match peg colours to coloured dots on the plate.", "Count the pegs."], "Open the peg. Clip it on the plate!", ["Opens the peg with fingertips", "Clips with control", "Matches colours"], "Stronger pinch and finger control."],
      ["Buttoning and unbuttoning practice", "life", "P", 10, "A shirt or a button board with big buttons", ["Start with unbuttoning (easier).", "Show: push the button halfway, pull it through.", "Button 3 big buttons.", "Move to smaller buttons later."], "Push the button through the hole. Pull it!", ["Uses both hands", "Unbuttons without help", "Buttons without help"], "Two-hand coordination and independence."],
      ["Opening and closing containers", "life", "PG", 6, "Jars and boxes with screw lids and snap lids", ["Put a small toy inside each container.", "Twist lids open and closed.", "Open snap lids.", "Match lids to jars."], "Twist the lid. Find the surprise inside!", ["Twists with wrist", "Uses both hands", "Matches lids"], "Wrist turning and hand strength."]
    ],
    practice: [
      { id: "sortcolour", t: "Sort the seeds by colour", w: "dragsort", about: "Drag seeds into the matching bowl.", cfg: { gen: SEEDS } },
      { id: "sortsize", t: "Big and small", w: "dragsort", about: "Sort big and small objects.", cfg: { gen: SIZE, cols: 2 } },
      { id: "tweezers", t: "Tiny bead transfer", w: "dragsort", about: "Move very small beads with care, like using tweezers.", cfg: { gen: TWEEZ, cols: 1 } },
      { id: "beads", t: "Bead threading pattern", w: "seqtap", about: "Copy the colour pattern to thread the beads.", cfg: { mode: "copy", tip: "Look at the bead pattern. Tap the beads in the same order.", start: 3, max: 8, rounds: 6, buttons: COLORS.map(([n, c]) => ({ h: dot(c, 34), l: n, c })) } },
      { id: "pick", t: "Pick the small objects", w: "tapgame", about: "Tap small objects quickly and carefully.", cfg: { emoji: ["🫘", "🔘", "🌰", "🫛"], size: 54, tip: "Pick each small object before it disappears!" } }
    ]
  });

  const SHAPES = ["circle", "square", "triangle", "star", "heart", "diamond"];
  WP.add({
    id: "hand-eye", level: "beginner", stage: "before", name: "Hand-Eye Coordination", icon: "🎯",
    short: "Matching, stacking, sorting shapes, following paths and hitting targets.",
    objective: "Improve coordination between what the eyes see and what the hands do.",
    skills: ["Visual tracking", "Aiming", "Precise placing", "Following a path"],
    outcome: "The child guides the hand by looking, placing and tracing more accurately.",
    assess: ["Looks at the target while moving the hand", "Places objects accurately", "Follows a path without going outside", "Stays focused until finished"],
    support: ["Use bigger targets and wider paths.", "Guide the child's hand for the first try.", "Reduce the number of items."],
    teacher: ["Keep the work area clear of extra objects.", "Encourage the child to look before moving.", "Use the on-screen games for short, focused practice."],
    diff: { Easy: "Big targets, wide paths, few items.", Medium: "Medium targets; add one more step.", Difficult: "Small targets, narrow paths, or a time limit." },
    subs: { match: "Matching and sorting", build: "Building and puzzles", path: "Paths and tracing", target: "Targets and aiming" },
    ws: ["maze", "dots"],
    acts: [
      ["Matching identical objects", "match", "PDG", 8, "Pairs of picture cards or objects", ["Lay cards face down.", "Turn over two; keep them if they match.", "Talk about what is the same.", "Play the on-screen memory game."], "Find two pictures that are the same.", ["Looks carefully", "Remembers positions", "Finds pairs"], "Better visual attention and memory."],
      ["Block stacking", "build", "PG", 8, "Wooden or plastic blocks", ["Stack 3 blocks, then 5, then 8.", "Build a tower to copy a picture.", "Take turns adding a block to a team tower.", "Count the blocks."], "Put one block on top of another. Make a tall tower!", ["Places blocks carefully", "Builds 5+ blocks", "Copies a model"], "Precise placing and steady hands."],
      ["Shape sorting", "match", "PDG", 8, "Shape sorter or cut-out shapes with matching outlines", ["Show a shape and its matching hole.", "Turn the shape until it fits.", "Sort 6 shapes.", "Try the on-screen shape sorter."], "Find the right hole for each shape.", ["Turns shapes to fit", "Matches shapes", "Finishes the set"], "Shape matching with hand control."],
      ["Simple puzzles", "build", "PDG", 10, "2-, 4- or 9-piece puzzles", ["Show the whole picture first.", "Find corner pieces first.", "Complete the puzzle.", "Use the on-screen picture puzzle."], "Put the pieces together to make the picture.", ["Looks at the picture", "Turns pieces to fit", "Completes the puzzle"], "Seeing how parts make a whole."],
      ["Connecting matching dots", "path", "DW", 8, "Dot worksheet or the on-screen game", ["Show two dots with the same picture.", "Draw a line to join them.", "Join all the pairs.", "Try the dot-to-dot worksheet."], "Join each picture to its partner with a line.", ["Finds the matching pair", "Draws a line to the dot", "Lines reach the dot"], "Aiming the hand at a target."],
      ["Following a pathway", "path", "PDW", 8, "Rope or chalk path; maze worksheet", ["Make a wiggly path on the floor with rope.", "Walk it, then trace it with a finger in the air.", "Trace a paper maze with a finger, then a crayon.", "Try the on-screen road."], "Help the mouse reach the cheese. Stay on the road!", ["Stays inside the path", "Moves smoothly", "Reaches the end"], "Controlled hand movement along a line."],
      ["Putting objects into specific containers", "target", "PDG", 8, "Coloured cups and matching objects", ["Line up coloured cups.", "Drop each object into the cup of the same colour.", "Move cups further away.", "Use the sorting game."], "Drop each one into the right cup.", ["Aims carefully", "Matches colours", "Releases at the right time"], "Accurate aiming and release."],
      ["Tracing shapes using fingers", "path", "PDW", 6, "Sand tray, shapes drawn in sand or on the screen", ["Draw a big shape in sand.", "The child traces it with a finger.", "Trace shapes on the screen with a finger.", "Say the shape name while tracing."], "Trace the shape with your finger.", ["Starts at the start point", "Follows the line", "Closes the shape"], "Shape tracing control before using a crayon."],
      ["Object transfer activities", "target", "PG", 8, "Spoon, small balls, two bowls", ["Carry a ball on a spoon from one bowl to another.", "Walk slowly and look at the spoon.", "Make it a relay race.", "Use a smaller spoon to make it harder."], "Carry the ball on the spoon. Don't drop it!", ["Watches the spoon", "Keeps the hand steady", "Finishes the transfer"], "Steady hands while watching."],
      ["Target-based games", "target", "PDG", 10, "Bean bags, a hoop or a chalk circle", ["Place a hoop 2 metres away.", "Throw bean bags into it.", "Score 1 point for each one inside.", "Play the on-screen target game."], "Throw the bean bag into the hoop!", ["Looks at the target", "Adjusts force", "Hits the target"], "Aiming and judging distance."]
    ],
    practice: [
      { id: "memory", t: "Matching pictures (memory)", w: "memory", about: "Find identical pairs.", cfg: { pairs: 6, emoji: ["🍎", "🐶", "⚽", "🚗", "🌸", "🐟", "⭐", "🎈", "🍌", "🐱"] } },
      { id: "shapesort", t: "Shape sorter", w: "dragsort", about: "Drag each shape into its matching hole.", cfg: { cols: 3, gen: () => { const s = shuffle(SHAPES).slice(0, 3); return { prompt: "Put each shape into the hole with the same shape.", items: s.flatMap((n) => [{ h: WP.shapeSVG(n, "#5b5bd6", { size: 50 }), k: n }, { h: WP.shapeSVG(n, "#18a88f", { size: 50, rot: 20 }), k: n }]), bins: s.map((n) => ({ h: WP.shapeSVG(n, "#8a8fa8", { size: 54, outline: true }), k: n })) }; } } },
      { id: "puzzle", t: "Picture puzzle", w: "puzzle", about: "Swap pieces to make the picture.", cfg: { emoji: ["🐘", "🦁", "🏠", "🚌", "🌻"] } },
      { id: "connect", t: "Connect matching dots", w: "pairs", about: "Join each picture to its partner.", cfg: { gen: () => { const e = shuffle(["🍎", "🐶", "⚽", "🚗", "🌸", "🐟", "⭐"]).slice(0, 4); return { prompt: "Tap a picture, then tap the same picture on the other side.", pairs: e.map((x) => [x, x]) }; } } },
      { id: "road", t: "Follow the road", w: "trace", about: "Keep the finger on the road from start to end.", cfg: { options: [{ label: "Mouse to cheese", glyphs: [WP.ROAD.s], opts: { road: ["🐭", "🧀"], lines: false } }, { label: "Car to house", glyphs: [["M 0 60 C 30 0 60 0 80 40 C 100 80 130 90 160 50 C 190 10 220 20 240 60"]], opts: { road: ["🚗", "🏠"], lines: false } }, { label: "Bee to flower", glyphs: [["M 0 20 L 60 20 C 90 20 90 80 60 80 L 0 80 C -30 80 -30 140 0 140 L 120 140"]], opts: { road: ["🐝", "🌼"], lines: false } }], tip: "Put your finger on the start and follow the road to the end.", maxH: 280 } },
      { id: "shapes", t: "Trace shapes with a finger", w: "trace", about: "Finger-trace big shapes.", cfg: { options: SHAPES.map((n) => ({ label: G[n].n, glyphs: [G[n].s], opts: { lines: false } })), pen: 9 } },
      { id: "targets", t: "Target game", w: "tapgame", about: "Tap the targets as they appear.", cfg: { emoji: ["🎯", "🎈", "⭐", "🫧"], size: 80 } }
    ]
  });

  /* visual perception question generators */
  const COLS = ["#e5484d", "#2f8ee0", "#2aa876", "#f5a524", "#8e4ec6"];
  const sh = (n, c, o) => WP.shapeSVG(n, c, Object.assign({ size: 64 }, o));
  const VP = {
    same: () => { const t = pick(SHAPES), c = pick(COLS), others = shuffle(SHAPES.filter((x) => x !== t)).slice(0, 3); return { prompt: `Find the one that is exactly the same:<div class="wp-model">${sh(t, c, { size: 80 })}</div>`, choices: shuffle([{ h: sh(t, c), ok: true }].concat(others.map((o) => ({ h: sh(o, c), ok: false })))) }; },
    odd: () => { const t = pick(SHAPES), o = pick(SHAPES.filter((x) => x !== t)), c = pick(COLS), k = Math.floor(Math.random() * 4); return { prompt: "Which one is different?", choices: [0, 1, 2, 3].map((i) => ({ h: sh(i === k ? o : t, c), ok: i === k })) }; },
    pattern: () => { const a = pick(SHAPES), b = pick(SHAPES.filter((x) => x !== a)), ca = pick(COLS), cb = pick(COLS.filter((x) => x !== ca)), seq = [[a, ca], [b, cb], [a, ca], [b, cb], [a, ca]]; return { prompt: `What comes next?<div class="wp-model">${seq.map(([n, c]) => sh(n, c, { size: 46 })).join("")}<span class="wp-qm">?</span></div>`, choices: shuffle([{ h: sh(b, cb), ok: true }, { h: sh(a, ca), ok: false }, { h: sh(pick(SHAPES.filter((x) => x !== a && x !== b)), pick(COLS)), ok: false }]) }; },
    missing: () => { const s = shuffle(SHAPES).slice(0, 3), c = pick(COLS), seq = s.concat(s), m = 1 + Math.floor(Math.random() * 4); return { prompt: `Which shape is missing?<div class="wp-model">${seq.map((n, i) => (i === m ? '<span class="wp-qm">?</span>' : sh(n, c, { size: 46 }))).join("")}</div>`, choices: shuffle(s.map((n) => ({ h: sh(n, c), ok: n === seq[m] }))) }; },
    diff: () => { const s = shuffle(["🍎", "🐶", "⚽", "🚗", "🌸", "🐟", "⭐", "🎈"]).slice(0, 4), k = Math.floor(Math.random() * 4), alt = s.slice(); alt[k] = pick(["🍌", "🐱", "🏀", "🚌", "🌼", "🐠", "🌙", "🪁"]); return { prompt: `Look at both rows. Which picture is different in the bottom row?<div class="wp-model">${s.join(" ")}</div><div class="wp-model">${alt.join(" ")}</div>`, choices: alt.map((e, i) => ({ h: `<span style="font-size:2.2rem">${e}</span>`, ok: i === k })) }; },
    direction: () => { const d = pick([["left", "⬅️"], ["right", "➡️"], ["up", "⬆️"], ["down", "⬇️"]]); return { prompt: `Which arrow points <b>${d[0].toUpperCase()}</b>?`, say: "Which arrow points " + d[0], choices: shuffle(["⬅️", "➡️", "⬆️", "⬇️"]).map((a) => ({ h: `<span style="font-size:2.6rem">${a}</span>`, ok: a === d[1] })) }; },
    position: () => { const pos = pick(["top", "bottom", "left", "right"]), cell = { top: 1, bottom: 7, left: 3, right: 5 }; return { prompt: `Where is the ball? <div class="wp-grid3">${Array.from({ length: 9 }, (_, i) => `<span>${i === 4 ? "📦" : i === cell[pos] ? "⚽" : ""}</span>`).join("")}</div>`, choices: ["top", "bottom", "left", "right"].map((p) => ({ h: { top: "⬆️ Above the box", bottom: "⬇️ Below the box", left: "⬅️ Left of the box", right: "➡️ Right of the box" }[p], ok: p === pos })), cols: 2 }; },
    size: () => { const e = pick(["🐘", "🍎", "⭐", "🚗", "🐟"]), big = Math.random() < .5, sizes = shuffle([1.2, 1.8, 2.6, 3.4]), t = big ? Math.max(...sizes) : Math.min(...sizes); return { prompt: `Tap the <b>${big ? "biggest" : "smallest"}</b> one.`, say: "Tap the " + (big ? "biggest" : "smallest") + " one", choices: sizes.map((s) => ({ h: `<span style="font-size:${s}rem">${e}</span>`, ok: s === t })) }; },
    orient: () => { const n = pick(["triangle", "heart", "star"]), k = Math.floor(Math.random() * 4); return { prompt: "One is upside down. Which one?", choices: [0, 1, 2, 3].map((i) => ({ h: sh(n, "#5b5bd6", { rot: i === k ? 180 : 0 }), ok: i === k })) }; },
    sequence: () => { const s = shuffle(["🍎", "🐶", "⚽", "🚗", "🌸", "⭐"]).slice(0, 3), ask = Math.floor(Math.random() * 3), word = ["first", "second", "third"][ask]; return { prompt: `Look at the order: <div class="wp-model">${s.map((e, i) => `<span style="font-size:2rem">${e}</span>${i < 2 ? " ➜ " : ""}`).join("")}</div>Which one came <b>${word}</b>?`, choices: shuffle(s).map((e) => ({ h: `<span style="font-size:2.2rem">${e}</span>`, ok: e === s[ask] })) }; }
  };
  WP.VP = VP;
  WP.add({
    id: "visual", level: "beginner", stage: "before", name: "Visual Perception", icon: "👀",
    short: "Seeing shapes, patterns, positions, directions and differences.",
    objective: "Help children recognise shapes, directions, positions, patterns and visual differences.",
    skills: ["Visual discrimination", "Pattern recognition", "Spatial awareness", "Visual memory"],
    outcome: "The child notices small differences and directions, which is needed to tell letters like b and d apart.",
    assess: ["Finds the same or different item", "Completes simple patterns", "Uses words for position (up, down, left, right)", "Remembers a short visual sequence"],
    support: ["Use fewer choices (2 instead of 4).", "Use real objects before pictures.", "Point and talk through what is the same and different."],
    teacher: ["Ask ‘How do you know?’ to build visual language.", "Keep sessions short (5–8 minutes).", "Use left/right with a band on the right wrist."],
    diff: { Easy: "Two or three choices, big clear pictures.", Medium: "Four choices; patterns of two.", Difficult: "Small details, patterns of three, or from memory." },
    subs: { same: "Same and different", pattern: "Patterns and sequences", space: "Position and direction", size: "Size and orientation" },
    ws: ["visual"],
    acts: [
      ["Identify identical shapes", "same", "PDW", 6, "Shape cards", ["Show one shape.", "Spread 4 cards; one is the same.", "The child finds it and says why.", "Use the on-screen ‘Same shape’ game."], "Find the one that is exactly the same.", null, null],
      ["Match pictures", "same", "PDG", 8, "Picture card pairs", ["Lay out picture pairs mixed up.", "Match each pair.", "Talk about details (colour, size).", "Play the memory game."], "Find the matching pictures.", null, null],
      ["Find the odd one out", "same", "PDW", 6, "Sets of 4 objects (3 same, 1 different)", ["Place 3 spoons and 1 fork.", "Ask ‘Which one does not belong?’", "Make it harder with small differences.", "Use the on-screen game."], "Which one is different?", null, null],
      ["Identify missing shapes", "pattern", "DW", 6, "Shape strips with a gap", ["Show a shape strip with one shape covered.", "The child guesses the missing shape.", "Uncover and check.", "Use the ‘Missing shape’ game."], "Which shape is missing?", null, null],
      ["Complete patterns", "pattern", "PDWG", 8, "Coloured blocks or beads", ["Make a pattern: red, blue, red, blue…", "The child continues it.", "Try AAB patterns.", "Children make patterns for friends."], "What comes next in the pattern?", null, null],
      ["Find differences between pictures", "same", "DW", 8, "Two similar pictures", ["Show two pictures side by side.", "Find 3 differences.", "Circle them on a worksheet.", "Use the on-screen ‘Spot the difference’ game."], "Look at both pictures. What is different?", null, null],
      ["Recognise shapes and their positions", "space", "PDG", 8, "A box and a ball", ["Put the ball above, below, beside the box.", "Ask ‘Where is the ball?’", "The child places the ball where you say.", "Use the ‘Where is it?’ game."], "Put the ball on top of the box!", null, null],
      ["Identify left, right, up and down", "space", "PDG", 8, "Arrow cards", ["Point arrows in different directions.", "Children point the same way.", "Play ‘Arrow says’ (like Simon says).", "Use the ‘Which way?’ game."], "Point your arm the way the arrow points.", null, null],
      ["Follow visual sequences", "pattern", "PDG", 8, "3–4 picture cards", ["Show cards in an order for 5 seconds.", "Turn them over.", "The child says or rebuilds the order.", "Use the ‘Remember the order’ game."], "Remember the order of the pictures.", null, null],
      ["Identify objects based on size and orientation", "size", "PDW", 8, "Objects of different sizes; picture cards turned different ways", ["Line up objects by size.", "Find the biggest and smallest.", "Find the picture that is upside down.", "Use the ‘Big and small’ and ‘Upside down’ games."], "Find the biggest one. Find the one upside down.", null, null]
    ],
    practice: [
      { id: "same", t: "Same shape", w: "quiz", cfg: { gen: VP.same } }, { id: "odd", t: "Odd one out", w: "quiz", cfg: { gen: VP.odd } },
      { id: "pattern", t: "What comes next?", w: "quiz", cfg: { gen: VP.pattern, rounds: 5 } }, { id: "missing", t: "Missing shape", w: "quiz", cfg: { gen: VP.missing, rounds: 5 } },
      { id: "diff", t: "Spot the difference", w: "quiz", cfg: { gen: VP.diff, rounds: 5 } }, { id: "direction", t: "Which way?", w: "quiz", cfg: { gen: VP.direction } },
      { id: "position", t: "Where is it?", w: "quiz", cfg: { gen: VP.position } }, { id: "size", t: "Big and small", w: "quiz", cfg: { gen: VP.size } },
      { id: "orient", t: "Upside down", w: "quiz", cfg: { gen: VP.orient } }, { id: "sequence", t: "Remember the order", w: "quiz", cfg: { gen: VP.sequence, rounds: 5 } }
    ]
  });

  const FINGERS = [["👍", "Thumb", "#e5484d"], ["☝️", "Index", "#f5a524"], ["🖕", "Middle", "#2aa876"], ["💍", "Ring", "#2f8ee0"], ["🤙", "Little", "#8e4ec6"]];
  WP.add({
    id: "finger-strength", level: "beginner", stage: "before", name: "Finger and Hand Strength", icon: "💪",
    short: "Pressing, tapping, squeezing and isolating each finger.",
    objective: "Build finger strength and the ability to move each finger on its own.",
    skills: ["Finger isolation", "Grip strength", "Endurance", "Thumb opposition"],
    outcome: "Stronger fingers that can hold a crayon for longer without tiring.",
    assess: ["Moves one finger at a time", "Touches thumb to each finger", "Holds a press for 3 seconds", "Squeezes with good force"],
    support: ["Do the movement with the child's hand on yours.", "Use softer dough and fewer repetitions.", "Sing a finger song to keep it fun."],
    teacher: ["Do a 2-minute finger warm-up before every writing lesson.", "Watch for tiredness and give breaks.", "Make it rhythmic with songs or counting."],
    diff: { Easy: "Fewer repetitions; soft materials.", Medium: "More repetitions; one finger at a time.", Difficult: "Faster patterns, harder dough, longer holds." },
    subs: { press: "Pressing and squeezing", isolate: "Finger isolation", move: "Finger movement" },
    ws: ["finger"],
    acts: [
      ["Finger pressing games", "press", "PDG", 5, "Bubble wrap or the on-screen press button", ["Pop bubble wrap with each finger in turn.", "Press and hold the on-screen button.", "Count the pops together."], "Press with one finger. Pop!", null, null],
      ["Finger isolation exercises", "isolate", "PD", 5, "None", ["Hold the hand flat on the table.", "Lift one finger at a time.", "Name the finger while lifting.", "Use the on-screen finger game."], "Lift only one finger. Keep the others down.", null, null],
      ["Thumb-to-finger touching", "isolate", "PDG", 4, "None", ["Touch the thumb to each fingertip in turn.", "Go forward, then backward.", "Do it with eyes closed.", "Do it faster with a song."], "Touch your thumb to each finger: 1, 2, 3, 4!", null, null],
      ["Finger tapping patterns", "isolate", "PDG", 5, "A table, or the on-screen tapping game", ["Tap fingers on the table in a pattern: 1-2-3-4.", "Copy the teacher's pattern.", "Play the on-screen tapping game."], "Copy my tapping pattern.", null, null],
      ["Clay pressing", "press", "P", 6, "Clay or dough", ["Flatten a ball with the palm.", "Press holes with each fingertip.", "Make a ‘pizza’ with finger-press toppings."], "Press your finger into the clay. Make holes!", null, null],
      ["Sponge squeezing", "press", "P", 5, "Sponge, water, two bowls", ["Squeeze water from one bowl to another.", "Use fingertips only, then the whole hand."], "Squeeze the sponge with your fingers!", null, null],
      ["Peg squeezing", "press", "PG", 5, "Clothes pegs", ["Open and close a peg 10 times with thumb and index finger.", "Then thumb and middle finger.", "Clip pegs onto a card."], "Squeeze the peg open. Let go.", null, null],
      ["Finger walking", "move", "PDW", 5, "Finger-walk worksheet or a path drawn on paper", ["Walk the index and middle fingers along a path.", "Walk up a ladder drawn on paper.", "Use the finger-walk worksheet."], "Walk your fingers up the ladder!", null, null],
      ["Palm opening and closing", "move", "PG", 3, "None", ["Open the hand wide (star), then close a tight fist.", "Repeat 10 times with each hand.", "Do it to a beat."], "Open like a star. Close like a stone!", null, null],
      ["Sand tracing", "move", "P", 8, "A tray of sand or salt", ["Draw lines and shapes in sand with the index finger.", "Shake the tray to erase.", "Draw letters later when ready."], "Draw in the sand with one finger.", null, null]
    ],
    practice: [
      { id: "tap", t: "Finger tapping pattern", w: "seqtap", about: "Watch the fingers light up, then tap the same order.", cfg: { tip: "Watch which fingers light up. Then tap them in the same order.", start: 2, max: 6, rounds: 6, labelsSay: true, buttons: FINGERS.map(([h, l, c]) => ({ h, l, c })) } },
      { id: "press", t: "Press and hold", w: "hold", about: "Press the big button with one finger and hold.", cfg: { secs: 3, steps: [{ e: "☝️", t: "Press with your index finger." }, { e: "🖕", t: "Press with your middle finger." }, { e: "👍", t: "Press with your thumb." }, { e: "💍", t: "Press with your ring finger." }, { e: "🤙", t: "Press with your little finger." }] } },
      { id: "walk", t: "Finger walking ladder", w: "seqtap", about: "Walk two fingers by tapping left, right, left, right.", cfg: { tip: "Tap the two feet in the order they light up, like walking up a ladder.", start: 3, max: 8, rounds: 5, buttons: [{ h: "🦶", l: "Left", c: "#2f8ee0" }, { h: "🦶", l: "Right", c: "#f5a524" }] } },
      { id: "thumbs", t: "Thumb touches (guided)", w: "coach", about: "A guided routine for thumb-to-finger touches and open/close hands.", cfg: { routines: [{ name: "Thumb touches", steps: [{ e: "👌", t: "Touch your thumb to your index finger.", s: 4 }, { e: "🤌", t: "Thumb to middle finger.", s: 4 }, { e: "🤞", t: "Thumb to ring finger.", s: 4 }, { e: "🤙", t: "Thumb to little finger.", s: 4 }, { e: "🔁", t: "Now go back the other way, faster!", s: 8 }] }, { name: "Star and stone", steps: [{ e: "🖐", t: "Open your hand wide like a star.", s: 3 }, { e: "✊", t: "Close it tight like a stone.", s: 3 }, { e: "🖐", t: "Star!", s: 3 }, { e: "✊", t: "Stone!", s: 3 }, { e: "👐", t: "Shake both hands loose.", s: 4 }] }] } }
    ]
  });

  /* ---------------------------------------------- B. AFTER PENCIL GRIP ---------------------------------------------- */
  const GRIP_SVG = `<svg viewBox="0 0 240 160" class="wp-gripsvg" role="img" aria-label="Pencil held between thumb and index finger, resting on the middle finger">
    <rect x="30" y="70" width="170" height="16" rx="4" transform="rotate(-30 120 78)" fill="#ffd23f" stroke="#7a5c00" stroke-width="2"/><polygon points="0,0 22,8 0,16" transform="translate(178 22) rotate(150)" fill="#f2c79a" stroke="#7a5c00"/>
    <ellipse cx="98" cy="96" rx="24" ry="16" fill="#f4c7a1" stroke="#a46b45" stroke-width="2"/><text x="98" y="101" text-anchor="middle" font-size="11" font-family="Arial">thumb</text>
    <ellipse cx="128" cy="62" rx="24" ry="14" fill="#f4c7a1" stroke="#a46b45" stroke-width="2"/><text x="128" y="66" text-anchor="middle" font-size="11" font-family="Arial">index</text>
    <ellipse cx="72" cy="122" rx="26" ry="14" fill="#efb88f" stroke="#a46b45" stroke-width="2"/><text x="72" y="126" text-anchor="middle" font-size="11" font-family="Arial">middle (rest)</text>
    <text x="160" y="150" font-size="11" font-family="Arial" fill="#555">Pencil rests on the middle finger</text></svg>`;
  WP.add({
    id: "pencil-grip", level: "beginner", stage: "after", name: "Pencil Grip", icon: "✍️",
    short: "Holding crayons, chalk and pencils comfortably and with control.",
    objective: "Help children hold crayons, chalk and pencils in a comfortable, functional way that gives control.",
    skills: ["Pincer grasp", "Finger placement", "Hand posture", "Pressure control"],
    outcome: "The child holds a writing tool with a relaxed, functional grip and controls it to make marks.",
    assess: ["Holds the tool with fingertips, not the whole fist", "Hand and wrist are relaxed", "Other hand holds the paper", "Controls pressure (marks are visible but not tearing)"],
    support: ["Use short, thick or triangular crayons (they encourage a fingertip grip).", "Break crayons in half so only fingertips fit.", "Accept any functional grip that is comfortable and gives control."],
    teacher: ["Do not force one ‘correct’ grip; look for comfort and control.", "Check posture: feet flat, back straight, paper slightly tilted.", "Short daily practice is better than long sessions."],
    diff: { Easy: "Thick crayons and chalk on big paper.", Medium: "Triangular pencils; medium paper.", Difficult: "Regular pencils; small spaces." },
    subs: { learn: "Learning the grip", practise: "Grip practice", check: "Grip check" },
    ws: ["lines", "obs-grip"],
    acts: [
      ["Pinch-and-flip pencil pick-up", "learn", "PG", 5, "A pencil or crayon on the table", ["Place the pencil on the table pointing at the child.", "Pinch it with thumb and index finger near the tip.", "Flip it back so it rests on the hand.", "Repeat 5 times."], "Pinch the pencil. Flip it. Ready to write!", null, null],
      ["Thick crayon practice", "practise", "PW", 10, "Thick or broken short crayons, big paper", ["Give a short, thick crayon (it fits only the fingertips).", "Draw big lines, circles and zigzags.", "Remind: other hand holds the paper.", "Use the stroke worksheet with thick crayons."], "Hold your crayon with your fingertips. Draw big lines!", null, null],
      ["Triangular pencil practice", "practise", "PW", 10, "Triangular pencils, line worksheet", ["Show the three flat sides: thumb, index and middle each get one side.", "Trace standing and sleeping lines.", "Check the grip midway and praise."], "One finger on each flat side. Let's trace!", null, null],
      ["Chalk on the board or slate", "practise", "PG", 8, "Short chalk pieces, a board or slate", ["Use short chalk pieces.", "Draw big shapes on a vertical board (good for the wrist).", "Erase and draw again."], "Draw big shapes with your chalk.", null, null],
      ["Finger position song", "learn", "PG", 4, "None", ["Sing: ‘Pinch the pencil, flip it round, rest it on the middle, now it's down!’", "Children show the grip as they sing.", "Repeat before writing time."], "Sing and show the pencil grip!", null, null],
      ["Grip observation", "check", "D", 5, "The on-screen grip checklist", ["Watch the child draw for 2 minutes.", "Mark the checklist (Not yet / Sometimes / Yes).", "Write a short note and save it to the child's progress."], "Draw something for me.", null, null]
    ],
    practice: [
      { id: "guide", t: "How to hold a pencil", w: "html", about: "A picture guide to a comfortable grip.", html: `<div class="wp-guide">${GRIP_SVG}<ol class="wp-steps"><li><b>Pinch</b> the pencil near the tip with thumb and index finger.</li><li><b>Rest</b> it on the side of the middle finger.</li><li><b>Relax</b> the other fingers; curl them gently.</li><li><b>Hold</b> the paper with the other hand.</li><li><b>Sit</b> with feet flat and back straight.</li></ol><p class="note">Every hand is different. Look for a grip that is comfortable and gives control. Short or triangular crayons make a fingertip grip easier.</p></div>` },
      { id: "warm", t: "Warm-up with a thick crayon", w: "trace", about: "Big strokes with a thick crayon size.", cfg: { options: [{ label: "Zigzag", glyphs: row("zigzag", 2) }, { label: "Waves", glyphs: row("waves", 3) }, { label: "Circles", glyphs: row("circle", 2) }], pen: 12 } },
      { id: "check", t: "Grip observation checklist", w: "checklist", about: "Saved to the child's progress.", cfg: { title: "Pencil grip observation", intro: '<p class="small muted">Watch the child draw for 2 minutes. There is no single correct grip: look for comfort and control.</p>', items: ["Holds with fingertips (not a whole-fist grip)", "Thumb and index finger pinch the pencil", "Pencil rests on the middle finger", "Hand and wrist look relaxed", "Other hand holds the paper", "Pressure is right (not too light, not too hard)"] } }
    ]
  });

  WP.add({
    id: "scribbling", level: "beginner", stage: "after", name: "Scribbling", icon: "🖍️",
    short: "Free scribbling, scribbling inside boundaries, joining dots and colouring.",
    objective: "Let children explore marks freely, then gradually control where the marks go.",
    skills: ["Mark making", "Boundary control", "Colour choice", "Joining points"],
    outcome: "The child moves from free scribbles to controlled marks inside shapes and along dots.",
    assess: ["Makes different kinds of marks", "Keeps most scribbles inside a boundary", "Joins dots in order", "Enjoys the activity and keeps going"],
    support: ["Use big paper taped to the table.", "Use bigger boundaries and fewer dots.", "Draw alongside the child."],
    teacher: ["Praise all marks at first.", "Name the marks: ‘round and round’, ‘up and down’.", "Save drawings to see progress over time."],
    diff: { Easy: "Free scribbling on big paper.", Medium: "Scribble inside one big shape.", Difficult: "Colour small pictures; join 12+ dots." },
    subs: { free: "Free scribbling", inside: "Inside boundaries", dots: "Dots", colour: "Colouring" },
    ws: ["scribble", "dots"],
    acts: [
      ["Free scribbling", "free", "PD", 10, "Big paper, thick crayons (or the drawing canvas)", ["Tape a big paper to the table.", "Let the child scribble freely.", "Name the marks they make.", "Save the drawing with the date."], "Scribble anything you like!", null, null],
      ["Scribbling inside large boundaries", "inside", "PDW", 8, "A big outline (circle, square, cloud)", ["Draw a big shape.", "Scribble only inside it.", "Talk about ‘inside’ and ‘outside’.", "Use the ‘Inside a big shape’ canvas."], "Scribble inside the shape. Don't go out!", null, null],
      ["Scribbling within shapes", "inside", "PDW", 8, "Paper with 3 medium shapes", ["Draw 3 shapes.", "Use a different colour in each.", "Stay inside each one."], "Colour each shape with a different colour.", null, null],
      ["Connecting scattered dots", "dots", "PDW", 8, "Dot-to-dot worksheet", ["Show dot number 1.", "Draw a line to 2, then 3…", "See what picture appears.", "Use the on-screen dots."], "Join the dots: 1, 2, 3…", null, null],
      ["Colouring simple pictures", "colour", "PDW", 10, "Simple outline pictures, crayons", ["Choose a simple picture (apple, sun, fish).", "Colour inside the lines.", "Use the colouring canvas.", "Display the work."], "Colour the picture. Stay inside the lines.", null, null],
      ["Rainbow scribbles", "free", "PG", 8, "Many colours, big paper", ["Scribble big arcs with each colour.", "Make a rainbow together on chart paper.", "Each child adds one colour."], "Make a big rainbow!", null, null]
    ],
    practice: [{ id: "canvas", t: "Scribbling canvas", w: "drawpad", about: "Colours, sizes, eraser, undo/redo, save and download.", cfg: { modes: ["free", "boundary", "shapes", "dots", "colour"] } }]
  });

  const STROKES = ["standing", "sleeping", "slanting", "reverse", "short", "long"];
  WP.add({
    id: "strokes", level: "beginner", stage: "after", name: "Basic Strokes", icon: "📏",
    short: "Standing, sleeping, slanting, reverse slanting, short and long lines.",
    objective: "Practise the straight strokes that make up most letters, starting at the right point and moving in the right direction.",
    skills: ["Top-to-bottom strokes", "Left-to-right strokes", "Diagonal strokes", "Starting point"],
    outcome: "The child draws straight lines in the correct direction from the starting point.",
    assess: ["Starts at the green starting point", "Moves in the arrow direction", "Stays on the dotted line", "Stops at the end of the line"],
    support: ["Use bigger lines with fewer repetitions.", "Hand-over-hand for the first stroke.", "Use a highlighter line to trace over."],
    teacher: ["Standing lines go top to bottom; sleeping lines go left to right.", "Say the movement aloud: ‘Start at the top, slide down’.", "Use the 👀 Show me button to model."],
    diff: { Easy: "One big line with arrows.", Medium: "A row of three lines.", Difficult: "Five smaller lines without arrows." },
    subs: { straight: "Standing and sleeping", slant: "Slanting lines", length: "Short and long lines" },
    ws: ["lines"],
    acts: [
      ["Standing lines", "straight", "PDW", 8, "Line worksheet, crayon", ["Show: start at the top, slide down.", "Trace 5 standing lines.", "Draw 5 on your own."], "Start at the top. Slide down!", null, null],
      ["Sleeping lines", "straight", "PDW", 8, "Line worksheet", ["Show: start at the left, go across.", "Trace, then draw alone."], "Start on the left. Go across!", null, null],
      ["Slanting lines", "slant", "PDW", 8, "Line worksheet", ["Show: start at the top right, slide down to the left.", "Practise ‘slide’ movements."], "Start at the top. Slide down like a slide!", null, null],
      ["Reverse slanting lines", "slant", "PDW", 8, "Line worksheet", ["Show: start at the top left, slide down to the right.", "Compare with slanting lines."], "Start at the top. Slide down the other way!", null, null],
      ["Short and long lines", "length", "PDW", 8, "Line worksheet with four-line rows", ["Short lines go from the middle line to the base line.", "Long lines go from the top line to the descender line.", "Mix short and long."], "Short line, long line, short line!", null, null],
      ["Line art in sand or with chalk", "straight", "PG", 8, "Sand tray or chalk", ["Draw fences (standing lines) and roads (sleeping lines).", "Draw rain (slanting lines).", "Make a team picture on the floor with chalk."], "Draw a fence, a road and rain!", null, null],
      ["Stick placing", "slant", "PG", 6, "Ice-cream sticks or straws", ["Place sticks as standing, sleeping and slanting lines.", "Copy a pattern of sticks.", "Then draw what you made."], "Make the same lines with sticks.", null, null]
    ],
    practice: [{ id: "trace", t: "Trace the strokes", w: "trace", about: "Dotted guides, start points, arrows, Show me, Check.", cfg: { levels: true, options: STROKES.map((k) => ({ label: G[k].n, glyphs: [G[k].s] })) } }]
  });

  const CURVES = ["leftcurve", "rightcurve", "upcurve", "downcurve", "circle", "semicircle", "loops", "waves", "zigzag", "combined"];
  WP.add({
    id: "curves", level: "beginner", stage: "after", name: "Curves and Shapes", icon: "〰️",
    short: "Left and right curves, circles, loops, waves, zigzags and combined patterns.",
    objective: "Practise curved and changing-direction movements needed for round letters.",
    skills: ["Curved strokes", "Changing direction", "Closing shapes", "Rhythm of patterns"],
    outcome: "The child draws curves and simple shapes smoothly, starting at the right point.",
    assess: ["Starts at the start point", "Curves are smooth (not pointed)", "Closes circles", "Keeps patterns even"],
    support: ["Trace in the air and in sand before paper.", "Use larger patterns with fewer repetitions.", "Say a rhyme while moving (e.g. ‘round the sun’)."],
    teacher: ["Circles start at the top and go anticlockwise (like the letter c).", "Increase difficulty slowly: Easy → Medium → Difficult.", "Praise smooth movement, not just neatness."],
    diff: { Easy: "One big curve with arrows.", Medium: "Three curves in a row.", Difficult: "Five small curves without arrows." },
    subs: { curve: "Curves", shape: "Circles and semicircles", pattern: "Waves, loops and zigzags" },
    ws: ["curves", "shapes", "patterns"],
    acts: [
      ["Left and right curves", "curve", "PDW", 8, "Curve worksheet", ["Show a left curve like the letter c.", "Then a right curve like a backwards c.", "Trace and draw."], "Curve around like a moon!", null, null],
      ["Upward and downward curves", "curve", "PDW", 8, "Curve worksheet", ["Upward curve = a smile, downward = a rainbow.", "Draw smiles and rainbows."], "Draw a smile. Now a rainbow!", null, null],
      ["Circles", "shape", "PDW", 8, "Circle worksheet", ["Start at the top, go round anticlockwise.", "Draw big circles, then small.", "Make faces from the circles."], "Start at the top. Go round and close it!", null, null],
      ["Semicircles", "shape", "PDW", 6, "Worksheet", ["Draw half circles: tunnels and bridges.", "Join several for a caterpillar."], "Draw a tunnel!", null, null],
      ["Loops", "pattern", "PDW", 8, "Pattern worksheet", ["Draw loops like a rolling spring.", "Keep loops the same size."], "Make loops like a spring!", null, null],
      ["Waves", "pattern", "PDW", 6, "Pattern worksheet", ["Draw waves like the sea.", "Keep them smooth."], "Draw the sea waves!", null, null],
      ["Zigzag patterns", "pattern", "PDW", 6, "Pattern worksheet", ["Draw zigzags like mountains.", "Make sharp points."], "Up, down, up, down: mountains!", null, null],
      ["Combined patterns", "pattern", "PDW", 8, "Pattern worksheet", ["Mix waves and zigzags.", "Copy a combined pattern."], "Copy the pattern.", null, null],
      ["Rope and ribbon shapes", "shape", "PG", 8, "Rope or wool", ["Make curves and circles with rope on the floor.", "Walk around them.", "Copy the shapes on paper."], "Make a circle with the rope. Walk around it!", null, null]
    ],
    practice: [{ id: "trace", t: "Trace curves and shapes", w: "trace", about: "Ten patterns with increasing difficulty.", cfg: { levels: true, options: CURVES.map((k) => ({ label: G[k].n, glyphs: [G[k].s] })) } }]
  });

  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), LOWER = "abcdefghijklmnopqrstuvwxyz".split("");
  WP.UPPER = UPPER; WP.LOWER = LOWER;
  WP.ASSAMESE = { vowels: ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ"], consonants: ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "ৰ", "ল", "ৱ", "শ", "ষ", "স", "হ", "ক্ষ", "ড়", "ঢ়", "য়"] };
  const PATTERNS = ["cshape", "ocircle", "cross", "lshape", "tshape", "vshape", "xshape", "elloop", "cup", "arch", "hook", "stick"];
  WP.add({
    id: "readiness", level: "beginner", stage: "after", name: "Alphabet Readiness", icon: "🔡",
    short: "Pre-writing patterns that lead into letters, then first letter tracing (English and Assamese).",
    objective: "Prepare for letter formation with letter-like patterns, then introduce letter tracing when the child is ready.",
    skills: ["Letter-like movements", "Combining strokes", "Starting points", "Letter shapes"],
    outcome: "The child combines strokes into letter-like patterns and begins to trace letters correctly.",
    assess: ["Copies letter-like patterns", "Combines vertical, horizontal and slanting lines", "Starts letters at the right point", "Recognises the letter traced"],
    support: ["Stay longer with patterns before letters.", "Trace letters in sand first.", "Use only 3–4 letters per week."],
    teacher: ["Introduce letters only when strokes and curves are comfortable.", "Group letters with the same movement (c, o, a, d).", "Assamese letters are traced over the letter shape."],
    diff: { Easy: "One big pattern with arrows.", Medium: "Three patterns, then one letter.", Difficult: "Letters without arrows." },
    subs: { pattern: "Pre-writing patterns", letters: "First letters", assamese: "Assamese letters" },
    ws: ["patterns", "alpha", "assamese"],
    acts: [
      ["Curved patterns (c c c)", "pattern", "PDW", 8, "Pattern worksheet", ["Draw c shapes in a row.", "Say: ‘over and round’.", "Turn the c into o, a and d later."], "Draw c c c like little moons.", null, null],
      ["Circular movements (o o o)", "pattern", "PDW", 6, "Pattern worksheet", ["Small circles starting at the top.", "Keep them on the line."], "Round and round on the line!", null, null],
      ["Vertical and horizontal combinations", "pattern", "PDW", 8, "Worksheet", ["Draw plus signs, L and T shapes.", "Show how these become letters like L, T, E, H."], "Down, then across!", null, null],
      ["Slanting combinations", "pattern", "PDW", 8, "Worksheet", ["Draw v and x shapes.", "Link to letters V, W, X, Y."], "Slide down, slide up: v!", null, null],
      ["Loops and hooks", "pattern", "PDW", 8, "Worksheet", ["Draw e-loops and j-hooks.", "Keep loops even."], "Make a loop. Now a hook!", null, null],
      ["Letter-like patterns", "pattern", "PDW", 8, "Worksheet", ["Draw cups (u), arches (n) and stick-and-ball (b).", "Name the letter each pattern becomes."], "Cup, arch, stick and ball!", null, null],
      ["First letter tracing (uppercase)", "letters", "DW", 10, "Alphabet worksheet or on-screen tracing", ["Choose 3 letters with straight lines (L, T, I).", "Show the stroke order with 👀 Show me.", "Trace, then write alone."], "Start at the green dot. Follow the arrows.", null, null],
      ["First letter tracing (lowercase)", "letters", "DW", 10, "Alphabet worksheet", ["Start with c, o, a.", "Trace, then write on the lines."], "Trace the letter. Say its sound.", null, null],
      ["Assamese letter tracing", "assamese", "DW", 10, "Assamese letter worksheet", ["Show the letter and say its name.", "Trace over the dotted letter.", "Write it once on your own."], "Trace the letter and say its name.", null, null]
    ],
    practice: [
      { id: "patterns", t: "Pre-writing patterns", w: "trace", about: "Letter-like patterns with start points and arrows.", cfg: { levels: true, options: PATTERNS.map((k) => ({ label: G[k].n, glyphs: [G[k].s] })) } },
      { id: "letters", t: "English letters", w: "letterlab", about: "Trace letters with stroke order.", cfg: { sets: { "ABC": UPPER, "abc": LOWER } } },
      { id: "assamese", t: "Assamese letters", w: "fonttrace", about: "Trace Assamese vowels and consonants.", cfg: { items: WP.ASSAMESE.vowels.concat(WP.ASSAMESE.consonants.slice(0, 12)), font: "'Noto Sans Bengali'", tip: "Trace over the dotted letter.", sayAs: (t) => t } }
    ]
  });
})();
