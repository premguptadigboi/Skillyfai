/* Writing Practice – ACTIVITY GENERATOR (template engine) and PDF helpers.
   The generator only uses the chosen category's own activity bank (plus the teacher's custom activities for it),
   so Gross Motor never produces alphabet worksheets. Each result has the 14 required fields.
   Future AI: replace WP.gen.generate with a server call that returns the same activity objects. */
(function () {
  "use strict";
  const { esc } = SK;
  const TYPES = WP.TYPES;
  const CLASS_FACTOR = [0.7, 0.8, 1, 1, 1.15, 1.3], DIFF_FACTOR = { Easy: 0.8, Medium: 1, Difficult: 1.25 };
  const SUITS = { beginner: "Pre-primary (3–5 years) and Class 1", intermediate: "Classes 1–3 (5–8 years)", advanced: "Classes 3–8 (8–13 years)" };

  /* turn an activity into a different type, staying inside the same category */
  function convert(a, cat, type) {
    if (type === "G") return { t: "Team game: " + a.t, sub: a.sub, types: "G", mins: a.mins + 5, mat: a.mat + "; a score board", conv: true,
      steps: ["Divide the class into 2–4 small teams.", ...a.steps.slice(0, 2), "Each child takes a turn; the team earns a point for each careful, complete turn (not for speed).", "End with a quick ‘show and tell’ of the best attempts."], kid: a.kid + " Help your team!", check: a.check, out: a.out, obj: a.obj };
    if (type === "P") return { t: a.t + " (hands-on version)", sub: a.sub, types: "P", mins: a.mins, mat: a.mat + "; paper, crayons or real objects", conv: true,
      steps: ["Do this with real objects, paper or a slate instead of a screen.", ...a.steps], kid: a.kid, check: a.check, out: a.out, obj: a.obj };
    return null;
  }
  function wsItems(cat) { return (cat.ws || []).map((id) => WP.WS && WP.WS[id] ? { t: "Worksheet: " + WP.WS[id].name, sub: "", types: "W", mins: 15, mat: "Printed worksheet (Worksheets tab), pencils or crayons", conv: true, ws: id,
    steps: [`Open the Worksheets tab, choose “${WP.WS[id].name}”, set the number of exercises and print one copy per child.`, "Read the instructions aloud and show the first example.", "Children work on their own; walk around and support.", "Check together and note who needs more practice."], kid: "Look at the first one. Do the rest carefully.", check: cat.assess.slice(0, 3), out: cat.outcome } : null).filter(Boolean); }
  function digitalItems(cat) { return (cat.practice || []).filter((p) => p.w !== "html").map((p) => ({ t: "On-screen practice: " + p.t, sub: "", types: "D", mins: 8, mat: "Tablet, computer or the class screen", conv: true,
    steps: [`Open Writing Practice → ${cat.name} → Practice, and choose “${p.t}”.`, "Show the child how to use it once.", "Let the child practise; results are saved to their progress.", "Look at the score together and praise effort."], kid: "Try it yourself. Press Check when you finish!", check: cat.assess.slice(0, 3), out: cat.outcome })); }

  /* all candidates for a category and type */
  function pool(cat, type, sub) {
    const own = cat.acts.concat(WP.data.custom(cat.id).map((c) => ({ t: c.t, sub: c.sub || "", types: c.types || "P", mins: +c.mins || 10, mat: c.mat || "", steps: c.steps || [], kid: c.kid || "", check: c.check && c.check.length ? c.check : cat.assess.slice(0, 3), out: c.out || cat.outcome, obj: c.obj || null, custom: true })));
    const bySub = (a) => !sub || sub === "all" || !a.sub || a.sub === sub;
    if (!type || type === "any") return own.filter(bySub);
    const native = own.filter((a) => a.types.includes(type) && bySub(a));
    let extra = [];
    if (type === "W") extra = wsItems(cat); else if (type === "D") extra = digitalItems(cat); else extra = own.filter((a) => !a.types.includes(type) && bySub(a)).map((a) => convert(a, cat, type)).filter(Boolean);
    const seen = new Set(native.map((a) => a.t));
    return native.concat(extra.filter((a) => !seen.has(a.t)));
  }

  function expand(a, cat, o) {
    const ci = Math.max(0, WP.CLASSES.indexOf(o.cls)), diff = o.diff || "Medium", type = o.type && o.type !== "any" ? o.type : a.types[0];
    const mins = Math.max(3, Math.round(a.mins * DIFF_FACTOR[diff] * CLASS_FACTOR[ci]));
    const prep = { P: `Set out the materials before the lesson: ${a.mat}. Clear a safe space.`, D: "Charge the tablet or connect the class screen; open the practice on the Writing Practice page.", W: "Print one worksheet per child and keep pencils or crayons ready.", G: `Arrange the room for teams. Prepare: ${a.mat}.` }[type] || "Gather the materials.";
    const steps = a.steps.slice();
    steps.push(`${diff}: ${cat.diff[diff]}`);
    if (ci <= 1) steps.push("For young children: show every step first and keep turns short.");
    if (ci >= 4) steps.push("Older children: ask them to explain or record what they did.");
    return {
      key: [cat.id, a.t, type, diff].join("|"), level: cat.level, cat: cat.id, catName: cat.name, type, custom: !!a.custom,
      title: a.t, objective: a.obj || cat.objective, skills: cat.skills.slice(0, 4).join(", "),
      suitability: o.cls ? o.cls : SUITS[cat.level], materials: a.mat, preparation: prep, procedure: steps,
      teacher: cat.teacher.slice(0, 3), child: a.kid, duration: mins + " minutes", difficulty: diff,
      assessment: a.check.concat(diff === "Difficult" ? ["Completes it without prompts"] : []), outcome: a.out, support: cat.support
    };
  }

  WP.gen = {
    pool,
    /* o: {cat, sub, cls, diff, count, type, seed, skip:[keys]} → {items, total, note} */
    generate(o) {
      const cat = WP.cats[o.cat]; if (!cat) throw new Error("Choose a category first.");
      const all = pool(cat, o.type, o.sub), r = WP.rand((o.seed || 1) * 7919 + all.length);
      const nat = WP.shuffleR(all.filter((a) => !a.conv), r), conv = WP.shuffleR(all.filter((a) => a.conv), r);
      const skip = new Set(o.skip || []), list = nat.concat(conv).map((a) => expand(a, cat, o)).filter((x) => !skip.has(x.key));
      const items = list.slice(0, o.count || 3);
      let note = "";
      if (!all.length) note = `There are no ${TYPES[o.type] ? TYPES[o.type].toLowerCase() : ""} activities in this subcategory. Choose “All subcategories” or another type.`;
      else if (!items.length) note = "You have seen every matching activity for these choices. Press Regenerate to start again, or change the choices.";
      else if (items.length < (o.count || 3)) note = `Only ${items.length} more matching activit${items.length === 1 ? "y" : "ies"} for these choices.`;
      return { items, total: all.length, note };
    },
    html(a, opts = {}) {
      const L = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`, list = (x) => `<ol>${x.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`, ul = (x) => `<ul>${x.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
      return `<article class="wp-act" data-key="${esc(a.key)}"><header><h3>${esc(a.title)}</h3><div class="wp-act-tags"><span class="badge">${esc(WP.LEVELS[a.level].name)}</span><span class="badge">${esc(a.catName)}</span><span class="badge badge-ready">${esc(TYPES[a.type] || "")}</span><span class="badge">${esc(a.difficulty)}</span><span class="badge">⏱ ${esc(a.duration)}</span>${a.custom ? '<span class="badge badge-beta">My activity</span>' : ""}</div></header>
        <table class="wp-acttable">${L("1. Activity title", esc(a.title))}${L("2. Learning objective", esc(a.objective))}${L("3. Skills targeted", esc(a.skills))}${L("4. Age / class suitability", esc(a.suitability))}${L("5. Materials required", esc(a.materials))}${L("6. Preparation", esc(a.preparation))}${L("7. Step-by-step procedure", list(a.procedure))}${L("8. Teacher instructions", ul(a.teacher))}${L("9. Child instructions", `<b class="wp-kidline">“${esc(a.child)}”</b>`)}${L("10. Suggested duration", esc(a.duration))}${L("11. Difficulty level", esc(a.difficulty))}${L("12. Assessment criteria", ul(a.assessment))}${L("13. Expected learning outcome", esc(a.outcome))}${L("14. Support for children who need more help", ul(a.support))}</table>
        ${opts.actions === false ? "" : `<div class="wp-act-actions no-print">${opts.saved ? `<button type="button" class="btn btn-ghost btn-sm" data-unsave="${esc(a.key)}">✕ Remove from library</button>` : `<button type="button" class="btn btn-soft btn-sm" data-save="${esc(a.key)}">💾 Save activity</button>`}</div>`}</article>`;
    },
    text(a) { return [a.title, "Objective: " + a.objective, "Skills: " + a.skills, "Suitable for: " + a.suitability, "Materials: " + a.materials, "Preparation: " + a.preparation, "Procedure:", ...a.procedure.map((s, i) => `  ${i + 1}. ${s}`), "Teacher: " + a.teacher.join(" "), "Child: " + a.child, "Duration: " + a.duration, "Difficulty: " + a.difficulty, "Assessment: " + a.assessment.join("; "), "Outcome: " + a.outcome, "Support: " + a.support.join(" ")].join("\n"); }
  };

  /* ------------------------------------------------------------------ PDF ------------------------------------------------------------------ */
  const LIB = { jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", auto: "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js", h2c: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" };
  const loaded = {};
  const script = (src) => loaded[src] || (loaded[src] = new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => { delete loaded[src]; rej(new Error("Could not load the PDF tool. Check the internet connection.")); }; document.head.append(s); }));
  const safe = (s) => String(s).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/…/g, "...").replace(/→/g, "->").replace(/[^\x00-\xFF]/g, "");
  WP.pdf = {
    async activities(acts, title) {
      await script(LIB.jspdf); await script(LIB.auto);
      const { jsPDF } = window.jspdf, doc = new jsPDF({ unit: "mm", format: "a4" }), M = 14;
      acts.forEach((a, i) => {
        if (i) doc.addPage();
        doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(safe(a.title), M, M + 4, { maxWidth: 182 });
        doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90); doc.text(safe(`${WP.LEVELS[a.level].name} · ${a.catName} · ${TYPES[a.type] || ""} · ${a.difficulty} · ${a.duration}`), M, M + 11); doc.setTextColor(20);
        const rows = [["Learning objective", a.objective], ["Skills targeted", a.skills], ["Age / class suitability", a.suitability], ["Materials required", a.materials], ["Preparation", a.preparation], ["Step-by-step procedure", a.procedure.map((s, k) => `${k + 1}. ${s}`).join("\n")], ["Teacher instructions", a.teacher.map((s) => "- " + s).join("\n")], ["Child instructions", '"' + a.child + '"'], ["Suggested duration", a.duration], ["Difficulty level", a.difficulty], ["Assessment criteria", a.assessment.map((s) => "- " + s).join("\n")], ["Expected learning outcome", a.outcome], ["Support for children who need more help", a.support.map((s) => "- " + s).join("\n")]];
        doc.autoTable({ startY: M + 15, body: rows.map((r) => r.map(safe)), theme: "grid", margin: { left: M, right: M }, styles: { fontSize: 9.5, cellPadding: 2.2, valign: "top", lineColor: [120, 120, 120], lineWidth: 0.2, textColor: [20, 20, 20] }, columnStyles: { 0: { cellWidth: 48, fontStyle: "bold", fillColor: [240, 242, 250] } }, rowPageBreak: "avoid" });
      });
      const n = doc.internal.getNumberOfPages(); for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(130); doc.text(safe(title || "Skillyfai Writing Practice"), M, 290); doc.text(`Page ${i} of ${n}`, 196, 290, { align: "right" }); }
      doc.save(safe((title || "activities").replace(/[^\w\- ]+/g, "")).trim().replace(/\s+/g, "-") + ".pdf");
    },
    /* render A4 page elements to a PDF (used for worksheets) */
    async pages(nodes, landscape, name) {
      await script(LIB.jspdf); await script(LIB.h2c);
      const { jsPDF } = window.jspdf, doc = new jsPDF({ unit: "mm", format: "a4", orientation: landscape ? "landscape" : "portrait" }), Wmm = landscape ? 297 : 210, Hmm = landscape ? 210 : 297;
      const host = document.createElement("div"); host.style.cssText = "position:fixed;left:-10000px;top:0;"; document.body.append(host);
      try {
        for (let i = 0; i < nodes.length; i++) {
          const c = nodes[i].cloneNode(true); c.style.transform = "none"; host.innerHTML = ""; host.append(c);
          const canvas = await window.html2canvas(c, { scale: 2, backgroundColor: "#ffffff", logging: false });
          if (i) doc.addPage(); doc.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, Wmm, Hmm);
        }
      } finally { host.remove(); }
      doc.save((name || "worksheet").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + ".pdf");
    }
  };
})();
