/* Skillyfai Lesson Plan Generator: output.
   html(plan)  → the nine tabulated sections (used on screen and for printing)
   copy(el)    → copies the plan as a formatted table (pastes into Word / Google Docs) plus plain text
   pdf(el)     → builds an A4 PDF from the tables on screen (so cell edits are kept), using jsPDF + AutoTable,
                 loaded from cdnjs only when the teacher presses Download PDF. */
(function () {
  "use strict";
  const { esc, toast } = SK;

  const cell = (lines) => Array.isArray(lines) ? (lines.length > 1 ? `<ul>${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : esc(lines[0] || "")) : esc(lines);
  /* w = column widths in %, used identically on screen, in print and in the PDF */
  function table(head, rows, w, wide) {
    return `<div class="lp-scroll"><table class="lp-t${wide ? " wide" : ""}" data-w="${w.join(",")}">
      <colgroup>${w.map((x) => `<col style="width:${x}%">`).join("")}</colgroup>
      <thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td${c && c.cls ? ` class="${c.cls}"` : ""}>${c && c.html != null ? c.html : cell(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  const sec = (n, title, min, body) => `<section class="lp-sec"><h3>${n}. ${esc(title)}${min ? ` <small>(${min} min)</small>` : ""}</h3>${body}</section>`;
  const num = (i) => ({ html: String(i + 1), cls: "center-num" });

  function html(p) {
    return `<h2>${esc(p.title)}</h2>` +
      sec(1, "Lesson Details", 0, table(["Particulars", "Details"], p.details.map(([k, v]) => [{ html: `<b>${esc(k)}</b>` }, v]), [32, 68])) +
      sec(2, "General Objectives", 0, table(["Sl. No.", "General Objectives"], p.general.map((g, i) => [num(i), g]), [12, 88])) +
      sec(3, "Specific Objectives", 0, table(["Skills", "Learning Objectives"], p.specific.map(([s, o]) => [{ html: `<b>${esc(s)}</b>` }, o]), [24, 76])) +
      sec(4, "Teaching Aids", 0, table(["Sl. No.", "Teaching Aids"], p.aids.map((a, i) => [num(i), a]), [12, 88])) +
      sec(5, "Introduction", p.intro.min, table(["Teacher's Activity", "Pupils' Activity"], [[p.intro.teacher, p.intro.pupils]], [60, 40])) +
      sec(6, "Announcement of the Topic", p.announce.min, table(["Teacher's Activity", "Pupils' Activity"], [[p.announce.teacher, p.announce.pupils]], [60, 40])) +
      sec(7, "Presentation of the Lesson", p.presentation.reduce((s, x) => s + x.min, 0),
        table(["Steps", "Teaching Points", "Teacher's Activity", "Pupils' Activity", "Learning Outcomes"],
          p.presentation.map((s) => [{ html: `<b>${esc(s.step)}</b><span class="min">${s.min} min</span>` }, s.points, s.teacher, s.pupils, s.outcomes]), [15, 16, 27, 21, 21], true)) +
      sec(8, "Conclusion", p.conclusion.min, table(["Teacher's Activity", "Pupils' Activity"], [[p.conclusion.teacher, p.conclusion.pupils]], [60, 40])) +
      sec(9, "Completion", p.completion.min, table(["Teacher's Activity"], [[p.completion.teacher]], [100]));
  }

  function makeEditable(root) {
    root.querySelectorAll(".lp-t td").forEach((td) => { td.contentEditable = "true"; td.spellcheck = true; });
    root.querySelector("h2").contentEditable = "true";
  }

  /* ---------- read the (possibly edited) document back into plain data ---------- */
  function cellText(td, bullet) {
    const lis = td.querySelectorAll("li");
    if (lis.length) return Array.from(lis).map((li) => bullet + li.innerText.trim()).filter((s) => s.trim() !== bullet.trim()).join("\n");
    const minEl = td.querySelector(".min");
    if (minEl) { const c = td.cloneNode(true); const m = c.querySelector(".min"); const mt = m.innerText.trim(); m.remove(); return c.innerText.trim() + "\n" + mt; }
    return td.innerText.trim();
  }
  function readDoc(root, bullet = "• ") {
    return {
      title: root.querySelector("h2").innerText.trim(),
      sections: Array.from(root.querySelectorAll(".lp-sec")).map((s) => {
        const t = s.querySelector("table");
        return {
          title: s.querySelector("h3").innerText.replace(/\s+/g, " ").trim(),
          head: Array.from(t.querySelectorAll("thead th")).map((th) => th.innerText.trim()),
          rows: Array.from(t.querySelectorAll("tbody tr")).map((tr) => Array.from(tr.children).map((td) => cellText(td, bullet))),
          widths: t.dataset.w.split(",").map(Number)
        };
      })
    };
  }

  /* ---------- copy ---------- */
  async function copy(root) {
    const d = readDoc(root);
    const B = "border:1px solid #666;padding:6px 8px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:11pt;";
    const htmlStr = `<div style="font-family:Arial,sans-serif"><h2 style="text-align:center;font-size:16pt">${esc(d.title)}</h2>` + d.sections.map((s) =>
      `<h3 style="font-size:12pt;margin:14px 0 4px">${esc(s.title)}</h3><table style="border-collapse:collapse;width:100%">` +
      `<tr>${s.head.map((h, i) => `<th style="${B}background:#eceefa;width:${s.widths[i]}%">${esc(h)}</th>`).join("")}</tr>` +
      s.rows.map((r) => `<tr>${r.map((c) => `<td style="${B}">${esc(c).replace(/\n/g, "<br>")}</td>`).join("")}</tr>`).join("") + "</table>").join("") + "</div>";
    const text = d.title + "\n\n" + d.sections.map((s) => s.title + "\n" + [s.head].concat(s.rows).map((r) => r.map((c) => c.replace(/\n/g, "; ")).join(" | ")).join("\n")).join("\n\n");
    try {
      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([htmlStr], { type: "text/html" }), "text/plain": new Blob([text], { type: "text/plain" }) })]);
        toast("Lesson plan copied. Paste it into Word or Google Docs to keep the tables.");
      } else { await navigator.clipboard.writeText(text); toast("Lesson plan copied as text."); }
    } catch (e) { SK.copyText(text); }
  }

  /* ---------- PDF ---------- */
  const LIBS = ["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"];
  let libsP = null;
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load " + src)); document.head.append(s); });
  const loadLibs = () => (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API.autoTable) ? Promise.resolve() : libsP || (libsP =LIBS.reduce((p, u) => p.then(() => loadScript(u)), Promise.resolve()).catch((e) => { libsP = null; throw e; }));
  /* The built-in PDF fonts only cover Western characters, so map typographic symbols to safe ones */
  const safe = (s) => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/−/g, "-").replace(/→/g, "->").replace(/…/g, "...").replace(/•/g, "-");
  const unsupported = (s) => /[^\u0000-ÿ]/.test(s);

  async function pdf(root, plan) {
    const d = readDoc(root, "• ");
    const all = safe(JSON.stringify(d));
    if (unsupported(all)) {
      toast("This plan contains letters (for example Assamese or Hindi) that the PDF font cannot show. In the print window, choose “Save as PDF”.");
      setTimeout(() => window.print(), 900); return;
    }
    await loadLibs();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const M = 14, W = 210 - M * 2;
    doc.setFont("helvetica", "bold"); doc.setFontSize(15);
    doc.text(safe(d.title), 105, M + 4, { align: "center" });
    let y = M + 12;
    const opts = (s, startY, body) => {
      const cs = {}; s.widths.forEach((w, i) => (cs[i] = { cellWidth: (W * w) / 100 }));
      if (s.head[0] === "Particulars" || s.head[0] === "Skills" || s.head[0] === "Steps") cs[0].fontStyle = "bold";
      if (s.head[0] === "Sl. No.") cs[0].halign = "center";
      return {
        startY, head: [s.head.map(safe)], body: body.map((r) => r.map(safe)),
        theme: "grid", margin: { left: M, right: M, top: M + 4, bottom: M + 6 }, columnStyles: cs,
        styles: { font: "helvetica", fontSize: 9.5, cellPadding: 2.2, valign: "top", lineColor: [100, 100, 100], lineWidth: 0.2, textColor: [20, 20, 20], overflow: "linebreak" },
        headStyles: { fillColor: [236, 238, 250], textColor: [20, 20, 20], fontStyle: "bold" },
        rowPageBreak: "avoid", showHead: "everyPage"
      };
    };
    /* Height of the heading row + first body row, measured on a scratch document, so a section title
       and its table header are never left alone at the bottom of a page */
    const firstRowH = (s) => { const t = new jsPDF({ unit: "mm", format: "a4" }); t.autoTable(opts(s, 20, s.rows.slice(0, 1))); return t.lastAutoTable.finalY - 20; };
    const bottom = 297 - (M + 6);
    d.sections.forEach((s) => {
      if (y + 2 + firstRowH(s) > bottom) { doc.addPage(); y = M + 4; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(11.5); doc.setTextColor(46, 46, 138);
      doc.text(safe(s.title), M, y); doc.setTextColor(20, 20, 20);
      doc.autoTable(opts(s, y + 2, s.rows));
      y = doc.lastAutoTable.finalY + 8;
    });
    const n = doc.internal.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i); doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120);
      doc.text(safe(`${d.title} · ${plan.details[4][1]}`), M, 297 - 8);
      doc.text(`Page ${i} of ${n}`, 210 - M, 297 - 8, { align: "right" });
    }
    const name = ("Lesson-Plan-" + plan.details[4][1] + "-" + plan.details[3][1]).replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-");
    doc.save(name + ".pdf");
    toast("PDF downloaded");
  }

  window.SKLessonOutput = { html, makeEditable, copy, pdf, readDoc };
})();
