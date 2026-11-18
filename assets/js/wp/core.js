/* Skillyfai Writing Practice – core
   - WP.LEVELS / WP.add(): the category registry (filled by content-*.js)
   - WP.data: children, practice log, skill assessments, observations, portfolio, saved and custom activities
   - WP.path: stroke paths for lines, curves, shapes, patterns and letters (shared by tracing, demos and worksheets)
   Storage is the browser's localStorage (the site has no server); everything can be exported and imported. */
(function () {
  "use strict";
  const { store, uid, esc } = SK;
  const WP = (window.WP = { cats: {}, order: { beginner: [], intermediate: [], advanced: [] } });

  WP.LEVELS = {
    beginner: { name: "Beginner", icon: "🌱", color: "var(--mint)", tint: "var(--mint-soft)",
      blurb: "Writing readiness: big and small muscles, hand-eye coordination, seeing shapes, holding a pencil, scribbles, strokes, curves and first letters." },
    intermediate: { name: "Intermediate", icon: "✏️", color: "var(--primary-ink)", tint: "var(--primary-soft)",
      blurb: "Controlled writing: forming letters correctly, matching cases, building words, spacing, copying, dictation and first sentences." },
    advanced: { name: "Advanced", icon: "📝", color: "var(--coral)", tint: "var(--coral-soft)",
      blurb: "Independent writing: sentences, picture composition, paragraphs, stories, letters, diaries and editing." }
  };
  WP.CLASSES = ["Pre-primary (3–4 years)", "Pre-primary (4–5 years)", "Class 1 (5–6 years)", "Class 2 (6–7 years)", "Classes 3–5 (8–10 years)", "Classes 6–8 (11–13 years)"];
  WP.TYPES = { P: "Physical", D: "Digital", W: "Worksheet", G: "Classroom Game" };
  WP.DIFF = ["Easy", "Medium", "Difficult"];

  /* Register a category. Activities are compact arrays (see content files) expanded here. */
  WP.add = function (c) {
    c.acts = (c.acts || []).map((a, i) => Array.isArray(a) ? {
      id: c.id + "-" + i, t: a[0], sub: a[1], types: a[2], mins: a[3], mat: a[4], steps: a[5], kid: a[6],
      check: a[7] || c.assess.slice(0, 3), out: a[8] || c.outcome, obj: a[9] || null } : a);
    WP.cats[c.id] = c; WP.order[c.level].push(c.id);
  };
  WP.catsOf = (level) => WP.order[level].map((id) => WP.cats[id]);

  /* ------------------------------------------------------------------ data ------------------------------------------------------------------ */
  const K = (k) => "wp:" + k;
  const get = (k, d) => store.get(K(k), d), set = (k, v) => store.set(K(k), v);
  WP.data = {
    children: () => get("children", []),
    child() { const id = get("child", ""); return this.children().find((c) => c.id === id) || null; },
    setChild(id) { set("child", id); document.dispatchEvent(new CustomEvent("wp:child")); },
    addChild(name, cls) { const c = { id: uid(), name: name.trim(), cls: cls || "", level: "beginner", created: Date.now() }; set("children", this.children().concat(c)); this.setChild(c.id); return c; },
    updateChild(id, patch) { set("children", this.children().map((c) => (c.id === id ? Object.assign({}, c, patch) : c))); },
    removeChild(id) {
      set("children", this.children().filter((c) => c.id !== id));
      set("logs", this.logs().filter((l) => l.child !== id)); const a = get("assess", {}); delete a[id]; set("assess", a);
      set("obs", get("obs", []).filter((o) => o.child !== id)); set("portfolio", get("portfolio", []).filter((p) => p.child !== id));
      if (get("child", "") === id) this.setChild("");
    },
    /* practice log */
    logs: () => get("logs", []),
    log(entry) {
      const c = this.child(); const e = Object.assign({ id: uid(), child: c ? c.id : "guest", at: Date.now() }, entry);
      const l = this.logs(); l.push(e); set("logs", l.slice(-4000)); document.dispatchEvent(new CustomEvent("wp:log", { detail: e })); return e;
    },
    /* skill assessment: "ns" not started, "dev" developing, "ach" achieved (set by the teacher only) */
    assess(childId) { return (get("assess", {})[childId]) || {}; },
    setAssess(childId, cat, val) { const a = get("assess", {}); a[childId] = Object.assign({}, a[childId], { [cat]: val }); set("assess", a); },
    obs: (childId) => get("obs", []).filter((o) => o.child === childId),
    addObs(childId, text, cat) { const o = get("obs", []); o.unshift({ id: uid(), child: childId, text, cat: cat || "", at: Date.now() }); set("obs", o); },
    delObs(id) { set("obs", get("obs", []).filter((o) => o.id !== id)); },
    /* writing portfolio (advanced writing, with teacher feedback) */
    portfolio: (childId, cat) => get("portfolio", []).filter((p) => (!childId || p.child === childId) && (!cat || p.cat === cat)),
    savePiece(piece) { const p = get("portfolio", []); const i = p.findIndex((x) => x.id === piece.id); if (i >= 0) p[i] = piece; else p.unshift(piece); set("portfolio", p.slice(0, 600)); },
    delPiece(id) { set("portfolio", get("portfolio", []).filter((p) => p.id !== id)); },
    /* drawings gallery (small PNGs) */
    gallery: () => get("gallery", []),
    addDrawing(d) { const g = get("gallery", []); g.unshift(d); while (JSON.stringify(g).length > 2500000) g.pop(); return set("gallery", g.slice(0, 24)); },
    delDrawing(id) { set("gallery", get("gallery", []).filter((d) => d.id !== id)); },
    /* teacher library */
    saved: () => get("saved", []),
    saveActivity(a) { const s = get("saved", []); if (s.some((x) => x.key === a.key)) return false; s.unshift(Object.assign({ savedAt: Date.now() }, a)); set("saved", s.slice(0, 500)); return true; },
    delSaved(key) { set("saved", get("saved", []).filter((x) => x.key !== key)); },
    custom: (cat) => get("custom", []).filter((a) => !cat || a.cat === cat),
    addCustom(a) { const c = get("custom", []); c.unshift(Object.assign({ id: uid(), created: Date.now(), custom: true }, a)); set("custom", c); },
    delCustom(id) { set("custom", get("custom", []).filter((a) => a.id !== id)); },
    /* dictation lists and results */
    dict: () => get("dict", { lists: [], results: [] }),
    setDict: (d) => set("dict", d),
    /* backup */
    exportAll() { const o = {}; ["children", "child", "logs", "assess", "obs", "portfolio", "saved", "custom", "dict"].forEach((k) => (o[k] = get(k, null))); return { app: "skillyfai-writing-practice", version: 1, at: new Date().toISOString(), data: o }; },
    importAll(obj) {
      if (!obj || obj.app !== "skillyfai-writing-practice" || !obj.data) throw new Error("This file is not a Skillyfai Writing Practice backup.");
      Object.entries(obj.data).forEach(([k, v]) => { if (v !== null && v !== undefined) set(k, v); });
    }
  };

  /* session timer used by every practice: start → finish({done, acc, note}) */
  WP.session = function (cat, practice) {
    const start = Date.now(); let ended = false;
    return {
      finish(r = {}) {
        if (ended && !r.again) return; ended = true;
        return WP.data.log({ level: WP.cats[cat] ? WP.cats[cat].level : "", cat, practice, secs: Math.max(1, Math.round((Date.now() - start) / 1000)), done: r.done !== false, acc: typeof r.acc === "number" ? Math.max(0, Math.min(100, Math.round(r.acc))) : null, note: r.note || "" });
      }
    };
  };

  /* ------------------------------------------------------------------ paths ------------------------------------------------------------------ */
  /* Unit box: y 0 = top line, 40 = middle line, 80 = base line, 110 = descender line. Each glyph is a list of strokes (SVG path data),
     drawn in order; the first point of every stroke is its starting point. */
  const L = {
    A: ["M 30 0 L 0 80", "M 30 0 L 60 80", "M 12 48 L 48 48"], B: ["M 0 0 L 0 80", "M 0 0 L 30 0 C 55 0 55 38 30 38 L 0 38", "M 0 38 L 34 38 C 60 38 60 80 34 80 L 0 80"],
    C: ["M 55 15 C 45 -3 0 -3 0 40 C 0 83 45 83 55 65"], D: ["M 0 0 L 0 80", "M 0 0 L 22 0 C 65 0 65 80 22 80 L 0 80"],
    E: ["M 0 0 L 0 80", "M 0 0 L 45 0", "M 0 40 L 38 40", "M 0 80 L 45 80"], F: ["M 0 0 L 0 80", "M 0 0 L 45 0", "M 0 40 L 38 40"],
    G: ["M 58 15 C 48 -3 0 -3 0 40 C 0 83 55 85 58 50 L 34 50"], H: ["M 0 0 L 0 80", "M 50 0 L 50 80", "M 0 40 L 50 40"],
    I: ["M 20 0 L 20 80", "M 0 0 L 40 0", "M 0 80 L 40 80"], J: ["M 40 0 L 40 60 C 40 85 5 85 2 62"],
    K: ["M 0 0 L 0 80", "M 48 0 L 0 45", "M 15 32 L 50 80"], L: ["M 0 0 L 0 80 L 45 80"], M: ["M 0 80 L 0 0 L 30 60 L 60 0 L 60 80"],
    N: ["M 0 80 L 0 0 L 50 80 L 50 0"], O: ["M 30 0 C -10 0 -10 80 30 80 C 70 80 70 0 30 0"], P: ["M 0 0 L 0 80", "M 0 0 L 30 0 C 58 0 58 42 30 42 L 0 42"],
    Q: ["M 30 0 C -10 0 -10 80 30 80 C 70 80 70 0 30 0", "M 35 60 L 60 88"], R: ["M 0 0 L 0 80", "M 0 0 L 30 0 C 58 0 58 42 30 42 L 0 42", "M 25 42 L 52 80"],
    S: ["M 55 12 C 45 -4 0 -2 3 20 C 6 40 55 38 55 60 C 55 85 8 84 0 66"], T: ["M 0 0 L 50 0", "M 25 0 L 25 80"],
    U: ["M 0 0 L 0 55 C 0 88 50 88 50 55 L 50 0"], V: ["M 0 0 L 28 80 L 56 0"], W: ["M 0 0 L 16 80 L 34 25 L 52 80 L 68 0"],
    X: ["M 0 0 L 50 80", "M 50 0 L 0 80"], Y: ["M 0 0 L 27 40", "M 54 0 L 27 40 L 27 80"], Z: ["M 0 0 L 50 0 L 0 80 L 50 80"],
    a: ["M 40 50 C 35 38 0 38 0 62 C 0 86 35 86 40 72", "M 40 42 L 40 80"], b: ["M 0 0 L 0 80", "M 0 60 C 0 35 40 35 40 60 C 40 85 0 85 0 62"],
    c: ["M 38 47 C 30 36 0 38 0 60 C 0 84 30 85 38 73"], d: ["M 40 50 C 35 38 0 38 0 62 C 0 86 35 86 40 72", "M 40 0 L 40 80"],
    e: ["M 0 60 L 40 60 C 40 35 0 35 0 60 C 0 85 32 86 38 74"], f: ["M 38 6 C 30 -4 15 0 15 15 L 15 80", "M 0 40 L 32 40"],
    g: ["M 40 50 C 35 38 0 38 0 60 C 0 82 35 82 40 70", "M 40 42 L 40 98 C 40 115 5 115 2 100"], h: ["M 0 0 L 0 80", "M 0 58 C 5 35 40 35 40 58 L 40 80"],
    i: ["M 10 40 L 10 80", "M 10 22 L 10 25"], j: ["M 20 40 L 20 98 C 20 115 0 113 -2 102", "M 20 22 L 20 25"],
    k: ["M 0 0 L 0 80", "M 34 40 L 0 64", "M 12 56 L 38 80"], l: ["M 10 0 L 10 80"],
    m: ["M 0 40 L 0 80", "M 0 55 C 5 35 30 35 30 55 L 30 80", "M 30 55 C 35 35 60 35 60 55 L 60 80"], n: ["M 0 40 L 0 80", "M 0 55 C 5 35 40 35 40 55 L 40 80"],
    o: ["M 20 40 C -6 40 -6 80 20 80 C 46 80 46 40 20 40"], p: ["M 0 40 L 0 110", "M 0 60 C 0 35 40 35 40 60 C 40 85 0 85 0 62"],
    q: ["M 40 50 C 35 38 0 38 0 60 C 0 82 35 82 40 70", "M 40 40 L 40 110"], r: ["M 0 40 L 0 80", "M 0 58 C 5 40 25 36 34 44"],
    s: ["M 34 45 C 26 36 2 38 3 50 C 4 60 34 58 34 70 C 34 84 5 84 0 74"], t: ["M 15 10 L 15 80", "M 0 40 L 32 40"],
    u: ["M 0 40 L 0 65 C 0 86 36 86 38 62", "M 38 40 L 38 80"], v: ["M 0 40 L 20 80 L 40 40"], w: ["M 0 40 L 12 80 L 26 52 L 40 80 L 52 40"],
    x: ["M 0 40 L 38 80", "M 38 40 L 0 80"], y: ["M 0 40 L 20 80", "M 40 40 L 20 80 L 8 110"], z: ["M 0 40 L 38 40 L 0 80 L 38 80"]
  };
  /* lines, curves, shapes and pre-writing patterns */
  const G = {
    standing: { n: "Standing line", s: ["M 10 0 L 10 80"] }, sleeping: { n: "Sleeping line", s: ["M 0 40 L 60 40"] },
    slanting: { n: "Slanting line", s: ["M 40 0 L 0 80"] }, reverse: { n: "Reverse slanting line", s: ["M 0 0 L 40 80"] },
    short: { n: "Short line", s: ["M 10 40 L 10 80"] }, long: { n: "Long line", s: ["M 10 0 L 10 110"] },
    leftcurve: { n: "Left curve", s: ["M 35 5 C -10 10 -10 70 35 75"] }, rightcurve: { n: "Right curve", s: ["M 5 5 C 50 10 50 70 5 75"] },
    upcurve: { n: "Upward curve", s: ["M 0 20 C 5 85 55 85 60 20"] }, downcurve: { n: "Downward curve", s: ["M 0 75 C 5 10 55 10 60 75"] },
    circle: { n: "Circle", s: ["M 40 2 A 38 38 0 0 0 40 78 A 38 38 0 0 0 40 2"] }, semicircle: { n: "Semicircle", s: ["M 0 75 A 37 37 0 0 1 74 75"] },
    loops: { n: "Loops", s: ["M 0 75 C 25 75 40 45 30 25 C 20 5 5 25 15 50 C 22 70 35 75 45 75"] },
    waves: { n: "Waves", s: ["M 0 40 C 10 10 20 10 30 40 C 40 70 50 70 60 40"] }, zigzag: { n: "Zigzag", s: ["M 0 75 L 15 15 L 30 75 L 45 15 L 60 75"] },
    combined: { n: "Combined pattern", s: ["M 0 40 C 10 5 30 5 40 40 L 50 75 L 60 40"] },
    square: { n: "Square", s: ["M 0 0 L 0 78 L 78 78 L 78 0 L 0 0"] }, triangle: { n: "Triangle", s: ["M 40 0 L 0 78 L 80 78 L 40 0"] },
    rectangle: { n: "Rectangle", s: ["M 0 15 L 0 70 L 110 70 L 110 15 L 0 15"] }, diamond: { n: "Diamond", s: ["M 40 0 L 0 40 L 40 80 L 80 40 L 40 0"] },
    star: { n: "Star", s: ["M 40 0 L 50 28 L 80 30 L 56 48 L 64 78 L 40 60 L 16 78 L 24 48 L 0 30 L 30 28 L 40 0"] },
    heart: { n: "Heart", s: ["M 40 22 C 38 15 32 7 22 8 C 0 10 0 50 40 78 C 80 50 80 10 58 8 C 48 7 42 15 40 22"] },
    oval: { n: "Oval", s: ["M 30 2 A 28 38 0 0 0 30 78 A 28 38 0 0 0 30 2"] },
    cshape: { n: "Curved pattern (c)", s: ["M 38 47 C 30 36 0 38 0 60 C 0 84 30 85 38 73"] }, ocircle: { n: "Circular movement (o)", s: ["M 20 40 C -6 40 -6 80 20 80 C 46 80 46 40 20 40"] },
    cross: { n: "Plus (vertical and horizontal)", s: ["M 25 25 L 25 80", "M 0 52 L 50 52"] }, lshape: { n: "Down and across (L)", s: ["M 0 20 L 0 80 L 40 80"] },
    tshape: { n: "Across and down (T)", s: ["M 0 20 L 44 20", "M 22 20 L 22 80"] }, vshape: { n: "Slanting pair (v)", s: ["M 0 30 L 22 80 L 44 30"] },
    xshape: { n: "Crossing slants (x)", s: ["M 0 30 L 40 80", "M 40 30 L 0 80"] }, elloop: { n: "Loop (e)", s: ["M 0 60 L 40 60 C 40 35 0 35 0 60 C 0 85 32 86 38 74"] },
    cup: { n: "Cup (u)", s: ["M 0 40 L 0 65 C 0 86 36 86 38 62 L 38 40"] }, arch: { n: "Arch (n)", s: ["M 0 80 L 0 55 C 5 35 40 35 40 55 L 40 80"] },
    hook: { n: "Hook (j)", s: ["M 20 40 L 20 98 C 20 115 0 113 -2 102"] }, stick: { n: "Stick and ball (b)", s: ["M 0 0 L 0 80", "M 0 60 C 0 35 40 35 40 60 C 40 85 0 85 0 62"] }
  };
  WP.LETTERS = L; WP.GLYPHS = G;
  WP.ROAD = { n: "Road", s: ["M 0 50 C 40 -10 80 110 120 50 C 160 -10 200 110 240 50"] };

  /* measuring (cached) via one hidden SVG path element */
  let svgEl, pathEl; const cache = new Map();
  function ensure() { if (!svgEl) { svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svgEl.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden"); svgEl.setAttribute("aria-hidden", "true"); pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path"); svgEl.append(pathEl); document.body.append(svgEl); } }
  WP.path = {
    /* sample points along a stroke every `step` units, plus total length */
    sample(d, step = 3) {
      const k = d + "|" + step; if (cache.has(k)) return cache.get(k);
      ensure(); pathEl.setAttribute("d", d); const len = pathEl.getTotalLength(), pts = [];
      for (let t = 0; t <= len; t += step) { const p = pathEl.getPointAtLength(t); pts.push([p.x, p.y]); }
      const e = pathEl.getPointAtLength(len); pts.push([e.x, e.y]);
      const r = { len, pts }; cache.set(k, r); return r;
    },
    at(d, frac) { ensure(); pathEl.setAttribute("d", d); const len = pathEl.getTotalLength(), a = pathEl.getPointAtLength(len * frac), b = pathEl.getPointAtLength(Math.min(len, len * frac + 2)); return { x: a.x, y: a.y, ang: Math.atan2(b.y - a.y, b.x - a.x) }; },
    /* horizontal extent of a glyph */
    box(strokes) { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; strokes.forEach((d) => WP.path.sample(d, 4).pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); })); return { x0, x1, y0, y1, w: x1 - x0 }; },
    /* lay glyphs out in a row: returns [{strokes, dx}] and total width */
    row(glyphs, gap = 22) { let x = 0; const out = []; glyphs.forEach((g) => { const b = WP.path.box(g); out.push({ strokes: g, dx: x - b.x0 }); x += b.w + gap; }); return { items: out, width: Math.max(1, x - gap) }; }
  };

  /* SVG of a traceable row: model (solid) + dotted copies with start dots and arrows. Used on screen and in worksheets. */
  WP.traceSVG = function (glyphs, o = {}) {
    const r = WP.path.row(glyphs, o.gap || 26), H = o.lines === false ? 90 : 116, pad = 8, W = r.width + pad * 2;
    const lines = o.lines === false ? "" : [0, 40, 80, 110].map((y, i) => `<line x1="0" x2="${W}" y1="${y + 3}" y2="${y + 3}" stroke="${o.bw ? (i === 2 ? "#555" : "#999") : i === 2 ? "#e39b9b" : "#b9c6e6"}" stroke-width="1.2" ${i === 1 ? 'stroke-dasharray="5 5"' : ""}/>`).join("");
    const body = r.items.map((it, gi) => it.strokes.map((d, si) => {
      const solid = o.model && gi === 0, sw = o.thick ? 7 : 3.4;
      let s = `<path d="${d}" transform="translate(${it.dx + pad} 3)" fill="none" stroke="${solid ? "#222" : o.bw ? "#666" : "#8a8fa8"}" stroke-width="${solid ? sw + 1.5 : sw}" stroke-linecap="round" stroke-linejoin="round" ${solid ? "" : 'stroke-dasharray="1 7"'}/>`;
      if (o.guides !== false && (!o.model || gi > 0) && (o.guidesAll || gi <= (o.model ? 1 : 0))) {
        const p0 = WP.path.at(d, 0), mid = WP.path.at(d, d.includes("A") || /Z|L 0 0|L 40 0$/.test(d) ? 0.25 : 0.5), len = WP.path.sample(d, 4).len;
        s += `<g transform="translate(${it.dx + pad} 3)"><circle cx="${p0.x}" cy="${p0.y}" r="5.5" fill="${o.bw ? "#111" : "#1d8f5a"}"/><text x="${p0.x}" y="${p0.y + 3.2}" font-size="7.5" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">${si + 1}</text>`;
        if (len > 26) s += `<path d="M -5 -4 L 4 0 L -5 4 Z" fill="${o.bw ? "#444" : "#c2410c"}" transform="translate(${mid.x} ${mid.y}) rotate(${mid.ang * 180 / Math.PI})"/>`;
        s += "</g>";
      }
      return s;
    }).join("")).join("");
    return `<svg viewBox="0 0 ${W} ${H + 6}" width="100%" preserveAspectRatio="xMinYMid meet" style="display:block;${o.h ? `height:${o.h}px` : `max-height:${o.maxH || 160}px`}">${lines}${body}</svg>`;
  };

  /* small shape icons for games and worksheets */
  WP.shapeSVG = function (name, color = "#5b5bd6", o = {}) {
    const g = G[name] || G.circle, b = WP.path.box(g.s), s = o.size || 56, rot = o.rot || 0, flip = o.flip ? -1 : 1, sc = o.scale || 1;
    const vb = `${b.x0 - 6} ${b.y0 - 6} ${b.w + 12} ${b.y1 - b.y0 + 12}`, cx = b.x0 + b.w / 2, cy = (b.y0 + b.y1) / 2;
    return `<svg viewBox="${vb}" width="${s}" height="${s}" aria-hidden="true"><g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${flip * sc} ${sc}) translate(${-cx} ${-cy})">${g.s.map((d) => `<path d="${d}" fill="${o.outline ? "none" : color}" stroke="${o.outline ? color : "#222"}" stroke-width="${o.outline ? 5 : 2.5}" stroke-linejoin="round"/>`).join("")}</g></svg>`;
  };

  WP.esc = esc;
  WP.rand = (seed) => { let a = seed >>> 0 || 1; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  WP.shuffleR = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
})();
