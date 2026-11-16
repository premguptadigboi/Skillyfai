/* Skillyfai Lesson Plan Generator: topic knowledge.
   Each entry gives the engine real, topic-specific material (examples, key words, simple facts as
   question/answer pairs, teaching aids, real-life links). Topics not found here fall back to
   subject-aware generic plans built from the teacher's optional key words.
   To add a topic: copy an entry of the same kind and change the content. */
(function () {
  "use strict";
  const TOPICS = [];

  /* ---------- SET topics: a group of concrete things children can name, see and talk about ---------- */
  function set(id, re, one, n, items, words, f, x) { TOPICS.push(Object.assign({ id, re, kind: "set", one, n, items, words, f }, x)); }

  set("festival", /festiv|diwali|\beid\b|bihu|christmas|holi|puja/, "festival", "festivals",
    ["Diwali", "Eid", "Christmas", "Bihu", "Holi", "Durga Puja"], ["lamp", "sweets", "gifts", "new clothes", "dance", "prayer"],
    [["What do we light on Diwali?", "We light lamps on Diwali."], ["What do people share on Eid?", "People pray and share sweets on Eid."],
     ["What do we decorate at Christmas?", "We decorate a Christmas tree."], ["What do we do in Bihu?", "We dance and eat pitha in Bihu."],
     ["What do we play with on Holi?", "We play with colours on Holi."]],
    { aids: ["Pictures of Diwali, Eid, Christmas and Bihu", "Word cards: lamp, sweets, gifts, dance", "A small lamp (diya)"],
      hook: ["Which festival do you like the most?", "What do you wear on a festival day?", "What sweets do you eat during festivals?"],
      hookObj: "a small lamp (diya) and a festival picture", why: "festivals bring people together and teach us to share and care",
      life: "How does your family celebrate your favourite festival?", make: "make a simple greeting card for their favourite festival",
      makeMat: "chart paper, crayons, glue and coloured paper", act: true });

  set("animals", /animal|pet\b|pets|domestic|wild|zoo/, "animal", "animals",
    ["cow", "dog", "cat", "elephant", "tiger", "monkey", "goat"], ["tail", "fur", "legs", "forest", "farm", "pet"],
    [["Which animal gives us milk?", "The cow gives us milk."], ["Which animal guards our house?", "The dog guards our house."],
     ["Where does the tiger live?", "The tiger lives in the forest."], ["Which animal has a long trunk?", "The elephant has a long trunk."],
     ["Which animal climbs trees?", "The monkey climbs trees."]],
    { aids: ["Pictures or toy models of animals", "Word cards with animal names", "A chart of domestic and wild animals"],
      hook: ["Do you have a pet at home?", "Which animal do you like the most?", "Which animals have you seen near your house?"],
      hookObj: "a toy animal", sort: ["domestic animals", "wild animals"], why: "animals help us in many ways and we must be kind to them",
      life: "How can we take care of animals around us?", make: "make animal masks with paper plates", makeMat: "paper plates, crayons, scissors and thread", act: true });

  set("birds", /bird|feather|nest/, "bird", "birds",
    ["crow", "parrot", "peacock", "sparrow", "pigeon", "duck"], ["feathers", "beak", "wings", "nest", "egg", "fly"],
    [["What do birds have on their bodies?", "Birds have feathers on their bodies."], ["What do birds use to fly?", "Birds use their wings to fly."],
     ["Where do birds lay eggs?", "Birds lay eggs in nests."], ["Which bird is our national bird?", "The peacock is our national bird."],
     ["Which bird can talk?", "The parrot can copy our words."]],
    { aids: ["Pictures of common birds", "A real feather", "Picture of a nest with eggs"],
      hook: ["Which birds do you see near your house?", "What sound does a crow make?", "Have you ever seen a bird's nest?"],
      hookObj: "a feather", sort: ["birds that can fly", "birds that cannot fly"], why: "birds make our world beautiful and help plants grow",
      life: "How can we help birds in summer?", make: "make a paper bird and label its parts", makeMat: "coloured paper, glue and crayons", act: true });

  set("fruits", /fruit|mango|banana|apple/, "fruit", "fruits",
    ["mango", "banana", "apple", "orange", "grapes", "pineapple"], ["sweet", "sour", "juicy", "peel", "seed", "healthy"],
    [["Which fruit is the king of fruits?", "The mango is the king of fruits."], ["What colour is a ripe banana?", "A ripe banana is yellow."],
     ["Which fruit has many small seeds inside?", "The guava has many small seeds."], ["Why should we eat fruits?", "Fruits keep us healthy."],
     ["Which fruit grows in bunches?", "Grapes grow in bunches."]],
    { aids: ["Real fruits or fruit pictures", "Fruit name cards", "A basket"],
      hook: ["Which fruit do you like the most?", "Which fruit is yellow?", "Which fruits did you eat this week?"],
      hookObj: "a basket with a covered fruit", sort: ["fruits with one seed", "fruits with many seeds"], why: "fruits give us vitamins and keep us healthy",
      life: "Which fruits grow in your area?", make: "make a fruit basket chart with drawings and names", makeMat: "chart paper, crayons and glue" });

  set("vegetables", /vegetable|veggie/, "vegetable", "vegetables",
    ["potato", "tomato", "brinjal", "cabbage", "carrot", "pumpkin"], ["root", "leaf", "fresh", "cook", "raw", "healthy"],
    [["Which vegetable grows under the ground?", "The potato grows under the ground."], ["Which vegetable is red and round?", "The tomato is red and round."],
     ["Which vegetable can we eat raw?", "We can eat carrots raw."], ["Why should we wash vegetables?", "We wash vegetables to remove dirt and germs."]],
    { aids: ["Real vegetables or pictures", "Vegetable name cards", "A vegetable basket"],
      hook: ["Which vegetable do you like the most?", "Which vegetables are cooked at your home?", "Have you seen a vegetable garden?"],
      hookObj: "a bag with a real vegetable", sort: ["vegetables we eat raw", "vegetables we cook"], why: "vegetables give us strength and keep us healthy",
      life: "Which vegetables does your family grow or buy?", make: "make vegetable prints with paint", makeMat: "cut vegetables (okra, potato), paint and paper" });

  set("flowers", /flower|lotus|rose\b/, "flower", "flowers",
    ["rose", "lotus", "sunflower", "marigold", "jasmine", "hibiscus"], ["petal", "smell", "colour", "garden", "bud", "bloom"],
    [["Which flower is our national flower?", "The lotus is our national flower."], ["Which flower faces the sun?", "The sunflower faces the sun."],
     ["Which flower has a sweet smell?", "Jasmine has a sweet smell."], ["What do we call the coloured parts of a flower?", "They are called petals."]],
    { aids: ["Real flowers or flower pictures", "Flower name cards", "Chart of parts of a flower"],
      hook: ["Which flower do you like?", "Which flowers grow in your garden?", "Where do we see many flowers?"],
      hookObj: "a fresh flower", why: "flowers make our surroundings beautiful and turn into fruits",
      life: "Why should we not pluck flowers in a park?", make: "make paper flowers and name them", makeMat: "coloured paper, glue and sticks" });

  set("family", /family|relative|mother|father/, "family member", "family members",
    ["mother", "father", "sister", "brother", "grandmother", "grandfather"], ["love", "care", "help", "share", "home", "together"],
    [["Who cooks food in your family?", "My mother and father cook food."], ["Who tells you stories?", "My grandmother tells me stories."],
     ["How do you help your family?", "I help my family by keeping my things in place."], ["Who are the members of a small family?", "Father, mother and children."]],
    { aids: ["Family picture chart", "Word cards: mother, father, sister, brother", "A family photograph (optional)"],
      hook: ["How many people are there in your family?", "Who loves you the most at home?", "What do you do with your family on holidays?"],
      hookObj: "a family photograph", sort: ["small family", "large family"], why: "our family loves us, cares for us and teaches us good things",
      life: "How do you help your family at home?", make: "make a family tree with drawings and names", makeMat: "chart paper, crayons and glue", act: true });

  set("body", /body|sense organ|parts of (the |our )?body/, "body part", "parts of the body",
    ["eyes", "ears", "nose", "mouth", "hands", "legs"], ["see", "hear", "smell", "taste", "touch", "walk"],
    [["What do we see with?", "We see with our eyes."], ["What do we hear with?", "We hear with our ears."],
     ["What do we smell with?", "We smell with our nose."], ["What do we use to walk?", "We use our legs to walk."]],
    { aids: ["Body parts chart", "Word cards with body part names", "A mirror"],
      hook: ["How many eyes do you have?", "What do you do with your hands?", "Which body part helps you eat?"],
      hookObj: "a mirror", why: "we must keep every part of our body clean and safe",
      life: "How do you keep your body clean every day?", make: "make a labelled body chart by tracing a classmate", makeMat: "big chart paper, markers and word cards", act: true });

  set("colours", /colou?r/, "colour", "colours",
    ["red", "blue", "green", "yellow", "black", "white"], ["bright", "dark", "light", "mix", "rainbow", "paint"],
    [["What colour is the sky?", "The sky is blue."], ["What colour are leaves?", "Leaves are green."],
     ["What colour is a ripe tomato?", "A ripe tomato is red."], ["What colour is the sun in a drawing?", "The sun is yellow."]],
    { aids: ["Colour cards", "Coloured objects (ball, ribbon, leaf)", "Crayons"],
      hook: ["What is your favourite colour?", "What colour is your school bag?", "Which colours do you see in a rainbow?"],
      hookObj: "a bag of coloured objects", why: "colours help us to see, sort and enjoy things around us",
      life: "Which colours do you see in your classroom?", make: "make a colour collage from old magazines", makeMat: "old magazines, glue and chart paper" });

  set("transport", /transport|vehicle|travel/, "vehicle", "means of transport",
    ["bus", "train", "car", "bicycle", "boat", "aeroplane"], ["road", "rail", "water", "air", "driver", "ticket"],
    [["Which vehicle runs on rails?", "The train runs on rails."], ["Which vehicle flies in the sky?", "The aeroplane flies in the sky."],
     ["Which vehicle moves on water?", "The boat moves on water."], ["Which vehicle has two wheels and no engine?", "The bicycle has two wheels."]],
    { aids: ["Pictures or toys of vehicles", "Chart: land, water and air transport", "Word cards"],
      hook: ["How do you come to school?", "Have you ever travelled by train or boat?", "Which vehicle do you like the most?"],
      hookObj: "a toy car", sort: ["land transport", "water transport", "air transport"], why: "transport helps people and goods move from one place to another",
      life: "Which transport do people use most in your village or town?", make: "make a paper boat and a road chart", makeMat: "paper, chart paper and crayons", act: true });

  set("helpers", /helper|occupation|profession|community/, "helper", "community helpers",
    ["doctor", "teacher", "farmer", "postman", "police officer", "cobbler"], ["help", "work", "tools", "hospital", "field", "uniform"],
    [["Who treats sick people?", "A doctor treats sick people."], ["Who grows our food?", "A farmer grows our food."],
     ["Who brings our letters?", "The postman brings our letters."], ["Who keeps us safe?", "The police officer keeps us safe."]],
    { aids: ["Pictures of community helpers", "Pictures of their tools", "Word cards"],
      hook: ["What do you want to be when you grow up?", "Who helps us when we are sick?", "Who teaches you in school?"],
      hookObj: "a stethoscope or a toy tool", why: "community helpers make our life easy and we should respect them",
      life: "Which helpers do you see near your home every day?", make: "match helpers with their tools on a chart", makeMat: "picture cards, chart paper and glue", act: true });

  set("food", /\bfood|meal|diet|nutrition/, "food item", "food items",
    ["rice", "dal", "roti", "fish", "milk", "eggs"], ["healthy", "junk food", "cook", "plants", "animals", "balanced"],
    [["Which food do we get from animals?", "We get milk, eggs and fish from animals."], ["Which food do we get from plants?", "We get rice, dal and vegetables from plants."],
     ["Why should we eat healthy food?", "Healthy food makes us strong."], ["Why should we not eat too much junk food?", "Junk food can make us sick."]],
    { aids: ["Pictures of different food items", "Chart: food from plants and animals", "Food packets (empty)"],
      hook: ["What did you eat for breakfast today?", "What is your favourite food?", "Which food is cooked on festivals at home?"],
      hookObj: "a lunch box", sort: ["food from plants", "food from animals"], why: "healthy food gives us energy and keeps us strong",
      life: "What healthy food will you eat tomorrow?", make: "make a healthy plate chart", makeMat: "paper plates, food pictures and glue" });

  set("clothes", /cloth|dress|wear/, "piece of clothing", "clothes",
    ["shirt", "frock", "sweater", "raincoat", "cotton saree", "cap"], ["cotton", "wool", "warm", "rain", "summer", "winter"],
    [["What do we wear in winter?", "We wear woollen sweaters in winter."], ["What do we wear in the rainy season?", "We wear raincoats in the rainy season."],
     ["Which clothes are good for summer?", "Cotton clothes are good for summer."], ["Why do we wear clothes?", "Clothes protect our body."]],
    { aids: ["Real clothes or pictures", "Weather pictures (sun, rain, cold)", "Word cards"],
      hook: ["What are you wearing today?", "What do you wear when it is very cold?", "What do you wear when it rains?"],
      hookObj: "a sweater and a raincoat", sort: ["summer clothes", "winter clothes", "rainy-day clothes"], why: "clothes protect our body from heat, cold and rain",
      life: "Which clothes will you wear on a rainy day?", make: "dress a paper doll for different seasons", makeMat: "paper dolls, coloured paper and glue" });

  set("seasons", /season|weather|rain(y)? |summer|winter|monsoon/, "season", "seasons",
    ["summer", "rainy season", "winter", "spring"], ["hot", "cold", "rain", "wind", "umbrella", "sweater"],
    [["Which season is very hot?", "Summer is very hot."], ["When do we use an umbrella?", "We use an umbrella in the rainy season."],
     ["Which season is very cold?", "Winter is very cold."], ["When do new flowers and leaves come?", "New flowers and leaves come in spring."]],
    { aids: ["Season pictures", "Weather chart", "Umbrella and sweater"],
      hook: ["Is it hot or cold today?", "Which season do you like? Why?", "What do you do on a rainy day?"],
      hookObj: "an umbrella", why: "seasons change our food, clothes and work",
      life: "What changes do you see at home when winter comes?", make: "make a four-season wheel chart", makeMat: "paper plates, crayons and a split pin" });

  set("house", /house|home|shelter/, "type of house", "houses",
    ["kutcha house", "pucca house", "hut", "flat", "houseboat", "tent"], ["roof", "wall", "door", "window", "kitchen", "safe"],
    [["Why do we need a house?", "A house keeps us safe from sun, rain and cold."], ["What is a kutcha house made of?", "A kutcha house is made of mud, bamboo and straw."],
     ["What is a pucca house made of?", "A pucca house is made of bricks and cement."], ["Where do people live on water?", "People live in houseboats on water."]],
    { aids: ["Pictures of different houses", "Model house (cardboard)", "Word cards"],
      hook: ["What is your house made of?", "How many rooms are there in your house?", "Where do birds and animals live?"],
      hookObj: "a cardboard model house", sort: ["kutcha houses", "pucca houses"], why: "a house gives us shelter and safety",
      life: "How do you keep your house clean?", make: "make a model house with cardboard or matchboxes", makeMat: "cardboard, matchboxes, glue and colours" });

  set("school", /school|classroom/, "place in school", "places in our school",
    ["classroom", "library", "playground", "office", "kitchen (mid-day meal)", "toilet"], ["teacher", "friends", "books", "bench", "bell", "uniform"],
    [["Where do we read storybooks?", "We read storybooks in the library."], ["Where do we play games?", "We play games on the playground."],
     ["Who teaches us in school?", "Teachers teach us in school."], ["What do we eat at school?", "We eat the mid-day meal at school."]],
    { aids: ["Pictures of school places", "School map drawn on chart", "Word cards"],
      hook: ["What do you like most in your school?", "What is the name of your school?", "Who is your best friend in class?"],
      hookObj: "the school bell", why: "school helps us learn, play and make friends",
      life: "How can we keep our school clean?", make: "draw a simple map of the school", makeMat: "chart paper, pencils and crayons" });

  set("water", /water|river|pond|rain\b/, "source of water", "sources of water",
    ["rain", "river", "pond", "well", "tap", "tube well"], ["drink", "clean", "save", "waste", "boil", "dirty"],
    [["Where do we get water from?", "We get water from rivers, ponds, wells and rain."], ["Why should we drink clean water?", "Clean water keeps us healthy."],
     ["How can we make water safe to drink?", "We can boil or filter water."], ["How can we save water?", "We can close the tap when not in use."]],
    { aids: ["A glass of clean water and a glass of muddy water", "Pictures of water sources", "Chart: uses of water"],
      hook: ["When do you drink water?", "Where does the water in your home come from?", "What will happen if there is no water?"],
      hookObj: "a bottle of muddy water", sort: ["safe water", "unsafe water"], why: "water is needed by all living things, so we must save it",
      life: "How will you save water at home?", make: "make a simple sand-and-cloth water filter", makeMat: "a plastic bottle, cloth, sand and small stones" });

  set("plants", /plant|tree|leaf|leaves|seed|root/, "part of a plant", "parts of a plant",
    ["root", "stem", "leaf", "flower", "fruit", "seed"], ["soil", "sunlight", "water", "grow", "green", "shade"],
    [["Which part of a plant is under the soil?", "The root is under the soil."], ["What does a plant need to grow?", "A plant needs water, air, sunlight and soil."],
     ["Which part of the plant makes food?", "The leaf makes food for the plant."], ["What grows into a new plant?", "A seed grows into a new plant."]],
    { aids: ["A small potted plant or uprooted weed", "Chart of parts of a plant", "Seeds (beans or gram)"],
      hook: ["Which trees grow near your house?", "What do plants give us?", "Have you ever planted a seed?"],
      hookObj: "a small plant with roots", sort: ["trees", "shrubs", "herbs"], why: "plants give us food, air and shade",
      life: "How can we take care of plants in our school?", make: "sow seeds in a cup and watch them grow", makeMat: "paper cups, soil, seeds and water" });

  set("air", /\bair\b|wind|breath/, "use of air", "uses of air",
    ["breathing", "flying kites", "drying clothes", "moving sailboats", "turning windmills"], ["wind", "breeze", "oxygen", "blow", "fresh", "moving air"],
    [["Can we see air?", "No, we cannot see air, but we can feel it."], ["Why do we need air?", "We need air to breathe."],
     ["What is moving air called?", "Moving air is called wind."], ["How does air help to dry clothes?", "Moving air dries wet clothes."]],
    { aids: ["A balloon", "A paper fan or pinwheel", "Pictures showing uses of air"],
      hook: ["What happens when you blow into a balloon?", "Can you feel air? How?", "Why do kites fly?"],
      hookObj: "a balloon", why: "all living things need air to live",
      life: "How can we keep the air clean?", make: "make a paper pinwheel", makeMat: "square paper, pins and straws" });

  set("sky", /\bsun\b|moon|star|sky|planet|solar|earth\b/, "object in the sky", "objects in the sky",
    ["Sun", "Moon", "stars", "Earth", "planets"], ["light", "heat", "night", "day", "shine", "round"],
    [["What gives us light and heat?", "The Sun gives us light and heat."], ["When do we see the Moon and stars?", "We see them at night."],
     ["What is the shape of the Earth?", "The Earth is round."], ["On which planet do we live?", "We live on the Earth."]],
    { aids: ["Pictures of the Sun, Moon and stars", "A torch and a ball", "Night-sky chart"],
      hook: ["What do you see in the sky during the day?", "What do you see in the sky at night?", "Is the Moon always the same shape?"],
      hookObj: "a torch and a ball", sort: ["things seen in the day sky", "things seen in the night sky"], why: "the Sun gives us light and heat which all life needs",
      life: "What do you do when the Sun is very hot?", make: "make a day-and-night sky chart", makeMat: "black and blue chart paper, yellow paper and glue" });

  set("habits", /habit|health|hygiene|clean/, "good habit", "good habits",
    ["brushing teeth", "taking a bath", "washing hands", "cutting nails", "eating fruits", "sleeping early"], ["clean", "germs", "soap", "healthy", "daily", "neat"],
    [["When should we wash our hands?", "We should wash our hands before eating and after using the toilet."], ["How many times should we brush our teeth?", "We should brush our teeth twice a day."],
     ["Why should we cut our nails?", "Dirt and germs hide in long nails."], ["Why should we sleep early?", "Sleep gives our body rest."]],
    { aids: ["Soap, towel and toothbrush", "Good and bad habits chart", "Picture cards"],
      hook: ["What do you do after you wake up?", "Did you brush your teeth today?", "Why do we use soap?"],
      hookObj: "a soap and a toothbrush", sort: ["good habits", "bad habits"], why: "good habits keep us clean, healthy and happy",
      life: "Which good habit will you start from today?", make: "make a daily good-habits chart with ticks", makeMat: "chart paper, crayons and stickers", act: true });

  set("india", /india|our country|national symbol|our nation/, "symbol of India", "national symbols of India",
    ["the Tricolour", "the tiger", "the peacock", "the lotus", "the mango", "the banyan tree"], ["flag", "country", "states", "national", "map", "proud"],
    [["What is our national flag called?", "Our national flag is called the Tricolour."], ["What is our national animal?", "The tiger is our national animal."],
     ["What is our national bird?", "The peacock is our national bird."], ["What is our national flower?", "The lotus is our national flower."]],
    { aids: ["Map of India", "Pictures of national symbols", "A paper flag"],
      hook: ["What is the name of our country?", "In which state do you live?", "What colours are in our flag?"],
      hookObj: "a paper Tricolour", why: "we should know and respect our country and its symbols",
      life: "How do we celebrate Independence Day at school?", make: "make a paper Tricolour and a symbols chart", makeMat: "saffron, white and green paper, glue and sticks" });

  set("games", /game|sport|play\b/, "game", "games and sports",
    ["football", "cricket", "kho-kho", "kabaddi", "badminton", "hide and seek"], ["team", "ball", "player", "win", "rules", "exercise"],
    [["Which game is played with a bat and a ball?", "Cricket is played with a bat and a ball."], ["Which game is played with a shuttlecock?", "Badminton is played with a shuttlecock."],
     ["Why should we play games?", "Games keep us fit and happy."], ["What should we do if we lose a game?", "We should smile and try again."]],
    { aids: ["Pictures of games", "A ball", "Word cards"],
      hook: ["Which game do you play after school?", "Do you like indoor or outdoor games?", "Who is your favourite player?"],
      hookObj: "a ball", sort: ["indoor games", "outdoor games"], why: "games keep us healthy and teach teamwork",
      life: "Which game do you play with your friends?", make: "make a chart of indoor and outdoor games", makeMat: "chart paper, pictures and glue", act: true });

  set("pollution", /pollut|environment|waste|garbage|recycl/, "type of pollution", "kinds of pollution",
    ["air pollution", "water pollution", "land pollution", "noise pollution"], ["smoke", "garbage", "plastic", "dustbin", "recycle", "clean"],
    [["What makes the air dirty?", "Smoke from vehicles and factories makes the air dirty."], ["How does water get polluted?", "Garbage and waste thrown into rivers pollute water."],
     ["Where should we throw garbage?", "We should throw garbage in a dustbin."], ["How can we reduce plastic waste?", "We can use cloth bags instead of plastic bags."]],
    { aids: ["Pictures of clean and polluted places", "A cloth bag and a plastic bag", "Two dustbins (wet and dry waste)"],
      hook: ["Have you seen garbage on the road?", "Is the air near busy roads clean?", "Where do you throw wrappers?"],
      hookObj: "a cloth bag and a plastic bag", sort: ["wet waste", "dry waste"], why: "a clean environment keeps all living things healthy",
      life: "What will you do to keep your surroundings clean?", make: "make a poster: Keep our surroundings clean", makeMat: "chart paper, sketch pens and old magazines" });

  /* ---------- GRAMMAR topics (language subjects) ---------- */
  function gram(id, re, unit, concept, words, others, ex, x) { TOPICS.push(Object.assign({ id, re, kind: "grammar", unit, n: unit, one: unit.replace(/s(\s*\(.*\))?$/, "$1"), concept, words, others, ex }, x)); }
  gram("noun", /noun|naming word/, "naming words (nouns)", "A naming word (noun) is the name of a person, place, animal or thing.",
    ["Ravi", "teacher", "Guwahati", "school", "cow", "pen", "mango"], ["run", "big", "happy", "eat", "slowly"],
    ["Ravi goes to school.", "The cow eats grass.", "My pen is blue.", "Asha lives in Guwahati."], { mark: "naming words" });
  gram("verb", /verb|action word|doing word/, "action words (verbs)", "An action word (verb) tells us what someone does.",
    ["run", "jump", "eat", "sing", "write", "read", "swim"], ["table", "red", "Rina", "tall", "house"],
    ["The boy runs fast.", "Birds sing in the morning.", "We read books.", "The fish swims in the pond."], { mark: "action words", act: true });
  gram("adjective", /adjective|describing word/, "describing words (adjectives)", "A describing word (adjective) tells us more about a naming word.",
    ["big", "small", "red", "tall", "sweet", "happy", "soft"], ["dog", "run", "Mina", "eat", "chair"],
    ["The elephant is big.", "I have a red ball.", "The mango is sweet.", "She has soft hair."], { mark: "describing words" });
  gram("opposites", /opposite|antonym/, "opposite words", "Opposite words have opposite meanings, like hot and cold.",
    ["hot – cold", "big – small", "up – down", "happy – sad", "fast – slow", "day – night"], [],
    ["The tea is hot. The ice is cold.", "The elephant is big. The ant is small.", "The rabbit is fast. The tortoise is slow."], { mark: "opposite words", act: true });
  gram("plural", /plural|singular|one and many/, "singular and plural words", "Singular means one; plural means more than one, like cat – cats.",
    ["cat – cats", "box – boxes", "baby – babies", "man – men", "child – children", "leaf – leaves"], [],
    ["I have one pen. Ravi has two pens.", "There is a box. There are three boxes.", "One child is singing. Many children are dancing."], { mark: "plural words" });
  gram("articles", /article|\ba\b.*\ban\b|a,? an/, "articles (a, an, the)", "We use 'a' before consonant sounds, 'an' before vowel sounds, and 'the' for a particular thing.",
    ["a cat", "an apple", "an egg", "a bus", "the sun", "an umbrella"], [],
    ["I ate an apple.", "A dog is barking.", "The sun is hot.", "She has an umbrella."], { mark: "articles" });
  gram("pronoun", /pronoun/, "pronouns", "A pronoun is used in place of a naming word, like he, she, it, they.",
    ["he", "she", "it", "they", "we", "I", "you"], ["Ravi", "dog", "school", "run", "big"],
    ["Ravi is my friend. He is kind.", "Mina sings well. She is happy.", "The dog is hungry. It wants food."], { mark: "pronouns" });
  gram("rhyming", /rhym/, "rhyming words", "Rhyming words end with the same sound, like cat – hat.",
    ["cat – hat", "sun – fun", "ball – wall", "cake – lake", "king – ring", "mouse – house"], [],
    ["The cat has a hat.", "We have fun in the sun.", "The ball hit the wall."], { mark: "rhyming words", act: true });
  gram("tense", /tense/, "tenses", "Tense tells us when an action happens: present, past or future.",
    ["play – played – will play", "walk – walked – will walk", "eat – ate – will eat", "go – went – will go"], [],
    ["I play football every day.", "I played football yesterday.", "I will play football tomorrow."], { mark: "action words and their time" });

  /* ---------- MATHS topics: examples are generated fresh for the class level ---------- */
  function math(id, re, n, concept, words, manip, gen, story, x) { TOPICS.push(Object.assign({ id, re, kind: "math", n, one: n, concept, words, manip, gen, story }, x)); }
  const R = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const big = (ci) => [9, 40, 500, 2000, 50000, 100000, 500000, 1000000][Math.min(ci, 7)];
  const fmt = (v) => v.toLocaleString("en-IN");
  const pickQ = (r, L) => { const p = L[Math.floor(r() * L.length)]; return { q: p[0], a: p[1] }; };

  math("addition", /addition|\badd\b|adding|\bsum\b|plus/, "addition", "Addition means putting things together to find how many in all.",
    ["add", "plus (+)", "sum", "total", "equal to (=)"], "counters (bottle caps or seeds)",
    (r, ci) => { const m = big(ci); const a = ci === 0 ? R(r, 1, 8) : R(r, 1, m), b = ci === 0 ? R(r, 1, 9 - a) : R(r, 1, m); return { q: `${fmt(a)} + ${fmt(b)} = ?`, a: fmt(a + b) }; },
    (r, ci) => { const m = big(ci); const a = R(r, 2, Math.min(m, 9 + ci * 200)), b = R(r, 1, Math.min(m, 9 + ci * 150)); return { q: `Rima has ${fmt(a)} mangoes. Her mother gives her ${fmt(b)} more. How many mangoes does she have now?`, a: fmt(a + b) }; },
    { aids: ["Counters (bottle caps or seeds)", "Number line chart", "Flash cards with sums"], why: "we add when we count money, marks and things at home",
      life: "Where do we use addition at home or in the market?" });
  math("subtraction", /subtract|minus|take away|difference/, "subtraction", "Subtraction means taking away to find how many are left.",
    ["subtract", "minus (−)", "take away", "left", "difference"], "counters (bottle caps or seeds)",
    (r, ci) => { const m = big(ci); const a = R(r, Math.max(3, m / 10 | 0), m), b = R(r, 1, a - 1); return { q: `${fmt(a)} − ${fmt(b)} = ?`, a: fmt(a - b) }; },
    (r, ci) => { const m = big(ci); const a = R(r, 5, Math.min(m, 9 + ci * 200)), b = R(r, 1, a - 1); return { q: `There are ${fmt(a)} birds on a tree. ${fmt(b)} birds fly away. How many birds are left?`, a: fmt(a - b) }; },
    { aids: ["Counters (bottle caps or seeds)", "Number line chart", "Flash cards with sums"], why: "we subtract to find what is left, like change after shopping",
      life: "When do you take away things in daily life?" });
  math("multiplication", /multipl|times|table/, "multiplication", "Multiplication is quick repeated addition. 3 × 4 means 4 + 4 + 4.",
    ["multiply", "times (×)", "product", "groups of", "table"], "groups of counters or sticks",
    (r, ci) => { const a = ci <= 2 ? R(r, 2, 5 + ci) : ci <= 4 ? R(r, 12, 99) : R(r, 101, 999), b = ci <= 2 ? R(r, 2, 10) : ci <= 4 ? R(r, 2, 9) : R(r, 11, 99); return { q: `${fmt(a)} × ${b} = ?`, a: fmt(a * b) }; },
    (r, ci) => { const a = ci <= 2 ? R(r, 2, 6) : R(r, 12, 60), b = R(r, 3, 9); return { q: `There are ${b} baskets. Each basket has ${a} oranges. How many oranges are there in all?`, a: fmt(a * b) }; },
    { aids: ["Counters or sticks in groups", "Multiplication table chart", "Flash cards"], why: "multiplication helps us count groups of things quickly",
      life: "How many legs do 5 cows have? Where else do we count in groups?" });
  math("division", /divi|share equally|sharing/, "division", "Division means sharing equally into groups.",
    ["divide", "÷", "share equally", "quotient", "remainder"], "counters shared into plates",
    (r, ci) => { const b = R(r, 2, ci <= 2 ? 5 : 9), q = ci <= 2 ? R(r, 2, 10) : ci <= 4 ? R(r, 11, 99) : R(r, 100, 999); return { q: `${fmt(b * q)} ÷ ${b} = ?`, a: fmt(q) }; },
    (r, ci) => { const b = R(r, 2, 6), q = ci <= 2 ? R(r, 2, 8) : R(r, 10, 60); return { q: `${fmt(b * q)} sweets are shared equally among ${b} children. How many sweets does each child get?`, a: fmt(q) }; },
    { aids: ["Counters and paper plates", "Chart showing equal sharing", "Flash cards"], why: "we divide when we share things equally",
      life: "How will you share 12 biscuits equally among 4 friends?" });
  math("fractions", /fraction|half|quarter/, "fractions", "A fraction is a part of a whole. Half means one of two equal parts.",
    ["whole", "part", "half (1/2)", "quarter (1/4)", "numerator", "denominator"], "paper circles and a real roti or apple",
    (r, ci) => pickQ(r, ci <= 2 ? [["Colour 1/2 of a circle", "half the circle coloured"], ["Colour 1/4 of a square", "one of four parts coloured"], ["Write the fraction for 1 part out of 3", "1/3"],
        ["What is half of 8 mangoes?", "4"], ["What is half of 10 pencils?", "5"], ["Write the fraction for 2 parts out of 4", "2/4"], ["Which is bigger: 1/2 or 1/4 of the same roti?", "1/2"],
        ["How many halves make one whole?", "2"], ["How many quarters make one whole?", "4"], ["What is one quarter of 12 sweets?", "3"], ["Draw a line to cut a square into two halves", "one straight line"]]
      : ci <= 4 ? [["1/4 + 2/4 = ?", "3/4"], ["Which is bigger: 1/2 or 1/4?", "1/2"], ["Write two fractions equal to 1/2", "2/4, 3/6"], ["5/8 − 2/8 = ?", "3/8"], ["2/5 + 1/5 = ?", "3/5"],
        ["7/9 − 4/9 = ?", "3/9"], ["1/3 of 15 = ?", "5"], ["Which is smaller: 2/7 or 5/7?", "2/7"], ["Write 6/8 in its simplest form", "3/4"], ["3/10 + 4/10 = ?", "7/10"], ["1/4 of 20 = ?", "5"]]
      : [["1/2 + 1/3 = ?", "5/6"], ["3/4 of 20 = ?", "15"], ["Write 3/5 as a decimal", "0.6"], ["2/3 × 3/4 = ?", "1/2"], ["3/4 − 1/2 = ?", "1/4"], ["5/6 ÷ 5/12 = ?", "2"],
        ["Write 0.25 as a fraction", "1/4"], ["2/5 + 1/4 = ?", "13/20"], ["Which is greater: 3/5 or 4/7?", "3/5"], ["1 1/2 + 2 1/4 = ?", "3 3/4"], ["Write 7/4 as a mixed fraction", "1 3/4"]]),
    (r, ci) => ci <= 2 ? { q: "Mother cuts a roti into 4 equal parts. Ravi eats 1 part. What fraction did he eat?", a: "1/4" } : { q: "A cake is cut into 8 equal pieces. 3 pieces are eaten. What fraction is left?", a: "5/8" },
    { aids: ["Paper circles and squares", "Fraction chart", "A roti or an apple to cut"], why: "we use fractions when we share food and measure things",
      life: "When do you share something into equal parts at home?" });
  math("shapes", /shape|geometr|circle|triangle|square|rectangle/, "shapes", "Shapes have sides and corners. A circle has no corners; a triangle has 3 sides.",
    ["circle", "square", "triangle", "rectangle", "side", "corner"], "real objects and cut-out paper shapes",
    (r, ci) => pickQ(r, ci <= 2 ? [["How many sides does a triangle have?", "3"], ["Which shape has no corners?", "circle"], ["Name a thing shaped like a rectangle", "door / book"], ["How many corners does a square have?", "4"],
        ["Name a thing shaped like a circle", "clock / plate"], ["How many sides does a rectangle have?", "4"], ["Which shape has 3 corners?", "triangle"], ["Name a thing shaped like a triangle", "samosa / roof"],
        ["Are all sides of a square equal?", "yes"], ["How many sides does a circle have?", "none (it is curved)"], ["Draw a square and a triangle", "drawing"]]
      : [["Find the perimeter of a square of side 5 cm", "20 cm"], ["Find the area of a rectangle 6 cm by 4 cm", "24 sq cm"], ["How many sides does a hexagon have?", "6"], ["What is the sum of the angles of a triangle?", "180°"],
        ["Find the perimeter of a rectangle 8 cm by 3 cm", "22 cm"], ["Find the area of a square of side 7 cm", "49 sq cm"], ["How many sides does a pentagon have?", "5"], ["What is an angle of 90° called?", "a right angle"],
        ["How many diagonals does a square have?", "2"], ["Find the perimeter of an equilateral triangle of side 6 cm", "18 cm"], ["What is the radius if the diameter is 10 cm?", "5 cm"]]),
    (r, ci) => ci <= 2 ? { q: "Look around the classroom. Find two things shaped like a circle and two shaped like a rectangle.", a: "clock, plate; door, book" } : { q: "A garden is 10 m long and 6 m wide. How much fencing is needed around it?", a: "32 m" },
    { aids: ["Cut-out paper shapes", "Real objects (clock, book, ball)", "Shapes chart"], why: "shapes are everywhere around us in buildings, things and nature",
      life: "Which shapes can you see in your house?", act: true });
  math("numbers", /number|count|place value|numeral|digit/, "numbers", "Numbers tell us how many. The place of a digit decides its value.",
    ["count", "digit", "ones", "tens", "hundreds", "number name"], "bundles of sticks and loose sticks",
    (r, ci) => { const m = Math.max(20, big(ci)); const v = R(r, ci === 0 ? 1 : 11, m); return ci <= 1 ? { q: `Write the number name of ${v}`, a: "in words" } : { q: `Write the place value of each digit in ${fmt(v)}`, a: "by place" }; },
    (r, ci) => ci <= 1 ? { q: "Count the pencils in the box and write the number and its name.", a: "by counting" } : { q: "Write the greatest and smallest 3-digit numbers using 4, 7 and 2.", a: "742 and 247" },
    { aids: ["Bundles of 10 sticks and loose sticks", "Number chart (1–100)", "Place value chart"], why: "we use numbers to count, buy and measure every day",
      life: "Where do you see numbers at home and on the road?" });
  math("money", /money|coin|rupee|note\b/, "money", "We use coins and notes to buy things. 100 paise make 1 rupee.",
    ["rupee (Rs.)", "paise", "coin", "note", "price", "change"], "toy coins and notes",
    (r, ci) => { const a = R(r, 2, ci <= 1 ? 10 : 90), b = R(r, 1, ci <= 1 ? 9 : 60); return { q: `A pencil costs Rs. ${a} and an eraser costs Rs. ${b}. What is the total cost?`, a: `Rs. ${a + b}` }; },
    (r, ci) => { const p = R(r, 3, ci <= 1 ? 9 : 85), g = ci <= 1 ? 10 : 100; return { q: `You buy a book for Rs. ${p} and give Rs. ${g}. How much change will you get?`, a: `Rs. ${g - p}` }; },
    { aids: ["Toy coins and notes", "Price cards", "A small shop corner"], why: "we use money every day to buy what we need",
      life: "What things does your family buy every week?", act: true });
  math("time", /time|clock|hour|calendar/, "time", "A clock shows time. The short hand shows hours; the long hand shows minutes.",
    ["clock", "hour hand", "minute hand", "o'clock", "half past", "a.m. / p.m."], "a cardboard clock with moving hands",
    (r, ci) => { const h = R(r, 1, 12), m = ci <= 1 ? [0, 30][R(r, 0, 1)] : R(r, 0, 11) * 5; return { q: `Show ${h}:${String(m).padStart(2, "0")} on the clock`, a: "on the clock" }; },
    (r, ci) => ci <= 1 ? { q: "School starts at 9 o'clock. What will the clock show?", a: "short hand on 9, long hand on 12" } : { q: "A train leaves at 10:15 a.m. and reaches at 1:45 p.m. How long is the journey?", a: "3 hours 30 minutes" },
    { aids: ["Cardboard clock with moving hands", "Real wall clock", "Daily routine chart"], why: "time helps us do things on time every day",
      life: "At what time do you wake up and go to school?" });
  math("measurement", /measur|length|weight|mass|capacity|metre|kilogram|litre/, "measurement", "We measure length in centimetres and metres, weight in grams and kilograms.",
    ["length", "weight", "centimetre (cm)", "metre (m)", "gram (g)", "kilogram (kg)"], "a ruler, measuring tape and a simple balance",
    (r, ci) => ci <= 2 ? pickQ(r, [["Measure the length of your book in cm", "by measuring"], ["Measure the length of your pencil in cm", "by measuring"], ["Which is longer: a pencil or a bench?", "bench"],
        ["Which is heavier: a brick or a feather?", "brick"], ["How many hand spans long is your desk?", "by measuring"], ["Measure your notebook in cm", "by measuring"], ["Which is lighter: a ball or a bucket of water?", "ball"],
        ["What do we use to measure length?", "ruler / tape"], ["What do we use to measure weight?", "balance / scale"], ["Which is shorter: your finger or your arm?", "finger"], ["How many cm long is your eraser?", "by measuring"]])
      : (() => { const a = R(r, 2, 30), k = R(r, 2, 15), t = R(r, 1, 9); return pickQ(r, [[`Convert ${a * 100} cm into metres`, `${a} m`], [`Convert ${k} kg into grams`, `${k * 1000} g`], [`Convert ${t} km into metres`, `${t * 1000} m`],
        [`${a} m + ${k} m = ?`, `${a + k} m`], [`Convert ${k * 1000} mL into litres`, `${k} L`], [`${a} kg − ${Math.min(a - 1, k)} kg = ?`, `${a - Math.min(a - 1, k)} kg`]]); })(),
    (r, ci) => ci <= 2 ? { q: "Which is heavier: a school bag or a pencil? How can we check?", a: "school bag; use a balance" } : { q: "A rope is 5 m long. 1 m 50 cm is cut off. How much is left?", a: "3 m 50 cm" },
    { aids: ["Ruler and measuring tape", "Simple balance (two-pan)", "Objects to measure"], why: "we measure things in shops, at home and in buildings",
      life: "What do people measure in a market?", act: true });

  window.SKLessonTopics = TOPICS;
})();
