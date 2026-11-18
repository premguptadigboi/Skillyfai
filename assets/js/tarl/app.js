/* TARL Lesson Plans: day selector, plan view, assessment checkpoints, print and PDF.
   Data (pre-generated, no random choice at run time) is in assets/data/tarl/literacy.js and numeracy.js. */
(function () {
  "use strict";
  const { $, $$, esc, toast, store } = SK;
  const kind = document.body.dataset.tarl;                      // "literacy" | "numeracy"
  const D = window.TARL && window.TARL[kind];
  const root = $("#tarl-app");
  if (!D) { root.innerHTML = '<div class="empty"><div class="e-icon">⚠️</div><p>The lesson plan data could not be loaded. Please reload the page.</p></div>'; return; }
  const { meta, days } = D;
  const TITLE = kind === "literacy" ? "TARL – Literacy Lesson Plan Generator" : "TARL – Numeracy Lesson Plan Generator";
  const SUBJECT = kind === "literacy" ? "Language literacy: oral language, reading, writing" : "Mathematics (numeracy)";
  const CP = meta.checkpoints;
  const tone = kind === "literacy" ? "lit" : "num";
  let cur = null;

  const src = (r) => r.source === "M" ? `<span class="src src-m" title="Taken from the TaRL manual">Manual ${esc((r.ref || "").replace("p.", "p. "))}</span>` : `<span class="src src-i" title="Professional interpretation: the manual does not state this">Interpretation</span>`;
  const grp = (g) => `<span class="grp ${/^Whole/.test(g) ? "g-w" : /^Small/.test(g) ? "g-s" : "g-i"}">${esc(g)}</span>`;
  const GSHORT = (g) => (/^Whole/.test(g) ? "Whole class" : /^Small/.test(g) ? "Small groups" : "Individual");
  const groupsOf = (rows) => { const out = []; rows.forEach((r) => { const g = GSHORT(r.grouping); if (!out.includes(g)) out.push(g); }); return out; };
  const partChip = (g) => `<span class="grp ${/^Whole/.test(g) ? "g-w" : /^Small/.test(g) ? "g-s" : "g-i"}">${/^Whole/.test(g) ? "Part 1 · " : "Part 2 · "}${esc(GSHORT(g))}</span>`;
  const shortAct = (a) => { const t = a.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim(); return t.length > 46 ? t.slice(0, 44) + "…" : t; };
  // one seating change: Part 1 whole class (U shape); Part 2 level groups, small-group tasks first and then individual tasks at the same seats
  function runOrder(V) {
    const rows = V.parts.flatMap((c) => c.rows), by = (re) => rows.filter((r) => re.test(r.grouping)), sum = (a) => a.reduce((s, r) => s + r.minutes, 0);
    const w = by(/^Whole/), sm = by(/^Small/), iv = by(/^Individual/), t1 = sum(w), t2 = sum(sm), t3 = sum(iv);
    const it = (a) => a.map((r) => esc(shortAct(r.activity)) + " (" + r.minutes + ")").join(" → ") || "none today";
    return { t1, t2, t3, ok: t1 + t2 + t3 === V.total,
      html: `<div class="runorder"><h4>Run order: one seating change</h4>
        <div class="ro p1"><b>Part 1 · Whole class in a U · min 0-${t1}</b><span>${it(w)}</span></div>
        <div class="ro p2"><b>Part 2 · Level groups · min ${t1}-${V.total}</b><span><i>Small groups (${t2} min):</i> ${it(sm)}<br><i>Then individual, same seats (${t3} min):</i> ${it(iv)}</span></div>
        ${V.after ? `<div class="ro p3"><b>After the class · ${esc(V.after.name)} · ${V.after.minutes} min</b><span>Each learner reads alone.</span></div>` : ""}</div>` };
  }
  const list = (a) => `<ul class="tl">${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const li = (arr) => `<ul class="tl compact">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;

  /* ------------------------------------------------------------ shell ------------------------------------------------------------ */
  function timeline() {
    return `<ol class="tl-track" aria-label="Programme timeline">
      <li><button type="button" class="tl-cp" data-cp="baseline"><b>Baseline assessment</b><small>Before Day 1</small></button></li>
      <li><button type="button" class="tl-ph p1" data-day="1"><b>Phase 1</b><small>Days 1-45</small></button></li>
      <li><button type="button" class="tl-cp" data-cp="midline"><b>Midline assessment</b><small>After Day 45</small></button></li>
      <li><button type="button" class="tl-ph p2" data-day="46"><b>Phase 2</b><small>Days 46-90</small></button></li>
      <li><button type="button" class="tl-cp" data-cp="endline"><b>Endline assessment</b><small>After Day 90</small></button></li>
    </ol>`;
  }
  function grid() {
    const chip = (d) => `<button type="button" class="dchip p${d.phase}" data-day="${d.day}" aria-label="Day ${d.day}">${d.day}</button>`;
    const cp = (k) => `<button type="button" class="dchip cp" data-cp="${k}">${CP[k].name.replace(" assessment", "")}</button>`;
    return `<div class="dgrid" role="group" aria-label="Choose a day">${cp("baseline")}<span class="dlabel">Phase 1</span>${days.filter((d) => d.phase === 1).map(chip).join("")}${cp("midline")}<span class="dlabel">Phase 2</span>${days.filter((d) => d.phase === 2).map(chip).join("")}${cp("endline")}</div>`;
  }
  function shell() {
    root.innerHTML = `
      <section class="panel tarl-over">
        <h2>${esc(TITLE)}</h2>
        <p class="muted">Based on the TaRL (Teaching at the Right Level) teacher manual, Assamese module. Levels: ${meta.levels.map(esc).join(", ")}.</p>
        <div class="tarl-facts"><div><b>90</b><span>Lesson plans</span></div><div><b>${meta.duration} min</b><span>Daily lesson${kind === "literacy" ? " + 10 min reading" : ""}</span></div><div><b>45 + 45</b><span>Days in Phase 1 + Phase 2</span></div><div><b>3</b><span>Assessment checkpoints</span></div></div>
        ${timeline()}
        <p class="small muted">Baseline, midline and endline are separate events. They are not among the 90 lessons.</p>
      </section>
      <section class="panel tarl-pick no-print" id="picker">
        <h2>Select a day</h2>
        <div class="pick-row">
          <div class="field"><label for="daySel">Day serial number</label>
            <select id="daySel" class="input">
              <optgroup label="Phase 1 (Days 1-45)">${days.filter((d) => d.phase === 1).map((d) => `<option value="${d.day}">Day ${d.day}</option>`).join("")}</optgroup>
              <optgroup label="Phase 2 (Days 46-90)">${days.filter((d) => d.phase === 2).map((d) => `<option value="${d.day}">Day ${d.day}</option>`).join("")}</optgroup>
            </select></div>
          <button type="button" class="btn btn-primary btn-lg" id="genBtn">GENERATE LESSON PLAN</button>
        </div>
        <details class="dgrid-wrap" open><summary>Or tap a day number</summary>${grid()}</details>
      </section>
      <div id="result" aria-live="polite"></div>
      <section class="panel tarl-gaps no-print"><details><summary><b>Notes on the manual: what it says and what these plans interpret</b></summary>
        <p class="small muted">Each activity is tagged <span class="src src-m">Manual p. X</span> (in the manual) or <span class="src src-i">Interpretation</span> (my decision where the manual is silent).</p>${list(meta.gaps)}</details></section>`;
    const last = +store.get("tarl:" + kind + ":last", 0);
    if (last) $("#daySel").value = last;
  }

  /* ------------------------------------------------------------ time validation ------------------------------------------------------------ */
  // Component times come from meta.prescribed (the manual). Totals are always computed, never typed in.
  function validate(p) {
    const msgs = [], rn = {}; p.sequence.forEach((r) => (rn[r.n] = r));
    const pres = meta.prescribed, parts = [];
    if (p.components.length !== pres.length) msgs.push("a compulsory component is missing");
    pres.forEach((pr, i) => {
      const c = p.components[i];
      if (!c || c.key !== pr[0]) { msgs.push("component order differs from the manual at position " + (i + 1)); return; }
      const rows = c.rows.map((n) => rn[n]).filter(Boolean), m = rows.reduce((s, r) => s + r.minutes, 0);
      if (!rows.length) msgs.push(c.name + " has no activities");
      if (m !== pr[2]) msgs.push(c.name + " is " + m + " min but the manual says " + pr[2] + " min");
      parts.push({ no: c.no, key: c.key, name: c.name, ref: pr[3], keywords: c.keywords, rows, minutes: m });
    });
    let after = null;
    if (meta.afterClass) {
      const rows = (p.afterClass ? p.afterClass.rows : []).map((x) => rn[x]).filter(Boolean), m = rows.reduce((s, r) => s + r.minutes, 0);
      if (!rows.length || m !== meta.afterClass.minutes) msgs.push("the after-class " + meta.afterClass.name + " is " + m + " min but the manual says " + meta.afterClass.minutes + " min");
      after = { name: p.afterClass.name, ref: meta.afterClass.ref, minutes: m, rows, keywords: p.afterClass.keywords };
    }
    const gsum = (re) => parts.flatMap((c) => c.rows).filter((r) => re.test(r.grouping)).reduce((s, r) => s + r.minutes, 0);
    if (gsum(/^Whole/) + gsum(/^Small/) + gsum(/^Individual/) !== parts.reduce((s, c) => s + c.minutes, 0)) msgs.push("part minutes do not add up to the lesson");
    const total = parts.reduce((s, c) => s + c.minutes, 0), want = pres.reduce((s, x) => s + x[2], 0);
    if (total !== want) msgs.push("total " + total + " min does not match the manual total " + want + " min");
    if (total !== p.duration) msgs.push("lesson duration field says " + p.duration + " min");
    return { ok: msgs.length === 0, msgs, total, parts, after };
  }

  /* ------------------------------------------------------------ plan view ------------------------------------------------------------ */
  function nav(d) {
    const prev = d === 1 ? ["cp", "baseline", "Baseline assessment"] : ["day", d - 1, "Day " + (d - 1)];
    const next = d === 45 ? ["cp", "midline", "Midline assessment"] : d === 90 ? ["cp", "endline", "Endline assessment"] : ["day", d + 1, "Day " + (d + 1)];
    const a = (t) => t[0] === "cp" ? `data-cp="${t[1]}"` : `data-day="${t[1]}"`;
    return `<div class="tp-nav no-print"><button type="button" class="btn btn-ghost btn-sm" ${a(prev)}>← Previous: ${prev[2]}</button>
      <button type="button" class="btn btn-ghost btn-sm" data-back>Back to day selection</button>
      <button type="button" class="btn btn-ghost btn-sm" ${a(next)}>Next: ${next[2]} →</button><span class="spacer"></span>
      <button type="button" class="btn btn-soft btn-sm" data-print>🖨️ Print</button><button type="button" class="btn btn-soft btn-sm" data-pdf>⬇️ Download PDF</button></div>`;
  }
  function planHTML(p) {
    const V = validate(p), comps = V.parts;
    const compRows = comps.map((c) => `<tr><td data-label="Sl. No.">${c.no}</td>
      <td data-label="Teaching component / session"><b>${esc(c.name)}</b><div><span class="src src-m" title="Component and time from the manual's daily timetable">Manual ${esc(c.ref.replace("p.", "p. "))}</span></div></td>
      <td data-label="Time allocation" class="tm"><b>${c.minutes} minutes</b></td>
      <td data-label="Teaching-learning activities">${li(c.rows.map((r) => `<b>${esc(r.activity)}</b> ${partChip(r.grouping)} <span class="sub">${r.minutes} min</span> ${src(r)}<div class="tlm">TLM: ${esc(r.tlm)}</div>`))}</td>
      <td data-label="Teacher's role">${li(c.rows.map((r) => esc(r.teacher)))}</td>
      <td data-label="Learners' participation">${li(c.rows.map((r) => esc(r.learners)))}</td></tr>`).join("");
    const RO = runOrder(V);
    const timeBadge = V.ok ? `<div class="tcheck ok">✔ Time check passed: ${comps.map((c) => c.minutes).join(" + ")} = ${V.total} minutes</div>` : `<div class="tcheck bad">⚠ Time check failed, please review: ${V.msgs.map(esc).join("; ")}</div>`;
    const afterHTML = V.after ? `<h4 class="afterhead">After the class: ${esc(V.after.name)}, ${V.after.minutes} minutes (not in the ${V.total}) <span class="src src-m" title="A note in the manual's daily timetable">Manual ${esc(V.after.ref.replace("p.", "p. "))}</span></h4>
      <div class="tbl-wrap"><table class="tarl-tbl afterclass"><thead><tr><th>Component</th><th>Time</th><th>Activities</th><th>Teacher's role</th><th>Learners' participation</th></tr></thead><tbody><tr><td data-label="Component"><b>${esc(V.after.name)}</b></td><td data-label="Time" class="atm"><b>${V.after.minutes} minutes</b></td>
      <td data-label="Activities">${li(V.after.rows.map((r) => `<b>${esc(r.activity)}</b> <span class="grp g-i">After class · Individual</span><div class="tlm">TLM: ${esc(r.tlm)}</div>`))}</td><td data-label="Teacher's role">${li(V.after.rows.map((r) => esc(r.teacher)))}</td><td data-label="Learners' participation">${li(V.after.rows.map((r) => esc(r.learners)))}</td></tr></tbody></table></div>` : "";
    const revAfter = V.after ? `<p class="revafter">+ <b>${esc(V.after.name)}: ${V.after.minutes} min</b> after the class (not in the total) <i>•</i> ${groupsOf(V.after.rows).join(", ")} <i>•</i> ${V.after.keywords.map(esc).join(" <i>•</i> ")}</p>` : "";
    const pre = p.preLesson ? `<p class="prelesson">${esc(p.preLesson)}</p>` : "";
    const revRows = comps.map((c) => `<tr><td data-label="Session"><b>${c.no}. ${esc(c.name)}</b></td><td data-label="Time" class="tm">${c.minutes} min</td><td data-label="Groups targeted" class="grps">${groupsOf(c.rows).map((g) => `<span class="gtag">${g}</span>`).join(" ")}</td><td data-label="Keywords / key activities">${c.keywords.map(esc).join(' <i>•</i> ')}</td></tr>`).join("");
    const revision = `<section class="revnote" id="revnote"><h3>QUICK REVISION NOTE – LESSON AT A GLANCE</h3><p class="small muted">${esc(meta.name.replace("TARL ", "").toUpperCase())} · Day ${p.day} · ${esc(p.title)}</p>
      <div class="tbl-wrap"><table class="tarl-tbl rev"><thead><tr><th>Session</th><th>Time</th><th>Groups targeted</th><th>Keywords / key activities</th></tr></thead><tbody>${revRows}</tbody>
      <tfoot><tr class="totalrow"><td><b>TOTAL</b></td><td class="tm" data-rev-total><b>${V.total} min</b></td><td></td><td><b>Complete lesson: ${V.total} minutes</b></td></tr></tfoot></table></div><p class="revrun"><b>Run order:</b> Part 1 whole class ${RO.t1} min → Part 2 level groups ${RO.t2 + RO.t3} min (small groups ${RO.t2}, individual ${RO.t3})</p>${revAfter}</section>`;
    const procs = p.procedures.map((pr) => `<div class="proc"><h4>${esc(pr.activity)} ${grp(pr.grouping)} ${src(pr)}</h4>
      <div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Step</th><th>Teacher's instructions</th><th>Learners' participation</th></tr></thead><tbody>${pr.steps.map((s, i) => `<tr><td data-label="Step">${i + 1}</td><td data-label="Teacher's instructions">${esc(s.teacher)}</td><td data-label="Learners' participation">${esc(s.learners)}</td></tr>`).join("")}</tbody></table></div></div>`).join("");
    const lv = p.levelTasks.map((l) => `<div class="proc"><h4>${esc(l.activity)} ${src(l)}</h4><div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Level</th><th>Task</th></tr></thead><tbody>${meta.levelKeys.map((k, i) => `<tr><td data-label="Level"><b>${esc(meta.levels[i])}</b></td><td data-label="Task">${esc(l.tasks[k] || "")}</td></tr>`).join("")}</tbody></table></div></div>`).join("");
    const org = p.organisation.map((o) => `<tr><td data-label="Grouping"><b>${esc(o.grouping)}</b></td><td data-label="How to organise">${esc(o.how)}</td></tr>`).join("");
    return `<article class="tarl-plan ${tone}" id="plan" data-pday="${p.day}">
      <header class="tp-head"><div class="tp-badges"><span class="badge">${esc(p.programme)}</span><span class="badge">Day ${p.day} of 90</span><span class="badge ph${p.phase}">${esc(p.phaseLabel)}</span></div>
        <h2>Day ${p.day}: ${esc(p.title)}</h2><p class="muted">${esc(p.dayType)}</p></header>
      ${nav(p.day)}
      <section><h3>A. Lesson details</h3><div class="tbl-wrap"><table class="tarl-tbl kv"><tbody>
        <tr><th>Programme · Day · Phase</th><td>${esc(p.programme)} · Day ${p.day} of 90 · ${esc(p.phaseLabel)}</td></tr>
        <tr><th>Subject</th><td>${esc(SUBJECT)}</td></tr><tr><th>Main learning focus</th><td>${esc(p.focus)}</td></tr>
        <tr><th>Learning objectives</th><td>${list(p.objectives)}</td></tr>
        <tr><th>Overall duration</th><td><b class="bigmin">${V.total} minutes</b> (${comps.map((c) => c.minutes).join(" + ")})${V.after ? " + " + V.after.minutes + "-minute daily reading after the class" : ""}</td></tr></tbody></table></div></section>
      <section><h3>B. Lesson plan: components and time allocation</h3>${timeBadge}${pre}${RO.html}<div class="tbl-wrap"><table class="tarl-tbl seq"><thead><tr><th>Sl. No.</th><th>Teaching component / session</th><th>Time allocation</th><th>Teaching-learning activities</th><th>Teacher's role</th><th>Learners' participation</th></tr></thead><tbody>${compRows}</tbody>
        <tfoot><tr class="totalrow"><td></td><td><b>TOTAL DURATION</b></td><td class="tm" data-main-total><b>${V.total} minutes</b></td><td colspan="3"><b>TOTAL DURATION = ${V.total} MINUTES</b></td></tr></tfoot></table></div>
        ${afterHTML}<p class="small muted">Component times are the manual's. Minutes per activity are a suggested split.</p></section>
      <section><h3>C. Steps</h3>${procs}</section>
      <section><h3>Level-wise tasks</h3>${lv}</section>
      <section><h3>D. Grouping and organisation</h3><div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Grouping</th><th>How to organise</th></tr></thead><tbody>${org}</tbody></table></div></section>
      <section class="two"><div><h3>E. Materials (TLM)</h3>${list(p.materials)}</div><div><h3>F. Outcomes</h3>${list(p.outcomes)}</div></section>
      <section><h3>G. Observation / formative assessment</h3>${list(p.observation)}</section>
      <section><h3>Notes</h3>${list(p.teacherNotes)}</section>
      ${revision}
      <footer class="tp-foot small muted">From the TaRL Teacher Manual (Assamese module). <span class="src src-m">Manual</span> = in the manual. <span class="src src-i">Interpretation</span> = my decision.</footer>
      ${nav(p.day)}
    </article>`;
  }

  /* ------------------------------------------------------------ checkpoint view ------------------------------------------------------------ */
  function sampleHTML(s) {
    if (kind === "literacy") return `<p><b>Reading sample ${s.n}:</b> the story, two paras, questions, 10 letters and 10 words are on pages ${s.pages} of the Assamese manual PDF.</p>`;
    return `<div class="sample"><h4>Math sample ${s.n} <span class="small muted">(manual PDF p.${s.page})</span></h4><p><b>Numbers 1-9:</b> ${s.r19.join(", ")}</p><p><b>Numbers 10-99:</b> ${s.r1099.join(", ")}</p><p><b>Subtraction:</b> ${s.sub.join(" &nbsp;·&nbsp; ")}</p><p><b>Division:</b> ${s.div.join(" &nbsp;·&nbsp; ")}</p></div>`;
  }
  function cpHTML(k) {
    const c = CP[k], s = meta.samples.find((x) => x.n === c.sample);
    const next = k === "baseline" ? ["day", 1, "Start Day 1"] : k === "midline" ? ["day", 46, "Continue to Day 46"] : null;
    const prev = k === "midline" ? ["day", 45, "Day 45"] : k === "endline" ? ["day", 90, "Day 90"] : null;
    const b = (t) => `data-day="${t[1]}"`;
    return `<article class="tarl-plan ${tone} cp-view" id="plan">
      <header class="tp-head"><div class="tp-badges"><span class="badge">${esc(meta.name)}</span><span class="badge cpb">Assessment checkpoint</span></div><h2>${esc(c.name)}</h2><p class="muted">${esc(c.when)}. An assessment event, not a lesson.</p></header>
      <div class="tp-nav no-print">${prev ? `<button type="button" class="btn btn-ghost btn-sm" ${b(prev)}>← ${prev[2]}</button>` : ""}<button type="button" class="btn btn-ghost btn-sm" data-back>Back to day selection</button>${next ? `<button type="button" class="btn btn-primary btn-sm" ${b(next)}>${next[2]} →</button>` : ""}<span class="spacer"></span><button type="button" class="btn btn-soft btn-sm" data-print>🖨️ Print</button></div>
      <section><h3>Purpose</h3><p>${esc(c.purpose)}</p><p><b>Afterwards:</b> ${esc(c.afterwards)}</p></section>
      <section><h3>Procedure (manual ${kind === "literacy" ? "p.4" : "p.23"})</h3>
        <div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Step</th><th>What to do</th></tr></thead><tbody>${meta.assessmentSteps.map((a) => `<tr><td data-label="Step"><b>${esc(a[0])}</b></td><td data-label="What to do">${esc(a[1])}</td></tr>`).join("")}</tbody></table></div></section>
      <section><h3>Levels recorded</h3><p>${meta.levels.map((l) => `<span class="badge">${esc(l)}</span>`).join(" ")}</p><p class="small">${esc(meta.recording)}</p></section>
      <section><h3>Sample test for this checkpoint (sample ${c.sample})</h3><p class="small muted">The recording sheet has a 'tool sample no.' column; the manual does not say which sample goes with which round. 1-2-3 here is my choice.</p>${sampleHTML(s)}
        <details class="no-print"><summary>Other samples</summary>${meta.samples.filter((x) => x.n !== c.sample).map(sampleHTML).join("")}</details></section></article>`;
  }

  /* ------------------------------------------------------------ routing ------------------------------------------------------------ */
  function show(html, scroll) { $("#result").innerHTML = html; if (scroll) $("#result").scrollIntoView({ behavior: "smooth", block: "start" }); }
  function render(scroll) {
    const h = location.hash.replace("#", "");
    let m;
    if ((m = /^day-(\d+)$/.exec(h)) && +m[1] >= 1 && +m[1] <= 90) {
      cur = +m[1]; const p = days[cur - 1];
      $("#daySel").value = cur; store.set("tarl:" + kind + ":last", cur);
      $$(".dchip").forEach((c) => c.classList.toggle("on", +c.dataset.day === cur));
      document.title = "Day " + cur + " · " + meta.name + " · Skillyfai";
      show(planHTML(p), scroll); domTimeCheck();
    } else if (CP[h]) {
      cur = null; $$(".dchip").forEach((c) => c.classList.toggle("on", c.dataset.cp === h));
      document.title = CP[h].name + " · " + meta.name + " · Skillyfai";
      show(cpHTML(h), scroll);
    } else { cur = null; show(""); $$(".dchip").forEach((c) => c.classList.remove("on")); document.title = TITLE + " · Skillyfai"; }
  }
  // the main table total and the revision note total are read back from the page and compared
  function domTimeCheck() {
    const num = (el) => (el ? parseInt(el.textContent, 10) : NaN);
    const mainSum = $$("#plan .seq tbody td.tm").reduce((a, c) => a + num(c), 0), revSum = $$("#revnote tbody td.tm").reduce((a, c) => a + num(c), 0);
    const mt = num($("#plan [data-main-total]")), rt = num($("#plan [data-rev-total]"));
    if (!(mainSum === mt && revSum === rt && mt === rt)) {
      const bar = document.createElement("div"); bar.className = "tcheck bad"; bar.textContent = "⚠ Time check failed: main table total (" + mt + ") and revision note total (" + rt + ") differ. Please report this day.";
      $("#plan .tp-head").after(bar);
    }
  }
  function go(hash) { if (location.hash === "#" + hash) render(true); else location.hash = hash; }
  window.addEventListener("hashchange", () => render(true));
  root.addEventListener("click", (e) => {
    const t = e.target, d = t.closest("[data-day]"), c = t.closest("[data-cp]");
    if (t.closest("#genBtn")) return go("day-" + $("#daySel").value);
    if (d) return go("day-" + d.dataset.day);
    if (c) return go(c.dataset.cp);
    if (t.closest("[data-back]")) { history.pushState(null, "", location.pathname); render(false); $("#picker").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (t.closest("[data-print]")) return printPlan();
    const pdf = t.closest("[data-pdf]"); if (pdf) return makePDF(pdf);
  });

  /* ------------------------------------------------------------ print ------------------------------------------------------------ */
  function printPlan() {
    const el = $("#plan"); if (!el) return;
    const st = document.createElement("style"); st.textContent = "@media print{@page{size:A4 landscape;margin:10mm}}"; document.head.append(st);
    SK.printEl(el); setTimeout(() => st.remove(), 1500);
  }

  /* ------------------------------------------------------------ PDF ------------------------------------------------------------ */
  // The plan is drawn by the browser (so Assamese script shows correctly), cut into blocks (a table row, a heading, a list) and
  // placed on A4 landscape pages without cutting a block in half.
  const LIB = { jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", h2c: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" };
  const loaded = {};
  const loadJs = (s) => loaded[s] || (loaded[s] = new Promise((res, rej) => { const e = document.createElement("script"); e.src = s; e.onload = res; e.onerror = () => { delete loaded[s]; rej(new Error("Could not load the PDF tool. Check the internet connection.")); }; document.head.append(e); }));
  const abs = (u) => new URL(u, location.href).href;
  async function makePDF(btn) {
    const p = cur ? days[cur - 1] : null; if (!p) { toast("Open a lesson plan first"); return; }
    const old = btn.textContent; btn.disabled = true; btn.textContent = "Making PDF…";
    let frame = null;
    try {
      await loadJs(LIB.jspdf); await loadJs(LIB.h2c);
      const FW = 1075;                                              // layout width in px (A4 landscape minus margins)
      frame = document.createElement("iframe"); frame.style.cssText = "position:fixed;left:-20000px;top:0;border:0;width:" + FW + "px;height:900px";
      document.body.append(frame);
      const fd = frame.contentDocument;
      const ready = new Promise((r) => { frame.onload = r; setTimeout(r, 6000); });
      fd.open(); fd.write('<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><link rel="stylesheet" href="' + abs("../assets/css/styles.css") + '"><link rel="stylesheet" href="' + abs("../assets/css/tarl.css") + '"><style>html,body{background:#fff!important;color:#111;margin:0}.no-print,.tp-nav,.tcheck{display:none!important}.tarl-plan{border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;margin:0!important}#stage{width:' + FW + 'px;padding:0}#stage>*{margin:0 0 6px}</style></head><body><div id="stage"></div></body></html>');
      fd.close(); await ready; if (fd.fonts) await fd.fonts.ready;
      const stage = fd.getElementById("stage");
      const holder = fd.createElement("div"); holder.innerHTML = $("#plan").outerHTML; stage.append(holder);
      await new Promise((r) => setTimeout(r, 200));
      const plan = fd.getElementById("plan");
      // cut the plan into blocks
      const atoms = [];
      const tableAtoms = (table) => {
        const rect = (el) => el.getBoundingClientRect();
        const first = table.tHead ? table.tHead.rows[0] : table.rows[0];
        const widths = [...first.cells].map((c) => rect(c).width);
        const wrapT = (inner) => { const t = fd.createElement("table"); t.className = table.className; t.style.cssText = "width:" + rect(table).width + "px;table-layout:fixed"; t.innerHTML = "<colgroup>" + widths.map((w) => '<col style="width:' + w + 'px">').join("") + "</colgroup>"; t.append(inner); return t; };
        const head = table.tHead ? (() => { const h = fd.createElement("thead"); h.append(table.tHead.rows[0].cloneNode(true)); return wrapT(h); })() : null;
        const rows = [...table.tBodies].flatMap((b) => [...b.rows]).concat(table.tFoot ? [...table.tFoot.rows] : []);
        if (head) atoms.push({ el: head, head: true, id: table });
        rows.forEach((r) => { const b = fd.createElement("tbody"); b.append(r.cloneNode(true)); atoms.push({ el: wrapT(b), id: table, headEl: head }); });
      };
      const walk = (node) => {
        if (node.classList && node.classList.contains("tbl-wrap")) return tableAtoms(node.querySelector("table"));
        if (node.querySelector && node.querySelector(".tbl-wrap")) return [...node.children].forEach(walk);
        atoms.push({ el: node.cloneNode(true) });
      };
      [...plan.children].forEach(walk);
      plan.style.display = "none";
      const work = fd.createElement("div"); work.style.cssText = "width:" + FW + "px"; fd.body.append(work);
      atoms.forEach((a) => { const w = fd.createElement("div"); w.style.cssText = "width:" + FW + "px;background:#fff"; w.append(a.el); work.append(w); a.box = w; });
      const { jsPDF } = window.jspdf, doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
      const PW = 297, PH = 210, M = 8, MM = (PW - 2 * M) / FW, usable = PH - 2 * M - 5;
      let y = M, onPage = false;
      const shot = (box) => window.html2canvas(box, { scale: 1.6, backgroundColor: "#ffffff", logging: false, windowWidth: FW });
      for (let i = 0; i < atoms.length; i++) {
        btn.textContent = "Making PDF… " + Math.round((i / atoms.length) * 100) + "%";
        const a = atoms[i], h = a.box.offsetHeight * MM;
        if (h < 0.5) continue;
        const canvas = await shot(a.box);
        let hh = h, ww = FW * MM; if (hh > usable) { ww = ww * usable / hh; hh = usable; }
        if (onPage && y + hh > PH - M - 5) {
          doc.addPage(); y = M; onPage = false;
          if (a.headEl) {                                              // repeat the table head at the top of a new page
            const hbox = atoms.find((x) => x.el === a.headEl).box, hc = await shot(hbox), h2 = hbox.offsetHeight * MM;
            doc.addImage(hc.toDataURL("image/jpeg", 0.92), "JPEG", M, y, FW * MM, h2); y += h2 + 1;
          }
        }
        doc.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", M, y, ww, hh); y += hh + 1; onPage = true;
      }
      const n = doc.internal.getNumberOfPages();
      for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(120); doc.text("Skillyfai | " + p.programme + " | Day " + p.day + " | from the TaRL Teacher Manual", M, PH - 4); doc.text("Page " + i + " of " + n, PW - M, PH - 4, { align: "right" }); }
      doc.save(p.programme.replace(/\s+/g, "-") + "-Day-" + String(p.day).padStart(2, "0") + ".pdf");
      toast("PDF downloaded");
    } catch (err) { console.error(err); toast(err.message || "Could not make the PDF"); }
    finally { if (frame) frame.remove(); btn.disabled = false; btn.textContent = old; }
  }

  shell();
  render(false);
})();
