/* Writing Practice – the app: routing, child selector, level and category dashboards, generator, worksheets, progress and library.
   Routes (hash): #/  #/beginner  #/beginner/<cat>/<tab>/<practice>  #/generator?level=&cat=  #/worksheets?level=&cat=&type=  #/progress  #/library */
(function () {
  "use strict";
  const { esc, toast, store, download, copyText, speak } = SK;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const view = $("#wp-view"), LV = WP.LEVELS, LEVELS = Object.keys(LV);
  const STATUS = { ns: "Not started", dev: "Developing", ach: "Achieved" };
  let mounted = null;
  const kid = () => document.body.classList.contains("wp-kid");
  const childId = () => { const c = WP.data.child(); return c ? c.id : "guest"; };
  const logsFor = (id, cat) => WP.data.logs().filter((l) => l.child === id && (!cat || l.cat === cat));
  const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? "selected" : ""}>${esc(t)}</option>`;
  const fmtTime = (s) => (s >= 3600 ? Math.floor(s / 3600) + " h " + Math.round((s % 3600) / 60) + " min" : s >= 60 ? Math.round(s / 60) + " min" : s + " s");
  const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null);
  const accs = (ls) => ls.filter((l) => l.acc != null).map((l) => l.acc);
  const date = (t) => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" });

  /* ------------------------------------------------------------ child bar and mode ------------------------------------------------------------ */
  const bar = $("#wp-barwrap");
  function renderBar() {
    const ch = WP.data.child(), list = WP.data.children();
    bar.innerHTML = `<div class="wp-barin">
      <label class="wp-childsel"><span>${kid() ? "👋 Hello," : "👧 Child:"}</span><select data-child aria-label="Choose a child">${opt("", list.length ? "Guest (not saved to a child)" : "Guest", ch ? ch.id : "")}${list.map((c) => opt(c.id, c.name + (c.cls ? " · " + c.cls : ""), ch ? ch.id : "")).join("")}</select></label>
      <button type="button" class="btn btn-ghost btn-sm t-only" data-addchild>＋ Add child</button>
      <span class="spacer"></span>
      <div class="seg" role="group" aria-label="Interface"><button type="button" data-mode="teacher" class="${kid() ? "" : "on"}">👩‍🏫 Teacher</button><button type="button" data-mode="kid" class="${kid() ? "on" : ""}">🧒 Child</button></div>
    </div>
    <form class="wp-addform" data-addform hidden><input class="input" name="name" placeholder="Child's name" required maxlength="40"><select class="input" name="cls">${WP.CLASSES.map((c) => opt(c, c)).join("")}</select><button class="btn btn-primary btn-sm">Add</button><button type="button" class="btn btn-ghost btn-sm" data-cancel>Cancel</button></form>`;
  }
  bar.addEventListener("change", (e) => { if (e.target.matches("[data-child]")) WP.data.setChild(e.target.value); });
  bar.addEventListener("click", (e) => {
    const m = e.target.closest("[data-mode]");
    if (m) { setMode(m.dataset.mode); return; }
    if (e.target.closest("[data-addchild]")) { const f = $("[data-addform]", bar); f.hidden = !f.hidden; if (!f.hidden) f.name.focus(); }
    if (e.target.closest("[data-cancel]")) $("[data-addform]", bar).hidden = true;
  });
  bar.addEventListener("submit", (e) => { e.preventDefault(); const f = e.target; if (!f.name.value.trim()) return; const c = WP.data.addChild(f.name.value, f.cls.value); toast(c.name + " added"); });
  function setMode(m) {
    if (m === "kid" === kid()) return;
    if (m === "teacher" && kid() && !confirm("Switch to the teacher view?")) return;
    document.body.classList.toggle("wp-kid", m === "kid"); store.set("wp:mode", m); renderBar(); renderNav(); route();
  }
  document.addEventListener("wp:child", () => { renderBar(); route(); });

  /* ------------------------------------------------------------ top navigation ------------------------------------------------------------ */
  const nav = $("#wp-nav");
  function renderNav() {
    const r = parse(), cur = r.parts[0] || "";
    const items = [["", "🏠", "Home"], ...LEVELS.map((l) => [l, LV[l].icon, LV[l].name]), ...(kid() ? [] : [["generator", "✨", "Activity Generator"], ["worksheets", "🖨️", "Worksheets"], ["progress", "📊", "Progress"], ["library", "📚", "Library"]])];
    nav.innerHTML = items.map(([id, i, n]) => `<a href="#/${id}" class="wp-tab ${cur === id ? "on" : ""} ${LEVELS.includes(id) ? "lvl-" + id : ""}" ${cur === id ? 'aria-current="page"' : ""}><span>${i}</span>${n}</a>`).join("");
  }

  /* ------------------------------------------------------------ router ------------------------------------------------------------ */
  function parse() {
    const h = location.hash.replace(/^#\/?/, ""), [p, q] = h.split("?");
    return { parts: (p || "").split("/").filter(Boolean).map(decodeURIComponent), q: new URLSearchParams(q || "") };
  }
  function unmount() { if (mounted && mounted.destroy) try { mounted.destroy(); } catch (e) { /* ignore */ } mounted = null; if (window.speechSynthesis) speechSynthesis.cancel(); }
  function route() {
    unmount(); renderNav();
    const { parts, q } = parse(), [a, b, c, d] = parts;
    try {
      if (!a) home();
      else if (LEVELS.includes(a) && !b) level(a);
      else if (LEVELS.includes(a) && WP.cats[b]) category(WP.cats[b], c || "practice", d);
      else if (a === "generator" && !kid()) generatorPage(q);
      else if (a === "worksheets" && !kid()) worksheetPage(q);
      else if (a === "progress" && !kid()) progressPage();
      else if (a === "library" && !kid()) libraryPage();
      else { location.replace("#/"); return; }
    } catch (err) { console.error(err); view.innerHTML = `<div class="empty"><div class="e-icon">⚠️</div><p>Something went wrong: ${esc(err.message)}</p><a class="btn btn-soft" href="#/">Go home</a></div>`; }
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", route);

  /* ------------------------------------------------------------ home ------------------------------------------------------------ */
  function catCard(c) {
    const id = childId(), n = logsFor(id, c.id).length, st = WP.data.assess(id)[c.id] || "ns";
    return `<a class="wp-catcard" href="#/${c.level}/${c.id}" style="--c:${LV[c.level].color};--t:${LV[c.level].tint}">
      <span class="wp-caticon">${c.icon}</span><span class="wp-catname">${esc(c.name)}</span><span class="wp-catshort t-only">${esc(c.short || c.objective)}</span>
      <span class="wp-catmeta t-only"><span class="wp-st st-${st}">${STATUS[st]}</span><span>${n} practice${n === 1 ? "" : "s"}</span><span>${c.acts.length} activities</span></span></a>`;
  }
  function home() {
    const ch = WP.data.child();
    if (kid()) {
      view.innerHTML = `<div class="wp-kidhome"><h2 class="wp-kidfont">${ch ? "Hi " + esc(ch.name) + "! " : ""}What shall we practise today?</h2><div class="wp-kidlevels">${LEVELS.map((l) => `<a href="#/${l}" class="wp-kidlevel" style="--c:${LV[l].color};--t:${LV[l].tint}"><span>${LV[l].icon}</span><b>${LV[l].name}</b></a>`).join("")}</div></div>`;
      return;
    }
    const recent = WP.data.logs().filter((l) => l.child === childId()).slice(-5).reverse();
    view.innerHTML = `
      <section class="wp-levels">${LEVELS.map((l) => `<a class="wp-levelcard" href="#/${l}" style="--c:${LV[l].color};--t:${LV[l].tint}"><span class="wp-lvicon">${LV[l].icon}</span><h2>${LV[l].name}</h2><p>${esc(LV[l].blurb)}</p><span class="wp-lvcount">${WP.order[l].length} categories · ${WP.catsOf(l).reduce((s, c) => s + c.acts.length, 0)} activities</span><span class="t-open">Open ${LV[l].name} →</span></a>`).join("")}</section>
      <section class="wp-quick">
        <a class="wp-qcard" href="#/generator"><span>✨</span><b>Activity Generator</b><small>Physical, digital, worksheet and game activities for any category, with print and PDF.</small></a>
        <a class="wp-qcard" href="#/worksheets"><span>🖨️</span><b>Worksheet Generator</b><small>A4 portrait or landscape, black and white, name/class/date fields.</small></a>
        <a class="wp-qcard" href="#/progress"><span>📊</span><b>Progress Dashboard</b><small>Attempts, accuracy, time, skill checklist and observations.</small></a>
        <a class="wp-qcard" href="#/library"><span>📚</span><b>My Library</b><small>Saved and custom activities, writing portfolio and drawings.</small></a>
      </section>
      <section class="panel"><h2>${ch ? esc(ch.name) + "'s" : "Recent"} practice</h2>${recent.length ? `<ul class="saved">${recent.map((l) => `<li><span class="s-name">${esc((WP.cats[l.cat] || {}).name || l.cat)} · ${esc(l.note || l.practice)}</span><span class="muted small">${l.acc != null ? l.acc + "% · " : ""}${date(l.at)}</span></li>`).join("")}</ul>` : `<p class="muted">No practice yet. ${ch ? "" : "Add a child (top bar) so each child's progress is saved separately, then "}open a level to begin.</p>`}</section>`;
  }

  /* ------------------------------------------------------------ level dashboard ------------------------------------------------------------ */
  function level(l) {
    const cats = WP.catsOf(l), L = LV[l];
    const group = (t, sub, list) => `<div class="wp-stage"><h2>${t}</h2>${sub ? `<p class="muted t-only">${sub}</p>` : ""}<div class="wp-catgrid">${list.map(catCard).join("")}</div></div>`;
    const body = l === "beginner"
      ? group("A. Before pencil grip", "Build the body and hand skills first: big movements, small finger movements, hand-eye coordination, seeing shapes and finger strength.", cats.filter((c) => c.stage === "before")) +
        group("B. After pencil grip", "When the child can hold a crayon or pencil: grip, scribbling, strokes, curves and letter readiness.", cats.filter((c) => c.stage === "after"))
      : group(l === "intermediate" ? "Controlled writing" : "Independent writing", "", cats);
    view.innerHTML = `<div class="wp-levelhead" style="--c:${L.color};--t:${L.tint}"><span>${L.icon}</span><div><h1>${L.name}</h1><p class="t-only">${esc(L.blurb)}</p></div>
      <div class="wp-levelbtns t-only"><a class="btn btn-primary" href="#/generator?level=${l}">✨ Generate activity</a><a class="btn btn-soft" href="#/worksheets?level=${l}">🖨️ Worksheets</a></div></div>${body}`;
  }

  /* ------------------------------------------------------------ category page ------------------------------------------------------------ */
  const TABS = [["practice", "🎮", "Practice"], ["activities", "📋", "Activities"], ["generate", "✨", "Generate"], ["worksheets", "🖨️", "Worksheets"], ["progress", "📊", "Progress"]];
  function category(c, tab, pid) {
    if (kid()) tab = "practice";
    if (!TABS.some((t) => t[0] === tab)) tab = "practice";
    const L = LV[c.level], base = `#/${c.level}/${c.id}`;
    view.innerHTML = `<div class="crumbs wp-crumbs"><a href="#/">Writing Practice</a><span>/</span><a href="#/${c.level}">${L.name}</a><span>/</span><span>${esc(c.name)}</span></div>
      <div class="wp-cathead" style="--c:${L.color};--t:${L.tint}"><span class="wp-caticon big">${c.icon}</span><div class="wp-cattext"><h1>${esc(c.name)}</h1><p class="t-only">${esc(c.objective)}</p>
        <div class="wp-skills t-only">${c.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
        <a class="btn btn-primary btn-lg wp-genbtn t-only" href="${base}/generate">✨ GENERATE ACTIVITY</a></div>
      <div class="wp-cattabs t-only" role="tablist">${TABS.map(([id, i, n]) => `<a role="tab" href="${base}/${id}" class="${tab === id ? "on" : ""}" aria-selected="${tab === id}"><span>${i}</span>${n}</a>`).join("")}</div>
      <div id="wp-pane"></div>`;
    const pane = $("#wp-pane");
    ({ practice: practiceTab, activities: activitiesTab, generate: (p, cc) => generatorUI(p, { level: cc.level, cat: cc.id, locked: true }), worksheets: (p, cc) => worksheetUI(p, { level: cc.level, cat: cc.id, locked: true }), progress: catProgress })[tab](pane, c, pid);
  }

  function practiceTab(pane, c, pid) {
    const list = c.practice || [], base = `#/${c.level}/${c.id}/practice/`;
    const p = list.find((x) => x.id === pid) || (kid() || list.length === 1 ? null : null);
    if (!p) {
      pane.innerHTML = `<div class="wp-practicegrid ${kid() ? "kid" : ""}">${list.map((x) => `<a class="wp-pcard" href="${base}${x.id}"><span class="wp-pemo">${pemo(x.w)}</span><b>${esc(x.t)}</b>${x.about ? `<small class="t-only">${esc(x.about)}</small>` : ""}</a>`).join("")}</div>
        ${kid() ? "" : `<div class="panel wp-teacherbox"><h2>For the teacher</h2><div class="grid-2"><div><h3>Teaching tips</h3><ul>${c.teacher.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div><div><h3>Children who need support</h3><ul>${c.support.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div></div><p class="small muted">Expected outcome: ${esc(c.outcome)}</p></div>`}`;
      return;
    }
    pane.innerHTML = `<div class="wp-practicehead"><a class="btn btn-ghost btn-sm" href="#/${c.level}/${c.id}/practice">← All practices</a><h2>${esc(p.t)}</h2>${list.length > 1 ? `<select class="input wp-psel" aria-label="Choose practice">${list.map((x) => opt(x.id, x.t, p.id)).join("")}</select>` : ""}<button type="button" class="icon-btn" data-full title="Full screen" aria-label="Full screen">⛶</button></div>
      ${p.about ? `<p class="muted t-only">${esc(p.about)}</p>` : ""}<div class="wp-stagebox fs-target" data-stage></div>`;
    const sel = $(".wp-psel", pane); if (sel) sel.onchange = () => (location.hash = base + sel.value);
    $("[data-full]", pane).onclick = () => SK.toggleFullscreen($("[data-stage]", pane));
    const host = $("[data-stage]", pane);
    if (p.w === "html") { host.innerHTML = p.html; WP.session(c.id, p.id).finish({ done: true, note: p.t + " (viewed)" }); return; }
    const W = WP.W[p.w]; if (!W) { host.innerHTML = '<p class="muted">This practice is not available.</p>'; return; }
    const ctx = { cat: c.id, practice: p.id, session: () => WP.session(c.id, p.id), finish: (r) => WP.session(c.id, p.id).finish(r) };
    mounted = W(host, p.cfg || {}, ctx);
  }
  function pemo(w) { return { trace: "✏️", fonttrace: "🔤", drawpad: "🎨", dragsort: "🫳", quiz: "❓", tapgame: "🎯", seqtap: "🎹", hold: "👆", memory: "🃏", pairs: "🔗", puzzle: "🧩", builder: "🧱", typecheck: "⌨️", coach: "🏃", commands: "📢", metronome: "🥁", checklist: "✅", writepad: "📝", template: "📄", diary: "📔", edit: "🔍", dictation: "🎧", letterlab: "🔠", html: "📖" }[w] || "⭐"; }

  function activitiesTab(pane, c) {
    const subs = Object.entries(c.subs || {});
    let sub = "all", type = "any";
    pane.innerHTML = `<div class="wp-filter">${subs.length ? `<div class="chips" data-subs><button type="button" class="chip on" data-sub="all">All (${c.acts.length})</button>${subs.map(([k, n]) => `<button type="button" class="chip" data-sub="${k}">${esc(n)} (${c.acts.filter((a) => a.sub === k).length})</button>`).join("")}</div>` : ""}
      <div class="seg" data-types><button type="button" class="on" data-type="any">All types</button>${Object.entries(WP.TYPES).map(([k, n]) => `<button type="button" data-type="${k}">${n}</button>`).join("")}</div></div><div data-list class="wp-actlist"></div>`;
    function draw() {
      const res = WP.gen.generate({ cat: c.id, sub, type, count: 999, seed: 1 }), saved = new Set(WP.data.saved().map((s) => s.key));
      const items = res.items.sort((a, b) => a.title.localeCompare(b.title));
      $("[data-list]", pane).innerHTML = items.length ? items.map((a) => `<details class="wp-actrow"><summary><b>${esc(a.title)}</b><span class="muted small">${esc(WP.TYPES[a.type])} · ⏱ ${esc(a.duration)}${a.custom ? " · custom" : ""}</span></summary>${WP.gen.html(a, { saved: saved.has(a.key) })}</details>`).join("") : `<p class="muted">${esc(res.note || "No activities.")}</p>`;
      pane._items = items;
    }
    pane.addEventListener("click", (e) => {
      const s = e.target.closest("[data-sub]"), t = e.target.closest("[data-type]");
      if (s) { sub = s.dataset.sub; $$("[data-sub]", pane).forEach((b) => b.classList.toggle("on", b === s)); draw(); }
      if (t) { type = t.dataset.type; $$("[data-type]", pane).forEach((b) => b.classList.toggle("on", b === t)); draw(); }
    });
    saveHandlers(pane, () => pane._items || []);
    draw();
  }

  /* save / unsave buttons inside activity cards */
  function saveHandlers(root, items) {
    root.addEventListener("click", (e) => {
      const s = e.target.closest("[data-save]"), u = e.target.closest("[data-unsave]");
      if (s) { const a = items().find((x) => x.key === s.dataset.save); if (a && WP.data.saveActivity(a)) toast("Saved to your library"); else toast("Already in your library"); s.outerHTML = `<button type="button" class="btn btn-ghost btn-sm" data-unsave="${esc(s.dataset.save)}">✕ Remove from library</button>`; }
      if (u) { WP.data.delSaved(u.dataset.unsave); toast("Removed from library"); u.outerHTML = `<button type="button" class="btn btn-soft btn-sm" data-save="${esc(u.dataset.unsave)}">💾 Save activity</button>`; }
    });
  }

  /* ------------------------------------------------------------ activity generator ------------------------------------------------------------ */
  function generatorPage(q) {
    view.innerHTML = `<div class="wp-pagehead"><h1>✨ Activity Generator</h1><p class="muted">Choose a level and category. Every activity stays inside the chosen category and comes with all 14 parts: objective, materials, procedure, assessment and more.</p></div><div id="wp-pane"></div>`;
    generatorUI($("#wp-pane"), { level: q.get("level") || "beginner", cat: q.get("cat") || "" });
  }
  function generatorUI(pane, o) {
    const last = store.get("wp:genopts", {});
    let st = { level: o.level || last.level || "beginner", cat: o.cat || "", sub: "all", cls: last.cls || WP.CLASSES[2], diff: last.diff || "Medium", count: last.count || 3, type: last.type || "any", seed: 1 }, items = [];
    if (!st.cat || !WP.cats[st.cat] || WP.cats[st.cat].level !== st.level) st.cat = WP.order[st.level][0];
    pane.innerHTML = `<div class="panel wp-genform">
      <div class="wp-formgrid">
        <div class="field"><label for="g-level">Level</label><select id="g-level" class="input" ${o.locked ? "disabled" : ""}>${LEVELS.map((l) => opt(l, LV[l].name, st.level)).join("")}</select></div>
        <div class="field"><label for="g-cat">Category</label><select id="g-cat" class="input" ${o.locked ? "disabled" : ""}></select></div>
        <div class="field"><label for="g-sub">Subcategory</label><select id="g-sub" class="input"></select></div>
        <div class="field"><label for="g-cls">Class / age group</label><select id="g-cls" class="input">${WP.CLASSES.map((c) => opt(c, c, st.cls)).join("")}</select></div>
        <div class="field"><label for="g-type">Activity type</label><select id="g-type" class="input">${opt("any", "Any type", st.type)}${Object.entries(WP.TYPES).map(([k, n]) => opt(k, n, st.type)).join("")}</select></div>
        <div class="field"><label for="g-count">Number of activities</label><select id="g-count" class="input">${[1, 2, 3, 4, 5, 6, 8, 10].map((n) => opt(String(n), String(n), String(st.count))).join("")}</select></div>
        <div class="field wp-span2"><span class="label">Difficulty</span><div class="seg" data-diff>${WP.DIFF.map((d) => `<button type="button" data-d="${d}" class="${d === st.diff ? "on" : ""}">${d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} ${d}</button>`).join("")}</div></div>
      </div>
      <div class="toolbar wp-genbar"><button type="button" class="btn btn-primary btn-lg" data-gen>✨ Generate</button><button type="button" class="btn btn-soft" data-more disabled>➕ Generate more</button><button type="button" class="btn btn-soft" data-regen disabled>🔄 Regenerate</button>
        <span class="spacer"></span><button type="button" class="btn btn-ghost" data-saveall disabled>💾 Save all</button><button type="button" class="btn btn-ghost" data-copy disabled>📋 Copy</button><button type="button" class="btn btn-ghost" data-print disabled>🖨️ Print</button><button type="button" class="btn btn-ghost" data-pdf disabled>⬇️ Download PDF</button></div>
      <p class="small muted" data-catinfo></p></div>
      <div data-note></div><div data-out class="wp-genout"></div>
      <details class="panel wp-custom"><summary><b>➕ Add your own activity to this category</b> <span class="muted small">(it will appear in the generator and the Activities list)</span></summary>
        <form data-cform class="wp-formgrid"><div class="field wp-span2"><label>Title</label><input class="input" name="t" required maxlength="90"></div>
          <div class="field"><label>Subcategory</label><select class="input" name="sub"></select></div>
          <div class="field"><label>Type</label><select class="input" name="types">${Object.entries(WP.TYPES).map(([k, n]) => opt(k, n)).join("")}</select></div>
          <div class="field"><label>Minutes</label><input class="input" name="mins" type="number" min="2" max="90" value="10"></div>
          <div class="field wp-span2"><label>Materials</label><input class="input" name="mat" maxlength="200"></div>
          <div class="field wp-span2"><label>Steps (one per line)</label><textarea class="textarea" name="steps" rows="4" required></textarea></div>
          <div class="field wp-span2"><label>Instruction for the child</label><input class="input" name="kid" maxlength="200"></div>
          <div class="wp-span2"><button class="btn btn-primary">Save activity</button></div></form></details>`;
    const sel = (id) => $("#g-" + id, pane);
    function fillCats() { sel("cat").innerHTML = WP.catsOf(st.level).map((c) => opt(c.id, c.icon + " " + c.name, st.cat)).join(""); fillSubs(); }
    function fillSubs() {
      const c = WP.cats[st.cat], subs = Object.entries(c.subs || {});
      sel("sub").innerHTML = opt("all", "All subcategories", st.sub) + subs.map(([k, n]) => opt(k, n, st.sub)).join(""); sel("sub").disabled = !subs.length;
      $("[data-cform] [name=sub]", pane).innerHTML = opt("", "—") + subs.map(([k, n]) => opt(k, n)).join("");
      $("[data-catinfo]", pane).textContent = `${c.name}: ${c.objective}`;
    }
    fillCats();
    const read = () => { st.level = sel("level").value; st.cat = sel("cat").value; st.sub = sel("sub").value || "all"; st.cls = sel("cls").value; st.type = sel("type").value; st.count = +sel("count").value; store.set("wp:genopts", { level: st.level, cls: st.cls, diff: st.diff, count: st.count, type: st.type }); };
    sel("level").onchange = () => { st.level = sel("level").value; st.cat = WP.order[st.level][0]; st.sub = "all"; fillCats(); };
    sel("cat").onchange = () => { st.cat = sel("cat").value; st.sub = "all"; fillSubs(); };
    $("[data-diff]", pane).onclick = (e) => { const b = e.target.closest("[data-d]"); if (!b) return; st.diff = b.dataset.d; $$("[data-d]", pane).forEach((x) => x.classList.toggle("on", x === b)); };
    function run(mode) {
      read();
      if (mode !== "more") st.seed = mode === "regen" ? st.seed + 1 + Math.floor(Math.random() * 1000) : st.seed;
      else st.seed += 17;
      const res = WP.gen.generate(Object.assign({}, st, { skip: mode === "more" ? items.map((a) => a.key) : mode === "regen" ? items.map((a) => a.key) : [] }));
      let got = res.items;
      if (mode === "regen" && !got.length) got = WP.gen.generate(Object.assign({}, st, { skip: [] })).items;
      items = mode === "more" ? items.concat(got) : got;
      $("[data-note]", pane).innerHTML = res.note ? `<p class="note">${esc(res.note)}</p>` : "";
      draw(); $$("[data-more],[data-regen],[data-saveall],[data-print],[data-pdf],[data-copy]", pane).forEach((b) => (b.disabled = !items.length));
      if (mode !== "more") $("[data-out]", pane).scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function draw() { const saved = new Set(WP.data.saved().map((s) => s.key)); $("[data-out]", pane).innerHTML = items.map((a) => WP.gen.html(a, { saved: saved.has(a.key) })).join(""); }
    $("[data-gen]", pane).onclick = () => run("gen");
    $("[data-more]", pane).onclick = () => run("more");
    $("[data-regen]", pane).onclick = () => run("regen");
    $("[data-saveall]", pane).onclick = () => { let n = 0; items.forEach((a) => { if (WP.data.saveActivity(a)) n++; }); toast(n ? `${n} saved to your library` : "All are already saved"); draw(); };
    $("[data-copy]", pane).onclick = () => copyText(items.map(WP.gen.text).join("\n\n------------------------------\n\n"));
    $("[data-print]", pane).onclick = () => printActs(items, WP.cats[st.cat].name + " activities");
    $("[data-pdf]", pane).onclick = (e) => pdfBtn(e.target, () => WP.pdf.activities(items, WP.cats[st.cat].name + " activities"));
    saveHandlers(pane, () => items);
    $("[data-cform]", pane).onsubmit = (e) => {
      e.preventDefault(); const f = e.target, steps = f.steps.value.split("\n").map((s) => s.trim()).filter(Boolean);
      WP.data.addCustom({ cat: st.cat, t: f.t.value.trim(), sub: f.sub.value, types: f.types.value, mins: +f.mins.value || 10, mat: f.mat.value.trim(), steps, kid: f.kid.value.trim() });
      f.reset(); toast("Your activity was added to " + WP.cats[st.cat].name);
    };
  }
  function printActs(items, title) {
    const d = document.createElement("div"); d.className = "wp-printacts";
    d.innerHTML = `<h1>${esc(title)}</h1>` + items.map((a) => WP.gen.html(a, { actions: false })).join("");
    SK.printEl(d);
  }
  async function pdfBtn(btn, fn) { const t = btn.textContent; btn.disabled = true; btn.textContent = "Making PDF…"; try { await fn(); toast("PDF downloaded"); } catch (err) { toast(err.message || "Could not make the PDF"); } finally { btn.disabled = false; btn.textContent = t; } }

  /* ------------------------------------------------------------ worksheet generator ------------------------------------------------------------ */
  function worksheetPage(q) {
    view.innerHTML = `<div class="wp-pagehead"><h1>🖨️ Worksheet Generator</h1><p class="muted">Printable A4 worksheets for every category, in black and white. New exercises each time you press Generate.</p></div><div id="wp-pane"></div>`;
    worksheetUI($("#wp-pane"), { level: q.get("level") || "", cat: q.get("cat") || "", type: q.get("type") || "" });
  }
  function worksheetUI(pane, o) {
    const last = store.get("wp:wsopts", {});
    let st = { level: o.level || last.level || "beginner", cat: o.cat || "", type: o.type || "", orientation: last.orientation || "portrait" };
    if (st.cat && WP.cats[st.cat]) st.level = WP.cats[st.cat].level;
    pane.innerHTML = `<div class="wp-wsgrid"><div class="panel wp-wsform">
      <div class="field"><label for="w-level">Level</label><select id="w-level" class="input" ${o.locked ? "disabled" : ""}>${LEVELS.map((l) => opt(l, LV[l].name, st.level)).join("")}</select></div>
      <div class="field"><label for="w-cat">Category</label><select id="w-cat" class="input" ${o.locked ? "disabled" : ""}></select></div>
      <div class="field"><label for="w-type">Worksheet</label><select id="w-type" class="input"></select></div>
      <div data-extra></div>
      <div class="field"><span class="label">Page</span><div class="seg" data-orient><button type="button" data-o="portrait" class="${st.orientation === "portrait" ? "on" : ""}">▯ Portrait</button><button type="button" data-o="landscape" class="${st.orientation === "landscape" ? "on" : ""}">▭ Landscape</button></div></div>
      <div class="field"><label for="w-count">Number of exercises</label><input id="w-count" class="input" type="number" min="1" max="48"></div>
      <div class="field"><label for="w-school">School name</label><input id="w-school" class="input" maxlength="80" value="${esc(store.get("wp:school", ""))}" placeholder="Leave empty for a blank line"></div>
      <div class="field"><label for="w-title">Title (optional)</label><input id="w-title" class="input" maxlength="80"></div>
      <div class="field"><span class="label">Header fields</span><div class="check-grid wp-checks">${[["fName", "Name"], ["fClass", "Class"], ["fDate", "Date"], ["fSchool", "School"]].map(([k, n]) => `<label class="check"><input type="checkbox" data-f="${k}" checked> ${n}</label>`).join("")}</div></div>
      <div class="toolbar"><button type="button" class="btn btn-primary" data-gen>🔄 Generate</button><button type="button" class="btn btn-soft" data-print>🖨️ Print</button><button type="button" class="btn btn-soft" data-pdf>⬇️ PDF</button></div>
      <p class="small muted" data-pages></p></div>
      <div class="wp-wspreview" data-preview aria-label="Worksheet preview"></div></div>`;
    const sel = (id) => $("#w-" + id, pane), prev = $("[data-preview]", pane);
    function fillCats() {
      const cats = WP.catsOf(st.level).filter((c) => (c.ws || []).length);
      if (!cats.some((c) => c.id === st.cat)) st.cat = o.locked ? st.cat : "";
      sel("cat").innerHTML = (o.locked ? "" : opt("", "All " + LV[st.level].name + " worksheets", st.cat)) + cats.map((c) => opt(c.id, c.icon + " " + c.name, st.cat)).join("");
      fillTypes();
    }
    function fillTypes() {
      const types = WP.ws.types(st.cat ? "" : st.level, st.cat || "");
      if (!types.some((t) => t.id === st.type)) st.type = types.length ? types[0].id : "";
      sel("type").innerHTML = types.map((t) => opt(t.id, t.name, st.type)).join("") || opt("", "No worksheets");
      fillExtra();
    }
    function fillExtra() {
      const T = WP.WS[st.type]; if (!T) return;
      sel("count").value = T.def || 4; sel("count").max = T.max || 20;
      $("[data-extra]", pane).innerHTML = (T.input ? `<div class="field"><label for="w-input">${esc(T.input)}</label><textarea id="w-input" class="textarea" rows="${/sentence/i.test(T.input) ? 4 : 2}">${T.inputDef ? esc(T.inputDef) : ""}</textarea></div>` : "") +
        Object.entries(T.options || {}).map(([k, vals]) => `<div class="field"><label for="w-o-${k}">${k[0].toUpperCase() + k.slice(1)}</label><select id="w-o-${k}" class="input" data-opt="${k}">${vals.map((v) => opt(v, v)).join("")}</select></div>`).join("");
    }
    function build() {
      const T = WP.WS[st.type]; if (!T) { prev.innerHTML = '<p class="muted">Choose a worksheet.</p>'; return; }
      const cfg = { orientation: st.orientation, count: +sel("count").value, school: sel("school").value.trim(), title: sel("title").value.trim(), input: sel("input") ? sel("input").value : "" };
      $$("[data-f]", pane).forEach((c) => (cfg[c.dataset.f] = c.checked));
      $$("[data-opt]", pane).forEach((s) => (cfg[s.dataset.opt] = s.value));
      store.set("wp:school", cfg.school); store.set("wp:wsopts", { level: st.level, orientation: st.orientation });
      prev.innerHTML = `<div class="ws-scale">${WP.ws.build(st.type, cfg)}</div>`;
      const n = $$(".ws-a4", prev).length; $("[data-pages]", pane).textContent = `${n} A4 page${n === 1 ? "" : "s"} · ${st.orientation}${T.teacher ? " · teacher sheet" : ""}`;
      scale();
    }
    function scale() {
      const s = $(".ws-scale", prev); if (!s) return; const pg = $(".ws-a4", s); if (!pg) return;
      const w = pg.offsetWidth, k = Math.min(1, (prev.clientWidth - 4) / w);
      $$(".ws-a4", s).forEach((p) => { p.style.transform = `scale(${k})`; p.style.marginBottom = `${-(p.offsetHeight * (1 - k)) + 16}px`; p.style.marginRight = `${-(w * (1 - k))}px`; });
    }
    const ro = new ResizeObserver(scale); ro.observe(prev); mounted = { destroy: () => ro.disconnect() };
    sel("level").onchange = () => { st.level = sel("level").value; st.cat = ""; fillCats(); build(); };
    sel("cat").onchange = () => { st.cat = sel("cat").value; fillTypes(); build(); };
    sel("type").onchange = () => { st.type = sel("type").value; fillExtra(); build(); };
    $("[data-orient]", pane).onclick = (e) => { const b = e.target.closest("[data-o]"); if (!b) return; st.orientation = b.dataset.o; $$("[data-o]", pane).forEach((x) => x.classList.toggle("on", x === b)); build(); };
    pane.addEventListener("change", (e) => { if (e.target.closest(".wp-wsform") && !e.target.matches("#w-level,#w-cat,#w-type")) build(); });
    $("[data-gen]", pane).onclick = build;
    $("[data-print]", pane).onclick = () => WP.ws.print(prev, st.orientation === "landscape");
    $("[data-pdf]", pane).onclick = (e) => pdfBtn(e.target, () => WP.pdf.pages($$(".ws-a4", prev), st.orientation === "landscape", (sel("title").value.trim() || WP.WS[st.type].name)));
    fillCats(); build();
  }

  /* ------------------------------------------------------------ progress ------------------------------------------------------------ */
  function spark(vals) {
    if (vals.length < 2) return "";
    const w = 90, h = 24, pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - (v / 100) * h}`).join(" ");
    return `<svg class="wp-spark" viewBox="-2 -2 ${w + 4} ${h + 4}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round"/></svg>`;
  }
  function trend(vals) {
    if (vals.length < 4) return '<span class="muted">—</span>';
    const h = Math.floor(vals.length / 2), a = avg(vals.slice(0, h)), b = avg(vals.slice(h)), d = b - a;
    return d > 4 ? `<span class="wp-up">▲ +${d}%</span>` : d < -4 ? `<span class="wp-down">▼ ${d}%</span>` : '<span class="muted">● steady</span>';
  }
  function statsHTML(ls) {
    const a = accs(ls), secs = ls.reduce((s, l) => s + (l.secs || 0), 0), done = ls.filter((l) => l.done).length, week = ls.filter((l) => l.at > Date.now() - 7 * 864e5).length;
    return `<div class="wp-stats"><div><b>${ls.length}</b><span>Attempts</span></div><div><b>${done}</b><span>Completed</span></div><div><b>${avg(a) == null ? "—" : avg(a) + "%"}</b><span>Average accuracy</span></div><div><b>${fmtTime(secs)}</b><span>Practice time</span></div><div><b>${week}</b><span>This week</span></div></div>`;
  }
  function catProgress(pane, c) {
    const id = childId(), ls = logsFor(id, c.id), st = WP.data.assess(id)[c.id] || "ns", obs = id === "guest" ? [] : WP.data.obs(id).filter((o) => o.cat === c.id);
    const a = accs(ls);
    pane.innerHTML = `${id === "guest" ? '<p class="note">You are practising as a guest. Add or choose a child in the top bar to keep separate progress for each child.</p>' : ""}
      ${statsHTML(ls)}
      <div class="grid-2"><div class="panel"><h2>Skill status</h2><p class="small muted">Set by the teacher after observing the child. Nothing changes automatically.</p>${statusSeg(id, c.id, st)}
        <h3 style="margin-top:16px">Look for</h3><ul class="wp-looks">${c.assess.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        ${a.length ? `<h3>Accuracy over time</h3><div class="wp-trendrow">${spark(a.slice(-12))} ${trend(a)}</div>` : ""}</div>
      <div class="panel"><h2>Teacher observations</h2>${id === "guest" ? '<p class="muted small">Choose a child to write observations.</p>' : `<form data-obs class="wp-obsform"><textarea class="textarea" name="t" rows="2" placeholder="What did you notice? e.g. holds the crayon with a fist grip; needs support crossing the middle" required></textarea><button class="btn btn-soft btn-sm">Add observation</button></form>
        <ul class="saved">${obs.map((o) => `<li><span class="s-name wrap-text">${esc(o.text)}</span><span class="small muted">${date(o.at)}</span><button type="button" data-delobs="${o.id}" aria-label="Delete">✕</button></li>`).join("") || '<li class="muted">No observations yet.</li>'}</ul>`}</div></div>
      <div class="panel"><h2>Recent practice</h2>${logTable(ls.slice(-15).reverse())}</div>`;
    wireProgress(pane, () => catProgress(pane, c));
  }
  function statusSeg(id, cat, st) { return `<div class="seg wp-status" data-status="${cat}">${Object.entries(STATUS).map(([k, n]) => `<button type="button" data-v="${k}" class="${st === k ? "on" : ""}" ${id === "guest" ? "disabled" : ""}>${{ ns: "⚪", dev: "🟡", ach: "🟢" }[k]} ${n}</button>`).join("")}</div>`; }
  function logTable(ls) { return ls.length ? `<div class="wp-tablewrap"><table class="wp-table"><thead><tr><th>Date</th><th>Category</th><th>Practice</th><th>Accuracy</th><th>Time</th></tr></thead><tbody>${ls.map((l) => { const c = WP.cats[l.cat], p = c && (c.practice || []).find((x) => x.id === l.practice); return `<tr><td>${date(l.at)}</td><td>${esc(c ? c.name : l.cat)}</td><td>${esc(l.note || (p ? p.t : l.practice))}</td><td>${l.acc == null ? "—" : l.acc + "%"}</td><td>${fmtTime(l.secs || 0)}</td></tr>`; }).join("")}</tbody></table></div>` : '<p class="muted">No practice recorded yet.</p>'; }
  function wireProgress(pane, redraw) {
    pane.onclick = (e) => {
      const b = e.target.closest("[data-status] [data-v]"); const ch = WP.data.child();
      if (b && ch) { WP.data.setAssess(ch.id, b.closest("[data-status]").dataset.status, b.dataset.v); redraw(); }
      const d = e.target.closest("[data-delobs]"); if (d && confirm("Delete this observation?")) { WP.data.delObs(d.dataset.delobs); redraw(); }
    };
    pane.onsubmit = (e) => {
      if (!e.target.matches("[data-obs]")) return; e.preventDefault(); const ch = WP.data.child(); if (!ch) return;
      const t = e.target.t.value.trim(), cat = e.target.cat ? e.target.cat.value : (parse().parts[1] || ""); if (!t) return;
      WP.data.addObs(ch.id, t, cat); toast("Observation saved"); redraw();
    };
  }

  function progressPage() {
    const ch = WP.data.child(), id = childId(), ls = logsFor(id), as = WP.data.assess(id), kids = WP.data.children();
    const lvl = ch ? ch.level || "beginner" : "beginner";
    const rows = (l) => WP.catsOf(l).map((c) => { const cl = ls.filter((x) => x.cat === c.id), a = accs(cl), last = cl.length ? cl[cl.length - 1].at : 0; return `<tr><td><a href="#/${l}/${c.id}">${c.icon} ${esc(c.name)}</a></td><td>${statusSeg(id, c.id, as[c.id] || "ns")}</td><td>${cl.length}</td><td>${avg(a) == null ? "—" : avg(a) + "%"}</td><td>${spark(a.slice(-10))} ${trend(a)}</td><td>${fmtTime(cl.reduce((s, x) => s + (x.secs || 0), 0))}</td><td>${last ? date(last) : "—"}</td></tr>`; }).join("");
    const need = WP.catsOf(lvl).concat(LEVELS.filter((l) => l !== lvl).flatMap(WP.catsOf)).filter((c) => { const a = accs(ls.filter((x) => x.cat === c.id)); return (a.length >= 2 && avg(a.slice(-5)) < 60) || as[c.id] === "dev" && a.length >= 3 && avg(a.slice(-5)) < 70; });
    const achieved = WP.order[lvl].filter((c) => as[c] === "ach").length, total = WP.order[lvl].length;
    const obs = ch ? WP.data.obs(ch.id) : [];
    view.innerHTML = `<div class="wp-pagehead"><h1>📊 Progress Dashboard</h1><p class="muted">${ch ? `Progress for <b>${esc(ch.name)}</b>${ch.cls ? " · " + esc(ch.cls) : ""}` : "Guest practice (choose or add a child in the top bar to track each child)."}</p></div>
      ${ch ? `<div class="panel wp-levelset"><div><h2>Working level</h2><p class="small muted">The teacher decides when a child moves on. There is no automatic promotion.</p></div>
        <div class="seg" data-setlevel>${LEVELS.map((l) => `<button type="button" data-l="${l}" class="${lvl === l ? "on" : ""}">${LV[l].icon} ${LV[l].name}</button>`).join("")}</div>
        <div class="wp-meter"><div style="width:${(achieved / total) * 100}%"></div></div><p class="small">${achieved} of ${total} ${LV[lvl].name.toLowerCase()} skills achieved.${achieved === total && lvl !== "advanced" ? " <b>All skills achieved. You may consider moving to the next level.</b>" : ""}</p></div>` : ""}
      ${statsHTML(ls)}
      <div class="panel"><h2>Areas needing support</h2>${need.length ? `<ul class="wp-need">${need.map((c) => `<li><b>${c.icon} ${esc(c.name)}</b>: ${esc(c.support[0])} <a href="#/${c.level}/${c.id}">Practise →</a></li>`).join("")}</ul>` : '<p class="muted small">Nothing flagged. Areas appear here when recent accuracy stays below 60%.</p>'}</div>
      <div class="panel"><div class="wp-panelhead"><h2>Skill checklist</h2><div class="seg" data-showlevel>${LEVELS.map((l) => `<button type="button" data-sl="${l}" class="${l === lvl ? "on" : ""}">${LV[l].name}</button>`).join("")}</div></div>
        ${LEVELS.map((l) => `<div class="wp-tablewrap" data-lt="${l}" ${l === lvl ? "" : "hidden"}><table class="wp-table wp-checktable"><thead><tr><th>Category</th><th>Status (teacher)</th><th>Attempts</th><th>Accuracy</th><th>Improvement</th><th>Time</th><th>Last</th></tr></thead><tbody>${rows(l)}</tbody></table></div>`).join("")}</div>
      <div class="grid-2"><div class="panel"><h2>Teacher observations</h2>${ch ? `<form data-obs class="wp-obsform"><select class="input" name="cat"><option value="">General</option>${LEVELS.map((l) => `<optgroup label="${LV[l].name}">${WP.catsOf(l).map((c) => opt(c.id, c.name)).join("")}</optgroup>`).join("")}</select><textarea class="textarea" name="t" rows="2" required placeholder="Write an observation"></textarea><button class="btn btn-soft btn-sm">Add observation</button></form>
          <ul class="saved">${obs.slice(0, 30).map((o) => `<li><span class="s-name wrap-text">${o.cat && WP.cats[o.cat] ? `<b>${esc(WP.cats[o.cat].name)}:</b> ` : ""}${esc(o.text)}</span><span class="small muted">${date(o.at)}</span><button type="button" data-delobs="${o.id}" aria-label="Delete">✕</button></li>`).join("") || '<li class="muted">No observations yet.</li>'}</ul>` : '<p class="muted small">Choose a child to write observations.</p>'}</div>
        <div class="panel"><h2>Children</h2><ul class="saved">${kids.map((k) => `<li><span class="s-name">${esc(k.name)} <span class="muted small">${esc(k.cls || "")} · ${LV[k.level || "beginner"].name}</span></span><button type="button" data-pick="${k.id}">Select</button><button type="button" data-rename="${k.id}">Rename</button><button type="button" data-remove="${k.id}" aria-label="Remove">✕</button></li>`).join("") || '<li class="muted">No children yet. Use “＋ Add child” at the top.</li>'}</ul>
          <h3 style="margin-top:16px">Backup and reports</h3><div class="toolbar"><button type="button" class="btn btn-soft btn-sm" data-csv>⬇️ Practice log (CSV)</button><button type="button" class="btn btn-soft btn-sm" data-json>⬇️ Full backup</button><label class="btn btn-ghost btn-sm">⬆️ Restore backup<input type="file" accept=".json,application/json" data-import hidden></label><button type="button" class="btn btn-ghost btn-sm" data-printrep>🖨️ Print report</button></div>
          <p class="small muted">Everything is stored only in this browser. Download a backup regularly.</p></div></div>
      <div class="panel"><h2>Recent practice</h2>${logTable(ls.slice(-25).reverse())}</div>`;
    wireProgress(view, progressPage);
    const base = view.onclick;
    view.onclick = (e) => {
      base(e);
      const l = e.target.closest("[data-l]"); if (l && ch) { WP.data.updateChild(ch.id, { level: l.dataset.l }); toast(`${ch.name} now works at ${LV[l.dataset.l].name} level`); progressPage(); return; }
      const sl = e.target.closest("[data-sl]"); if (sl) { $$("[data-sl]").forEach((b) => b.classList.toggle("on", b === sl)); $$("[data-lt]").forEach((t) => (t.hidden = t.dataset.lt !== sl.dataset.sl)); }
      const pk = e.target.closest("[data-pick]"); if (pk) WP.data.setChild(pk.dataset.pick);
      const rn = e.target.closest("[data-rename]"); if (rn) { const k = kids.find((x) => x.id === rn.dataset.rename), n = prompt("New name", k.name); if (n && n.trim()) { WP.data.updateChild(k.id, { name: n.trim() }); renderBar(); progressPage(); } }
      const rm = e.target.closest("[data-remove]"); if (rm) { const k = kids.find((x) => x.id === rm.dataset.remove); if (confirm(`Remove ${k.name} and all of their progress? This cannot be undone.`)) { WP.data.removeChild(k.id); renderBar(); progressPage(); } }
      if (e.target.closest("[data-csv]")) { const all = WP.data.logs(), names = Object.fromEntries(kids.map((k) => [k.id, k.name])); const q = (s) => `"${String(s).replace(/"/g, '""')}"`; download("writing-practice-log.csv", "﻿" + [["Date", "Child", "Level", "Category", "Practice", "Accuracy %", "Seconds", "Completed"].join(","), ...all.map((x) => [new Date(x.at).toISOString(), names[x.child] || "Guest", x.level, (WP.cats[x.cat] || {}).name || x.cat, x.note || x.practice, x.acc == null ? "" : x.acc, x.secs, x.done ? "yes" : "no"].map(q).join(","))].join("\n"), "text/csv"); }
      if (e.target.closest("[data-json]")) download("writing-practice-backup-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(WP.data.exportAll()), "application/json");
      if (e.target.closest("[data-printrep]")) { const d = document.createElement("div"); d.className = "wp-report"; d.innerHTML = `<h1>Writing progress report</h1><p>${ch ? esc(ch.name) + (ch.cls ? " · " + esc(ch.cls) : "") : "Guest"} · ${new Date().toLocaleDateString()}</p>` + $$(".wp-stats, .wp-need, [data-lt]:not([hidden]), .wp-levelset .small", view).map((n) => n.outerHTML).join(""); SK.printEl(d); }
    };
    $("[data-import]", view).onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { if (!confirm("Restoring replaces the Writing Practice data in this browser. Continue?")) return; WP.data.importAll(JSON.parse(t)); toast("Backup restored"); renderBar(); progressPage(); } catch (err) { toast(err.message || "Could not read that file"); } }); };
  }

  /* ------------------------------------------------------------ library ------------------------------------------------------------ */
  function libraryPage() {
    const saved = WP.data.saved(), custom = WP.data.custom(), ch = WP.data.child(), port = WP.data.portfolio(ch ? ch.id : null), gal = WP.data.gallery();
    view.innerHTML = `<div class="wp-pagehead"><h1>📚 My Library</h1><p class="muted">Saved activities, your own activities, the writing portfolio and saved drawings.</p></div>
      <div class="panel"><div class="wp-panelhead"><h2>Saved activities (${saved.length})</h2>${saved.length ? '<div class="toolbar"><button type="button" class="btn btn-soft btn-sm" data-print>🖨️ Print all</button><button type="button" class="btn btn-soft btn-sm" data-pdf>⬇️ PDF</button></div>' : ""}</div>
        ${saved.length ? saved.map((a) => `<details class="wp-actrow"><summary><b>${esc(a.title)}</b><span class="muted small">${esc(a.catName)} · ${esc(WP.TYPES[a.type] || "")} · ${esc(a.difficulty)}</span></summary>${WP.gen.html(a, { saved: true })}</details>`).join("") : '<p class="muted">Nothing saved yet. Press “💾 Save activity” on any generated activity.</p>'}</div>
      <div class="panel"><h2>My own activities (${custom.length})</h2>${custom.length ? `<ul class="saved">${custom.map((a) => `<li><span class="s-name">${esc(a.t)} <span class="muted small">· ${esc((WP.cats[a.cat] || {}).name || a.cat)} · ${esc(WP.TYPES[a.types] || "")}</span></span><button type="button" data-delc="${a.id}" aria-label="Delete">✕</button></li>`).join("")}</ul>` : '<p class="muted small">Add your own activities from the Activity Generator (“Add your own activity”).</p>'}</div>
      <div class="panel"><h2>Writing portfolio${ch ? " · " + esc(ch.name) : ""} (${port.length})</h2>${port.length ? `<ul class="saved">${port.map((p) => `<li><span class="s-name">${esc(p.title)} <span class="muted small">· ${esc((WP.cats[p.cat] || {}).name || "")} · ${date(p.updated || p.at)}</span></span><button type="button" data-view="${p.id}">View</button><button type="button" data-delp="${p.id}" aria-label="Delete">✕</button></li>`).join("")}</ul><div data-piece></div>` : '<p class="muted small">Writing saved in the Advanced practices appears here.</p>'}</div>
      <div class="panel"><h2>Drawings (${gal.length})</h2>${gal.length ? `<div class="wp-gallery">${gal.map((g) => `<figure><img src="${g.png}" alt="${esc(g.mode || "Drawing")}"><figcaption>${esc(g.mode || "")} · ${date(g.at)} <button type="button" data-delg="${g.id}" aria-label="Delete">✕</button></figcaption></figure>`).join("")}</div>` : '<p class="muted small">Drawings saved from the Scribbling canvas appear here.</p>'}</div>`;
    saveHandlers(view, () => saved);
    view.onclick = (e) => {
      if (e.target.closest("[data-unsave]")) setTimeout(libraryPage, 50);
      if (e.target.closest("[data-print]")) printActs(saved, "Saved writing activities");
      const pd = e.target.closest("[data-pdf]"); if (pd) pdfBtn(pd, () => WP.pdf.activities(saved, "Saved writing activities"));
      const dc = e.target.closest("[data-delc]"); if (dc && confirm("Delete this activity?")) { WP.data.delCustom(dc.dataset.delc); libraryPage(); }
      const dp = e.target.closest("[data-delp]"); if (dp && confirm("Delete this piece of writing?")) { WP.data.delPiece(dp.dataset.delp); libraryPage(); }
      const dg = e.target.closest("[data-delg]"); if (dg && confirm("Delete this drawing?")) { WP.data.delDrawing(dg.dataset.delg); libraryPage(); }
      const vw = e.target.closest("[data-view]"); if (vw) { const p = port.find((x) => x.id === vw.dataset.view); $("[data-piece]", view).innerHTML = `<div class="wp-paper"><h3>${esc(p.title)}</h3><div class="wp-piecetext">${esc(p.text || "").replace(/\n/g, "<br>")}</div>${p.feedback ? `<p class="small"><b>Teacher feedback:</b> ${esc(p.feedback)}</p>` : ""}<div class="toolbar"><button type="button" class="btn btn-ghost btn-sm" data-say>🔊 Read aloud</button><button type="button" class="btn btn-ghost btn-sm" data-pp>🖨️ Print</button></div></div>`; $("[data-say]", view).onclick = () => speak(p.text || ""); $("[data-pp]", view).onclick = () => SK.printEl($(".wp-paper", view)); }
    };
  }

  /* ------------------------------------------------------------ start ------------------------------------------------------------ */
  if (store.get("wp:mode", "teacher") === "kid") document.body.classList.add("wp-kid");
  renderBar(); route();
})();
