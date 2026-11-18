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
  const SUBJECT = kind === "literacy" ? "English literacy (oral language, reading, writing)" : "Mathematics (numeracy)";
  const CP = meta.checkpoints;
  const tone = kind === "literacy" ? "lit" : "num";
  let cur = null;

  const src = (r) => r.source === "M" ? `<span class="src src-m" title="Taken from the TaRL manual">Manual${r.ref ? " " + esc(r.ref) : ""}</span>` : `<span class="src src-i" title="Professional interpretation: the manual does not state this">Interpretation${r.ref ? " (" + esc(r.ref) + ")" : ""}</span>`;
  const grp = (g) => `<span class="grp ${/^Whole/.test(g) ? "g-w" : /^Small/.test(g) ? "g-s" : "g-i"}">${esc(g)}</span>`;
  const list = (a) => `<ul class="tl">${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

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
    return `<div class="dgrid" role="group" aria-label="Choose a day">
      ${cp("baseline")}<span class="dlabel">Phase 1</span>${days.filter((d) => d.phase === 1).map(chip).join("")}${cp("midline")}<span class="dlabel">Phase 2</span>${days.filter((d) => d.phase === 2).map(chip).join("")}${cp("endline")}
    </div>`;
  }
  function shell() {
    root.innerHTML = `
      <section class="panel tarl-over">
        <h2>${esc(TITLE)}</h2>
        <p class="muted">Based on the TaRL (Teaching at the Right Level) teacher manual. ${kind === "literacy" ? "Levels: Beginner, Letter, Word, Para, Story." : "Levels: Beginner, 1-9 number recognition, 10-99 number recognition, Subtraction, Division."} Daily lesson: ${meta.duration} minutes${kind === "literacy" ? " plus a 10-minute daily reading session at the end of the class" : ""}.</p>
        <div class="tarl-facts"><div><b>90</b><span>Lesson plans</span></div><div><b>45</b><span>Days in Phase 1 (Days 1-45)</span></div><div><b>45</b><span>Days in Phase 2 (Days 46-90)</span></div><div><b>3</b><span>Assessment checkpoints</span></div></div>
        ${timeline()}
        <p class="small muted">Baseline, midline and endline are separate assessment events. They are not counted among the 90 daily lessons.</p>
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
      <section class="panel tarl-gaps no-print"><details><summary><b>Notes on the TaRL manual: what the manual says and what these plans interpret</b></summary>
        <p class="small muted">Every activity row in a plan carries a tag: <span class="src src-m">Manual</span> means the activity is described in the manual (with the page); <span class="src src-i">Interpretation</span> means the manual does not state it and it is a professional decision. These are the gaps found in the manual:</p>${list(meta.gaps)}</details></section>`;
    const last = +store.get("tarl:" + kind + ":last", 0);
    if (last) $("#daySel").value = last;
  }

  /* ------------------------------------------------------------ time validation ------------------------------------------------------------ */
  // Components and their times come from meta.prescribed (taken from the manual). Totals are always computed, never typed in.
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
      after = { name: meta.afterClass.name, ref: meta.afterClass.ref, minutes: m, rows, keywords: p.afterClass ? p.afterClass.keywords : [] };
    }
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
      <button type="button" class="btn btn-soft btn-sm" data-print>🖨️ Print lesson plan</button><button type="button" class="btn btn-soft btn-sm" data-pdf>⬇️ Download PDF</button></div>`;
  }
  function planHTML(p) {
    const V = validate(p), comps = V.parts;
    const li = (arr) => `<ul class="tl compact">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    const compRows = comps.map((c) => `<tr><td data-label="Sl. No.">${c.no}</td>
      <td data-label="Teaching component / session"><b>${esc(c.name)}</b><div><span class="src src-m" title="Component and time taken from the manual's daily timetable">Manual ${esc(c.ref)}</span></div></td>
      <td data-label="Time allocation" class="tm"><b>${c.minutes} minutes</b></td>
      <td data-label="Teaching-learning activities">${li(c.rows.map((r) => `<b>${esc(r.activity)}</b> ${grp(r.grouping)} <span class="sub">${r.minutes} min</span> ${src(r)}<div class="tlm">TLM: ${esc(r.tlm)}</div>`))}</td>
      <td data-label="Teacher's role">${li(c.rows.map((r) => esc(r.teacher)))}</td>
      <td data-label="Learners' participation">${li(c.rows.map((r) => esc(r.learners)))}</td></tr>`).join("");
    const timeBadge = V.ok ? `<div class="tcheck ok">✔ Time check passed: ${comps.map((c) => c.minutes).join(" + ")} = ${V.total} minutes</div>` : `<div class="tcheck bad">⚠ Time check failed, please review: ${V.msgs.map(esc).join("; ")}</div>`;
    const afterHTML = V.after ? `<h4 class="afterhead">After the class: ${esc(V.after.name)} (not counted in the ${V.total} minutes) <span class="src src-m" title="A note in the manual's daily timetable">Manual ${esc(V.after.ref)}</span></h4>
      <div class="tbl-wrap"><table class="tarl-tbl afterclass"><thead><tr><th>Component</th><th>Time</th><th>Teaching-learning activities</th><th>Teacher's role</th><th>Learners' participation</th></tr></thead><tbody><tr><td data-label="Component"><b>${esc(V.after.name)}</b></td><td data-label="Time" class="atm"><b>${V.after.minutes} minutes</b></td>
      <td data-label="Teaching-learning activities">${li(V.after.rows.map((r) => `<b>${esc(r.activity)}</b> ${grp(r.grouping)}<div class="tlm">TLM: ${esc(r.tlm)}</div>`))}</td><td data-label="Teacher's role">${li(V.after.rows.map((r) => esc(r.teacher)))}</td><td data-label="Learners' participation">${li(V.after.rows.map((r) => esc(r.learners)))}</td></tr></tbody></table></div>` : "";
    const revAfter = V.after ? `<p class="revafter">+ <b>${esc(V.after.name)}: ${V.after.minutes} min</b> at the end of the class (not in the total) <i>•</i> ${V.after.keywords.map(esc).join(" <i>•</i> ")}</p>` : "";
    const pre = p.preLesson ? `<p class="prelesson">${esc(p.preLesson)}</p>` : "";
    const revRows = comps.map((c) => `<tr><td data-label="Session"><b>${c.no}. ${esc(c.name)}</b></td><td data-label="Time" class="tm">${c.minutes} min</td><td data-label="Keywords / key activities">${c.keywords.map(esc).join(' <i>•</i> ')}</td></tr>`).join("");
    const revision = `<section class="revnote" id="revnote"><h3>QUICK REVISION NOTE – LESSON AT A GLANCE</h3><p class="small muted">${esc(meta.name.replace("TARL ", "").toUpperCase())} · Day ${p.day} · ${esc(p.title)}</p>
      <div class="tbl-wrap"><table class="tarl-tbl rev"><thead><tr><th>Session</th><th>Time</th><th>Keywords / key activities</th></tr></thead><tbody>${revRows}</tbody>
      <tfoot><tr class="totalrow"><td><b>TOTAL</b></td><td class="tm" data-rev-total><b>${V.total} min</b></td><td><b>Complete lesson: ${V.total} minutes</b></td></tr></tfoot></table></div>${revAfter}</section>`;
    const procs = p.procedures.map((pr) => `<div class="proc"><h4>${esc(pr.activity)} ${grp(pr.grouping)} ${src(pr)}</h4>
      <div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Step</th><th>Teacher's instructions</th><th>Learners' participation</th></tr></thead><tbody>${pr.steps.map((s, i) => `<tr><td data-label="Step">Step ${i + 1}</td><td data-label="Teacher's instructions">${esc(s.teacher)}</td><td data-label="Learners' participation">${esc(s.learners)}</td></tr>`).join("")}</tbody></table></div></div>`).join("");
    const lv = p.levelTasks.map((l) => `<div class="proc"><h4>${esc(l.activity)} ${src(l)}</h4><div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Level</th><th>Task</th></tr></thead><tbody>${meta.levels.map((n) => `<tr><td data-label="Level"><b>${esc(n)}</b></td><td data-label="Task">${esc(l.tasks[n] || "")}</td></tr>`).join("")}</tbody></table></div></div>`).join("");
    const org = p.organisation.map((o) => `<tr><td data-label="Grouping">${grp(o.grouping)}</td><td data-label="Activities today">${o.activities.map((a) => esc(a)).join("; ")}</td><td data-label="How to organise">${esc(o.how)}</td></tr>`).join("");
    return `<article class="tarl-plan ${tone}" id="plan" data-pday="${p.day}">
      <header class="tp-head"><div class="tp-badges"><span class="badge">${esc(p.programme)}</span><span class="badge">Day ${p.day} of 90</span><span class="badge ph${p.phase}">${esc(p.phaseLabel)}</span></div>
        <h2>Day ${p.day}: ${esc(p.title)}</h2><p class="muted">${esc(p.dayType)}</p></header>
      ${nav(p.day)}
      <section><h3>A. Lesson details</h3><div class="tbl-wrap"><table class="tarl-tbl kv"><tbody>
        <tr><th>Programme</th><td>${esc(p.programme)}</td></tr><tr><th>Day serial number</th><td>Day ${p.day} of 90</td></tr><tr><th>Programme phase</th><td>${esc(p.phaseLabel)}</td></tr>
        <tr><th>Subject</th><td>${esc(SUBJECT)}</td></tr><tr><th>Main learning focus</th><td>${esc(p.focus)}</td></tr>
        <tr><th>Learning objectives</th><td>${list(p.objectives)}</td></tr>
        <tr><th>Overall lesson duration</th><td><b class="bigmin">${V.total} minutes</b> (${comps.map((c) => c.minutes).join(" + ")}), from the manual's daily timetable${V.after ? ", plus a " + V.after.minutes + "-minute daily reading session at the end of the class" : ""}</td></tr></tbody></table></div></section>
      <section><h3>B. Lesson plan: components and time allocation</h3>${timeBadge}${pre}<div class="tbl-wrap"><table class="tarl-tbl seq"><thead><tr><th>Sl. No.</th><th>Teaching component / session</th><th>Time allocation</th><th>Teaching-learning activities</th><th>Teacher's role</th><th>Learners' participation</th></tr></thead><tbody>${compRows}</tbody>
        <tfoot><tr class="totalrow"><td></td><td><b>TOTAL DURATION</b></td><td class="tm" data-main-total><b>${V.total} minutes</b></td><td colspan="3"><b>TOTAL DURATION = ${V.total} MINUTES</b></td></tr></tfoot></table></div>
        ${afterHTML}
        <p class="small muted">The time of each component is the manual's. The minutes shown for each activity inside a component are a suggested split that adds up to the component time.</p></section>
      <section><h3>C. Detailed activity procedures</h3>${procs}</section>
      <section><h3>Level-wise tasks</h3>${lv}</section>
      <section><h3>D. Grouping and classroom organisation</h3><div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Grouping</th><th>Activities today</th><th>How the teacher organises learners</th></tr></thead><tbody>${org}</tbody></table></div></section>
      <section class="two"><div><h3>E. Teaching-learning materials</h3>${list(p.materials)}</div><div><h3>F. Learning outcomes</h3>${list(p.outcomes)}</div></section>
      <section><h3>G. Teacher's observation / formative assessment</h3>${list(p.observation)}</section>
      <section><h3>Teacher's notes</h3>${list(p.teacherNotes)}</section>
      ${revision}
      <footer class="tp-foot small muted">Prepared from the TaRL Teacher Manual. <span class="src src-m">Manual</span> = described in the manual; <span class="src src-i">Interpretation</span> = professional decision where the manual is silent.</footer>
      ${nav(p.day)}
    </article>`;
  }

  /* ------------------------------------------------------------ checkpoint view ------------------------------------------------------------ */
  function sampleHTML(s) {
    if (kind === "literacy") {
      return `<div class="sample"><h4>Reading test sample ${s.n}</h4><p><b>Story:</b> ${esc(s.story)}</p><ol>${s.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ol><p><b>Paragraph 1:</b> ${esc(s.paras[0])}</p><p><b>Paragraph 2:</b> ${esc(s.paras[1])}</p></div>`;
    }
    return `<div class="sample"><h4>Math test sample ${s.n}: number recognition</h4><p><b>1-9 (ask any 5; at least 4 correct):</b> ${s.r19.join(", ")}</p><p><b>10-99 (ask any 5; at least 4 correct):</b> ${s.r1099.join(", ")}</p><p class="small muted">Subtraction and division problems: use the printed sample test in the manual.</p></div>`;
  }
  function cpHTML(k) {
    const c = CP[k], s = meta.samples.find((x) => x.n === c.sample);
    const next = k === "baseline" ? ["day", 1, "Start Day 1"] : k === "midline" ? ["day", 46, "Continue to Day 46"] : null;
    const prev = k === "midline" ? ["day", 45, "Day 45"] : k === "endline" ? ["day", 90, "Day 90"] : null;
    const b = (t) => t[0] === "day" ? `data-day="${t[1]}"` : "";
    return `<article class="tarl-plan ${tone} cp-view" id="plan">
      <header class="tp-head"><div class="tp-badges"><span class="badge">${esc(meta.name)}</span><span class="badge cpb">Assessment checkpoint</span></div><h2>${esc(c.name)}</h2><p class="muted">${esc(c.when)}. This is an assessment event, not a daily lesson.</p></header>
      <div class="tp-nav no-print">${prev ? `<button type="button" class="btn btn-ghost btn-sm" ${b(prev)}>← ${prev[2]}</button>` : ""}<button type="button" class="btn btn-ghost btn-sm" data-back>Back to day selection</button>${next ? `<button type="button" class="btn btn-primary btn-sm" ${b(next)}>${next[2]} →</button>` : ""}<span class="spacer"></span><button type="button" class="btn btn-soft btn-sm" data-print>🖨️ Print</button></div>
      <section><h3>Purpose</h3><p>${esc(c.purpose)}</p><p><b>Afterwards:</b> ${esc(c.afterwards)}</p></section>
      <section><h3>Assessment procedure (manual ${kind === "literacy" ? "p.4" : "p.23"})</h3><p class="small muted">Assess each learner individually. The manual gives one assessment tool; it is used at all three checkpoints (see the note below).</p>
        <div class="tbl-wrap"><table class="tarl-tbl"><thead><tr><th>Step</th><th>What to do</th></tr></thead><tbody>${meta.assessmentSteps.map((a) => `<tr><td data-label="Step"><b>${esc(a[0])}</b></td><td data-label="What to do">${esc(a[1])}</td></tr>`).join("")}</tbody></table></div>
        ${kind === "literacy" ? `<p><b>Letters (10):</b> ${esc(meta.toolLetters)}. <b>Words (10):</b> ${esc(meta.toolWords)}. Ask any 5; at least 4 must be correct.</p>` : ""}</section>
      <section><h3>Levels recorded</h3><p>${meta.levels.map((l) => `<span class="badge">${esc(l)}</span>`).join(" ")}</p></section>
      <section><h3>Sample test for this checkpoint (sample ${c.sample})</h3><p class="small muted">Which sample is used at which checkpoint is an interpretation: the manual provides four sample sets and does not assign them.</p>${sampleHTML(s)}
        <details class="no-print"><summary>Show the other sample tests</summary>${meta.samples.filter((x) => x.n !== c.sample).map(sampleHTML).join("")}</details></section>
      <section><h3>Notes on the manual</h3>${list(meta.gaps.slice(1, 2).concat(meta.gaps.slice(2, 3)))}</section></article>`;
  }

  /* ------------------------------------------------------------ routing ------------------------------------------------------------ */
  function show(html, scroll) {
    $("#result").innerHTML = html;
    if (scroll) $("#result").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function render(scroll) {
    const h = location.hash.replace("#", "");
    let m;
    if ((m = /^day-(\d+)$/.exec(h)) && +m[1] >= 1 && +m[1] <= 90) {
      cur = +m[1]; const p = days[cur - 1];
      $("#daySel").value = cur; store.set("tarl:" + kind + ":last", cur);
      $$(".dchip").forEach((c) => c.classList.toggle("on", +c.dataset.day === cur));
      document.title = "Day " + cur + " · " + meta.name + " · Skillyfai";
      show(planHTML(p), scroll);
      domTimeCheck();
    } else if (CP[h]) {
      cur = null; $$(".dchip").forEach((c) => c.classList.toggle("on", c.dataset.cp === h));
      document.title = CP[h].name + " · " + meta.name + " · Skillyfai";
      show(cpHTML(h), scroll);
    } else { cur = null; show(""); $$(".dchip").forEach((c) => c.classList.remove("on")); document.title = TITLE + " · Skillyfai"; }
  }
  // Rule 5: the total in the main table must equal the total in the Quick Revision Note (read back from the page itself)
  function domTimeCheck() {
    const num = (el) => (el ? parseInt(el.textContent, 10) : NaN);
    const mainSum = $$("#plan .seq tbody td.tm").reduce((a, c) => a + num(c), 0), revSum = $$("#revnote tbody td.tm").reduce((a, c) => a + num(c), 0);
    const mt = num($("#plan [data-main-total]")), rt = num($("#plan [data-rev-total]"));
    if (!(mainSum === mt && revSum === rt && mt === rt)) {
      const bar = document.createElement("div"); bar.className = "tcheck bad"; bar.textContent = "⚠ Time check failed: the main table total (" + mt + ") and the revision note total (" + rt + ") do not agree. Please report this day.";
      $("#plan .tp-head").after(bar);
    }
  }
  function go(hash) {
    if (location.hash === "#" + hash) render(true); else location.hash = hash;
  }
  window.addEventListener("hashchange", () => render(true));

  root.addEventListener("click", (e) => {
    const t = e.target;
    const d = t.closest("[data-day]"), c = t.closest("[data-cp]");
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
  const LIB = { jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", auto: "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js" };
  const loaded = {};
  const loadJs = (s) => loaded[s] || (loaded[s] = new Promise((res, rej) => { const e = document.createElement("script"); e.src = s; e.onload = res; e.onerror = () => { delete loaded[s]; rej(new Error("Could not load the PDF tool. Check the internet connection.")); }; document.head.append(e); }));
  const safe = (s) => String(s == null ? "" : s).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/…/g, "...").replace(/→/g, "->").replace(/←/g, "<-").replace(/[^\x00-\xFF]/g, "");
  async function makePDF(btn) {
    const p = cur ? days[cur - 1] : null; if (!p) { toast("Open a lesson plan first"); return; }
    const old = btn.textContent; btn.disabled = true; btn.textContent = "Making PDF…";
    try {
      await loadJs(LIB.jspdf); await loadJs(LIB.auto);
      const { jsPDF } = window.jspdf, doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" }), M = 10, W = 297 - 2 * M;
      let y = M;
      doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.text(safe(p.programme + " - Day " + p.day + " of 90"), M, y + 5);
      doc.setFontSize(11); doc.text(safe(p.title), M, y + 11);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(90); doc.text(safe(p.phaseLabel + " | " + p.dayType + " | " + p.duration + " minutes"), M, y + 16); doc.setTextColor(20);
      y += 20;
      const base = { theme: "grid", margin: { left: M, right: M, bottom: 12 }, styles: { fontSize: 7.6, cellPadding: 1.6, valign: "top", lineColor: [130, 130, 130], lineWidth: 0.15, textColor: [20, 20, 20], overflow: "linebreak" }, headStyles: { fillColor: [60, 62, 120], textColor: 255, fontStyle: "bold" }, rowPageBreak: "avoid" };
      const head = (t) => { let fy = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y; if (fy > 183) { doc.addPage(); fy = M + 4; } doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(20); doc.text(safe(t), M, fy); return fy + 2; };
      const tbl = (t, o) => { const sy = head(t); doc.autoTable(Object.assign({}, base, { startY: sy }, o)); };
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text("A. Lesson details", M, y);
      doc.autoTable(Object.assign({}, base, { startY: y + 2, body: [["Programme", p.programme], ["Day serial number", "Day " + p.day + " of 90"], ["Programme phase", p.phaseLabel], ["Subject", SUBJECT], ["Main learning focus", p.focus], ["Learning objectives", p.objectives.map((x) => "- " + x).join("\n")], ["Duration", p.duration + " minutes"]].map((r) => r.map(safe)), columnStyles: { 0: { cellWidth: 42, fontStyle: "bold", fillColor: [240, 242, 250] } } }));
      const V = validate(p);
      tbl("B. Lesson plan: components and time allocation", { head: [["No.", "Teaching component / session", "Time", "Teaching-learning activities", "Teacher's role", "Learners' participation"]],
        body: V.parts.map((c) => [c.no, c.name + " [Manual " + c.ref + "]", c.minutes + " min", c.rows.map((r) => "- " + r.activity + " (" + r.grouping + ", " + r.minutes + " min) TLM: " + r.tlm).join("\n"), c.rows.map((r) => "- " + r.teacher).join("\n"), c.rows.map((r) => "- " + r.learners).join("\n")].map(safe)),
        foot: [["", "TOTAL DURATION", V.total + " min", "TOTAL DURATION = " + V.total + " MINUTES", "", ""]], showFoot: "lastPage", footStyles: { fillColor: [235, 238, 250], textColor: 20, fontStyle: "bold" },
        columnStyles: { 0: { cellWidth: 9 }, 1: { cellWidth: 32 }, 2: { cellWidth: 14 }, 3: { cellWidth: 70 }, 4: { cellWidth: 78 } } });
      if (V.after) tbl("After the class: " + V.after.name + " - " + V.after.minutes + " minutes (not counted in the " + V.total + " minutes) [Manual " + V.after.ref + "]", { head: [["Activity", "Teacher's role", "Learners' participation"]], body: V.after.rows.map((r) => [r.activity + " (" + r.grouping + ") TLM: " + r.tlm, r.teacher, r.learners].map(safe)), columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 100 } } });
      p.procedures.forEach((pr) => tbl("C. Detailed procedure: " + pr.activity + " (" + pr.grouping + ")", { head: [["Step", "Teacher's instructions", "Learners' participation"]], body: pr.steps.map((s, i) => ["Step " + (i + 1), s.teacher, s.learners].map(safe)), columnStyles: { 0: { cellWidth: 16 }, 1: { cellWidth: 150 } } }));
      p.levelTasks.forEach((l) => tbl("Level-wise tasks: " + l.activity, { head: [["Level", "Task"]], body: meta.levels.map((n) => [n, l.tasks[n] || ""].map(safe)), columnStyles: { 0: { cellWidth: 24, fontStyle: "bold" } } }));
      tbl("D. Grouping and classroom organisation", { head: [["Grouping", "Activities today", "How the teacher organises learners"]], body: p.organisation.map((o) => [o.grouping, o.activities.join("; "), o.how].map(safe)), columnStyles: { 0: { cellWidth: 36 }, 1: { cellWidth: 90 } } });
      tbl("E. Teaching-learning materials", { body: [[p.materials.join("; ")].map(safe)] });
      tbl("F. Learning outcomes", { body: p.outcomes.map((x) => ["- " + x].map(safe)) });
      tbl("G. Teacher's observation / formative assessment", { body: p.observation.map((x) => ["- " + x].map(safe)) });
      tbl("Teacher's notes", { body: p.teacherNotes.map((x) => ["- " + x].map(safe)) });
      tbl("QUICK REVISION NOTE - LESSON AT A GLANCE", { head: [["Session", "Time", "Keywords / key activities"]], body: V.parts.map((c) => [c.no + ". " + c.name, c.minutes + " min", c.keywords.join("  *  ")].map(safe)),
        foot: [["TOTAL", V.total + " min", "Complete lesson: " + V.total + " minutes"]], showFoot: "lastPage", footStyles: { fillColor: [235, 238, 250], textColor: 20, fontStyle: "bold" }, columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 20 } } });
      if (V.after) { doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(20); doc.text(safe("+ " + V.after.name + ": " + V.after.minutes + " min at the end of the class (not in the total): " + V.after.keywords.join("  *  ")), M, doc.lastAutoTable.finalY + 6, { maxWidth: 277 }); }
      const n = doc.internal.getNumberOfPages();
      for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(120); doc.text(safe("Skillyfai | " + p.programme + " | Day " + p.day + " | prepared from the TaRL Teacher Manual"), M, 205); doc.text("Page " + i + " of " + n, 297 - M, 205, { align: "right" }); }
      doc.save(p.programme.replace(/\s+/g, "-") + "-Day-" + String(p.day).padStart(2, "0") + ".pdf");
      toast("PDF downloaded");
    } catch (err) { console.error(err); toast(err.message || "Could not make the PDF"); }
    finally { btn.disabled = false; btn.textContent = old; }
  }

  shell();
  render(false);
})();
