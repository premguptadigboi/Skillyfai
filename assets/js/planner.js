/* Skillyfai planner engine.
   Turns a field list + render function into a complete tool: form with suggestion chips,
   live preview, autosaved draft, saved library, copy / Word / print.

   SKPlanner({
     mount: "#planner", key: "lesson-plans", noun: "plan",
     fields: [{ id, label, type: text|textarea|select|number|checks|lines, options, placeholder, hint, suggest, value, half }],
     example: { ...values }, title: (v) => "…", render: (v, H) => "html", actions: [{ label, run(ctx) }]
   }) */
(function () {
  "use strict";
  const { $, $$, esc, h, store, toast, copyText, downloadDoc, printEl, uid } = SK;

  const H = {
    esc,
    list: (a, tag = "ul") => (a && a.length ? `<${tag}>${a.map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>` : ""),
    meta: (pairs) => `<div class="meta">${pairs.filter((p) => p[1]).map(([k, v]) => `<div><b>${esc(k)}</b>${esc(v)}</div>`).join("")}</div>`,
    or: (v, d) => (v && (Array.isArray(v) ? v.length : String(v).trim()) ? v : d),
    lines: (s) => String(s || "").split(/\n+/).map((x) => x.trim()).filter(Boolean),
    cap: (s) => String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1)
  };

  /* pre = id prefix, so several planners can share one page without clashing ids */
  function fieldHTML(f, pre) {
    const id = pre + f.id;
    const sug = f.suggest ? `<div class="suggest" data-for="${f.id}">${f.suggest.map((s) => `<button type="button">${esc(s)}</button>`).join("")}</div>` : "";
    const hint = f.hint ? `<span class="hint">${esc(f.hint)}</span>` : "";
    let ctl;
    switch (f.type) {
      case "textarea": case "lines":
        ctl = `<textarea class="textarea" id="${id}" name="${f.id}" rows="${f.rows || 3}" placeholder="${esc(f.placeholder || "")}"></textarea>`; break;
      case "select":
        ctl = `<select class="select" id="${id}" name="${f.id}">${f.placeholder ? `<option value="">${esc(f.placeholder)}</option>` : ""}${f.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`; break;
      case "checks":
        return `<fieldset class="field" style="border:0;padding:0;margin:0 0 14px"><legend class="label" style="margin-bottom:6px">${esc(f.label)}</legend>${hint}
          <div class="check-grid">${f.options.map((o) => `<label class="check"><input type="checkbox" name="${f.id}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}</div></fieldset>`;
      case "number":
        ctl = `<input class="input" type="number" id="${id}" name="${f.id}" min="${f.min ?? 1}" max="${f.max ?? 999}" placeholder="${esc(f.placeholder || "")}">`; break;
      default:
        ctl = `<input class="input" type="text" id="${id}" name="${f.id}" placeholder="${esc(f.placeholder || "")}" autocomplete="off">`;
    }
    return `<div class="field"><label for="${id}">${esc(f.label)}</label>${ctl}${hint}${sug}</div>`;
  }

  function layoutFields(fields, pre) {
    let out = "", buf = [];
    const flush = () => { if (buf.length) { out += buf.length > 1 ? `<div class="grid-2">${buf.join("")}</div>` : buf[0]; buf = []; } };
    fields.forEach((f) => {
      if (f.section) { flush(); out += `<h3 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--faint);margin:20px 0 10px">${esc(f.section)}</h3>`; return; }
      if (f.half) { buf.push(fieldHTML(f, pre)); if (buf.length === 2) flush(); } else { flush(); out += fieldHTML(f, pre); }
    });
    flush();
    return out;
  }

  window.SKPlanner = function (cfg) {
    const root = $(cfg.mount || "#planner");
    const noun = cfg.noun || "plan";
    const fields = cfg.fields.filter((f) => !f.section);
    root.className = "wrap split";
    root.innerHTML = `
      <div class="sticky no-print">
        <div class="panel">
          <div class="panel-head"><h2>Details</h2>
            <div class="toolbar">${cfg.example ? '<button class="btn btn-soft btn-sm" type="button" data-act="example">Fill example</button>' : ""}
            <button class="btn btn-ghost btn-sm" type="button" data-act="clear">Clear</button></div></div>
          <form autocomplete="off" onsubmit="return false">${layoutFields(cfg.fields, cfg.idPrefix || "f_")}
            ${cfg.generateLabel ? `<button type="button" class="btn btn-primary btn-lg" data-act="generate" style="width:100%;margin-top:6px">${cfg.generateLabel}</button>` : ""}</form>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>My saved ${noun}s</h2><span class="badge" data-count>0</span></div>
          <ul class="saved" data-saved></ul>
          <p class="small muted" style="margin:8px 0 0">Saved in this browser only.</p>
        </div>
      </div>
      <div class="panel" data-out>
        <div class="panel-head no-print"><h2>Preview</h2>
          <div class="toolbar">
            ${(cfg.actions || []).map((a, i) => `<button class="btn btn-ghost btn-sm" type="button" data-x="${i}">${a.label}</button>`).join("")}
            <button class="btn btn-primary btn-sm" type="button" data-act="save">Save</button>
            <button class="btn btn-ghost btn-sm" type="button" data-act="copy">Copy</button>
            <button class="btn btn-ghost btn-sm" type="button" data-act="word">Word</button>
            <button class="btn btn-ghost btn-sm" type="button" data-act="print">Print</button>
          </div></div>
        <div class="doc" data-doc></div>
      </div>`;
    const form = $("form", root), doc = $("[data-doc]", root), out = $("[data-out]", root);
    let currentId = null;

    function read() {
      const v = {};
      fields.forEach((f) => {
        if (f.type === "checks") v[f.id] = $$(`input[name="${f.id}"]:checked`, form).map((x) => x.value);
        else { const el = form.elements[f.id]; const val = el ? el.value : ""; v[f.id] = f.type === "lines" ? H.lines(val) : f.type === "number" ? (val === "" ? "" : +val) : val.trim(); }
      });
      return v;
    }
    function write(v) {
      fields.forEach((f) => {
        const val = v[f.id] ?? f.value ?? (f.type === "checks" ? [] : "");
        if (f.type === "checks") $$(`input[name="${f.id}"]`, form).forEach((x) => (x.checked = val.includes(x.value)));
        else if (form.elements[f.id]) form.elements[f.id].value = Array.isArray(val) ? val.join("\n") : val;
      });
    }
    const ctx = { read, write, render: () => render(), H, root, doc };

    let tm;
    function render() {
      const v = read();
      const hasAny = fields.some((f) => (Array.isArray(v[f.id]) ? v[f.id].length : String(v[f.id]).trim()) && !f.ignoreEmpty);
      doc.innerHTML = cfg.render(v, H, ctx) || "";
      if (!hasAny && cfg.emptyText) doc.innerHTML = `<div class="empty"><div class="e-icon">${cfg.emptyIcon || "📝"}</div><p>${cfg.emptyText}</p></div>`;
      store.set(cfg.key + ":draft", v);
    }
    /* With cfg.generateLabel the preview only changes when the Generate button is pressed; typing just keeps the draft */
    const manual = !!cfg.generateLabel;
    const keepDraft = () => store.set(cfg.key + ":draft", read());
    form.addEventListener("input", () => { if (manual) return keepDraft(); clearTimeout(tm); tm = setTimeout(render, 180); });
    form.addEventListener("change", () => (manual ? keepDraft() : render()));
    form.addEventListener("click", (e) => {
      const b = e.target.closest(".suggest button"); if (!b) return;
      const id = b.parentElement.dataset.for, el = form.elements[id], f = fields.find((x) => x.id === id);
      if (f.type === "lines" || f.type === "textarea") el.value = (el.value.trim() ? el.value.replace(/\s+$/, "") + "\n" : "") + b.textContent;
      else el.value = b.textContent;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Saved library
    const savedKey = cfg.key;
    function lib() { return store.get(savedKey, []); }
    function paintLib() {
      const items = lib();
      $("[data-count]", root).textContent = items.length;
      $("[data-saved]", root).innerHTML = items.length ? items.map((it) => `<li data-id="${it.id}"><span class="s-name" title="${esc(it.title)}">${esc(it.title)}</span>
        <small class="muted">${new Date(it.updated).toLocaleDateString()}</small><button data-open>Open</button><button data-del aria-label="Delete">✕</button></li>`).join("")
        : `<li class="muted">Nothing saved yet. Press <b>&nbsp;Save&nbsp;</b> to keep a ${noun}.</li>`;
    }
    $("[data-saved]", root).addEventListener("click", (e) => {
      const li = e.target.closest("li[data-id]"); if (!li) return;
      const items = lib(), it = items.find((x) => x.id === li.dataset.id);
      if (e.target.closest("[data-open]")) { write(it.values); currentId = it.id; render(); toast("Opened “" + it.title + "”"); window.scrollTo({ top: 0, behavior: "smooth" }); }
      if (e.target.closest("[data-del]") && confirm("Delete “" + it.title + "”?")) { store.set(savedKey, items.filter((x) => x.id !== it.id)); if (currentId === it.id) currentId = null; paintLib(); }
    });

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act],[data-x]"); if (!b) return;
      if (b.dataset.x != null) { cfg.actions[+b.dataset.x].run(ctx); return; }
      const act = b.dataset.act, v = read(), title = (cfg.title && cfg.title(v)) || "Untitled " + noun;
      if (act === "generate") {
        const msg = cfg.validate && cfg.validate(v); if (msg) { toast(msg); return; }
        render(); if (window.innerWidth < 960) out.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (act === "example") { write(cfg.example); currentId = null; render(); }
      if (act === "clear") { write({}); currentId = null; render(); }
      if (act === "save") {
        const items = lib(); const now = Date.now();
        const ex = currentId && items.find((x) => x.id === currentId);
        if (ex) Object.assign(ex, { title, values: v, updated: now }); else { currentId = uid(); items.unshift({ id: currentId, title, values: v, updated: now }); }
        store.set(savedKey, items.slice(0, 100)); paintLib(); toast("Saved “" + title + "”");
      }
      if (act === "copy") copyText(doc.innerText);
      if (act === "word") downloadDoc(title, doc, title);
      if (act === "print") printEl(out);
    });

    write(store.get(cfg.key + ":draft", null) || {});
    paintLib();
    if (manual) doc.innerHTML = `<div class="empty"><div class="e-icon">${cfg.emptyIcon || "📝"}</div><p>${cfg.emptyText}</p></div>`; else render();
    if (cfg.init) cfg.init(ctx);
    return ctx;
  };
})();
