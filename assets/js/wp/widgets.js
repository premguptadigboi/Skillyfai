/* Skillyfai Writing Practice – interactive widgets.
   Every widget: WP.W.<name>(el, cfg, ctx) where ctx = { cat, practice, finish({acc, done, note}) }.
   Widgets clean up after themselves through the returned { destroy }. */
(function () {
  "use strict";
  const { esc, toast, speak, shuffle, pick, celebrate, uid } = SK;
  const W = (WP.W = {});
  const $ = (s, r) => r.querySelector(s), $$ = (s, r) => Array.from(r.querySelectorAll(s));
  const stars = (n) => "⭐".repeat(n) + "☆".repeat(3 - n);
  const starsFor = (acc) => (acc >= 80 ? 3 : acc >= 60 ? 2 : acc >= 35 ? 1 : 0);
  const praise = (n) => ["Keep trying, you can do it!", "Good try! Practise once more.", "Well done!", "Excellent work!"][n];
  function summary(el, acc, again, extra = "") {
    const n = starsFor(acc); if (n === 3) celebrate();
    el.innerHTML = `<div class="wp-done"><div class="wp-stars">${stars(n)}</div><h3>${praise(n)}</h3>${acc != null ? `<p class="muted">Score: ${Math.round(acc)}%</p>` : ""}${extra}
      <button type="button" class="wp-big wp-go" data-again>▶ Play again</button></div>`;
    $("[data-again]", el).onclick = again;
  }
  const say = (t) => { if (t) speak(t, { rate: 0.85 }); };

  /* ================================================================ TRACING (path based) ================================================================ */
  function TraceCanvas(host, opts = {}) {
    host.classList.add("wp-tracebox");
    host.innerHTML = '<canvas class="bg"></canvas><canvas class="ink"></canvas>';
    const bg = $(".bg", host), ink = $(".ink", host), gb = bg.getContext("2d"), gi = ink.getContext("2d");
    let glyphs = [], row = { items: [], width: 1 }, s = 1, ox = 0, oy = 0, W0 = 0, H0 = 0, strokes = [], cur = null, o = opts, anim = 0;
    const UH = 126;
    function layout() {
      const w = host.clientWidth || 600; row = WP.path.row(glyphs, o.gap || 30);
      s = Math.min((w - 20) / (row.width + 20), (o.maxH || 300) / UH); W0 = w; H0 = Math.round(UH * s + 8);
      ox = (w - row.width * s) / 2; oy = 8 * s;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      [bg, ink].forEach((c) => { c.width = W0 * dpr; c.height = H0 * dpr; c.style.height = H0 + "px"; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); });
      host.style.height = H0 + "px"; drawBg(); drawInk();
    }
    const T = (x, y) => [ox + x * s, oy + y * s];
    function strokePath(ctx, d, dx) { ctx.save(); ctx.translate(ox + dx * s, oy); ctx.scale(s, s); ctx.stroke(new Path2D(d)); ctx.restore(); }
    function drawBg() {
      gb.clearRect(0, 0, W0, H0);
      if (o.lines !== false) [0, 40, 80, 110].forEach((y, i) => { gb.beginPath(); gb.setLineDash(i === 1 ? [6, 6] : []); gb.strokeStyle = i === 2 ? "#e79a9a" : "#a9bce8"; gb.lineWidth = 1.4; const [, yy] = T(0, y); gb.moveTo(0, yy); gb.lineTo(W0, yy); gb.stroke(); });
      gb.setLineDash([]);
      row.items.forEach((it, gi2) => it.strokes.forEach((d, si) => {
        if (o.road) { gb.lineCap = "round"; gb.lineJoin = "round"; gb.strokeStyle = "#e8e2cf"; gb.lineWidth = 30 * s; strokePath(gb, d, it.dx); gb.strokeStyle = "#c9bf9d"; gb.setLineDash([8, 10]); gb.lineWidth = 2; strokePath(gb, d, it.dx); gb.setLineDash([]); }
        else if (!o.hideGuide) { gb.lineCap = "round"; gb.lineJoin = "round"; gb.strokeStyle = "rgba(90,98,140,.55)"; gb.setLineDash([2, 9 * Math.max(.6, s)]); gb.lineWidth = Math.max(3, 4.2 * s); strokePath(gb, d, it.dx); gb.setLineDash([]); }
        if (o.hideGuide && !(si === 0)) return;
        const p = WP.path.at(d, 0), [x, y] = T(p.x + it.dx, p.y), r = Math.max(7, 6 * s);
        gb.fillStyle = "#1d8f5a"; gb.beginPath(); gb.arc(x, y, r, 0, 7); gb.fill();
        gb.fillStyle = "#fff"; gb.font = `700 ${Math.round(r * 1.2)}px Arial`; gb.textAlign = "center"; gb.textBaseline = "middle"; gb.fillText(String(si + 1), x, y + 0.5);
        if (!o.hideGuide && o.arrows !== false && WP.path.sample(d, 4).len > 26) {
          const m = WP.path.at(d, /A/.test(d) ? 0.22 : 0.5), [mx, my] = T(m.x + it.dx, m.y), a = Math.max(8, 7 * s);
          gb.save(); gb.translate(mx, my); gb.rotate(m.ang); gb.fillStyle = "#c2410c"; gb.beginPath(); gb.moveTo(a, 0); gb.lineTo(-a * .8, -a * .7); gb.lineTo(-a * .8, a * .7); gb.closePath(); gb.fill(); gb.restore();
        }
      }));
      if (o.road) { const f = row.items[0], st = WP.path.at(f.strokes[0], 0), en = WP.path.at(f.strokes[0], 1); gb.font = `${Math.round(26 * Math.max(.6, s))}px serif`; gb.textAlign = "center"; gb.fillText(o.road[0] || "🐭", ...T(st.x + f.dx, st.y - 16)); gb.fillText(o.road[1] || "🧀", ...T(en.x + f.dx, en.y - 16)); }
    }
    function drawInk() {
      gi.clearRect(0, 0, W0, H0); gi.lineCap = "round"; gi.lineJoin = "round";
      strokes.forEach((st) => { gi.strokeStyle = o.color || "#2b2bb0"; gi.lineWidth = (o.pen || 6) * s; gi.beginPath(); st.forEach(([x, y], i) => { const [a, b] = T(x, y); i ? gi.lineTo(a, b) : gi.moveTo(a, b); }); if (st.length === 1) { const [a, b] = T(...st[0]); gi.lineTo(a + .1, b); } gi.stroke(); });
    }
    const pos = (e) => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left - ox) / s, (e.clientY - r.top - oy) / s]; };
    ink.addEventListener("pointerdown", (e) => { e.preventDefault(); stopDemo(); ink.setPointerCapture(e.pointerId); cur = [pos(e)]; strokes.push(cur); drawInk(); o.onInk && o.onInk(); });
    ink.addEventListener("pointermove", (e) => { if (!cur) return; e.preventDefault(); ((e.getCoalescedEvents && e.getCoalescedEvents().length) ? e.getCoalescedEvents() : [e]).forEach((ev) => cur.push(pos(ev))); drawInk(); });
    const up = () => { cur = null; }; ink.addEventListener("pointerup", up); ink.addEventListener("pointercancel", up);
    const ro = new ResizeObserver(() => { if (Math.abs(host.clientWidth - W0) > 2) layout(); }); ro.observe(host);
    function guidePts() { const g = []; row.items.forEach((it) => it.strokes.forEach((d) => WP.path.sample(d, 3).pts.forEach(([x, y]) => g.push([x + it.dx, y])))); return g; }
    function inkPts() { const p = []; strokes.forEach((st) => { for (let i = 0; i < st.length; i++) { const [x, y] = st[i]; p.push([x, y]); if (i) { const [px, py] = st[i - 1], dd = Math.hypot(x - px, y - py); for (let t = 2; t < dd; t += 2) p.push([px + (x - px) * t / dd, py + (y - py) * t / dd]); } } }); return p; }
    function near(pts, tol) { const g = new Map(), c = tol; pts.forEach(([x, y]) => { const k = Math.floor(x / c) + "," + Math.floor(y / c); (g.get(k) || g.set(k, []).get(k)).push([x, y]); }); return (x, y) => { const cx = Math.floor(x / c), cy = Math.floor(y / c); for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const a = g.get(cx + i + "," + (cy + j)); if (a) for (const [px, py] of a) if ((px - x) ** 2 + (py - y) ** 2 <= tol * tol) return true; } return false; }; }
    function stopDemo() { if (anim) { cancelAnimationFrame(anim); anim = 0; drawInk(); } }
    return {
      set(gl, opts2) { glyphs = gl; o = Object.assign({}, opts, opts2 || {}); strokes = []; stopDemo(); layout(); },
      undo() { strokes.pop(); drawInk(); }, clear() { strokes = []; drawInk(); }, hasInk: () => strokes.length > 0,
      check() {
        const tol = o.road ? 15 : 10, g = guidePts(), ip = inkPts(); if (!ip.length) return null;
        const nearInk = near(ip, tol), nearGuide = near(g, tol * 1.7);
        const cover = g.filter(([x, y]) => nearInk(x, y)).length / g.length, off = ip.filter(([x, y]) => !nearGuide(x, y)).length / ip.length;
        const acc = Math.max(0, Math.round(100 * cover * (1 - Math.min(off, 1) * 0.75)));
        const f = row.items[0], st = WP.path.at(f.strokes[0], 0), first = strokes[0][0];
        return { acc, cover, off, goodStart: Math.hypot(first[0] - (st.x + f.dx), first[1] - st.y) < tol * 2.2 };
      },
      demo() {
        stopDemo(); const seq = []; row.items.forEach((it) => it.strokes.forEach((d) => seq.push(WP.path.sample(d, 2).pts.map(([x, y]) => [x + it.dx, y]))));
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) { drawInk(); return; }
        let si = 0, pi = 0; const step = () => {
          drawInk(); gi.strokeStyle = "rgba(242,105,74,.85)"; gi.lineWidth = (o.pen || 6) * s; gi.lineCap = "round";
          for (let k = 0; k <= si && k < seq.length; k++) { const pts = k < si ? seq[k] : seq[k].slice(0, pi + 1); gi.beginPath(); pts.forEach(([x, y], i) => { const [a, b] = T(x, y); i ? gi.lineTo(a, b) : gi.moveTo(a, b); }); gi.stroke(); }
          pi += 3; if (si < seq.length && pi >= seq[si].length) { si++; pi = 0; }
          anim = si < seq.length ? requestAnimationFrame(step) : (setTimeout(() => drawInk(), 900), 0);
        }; anim = requestAnimationFrame(step);
      },
      destroy() { ro.disconnect(); stopDemo(); }
    };
  }
  WP.TraceCanvas = TraceCanvas;

  /* options: [{label, glyphs:[[strokes]...], opts}]  cfg.modes adds "Trace / Write on my own" */
  W.trace = function (el, cfg, ctx) {
    const opts = cfg.options;
    el.innerHTML = `${opts.length > 1 ? `<div class="wp-chips" data-opts>${opts.map((x, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-i="${i}">${esc(x.label)}</button>`).join("")}</div>` : ""}
      ${cfg.levels ? `<div class="seg" data-lv style="margin:8px 0"><button type="button" class="on" data-l="easy">Easy</button><button type="button" data-l="medium">Medium</button><button type="button" data-l="hard">Difficult</button></div>` : ""}
      ${cfg.modes ? `<div class="seg" data-md style="margin:8px 0"><button type="button" class="on" data-m="trace">Trace</button><button type="button" data-m="alone">Write on my own</button></div>` : ""}
      <p class="wp-say" data-tip></p><div data-pad></div>
      <div class="wp-tools"><button type="button" class="wp-big" data-demo>👀 Show me</button><button type="button" class="wp-big ghost" data-undo>↶ Undo</button><button type="button" class="wp-big ghost" data-clear>🧽 Clear</button><button type="button" class="wp-big wp-go" data-check>✔ Check</button></div>
      <div class="wp-feedback" data-fb></div>`;
    let i = 0, lv = "easy", md = "trace", sess = null;
    const tc = TraceCanvas($("[data-pad]", el), { maxH: cfg.maxH || 300, pen: cfg.pen, onInk: () => { if (!sess) sess = ctx.session(); } });
    function scene() {
      const x = opts[i]; let gl = x.glyphs;
      if (cfg.levels) { const n = lv === "easy" ? 1 : lv === "medium" ? 3 : 5; gl = Array.from({ length: n }, () => x.glyphs[0]); }
      tc.set(gl, Object.assign({ hideGuide: md === "alone", arrows: !(cfg.levels && lv === "hard") }, cfg.opts, x.opts));
      $("[data-tip]", el).textContent = md === "alone" ? "Start at the green dot and write it on your own." : (x.tip || cfg.tip || "Start at the green dot. Follow the arrows.");
      $("[data-fb]", el).innerHTML = ""; sess = null;
    }
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]"); if (b && b.closest("[data-opts]")) { i = +b.dataset.i; $$("[data-opts] .wp-chip", el).forEach((c) => c.classList.toggle("on", c === b)); scene(); }
      const l = e.target.closest("[data-l]"); if (l) { lv = l.dataset.l; $$("[data-l]", el).forEach((c) => c.classList.toggle("on", c === l)); scene(); }
      const m = e.target.closest("[data-m]"); if (m) { md = m.dataset.m; $$("[data-m]", el).forEach((c) => c.classList.toggle("on", c === m)); scene(); }
    });
    $("[data-demo]", el).onclick = () => tc.demo(); $("[data-undo]", el).onclick = () => tc.undo(); $("[data-clear]", el).onclick = () => { tc.clear(); $("[data-fb]", el).innerHTML = ""; };
    $("[data-check]", el).onclick = () => {
      const r = tc.check(); if (!r) return toast("Trace first, then press Check");
      const n = starsFor(r.acc); if (n === 3) celebrate();
      $("[data-fb]", el).innerHTML = `<div class="wp-stars">${stars(n)}</div><b>${praise(n)}</b> ${!r.goodStart ? "<br>Tip: start at the green dot." : ""}${r.off > .35 ? "<br>Tip: stay on the dotted line." : ""}${r.cover < .6 ? "<br>Tip: trace the whole line." : ""}`;
      (sess || ctx.session()).finish({ acc: r.acc, done: n >= 2, note: opts[i].label + (md === "alone" ? " (on own)" : "") }); sess = null;
    };
    scene();
    return { destroy: () => tc.destroy() };
  };

  /* font-based tracing (Assamese letters, words) using the site's existing SKTrace */
  W.fonttrace = function (el, cfg, ctx) {
    el.innerHTML = `<div class="wp-chips" data-list>${cfg.items.map((t, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-i="${i}" style="font-family:${cfg.font || "Andika"}">${esc(t)}</button>`).join("")}</div>
      <p class="wp-say">${esc(cfg.tip || "Trace over the dotted letter. Then press Check.")}</p><div data-pad></div>
      <div class="wp-tools"><button type="button" class="wp-big" data-say>🔊 Listen</button><button type="button" class="wp-big ghost" data-undo>↶ Undo</button><button type="button" class="wp-big ghost" data-clear>🧽 Clear</button><button type="button" class="wp-big wp-go" data-check>✔ Check</button></div><div class="wp-feedback" data-fb></div>`;
    const pad = $("[data-pad]", el); pad.style.maxWidth = "720px"; pad.style.margin = "0 auto";
    const ft = SKTrace(pad, { text: "" }); let i = 0, sess = null;
    const fontReady = cfg.font && document.fonts ? document.fonts.load(`700 60px ${cfg.font.split(",")[0]}`).catch(() => {}) : Promise.resolve();
    function show() { const t = cfg.items[i]; if (cfg.font) pad.querySelector("canvas") && (pad.dataset.font = cfg.font); ft.setText(t); $("[data-fb]", el).innerHTML = ""; sess = null; }
    fontReady.then(show);
    $("[data-list]", el).onclick = (e) => { const b = e.target.closest("[data-i]"); if (!b) return; i = +b.dataset.i; $$("[data-list] .wp-chip", el).forEach((c) => c.classList.toggle("on", c === b)); show(); };
    pad.addEventListener("pointerdown", () => { if (!sess) sess = ctx.session(); });
    $("[data-say]", el).onclick = () => say(cfg.sayAs ? cfg.sayAs(cfg.items[i]) : cfg.items[i]);
    $("[data-undo]", el).onclick = () => ft.undo(); $("[data-clear]", el).onclick = () => ft.clear();
    $("[data-check]", el).onclick = () => { if (!ft.hasInk()) return toast("Trace first"); const r = ft.check(); const acc = Math.round(Math.max(0, r.cover - r.off * 0.6) * 100); $("[data-fb]", el).innerHTML = `<div class="wp-stars">${stars(r.stars)}</div><b>${praise(r.stars)}</b>`; if (r.stars === 3) celebrate(); (sess || ctx.session()).finish({ acc, done: r.stars >= 2, note: cfg.items[i] }); sess = null; };
    return { destroy() {} };
  };

  /* ================================================================ DRAWING PAD ================================================================ */
  const PICS = {
    Apple: ["M 50 30 C 30 15 5 25 8 50 C 10 80 35 95 50 85 C 65 95 90 80 92 50 C 95 25 70 15 50 30 Z", "M 50 30 C 50 20 55 10 62 6"],
    Sun: ["M 50 32 A 18 18 0 1 0 50.1 32 Z", "M 50 6 L 50 20", "M 50 80 L 50 94", "M 6 50 L 20 50", "M 80 50 L 94 50", "M 19 19 L 29 29", "M 71 71 L 81 81", "M 81 19 L 71 29", "M 29 71 L 19 81"],
    Fish: ["M 15 50 C 30 25 65 25 78 50 C 65 75 30 75 15 50 Z", "M 78 50 L 95 35 L 95 65 Z", "M 33 45 A 3 3 0 1 0 33.1 45"],
    House: ["M 20 50 L 50 20 L 80 50 Z", "M 28 50 L 28 88 L 72 88 L 72 50", "M 44 88 L 44 66 L 56 66 L 56 88"],
    Tree: ["M 45 92 L 45 66 L 55 66 L 55 92 Z", "M 50 8 C 20 13 15 45 30 55 C 25 70 75 70 70 55 C 85 45 80 13 50 8 Z"],
    Balloon: ["M 50 8 C 24 8 22 45 50 66 C 78 45 76 8 50 8 Z", "M 50 66 C 44 76 56 84 50 96"]
  };
  const BOUNDS = { Circle: "M 50 8 A 42 42 0 1 0 50.1 8 Z", Square: "M 10 10 L 90 10 L 90 90 L 10 90 Z", Cloud: "M 25 75 C 5 75 5 50 22 48 C 20 28 45 22 52 35 C 60 18 88 25 82 48 C 98 52 95 78 75 75 Z", Heart: "M 50 30 C 45 12 10 12 12 40 C 14 62 50 84 50 88 C 50 84 86 62 88 40 C 90 12 55 12 50 30 Z" };
  const DOTSHAPES = { Star: WP.GLYPHS.star.s[0], House: "M 10 90 L 10 45 L 50 10 L 90 45 L 90 90 L 10 90", Fish: "M 10 50 C 25 20 70 20 82 50 L 98 30 L 98 70 L 82 50 C 70 80 25 80 10 50", Kite: "M 50 5 L 85 45 L 50 95 L 15 45 L 50 5" };
  W.drawpad = function (el, cfg, ctx) {
    const COLORS = ["#222222", "#e5484d", "#f5a524", "#ffd23f", "#2aa876", "#2f8ee0", "#8e4ec6", "#a0522d"], SIZES = [["Pencil", 4], ["Thick pencil", 9], ["Crayon", 16], ["Big crayon", 28]];
    const modes = cfg.modes || ["free"], NAMES = { free: "Free scribbling", boundary: "Inside a big shape", shapes: "Within shapes", dots: "Connect the dots", colour: "Colour a picture", lines: "Write on the lines" };
    el.innerHTML = `${modes.length > 1 ? `<div class="wp-chips" data-modes>${modes.map((m, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-m="${m}">${NAMES[m]}</button>`).join("")}</div>` : ""}
      <div class="wp-chips" data-sub style="margin-top:6px"></div><p class="wp-say" data-tip></p>
      <div class="wp-draw"><canvas class="bg"></canvas><canvas class="ink"></canvas></div>
      <div class="wp-tools wp-palette">${COLORS.map((c, i) => `<button type="button" class="wp-sw ${i ? "" : "on"}" data-c="${c}" style="background:${c}" aria-label="Colour"></button>`).join("")}
        <select class="select" data-size style="width:auto" aria-label="Pen size">${SIZES.map(([n, w], i) => `<option value="${w}" ${i === 2 ? "selected" : ""}>${n}</option>`).join("")}</select>
        <button type="button" class="wp-big ghost sm" data-er>🧽 Eraser</button><button type="button" class="wp-big ghost sm" data-undo>↶ Undo</button><button type="button" class="wp-big ghost sm" data-redo>↷ Redo</button><button type="button" class="wp-big ghost sm" data-clear>🗑 Clear</button></div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-check>✔ I'm done</button><button type="button" class="wp-big" data-save>💾 Save drawing</button><button type="button" class="wp-big ghost" data-dl>⬇ Download picture</button></div>
      <div class="wp-feedback" data-fb></div><div data-gallery></div>`;
    const box = $(".wp-draw", el), bg = $(".bg", box), ink = $(".ink", box), gb = bg.getContext("2d"), gi = ink.getContext("2d");
    let mode = modes[0], sub = null, color = COLORS[0], size = 16, eraser = false, strokes = [], redo = [], cur = null, Wd = 0, Hd = 0, sess = null, region = null, dots = [];
    const toCv = (x, y) => [x / 100 * Wd, y / 100 * Hd];
    function subs() { return mode === "boundary" ? Object.keys(BOUNDS) : mode === "colour" ? Object.keys(PICS) : mode === "dots" ? Object.keys(DOTSHAPES) : []; }
    function paintSubs() { const s = subs(); sub = s[0] || null; $("[data-sub]", el).innerHTML = s.map((x, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-s="${x}">${x}</button>`).join(""); }
    function size2() { const w = box.clientWidth; Wd = w; Hd = Math.round(Math.min(w * 0.68, 520)); const dpr = Math.min(devicePixelRatio || 1, 2); [bg, ink].forEach((c) => { c.width = Wd * dpr; c.height = Hd * dpr; c.style.height = Hd + "px"; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); }); box.style.height = Hd + "px"; drawBg(); drawInk(); }
    function scaled(d) { const p = new Path2D(), m = new DOMMatrix().scale(Wd / 100, Hd / 100); p.addPath(new Path2D(d), m); return p; }
    function drawBg() {
      gb.fillStyle = "#fffdf7"; gb.fillRect(0, 0, Wd, Hd); region = null; dots = [];
      gb.lineWidth = 3; gb.strokeStyle = "#7b819e"; gb.setLineDash([]);
      const tips = { free: "Scribble freely. Try round and round, up and down, and zigzags!", boundary: "Scribble inside the big shape. Try not to go outside.", shapes: "Scribble inside each small shape.", dots: "Join the dots in order: 1, 2, 3…", colour: "Colour the picture. Stay inside the lines.", lines: cfg.lineText ? `Write: “${cfg.lineText}”` : "Write on the lines. Keep your letters sitting on the red line." };
      $("[data-tip]", el).textContent = tips[mode];
      if (mode === "boundary") { region = [scaled(BOUNDS[sub])]; gb.lineWidth = 6; gb.setLineDash([14, 10]); gb.stroke(region[0]); }
      if (mode === "shapes") { region = []; ["circle", "square", "triangle"].forEach((n, i) => { const g = WP.GLYPHS[n].s[0], p = new Path2D(), m = new DOMMatrix().translate(Wd * (0.05 + i * 0.33), Hd * 0.18).scale(Wd * 0.0034, Hd * 0.0075); p.addPath(new Path2D(g), m); region.push(p); gb.lineWidth = 4; gb.setLineDash([10, 8]); gb.stroke(p); }); }
      if (mode === "colour") { region = []; gb.lineWidth = 4; PICS[sub].forEach((d) => { const p = scaled(d); gb.stroke(p); if (/Z\s*$/.test(d)) region.push(p); }); }
      if (mode === "dots") { const smp = WP.path.sample(DOTSHAPES[sub], 3), n = 12; for (let i = 0; i < n; i++) { const [x, y] = smp.pts[Math.floor(i * (smp.pts.length - 1) / n)]; dots.push(toCv(x * 0.9 + 5, y * 0.9 + 5)); } dots.push(dots[0]);
        dots.slice(0, -1).forEach(([x, y], i) => { gb.fillStyle = i === 0 ? "#1d8f5a" : "#333"; gb.beginPath(); gb.arc(x, y, 6, 0, 7); gb.fill(); gb.fillStyle = "#333"; gb.font = "bold 14px Arial"; gb.fillText(String(i + 1), x + 8, y - 8); }); }
      if (mode === "lines") { const rowsN = 3, rh = Hd / (rowsN + 0.4); for (let r = 0; r < rowsN; r++) { const top = 18 + r * rh; [0, .33, .66, .9].forEach((f, i) => { gb.beginPath(); gb.strokeStyle = i === 2 ? "#e39b9b" : "#a9bce8"; gb.setLineDash(i === 1 ? [6, 6] : []); gb.lineWidth = 1.5; gb.moveTo(10, top + f * rh * .8); gb.lineTo(Wd - 10, top + f * rh * .8); gb.stroke(); }); }
        if (cfg.lineText) { gb.setLineDash([]); gb.fillStyle = "#9aa0bb"; gb.font = `700 ${Math.round(rh * .42)}px Andika, sans-serif`; gb.fillText(cfg.lineText, 14, 18 + rh * .66 * .8); } }
      gb.setLineDash([]);
    }
    function drawInk() { gi.clearRect(0, 0, Wd, Hd); gi.lineCap = "round"; gi.lineJoin = "round"; strokes.forEach((st) => { gi.globalCompositeOperation = st.er ? "destination-out" : "source-over"; gi.strokeStyle = st.c; gi.lineWidth = st.w; gi.globalAlpha = st.w >= 16 && !st.er ? 0.88 : 1; gi.beginPath(); st.p.forEach(([x, y], i) => (i ? gi.lineTo(x * Wd, y * Hd) : gi.moveTo(x * Wd, y * Hd))); if (st.p.length === 1) gi.lineTo(st.p[0][0] * Wd + .1, st.p[0][1] * Hd); gi.stroke(); }); gi.globalCompositeOperation = "source-over"; gi.globalAlpha = 1; }
    const pos = (e) => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    ink.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!sess) sess = ctx.session(); ink.setPointerCapture(e.pointerId); cur = { c: color, w: size, er: eraser, p: [pos(e)] }; strokes.push(cur); redo = []; drawInk(); });
    ink.addEventListener("pointermove", (e) => { if (!cur) return; ((e.getCoalescedEvents && e.getCoalescedEvents().length) ? e.getCoalescedEvents() : [e]).forEach((ev) => cur.p.push(pos(ev))); drawInk(); });
    ["pointerup", "pointercancel"].forEach((t) => ink.addEventListener(t, () => (cur = null)));
    el.addEventListener("click", (e) => {
      const m = e.target.closest("[data-m]"); if (m) { mode = m.dataset.m; $$("[data-m]", el).forEach((x) => x.classList.toggle("on", x === m)); paintSubs(); strokes = []; redo = []; drawBg(); drawInk(); $("[data-fb]", el).innerHTML = ""; }
      const sb = e.target.closest("[data-s]"); if (sb) { sub = sb.dataset.s; $$("[data-s]", el).forEach((x) => x.classList.toggle("on", x === sb)); strokes = []; drawBg(); drawInk(); }
      const c = e.target.closest("[data-c]"); if (c) { color = c.dataset.c; eraser = false; $("[data-er]", el).classList.remove("on"); $$("[data-c]", el).forEach((x) => x.classList.toggle("on", x === c)); }
    });
    $("[data-size]", el).onchange = (e) => (size = +e.target.value);
    $("[data-er]", el).onclick = (e) => { eraser = !eraser; e.currentTarget.classList.toggle("on", eraser); };
    $("[data-undo]", el).onclick = () => { if (strokes.length) redo.push(strokes.pop()); drawInk(); };
    $("[data-redo]", el).onclick = () => { if (redo.length) strokes.push(redo.pop()); drawInk(); };
    $("[data-clear]", el).onclick = () => { if (strokes.length && !confirm("Clear the drawing?")) return; strokes = []; redo = []; drawInk(); $("[data-fb]", el).innerHTML = ""; };
    function picture(maxW) { const c = document.createElement("canvas"), sc = Math.min(1, (maxW || 2000) / Wd); c.width = Wd * sc; c.height = Hd * sc; const x = c.getContext("2d"); x.drawImage(bg, 0, 0, c.width, c.height); x.drawImage(ink, 0, 0, c.width, c.height); return c; }
    function evaluate() {
      const pts = []; strokes.filter((s) => !s.er).forEach((s) => s.p.forEach(([x, y]) => pts.push([x * Wd, y * Hd])));
      if (!pts.length) return null;
      if (region && region.length) { const inside = pts.filter(([x, y]) => region.some((p) => gb.isPointInPath(p, x * (bg.width / Wd), y * (bg.height / Hd)) || gb.isPointInPath(p, x, y))).length; return { acc: Math.round(inside / pts.length * 100), msg: `${Math.round(inside / pts.length * 100)}% of your colouring is inside the lines.` }; }
      if (mode === "dots") { let ok = 0; for (let i = 0; i < dots.length - 1; i++) { const [ax, ay] = dots[i], [bx, by] = dots[i + 1], mx = (ax + bx) / 2, my = (ay + by) / 2; if (pts.some(([x, y]) => Math.hypot(x - mx, y - my) < Math.max(18, Wd * 0.03))) ok++; } return { acc: Math.round(ok / (dots.length - 1) * 100), msg: `You joined ${ok} of ${dots.length - 1} lines.` }; }
      return { acc: null, msg: "Lovely work!" };
    }
    $("[data-check]", el).onclick = () => { const r = evaluate(); if (!r) return toast("Draw something first"); const n = r.acc == null ? 3 : starsFor(r.acc); if (n === 3) celebrate(); $("[data-fb]", el).innerHTML = `<div class="wp-stars">${stars(n)}</div><b>${praise(n)}</b> ${esc(r.msg)}`; (sess || ctx.session()).finish({ acc: r.acc, done: true, note: NAMES[mode] + (sub ? ": " + sub : "") }); sess = null; };
    function gallery() {
      const ch = WP.data.child(), g = WP.data.gallery().filter((d) => d.child === (ch ? ch.id : "guest"));
      $("[data-gallery]", el).innerHTML = g.length ? `<h3 class="wp-h3">Saved drawings</h3><div class="wp-gallery">${g.map((d) => `<figure><img src="${d.png}" alt="Saved drawing ${esc(d.mode)}"><figcaption>${new Date(d.at).toLocaleDateString()}<button type="button" data-dl2="${d.id}" aria-label="Download">⬇</button><button type="button" data-del="${d.id}" aria-label="Delete">✕</button></figcaption></figure>`).join("")}</div>` : "";
    }
    $("[data-save]", el).onclick = () => { if (!strokes.length) return toast("Draw something first"); const ch = WP.data.child(); WP.data.addDrawing({ id: uid(), child: ch ? ch.id : "guest", at: Date.now(), mode: NAMES[mode], png: picture(560).toDataURL("image/png") }); gallery(); toast("Drawing saved"); };
    const dl = (url, name) => { const a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); };
    $("[data-dl]", el).onclick = () => dl(picture().toDataURL("image/png"), "my-drawing.png");
    $("[data-gallery]", el).onclick = (e) => { const d = e.target.dataset.del, k = e.target.dataset.dl2; if (k) { const x = WP.data.gallery().find((g) => g.id === k); x && dl(x.png, "drawing.png"); } if (d && confirm("Delete this drawing?")) { WP.data.delDrawing(d); gallery(); } };
    paintSubs(); const ro = new ResizeObserver(() => { if (Math.abs(box.clientWidth - Wd) > 2) size2(); }); ro.observe(box); size2(); gallery();
    return { destroy: () => ro.disconnect() };
  };

  /* ================================================================ DRAG AND SORT ================================================================ */
  /* cfg.gen() → { prompt, items:[{h,k}], bins:[{h,k,label}] }  (tap an item then a bin also works) */
  W.dragsort = function (el, cfg, ctx) {
    let round, placed, firstTry, tries, sess, sel = null;
    function start() {
      round = cfg.gen(); placed = 0; firstTry = 0; tries = new Map(); sess = ctx.session(); sel = null;
      el.innerHTML = `<p class="wp-say">${round.prompt}</p><div class="wp-tray" data-tray>${shuffle(round.items).map((it, i) => `<div class="wp-item" data-k="${esc(it.k)}" data-id="${i}" tabindex="0" role="button">${it.h}</div>`).join("")}</div>
        <div class="wp-bins" style="grid-template-columns:repeat(${Math.min(round.bins.length, cfg.cols || 4)},1fr)">${round.bins.map((b) => `<div class="wp-bin" data-bin="${esc(b.k)}"><div class="wp-binlab">${b.h}</div><div class="wp-binin"></div></div>`).join("")}</div><div class="wp-feedback" data-fb></div>`;
    }
    function drop(item, bin) {
      if (!bin) return; const id = item.dataset.id;
      if (bin.dataset.bin === item.dataset.k) { tries.get(id) || firstTry++; $(".wp-binin", bin).append(item); item.classList.add("ok"); item.removeAttribute("tabindex"); placed++; say(cfg.sayRight); if (placed === round.items.length) { const acc = firstTry / round.items.length * 100; sess.finish({ acc }); setTimeout(() => summary(el, acc, start), 500); } }
      else { tries.set(id, 1); bin.classList.add("shake"); setTimeout(() => bin.classList.remove("shake"), 400); $("[data-fb]", el).textContent = "Not that one. Look again!"; }
    }
    let drag = null;
    el.addEventListener("pointerdown", (e) => {
      const it = e.target.closest(".wp-item:not(.ok)"); if (!it) return; e.preventDefault();
      const r = it.getBoundingClientRect(); drag = { it, gh: it.cloneNode(true), dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false, x0: e.clientX, y0: e.clientY };
      Object.assign(drag.gh.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px", pointerEvents: "none", zIndex: 999, opacity: .9, transform: "scale(1.08)" });
    });
    const move = (e) => { if (!drag) return; if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) { drag.moved = true; document.body.append(drag.gh); drag.it.style.opacity = .3; } if (drag.moved) { drag.gh.style.left = e.clientX - drag.dx + "px"; drag.gh.style.top = e.clientY - drag.dy + "px"; } };
    const up = (e) => {
      if (!drag) return; const d = drag; drag = null;
      if (d.moved) { d.gh.remove(); d.it.style.opacity = ""; const bin = document.elementFromPoint(e.clientX, e.clientY)?.closest(".wp-bin"); if (bin && el.contains(bin)) drop(d.it, bin); }
      else { $$(".wp-item.sel", el).forEach((x) => x.classList.remove("sel")); sel = d.it; d.it.classList.add("sel"); }
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    el.addEventListener("click", (e) => { const bin = e.target.closest(".wp-bin"); if (bin && sel) { sel.classList.remove("sel"); drop(sel, bin); sel = null; } });
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.classList.contains("wp-item")) { $$(".wp-item.sel", el).forEach((x) => x.classList.remove("sel")); sel = e.target; sel.classList.add("sel"); } });
    start();
    return { destroy() { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); } };
  };

  /* ================================================================ QUIZ (pick the answer) ================================================================ */
  /* cfg.gen(i) → { prompt(html), say, choices:[{h, ok}], cols } */
  W.quiz = function (el, cfg, ctx) {
    const N = cfg.rounds || 6; let i, right, sess, first;
    function start() { i = 0; right = 0; sess = ctx.session(); next(); }
    function next() {
      if (i >= N) { const acc = right / N * 100; sess.finish({ acc }); return summary(el, acc, start); }
      const q = cfg.gen(i); first = true;
      el.innerHTML = `<div class="wp-prog"><i style="width:${i / N * 100}%"></i></div><div class="row" style="justify-content:space-between"><span class="badge">${i + 1} / ${N}</span>${q.say ? '<button type="button" class="wp-big ghost sm" data-hear>🔊 Listen</button>' : ""}</div>
        <div class="wp-q">${q.prompt}</div><div class="wp-choices" style="grid-template-columns:repeat(${q.cols || Math.min(q.choices.length, 4)},minmax(0,1fr))">${q.choices.map((c, k) => `<button type="button" class="wp-choice" data-k="${k}">${c.h}</button>`).join("")}</div><div class="wp-feedback" data-fb></div>`;
      if (q.say) { say(q.say); $("[data-hear]", el).onclick = () => say(q.say); }
      $$(".wp-choice", el).forEach((b) => (b.onclick = () => {
        const ok = q.choices[+b.dataset.k].ok;
        if (ok) { if (first) right++; b.classList.add("right", "pop"); $$(".wp-choice", el).forEach((x) => (x.disabled = true)); $("[data-fb]", el).innerHTML = "✔ " + (q.why || "Correct!"); setTimeout(() => { i++; next(); }, 800); }
        else { first = false; b.classList.add("wrong", "shake"); b.disabled = true; $("[data-fb]", el).textContent = "Try again!"; }
      }));
    }
    start(); return { destroy() {} };
  };

  /* ================================================================ TAP THE TARGETS ================================================================ */
  W.tapgame = function (el, cfg, ctx) {
    let timer = 0, spawn = 0, hits, miss, gone;
    el.innerHTML = `<p class="wp-say">${esc(cfg.tip || "Tap each one before it goes away!")}</p><div class="row" style="justify-content:center;margin-bottom:8px"><div class="seg" data-lv><button type="button" class="on" data-s="1">Big</button><button type="button" data-s="0.7">Medium</button><button type="button" data-s="0.45">Small</button></div><span class="badge" data-score>0</span><span class="badge" data-time>30s</span></div>
      <div class="wp-arena" data-arena><button type="button" class="wp-big wp-go" data-start>▶ Start</button></div>`;
    let scale = 1; const arena = $("[data-arena]", el);
    $("[data-lv]", el).onclick = (e) => { const b = e.target.closest("[data-s]"); if (!b) return; scale = +b.dataset.s; $$("[data-s]", el).forEach((x) => x.classList.toggle("on", x === b)); };
    function end(sess) { clearInterval(timer); clearInterval(spawn); timer = spawn = 0; const acc = hits ? hits / (hits + miss + gone) * 100 : 0; sess.finish({ acc }); summary(arena, acc, () => { arena.innerHTML = '<button type="button" class="wp-big wp-go" data-start>▶ Start</button>'; }, `<p>You tapped ${hits}.</p>`); }
    arena.addEventListener("click", (e) => {
      if (e.target.closest("[data-start]")) {
        hits = miss = gone = 0; let left = cfg.secs || 30; arena.innerHTML = ""; const sess = ctx.session();
        $("[data-time]", el).textContent = left + "s"; $("[data-score]", el).textContent = "0";
        timer = setInterval(() => { left--; $("[data-time]", el).textContent = left + "s"; if (left <= 0) end(sess); }, 1000);
        spawn = setInterval(() => {
          const t = document.createElement("button"), sz = Math.round((cfg.size || 72) * scale), r = arena.getBoundingClientRect();
          t.type = "button"; t.className = "wp-target"; t.textContent = pick(cfg.emoji || ["🎈", "⭐", "🫧", "🍎", "🦋"]); t.style.cssText = `width:${sz}px;height:${sz}px;font-size:${sz * .7}px;left:${Math.random() * Math.max(0, r.width - sz)}px;top:${Math.random() * Math.max(0, r.height - sz)}px`;
          arena.append(t); setTimeout(() => { if (t.isConnected && !t.dataset.hit) { gone++; t.remove(); } }, cfg.life || 1800);
        }, cfg.every || 850);
        return;
      }
      const t = e.target.closest(".wp-target"); if (t && !t.dataset.hit) { t.dataset.hit = 1; hits++; t.classList.add("pop"); $("[data-score]", el).textContent = hits; setTimeout(() => t.remove(), 180); }
      else if (timer && e.target === arena) miss++;
    });
    return { destroy() { clearInterval(timer); clearInterval(spawn); } };
  };

  /* ================================================================ SEQUENCE (finger tapping, bead threading) ================================================================ */
  W.seqtap = function (el, cfg, ctx) {
    const B = cfg.buttons; let len, seq, input, rounds, ok, sess, busy = false;
    el.innerHTML = `<p class="wp-say" data-tip>${esc(cfg.tip)}</p><div data-target class="wp-beads"></div><div class="wp-seqpad" style="grid-template-columns:repeat(${Math.min(B.length, 5)},1fr)">${B.map((b, i) => `<button type="button" class="wp-seqbtn" data-b="${i}" style="--c:${b.c}">${b.h}<small>${esc(b.l || "")}</small></button>`).join("")}</div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-start>▶ Start</button></div><div class="wp-feedback" data-fb></div>`;
    const flash = (i) => new Promise((res) => { const b = $(`[data-b="${i}"]`, el); b.classList.add("lit"); setTimeout(() => { b.classList.remove("lit"); setTimeout(res, 180); }, 520); });
    async function play() { busy = true; $("[data-fb]", el).textContent = "Watch…"; if (cfg.mode === "copy") { $("[data-target]", el).innerHTML = seq.map((i) => `<span style="--c:${B[i].c}">${B[i].h}</span>`).join(""); $("[data-fb]", el).textContent = "Copy this pattern."; busy = false; return; } for (const i of seq) await flash(i); $("[data-fb]", el).textContent = "Your turn!"; busy = false; }
    function newRound() { seq = Array.from({ length: len }, () => Math.floor(Math.random() * B.length)); input = []; if (cfg.mode === "copy") $("[data-target]", el).innerHTML = ""; play(); }
    $("[data-start]", el).onclick = () => { len = cfg.start || 2; rounds = 0; ok = 0; sess = ctx.session(); newRound(); };
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-b]"); if (!b || busy || !seq) return; const i = +b.dataset.b; b.classList.add("lit"); setTimeout(() => b.classList.remove("lit"), 160);
      if (cfg.labelsSay) say(B[i].l); input.push(i);
      if (cfg.mode === "copy") $("[data-target]", el).innerHTML = seq.map((s, k) => `<span style="--c:${B[s].c}" class="${k < input.length ? (input[k] === s ? "done" : "bad") : ""}">${B[s].h}</span>`).join("");
      const k = input.length - 1;
      if (input[k] !== seq[k]) { rounds++; $("[data-fb]", el).textContent = "Oops! Let's try that one again."; if (rounds >= (cfg.rounds || 6)) return endIt(); setTimeout(newRound, 900); return; }
      if (input.length === seq.length) { rounds++; ok++; len = Math.min(len + 1, cfg.max || 7); $("[data-fb]", el).textContent = "✔ Well done!"; if (rounds >= (cfg.rounds || 6)) return endIt(); setTimeout(newRound, 900); }
    });
    function endIt() { const acc = ok / rounds * 100; sess.finish({ acc }); seq = null; summary($("[data-fb]", el), acc, () => $("[data-start]", el).click()); }
    return { destroy() {} };
  };

  /* ================================================================ PRESS AND HOLD (finger strength) ================================================================ */
  W.hold = function (el, cfg, ctx) {
    const steps = cfg.steps; let i = 0, t0 = 0, raf = 0, ok = 0, sess = null; const need = cfg.secs || 3;
    el.innerHTML = `<p class="wp-say" data-tip></p><div class="wp-holdwrap"><button type="button" class="wp-hold" data-h><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7f2" stroke-width="10"/><circle data-ring cx="60" cy="60" r="52" fill="none" stroke="#18a88f" stroke-width="10" stroke-dasharray="327" stroke-dashoffset="327" transform="rotate(-90 60 60)"/></svg><span data-e>👆</span></button></div><div class="wp-feedback" data-fb></div>`;
    const ring = $("[data-ring]", el), btn = $("[data-h]", el);
    function show() { const s = steps[i % steps.length]; $("[data-tip]", el).textContent = `${i + 1}/${steps.length}: ${s.t} Hold for ${need} seconds.`; $("[data-e]", el).textContent = s.e; ring.style.strokeDashoffset = 327; }
    const down = (e) => { e.preventDefault(); if (!sess) sess = ctx.session(); t0 = performance.now(); const tick = (n) => { const p = Math.min(1, (n - t0) / (need * 1000)); ring.style.strokeDashoffset = 327 * (1 - p); if (p < 1) raf = requestAnimationFrame(tick); else { raf = 0; ok++; $("[data-fb]", el).textContent = "✔ Strong fingers!"; i++; if (i >= steps.length) { sess.finish({ acc: ok / steps.length * 100 }); summary($("[data-fb]", el), ok / steps.length * 100, () => { i = 0; ok = 0; sess = null; show(); }); } else setTimeout(show, 700); } }; raf = requestAnimationFrame(tick); };
    const upH = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; ring.style.strokeDashoffset = 327; $("[data-fb]", el).textContent = "Keep pressing a little longer!"; } };
    btn.addEventListener("pointerdown", down); btn.addEventListener("pointerup", upH); btn.addEventListener("pointerleave", upH); btn.addEventListener("pointercancel", upH);
    show(); return { destroy() { cancelAnimationFrame(raf); } };
  };

  /* ================================================================ MEMORY (match identical) ================================================================ */
  W.memory = function (el, cfg, ctx) {
    let open = [], moves, found, sess, lock = false;
    function start() {
      const n = cfg.pairs || 6, pool = shuffle(cfg.emoji).slice(0, n), cards = shuffle(pool.concat(pool)); moves = 0; found = 0; sess = ctx.session(); open = [];
      el.innerHTML = `<p class="wp-say">Find the two pictures that are the same.</p><div class="wp-memory" style="grid-template-columns:repeat(${n > 6 ? 5 : 4},1fr)">${cards.map((c, i) => `<button type="button" class="wp-card" data-v="${c}" data-i="${i}"><span>${c}</span></button>`).join("")}</div><div class="wp-feedback" data-fb></div>`;
      $$(".wp-card", el).forEach((b) => (b.onclick = () => {
        if (lock || b.classList.contains("up")) return; b.classList.add("up"); open.push(b);
        if (open.length === 2) { moves++; const [a, c] = open; open = []; if (a.dataset.v === c.dataset.v) { found++; a.classList.add("ok"); c.classList.add("ok"); if (found === n) { const acc = Math.min(100, n / moves * 100); sess.finish({ acc }); setTimeout(() => summary(el, acc, start, `<p>${moves} tries.</p>`), 500); } } else { lock = true; setTimeout(() => { a.classList.remove("up"); c.classList.remove("up"); lock = false; }, 800); } }
      }));
    }
    start(); return { destroy() {} };
  };

  /* ================================================================ CONNECT MATCHING PAIRS ================================================================ */
  W.pairs = function (el, cfg, ctx) {
    let sel = null, done, wrong, sess, round;
    function start() {
      round = cfg.gen(); done = 0; wrong = 0; sess = ctx.session(); sel = null;
      const L = round.pairs.map((p, i) => ({ h: p[0], k: i })), R = shuffle(round.pairs.map((p, i) => ({ h: p[1], k: i })));
      el.innerHTML = `<p class="wp-say">${round.prompt}</p><div class="wp-pairs"><svg class="wp-lines"></svg><div class="col">${L.map((x) => `<button type="button" class="wp-dot" data-side="L" data-k="${x.k}">${x.h}</button>`).join("")}</div><div class="col">${R.map((x) => `<button type="button" class="wp-dot" data-side="R" data-k="${x.k}">${x.h}</button>`).join("")}</div></div><div class="wp-feedback" data-fb></div>`;
    }
    function line(a, b) { const box = $(".wp-pairs", el), r = box.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect(); $(".wp-lines", el).insertAdjacentHTML("beforeend", `<line x1="${A.right - r.left}" y1="${A.top + A.height / 2 - r.top}" x2="${B.left - r.left}" y2="${B.top + B.height / 2 - r.top}" stroke="#18a88f" stroke-width="4" stroke-linecap="round"/>`); }
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".wp-dot:not(.ok)"); if (!b) return;
      if (!sel || sel.dataset.side === b.dataset.side) { $$(".wp-dot.sel", el).forEach((x) => x.classList.remove("sel")); sel = b; b.classList.add("sel"); return; }
      if (sel.dataset.k === b.dataset.k) { const [l, r] = sel.dataset.side === "L" ? [sel, b] : [b, sel]; line(l, r); [sel, b].forEach((x) => { x.classList.remove("sel"); x.classList.add("ok"); }); done++; sel = null;
        if (done === round.pairs.length) { const acc = Math.max(0, 100 - wrong / round.pairs.length * 50); sess.finish({ acc }); setTimeout(() => summary(el, acc, start), 700); } }
      else { wrong++; [sel, b].forEach((x) => { x.classList.add("shake"); setTimeout(() => x.classList.remove("shake", "sel"), 400); }); sel = null; }
    });
    start(); return { destroy() {} };
  };

  /* ================================================================ PICTURE PUZZLE (swap pieces) ================================================================ */
  W.puzzle = function (el, cfg, ctx) {
    let n = 2, order, sel = null, moves, sess, img = cfg.emoji[0];
    el.innerHTML = `<div class="wp-chips">${cfg.emoji.map((e, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-e="${e}" style="font-size:1.4rem">${e}</button>`).join("")}</div><div class="seg" style="margin:8px 0"><button type="button" class="on" data-n="2">4 pieces</button><button type="button" data-n="3">9 pieces</button></div><p class="wp-say">Tap two pieces to swap them. Make the picture whole!</p><div data-board></div><div class="wp-feedback" data-fb></div>`;
    function pieces() { const S = 360, c = document.createElement("canvas"); c.width = c.height = S; const x = c.getContext("2d"); x.fillStyle = "#fff8e6"; x.fillRect(0, 0, S, S); x.font = `${S * .8}px serif`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(img, S / 2, S / 2 + S * .05); const out = []; const p = S / n; for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) { const pc = document.createElement("canvas"); pc.width = pc.height = p; pc.getContext("2d").drawImage(c, q * p, r * p, p, p, 0, 0, p, p); out.push(pc.toDataURL()); } return out; }
    function start() { const P = pieces(); do order = shuffle(P.map((_, i) => i)); while (order.every((v, i) => v === i)); moves = 0; sess = ctx.session(); sel = null; draw(P); }
    function draw(P) { const b = $("[data-board]", el); b.className = "wp-puzzle"; b.style.gridTemplateColumns = `repeat(${n},1fr)`; b.innerHTML = order.map((v, i) => `<button type="button" data-p="${i}"><img src="${P[v]}" alt="piece"></button>`).join(""); b.onclick = (e) => { const t = e.target.closest("[data-p]"); if (!t) return; if (sel == null) { sel = +t.dataset.p; t.classList.add("sel"); return; } const a = sel, c = +t.dataset.p; sel = null; [order[a], order[c]] = [order[c], order[a]]; moves++; draw(P); if (order.every((v, i) => v === i)) { const best = n * n - 1, acc = Math.min(100, best / moves * 100); sess.finish({ acc }); $("[data-fb]", el).innerHTML = `<div class="wp-stars">${stars(starsFor(acc))}</div><b>You did it in ${moves} moves!</b>`; celebrate(); } }; }
    el.addEventListener("click", (e) => { const em = e.target.closest("[data-e]"), nn = e.target.closest("[data-n]"); if (em) { img = em.dataset.e; $$("[data-e]", el).forEach((x) => x.classList.toggle("on", x === em)); start(); } if (nn) { n = +nn.dataset.n; $$("[data-n]", el).forEach((x) => x.classList.toggle("on", x === nn)); start(); } });
    start(); return { destroy() {} };
  };

  /* ================================================================ BUILDER (letters → word, words → sentence, sentences → story) ================================================================ */
  /* cfg.gen(i) → { prompt, pieces:[..], answer:[..], sep, say, block } */
  W.builder = function (el, cfg, ctx) {
    const N = cfg.rounds || 5; let i, right, sess, q, built, pool, first;
    function start() { i = 0; right = 0; sess = ctx.session(); next(); }
    function next() {
      if (i >= N) { const acc = right / N * 100; sess.finish({ acc }); return summary(el, acc, start); }
      q = cfg.gen(i); built = []; first = true; pool = shuffle(q.pieces.map((t, k) => ({ t, k })));
      if (pool.map((p) => p.t).join("|") === q.answer.join("|") && pool.length > 1) pool.reverse();
      paint(); if (q.say) say(q.say);
    }
    function paint() {
      el.innerHTML = `<div class="wp-prog"><i style="width:${i / N * 100}%"></i></div><div class="row" style="justify-content:space-between"><span class="badge">${i + 1} / ${N}</span>${q.say ? '<button type="button" class="wp-big ghost sm" data-hear>🔊 Listen</button>' : ""}</div>
        <div class="wp-q">${q.prompt}</div><div class="wp-answer ${q.block ? "block" : ""}" data-ans>${built.length ? built.map((p, k) => `<button type="button" class="wp-tile in" data-b="${k}">${esc(p.t)}</button>`).join("") : '<span class="muted">Tap the pieces below in the right order</span>'}</div>
        <div class="wp-pool ${q.block ? "block" : ""}">${pool.map((p, k) => `<button type="button" class="wp-tile" data-p="${k}">${esc(p.t)}</button>`).join("")}</div>
        <div class="wp-tools"><button type="button" class="wp-big ghost" data-reset>↺ Start again</button><button type="button" class="wp-big wp-go" data-check>✔ Check</button></div><div class="wp-feedback" data-fb></div>`;
      if (q.say) $("[data-hear]", el).onclick = () => say(q.say);
    }
    el.addEventListener("click", (e) => {
      const p = e.target.closest("[data-p]"), b = e.target.closest("[data-b]");
      if (p) { built.push(pool.splice(+p.dataset.p, 1)[0]); paint(); }
      if (b) { pool.push(built.splice(+b.dataset.b, 1)[0]); paint(); }
      if (e.target.closest("[data-reset]")) { pool = pool.concat(built); built = []; paint(); }
      if (e.target.closest("[data-check]")) {
        if (pool.length) { $("[data-fb]", el).textContent = "Use all the pieces first."; return; }
        if (built.map((x) => x.t).join("|") === q.answer.join("|")) { if (first) right++; $("[data-ans]", el).classList.add("pop"); $("[data-fb]", el).innerHTML = "✔ Correct! " + esc(q.answer.join(q.sep ?? " ")); setTimeout(() => { i++; next(); }, 1200); }
        else { first = false; $("[data-ans]", el).classList.add("shake"); setTimeout(() => $("[data-ans]", el)?.classList.remove("shake"), 400); $("[data-fb]", el).textContent = "Not quite. Try again!"; }
      }
    });
    start(); return { destroy() {} };
  };

  /* ================================================================ TYPE AND CHECK ================================================================ */
  /* cfg.gen(i) → { prompt, say, check(text) → {ok, msg}, answer, big, multi } */
  W.typecheck = function (el, cfg, ctx) {
    const N = cfg.rounds || 5; let i, right, sess, q, tries;
    function start() { i = 0; right = 0; sess = ctx.session(); next(); }
    function next() {
      if (i >= N) { const acc = right / N * 100; sess.finish({ acc }); return summary(el, acc, start); }
      q = cfg.gen(i); tries = 0;
      el.innerHTML = `<div class="wp-prog"><i style="width:${i / N * 100}%"></i></div><div class="row" style="justify-content:space-between"><span class="badge">${i + 1} / ${N}</span>${q.say ? '<button type="button" class="wp-big ghost sm" data-hear>🔊 Listen</button>' : ""}</div>
        <div class="wp-q">${q.prompt}</div>${q.multi ? '<textarea class="wp-type" rows="3" data-in spellcheck="false"></textarea>' : '<input class="wp-type" data-in autocomplete="off" autocapitalize="off" spellcheck="false">'}
        <div class="wp-tools"><button type="button" class="wp-big ghost" data-show>👀 Show answer</button><button type="button" class="wp-big wp-go" data-check>✔ Check</button></div><div class="wp-feedback" data-fb></div>`;
      if (q.say) { say(q.say); $("[data-hear]", el).onclick = () => say(q.say); }
      const inp = $("[data-in]", el); inp.focus({ preventScroll: true }); if (q.prefill) inp.value = q.prefill;
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !q.multi) $("[data-check]", el).click(); });
      $("[data-check]", el).onclick = () => { const v = inp.value.trim(); if (!v) return; const r = q.check(v); tries++;
        if (r.ok) { if (tries === 1) right++; $("[data-fb]", el).innerHTML = "✔ " + esc(r.msg || "Correct!"); inp.classList.add("ok"); setTimeout(() => { i++; next(); }, 1300); }
        else { inp.classList.add("shake"); setTimeout(() => inp.classList.remove("shake"), 400); $("[data-fb]", el).textContent = r.msg || "Not yet. Try again!"; } };
      $("[data-show]", el).onclick = () => { tries = 9; $("[data-fb]", el).innerHTML = `Answer: <b>${esc(q.answer)}</b> <button type="button" class="wp-big ghost sm" data-nx>Next ➜</button>`; $("[data-nx]", el).onclick = () => { i++; next(); }; };
    }
    start(); return { destroy() {} };
  };

  /* ================================================================ MOVEMENT COACH, COMMANDS, RHYTHM ================================================================ */
  W.coach = function (el, cfg, ctx) {
    const R = cfg.routines; let r = 0, s = 0, left = 0, t = 0, sess;
    el.innerHTML = `<div class="wp-chips">${R.map((x, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-r="${i}">${esc(x.name)}</button>`).join("")}</div><div class="wp-coach" data-card></div>
      <div class="wp-tools"><button type="button" class="wp-big ghost" data-prev>⬅ Back</button><button type="button" class="wp-big wp-go" data-go>▶ Start</button><button type="button" class="wp-big ghost" data-next>Next ➜</button></div>`;
    function card() { const st = R[r].steps[s]; $("[data-card]", el).innerHTML = `<div class="wp-coach-e ${st.anim || ""}">${st.e}</div><div class="wp-coach-t">${esc(st.t)}</div><div class="wp-coach-n">Step ${s + 1} of ${R[r].steps.length}${left ? ` · <b>${left}s</b>` : ""}</div>`; }
    function run() { clearInterval(t); const st = R[r].steps[s]; left = st.s || 10; card(); say(st.t); t = setInterval(() => { left--; card(); if (left <= 0) { clearInterval(t); t = 0; if (s < R[r].steps.length - 1) { s++; run(); } else { left = 0; card(); sess && sess.finish({ done: true, note: R[r].name }); sess = null; $("[data-card]", el).insertAdjacentHTML("beforeend", '<div class="wp-coach-done">🎉 All done! Great moving!</div>'); celebrate(); } } }, 1000); }
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-r]"); if (b) { r = +b.dataset.r; s = 0; left = 0; clearInterval(t); $$("[data-r]", el).forEach((x) => x.classList.toggle("on", x === b)); card(); }
      if (e.target.closest("[data-go]")) { if (!sess) sess = ctx.session(); run(); }
      if (e.target.closest("[data-next]")) { clearInterval(t); left = 0; s = Math.min(s + 1, R[r].steps.length - 1); card(); }
      if (e.target.closest("[data-prev]")) { clearInterval(t); left = 0; s = Math.max(0, s - 1); card(); }
    });
    card(); return { destroy() { clearInterval(t); } };
  };
  W.commands = function (el, cfg, ctx) {
    let i, ok, t = 0, sess, N = cfg.rounds || 8;
    el.innerHTML = `<p class="wp-say">The child listens and does each action. The teacher taps ✔ when it is done well.</p><div class="wp-coach" data-card><div class="wp-coach-e">🧍</div><div class="wp-coach-t">Ready?</div></div><div class="wp-tools"><button type="button" class="wp-big wp-go" data-go>▶ Start</button></div><div class="wp-tools" data-mark hidden><button type="button" class="wp-big ghost" data-no>✘ Not yet</button><button type="button" class="wp-big wp-go" data-yes>✔ Done well</button></div>`;
    function show() { const c = pick(cfg.commands); $("[data-card]", el).innerHTML = `<div class="wp-coach-e">${c[0]}</div><div class="wp-coach-t">${esc(c[1])}</div><div class="wp-coach-n">${i + 1} of ${N}</div>`; say(c[1]); $("[data-mark]", el).hidden = false; }
    function mark(y) { if (y) ok++; i++; if (i >= N) { $("[data-mark]", el).hidden = true; const acc = ok / N * 100; sess.finish({ acc }); summary($("[data-card]", el), acc, () => $("[data-go]", el).click()); } else show(); }
    $("[data-go]", el).onclick = () => { i = 0; ok = 0; sess = ctx.session(); show(); };
    $("[data-yes]", el).onclick = () => mark(true); $("[data-no]", el).onclick = () => mark(false);
    return { destroy() { clearInterval(t); } };
  };
  W.metronome = function (el, cfg, ctx) {
    let ac, t = 0, beat = 0, sess, end = 0;
    el.innerHTML = `<div class="wp-chips">${cfg.patterns.map((p, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-p="${i}">${esc(p.name)}</button>`).join("")}</div>
      <div class="wp-beat" data-beat><div class="wp-coach-e" data-e>👏</div><div class="wp-coach-t" data-t>Press Start</div></div>
      <div class="row" style="justify-content:center;gap:12px"><label class="small"><b>Speed</b> <input type="range" min="50" max="130" value="80" data-bpm></label><span class="badge" data-bpmv>80 beats per minute</span></div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-go>▶ Start</button><button type="button" class="wp-big ghost" data-stop>■ Stop</button></div>`;
    let p = cfg.patterns[0];
    const click = (hi) => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = hi ? 1000 : 660; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(.3, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .08); o.start(); o.stop(ac.currentTime + .09); } catch (e) {} };
    function tick() { const st = p.beats[beat % p.beats.length]; $("[data-e]", el).textContent = st[0]; $("[data-t]", el).textContent = st[1]; const b = $("[data-beat]", el); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); click(beat % p.beats.length === 0); beat++; if (Date.now() > end) stop(true); }
    function stop(done) { clearInterval(t); t = 0; if (done && sess) { sess.finish({ done: true, note: p.name }); sess = null; $("[data-t]", el).textContent = "Well done! 🎉"; } }
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-p]"); if (b) { p = cfg.patterns[+b.dataset.p]; $$("[data-p]", el).forEach((x) => x.classList.toggle("on", x === b)); } });
    $("[data-bpm]", el).oninput = (e) => { $("[data-bpmv]", el).textContent = e.target.value + " beats per minute"; if (t) { clearInterval(t); t = setInterval(tick, 60000 / e.target.value); } };
    $("[data-go]", el).onclick = () => { stop(false); beat = 0; sess = ctx.session(); end = Date.now() + (cfg.secs || 60) * 1000; tick(); t = setInterval(tick, 60000 / $("[data-bpm]", el).value); };
    $("[data-stop]", el).onclick = () => stop(true);
    return { destroy() { clearInterval(t); } };
  };

  /* ================================================================ OBSERVATION CHECKLIST (pencil grip, gross motor) ================================================================ */
  W.checklist = function (el, cfg, ctx) {
    el.innerHTML = `${cfg.intro || ""}<div class="wp-checklist">${cfg.items.map((t, i) => `<div class="wp-crow"><span>${esc(t)}</span><div class="seg"><button type="button" data-i="${i}" data-v="0">Not yet</button><button type="button" data-i="${i}" data-v="1">Sometimes</button><button type="button" data-i="${i}" data-v="2">Yes</button></div></div>`).join("")}</div>
      <div class="field" style="margin-top:12px"><label>Teacher's note (optional)</label><textarea class="textarea" rows="2" data-note placeholder="e.g. Holds the crayon with the whole fist; try a short, thick crayon."></textarea></div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-save>💾 Save observation</button></div><div class="wp-feedback" data-fb></div>`;
    const vals = {};
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (!b) return; vals[b.dataset.i] = +b.dataset.v; $$(`[data-i="${b.dataset.i}"]`, el).forEach((x) => x.classList.toggle("on", x === b)); });
    $("[data-save]", el).onclick = () => {
      const ch = WP.data.child(); if (!ch) return toast("Choose or add a child at the top of the page first");
      const n = Object.keys(vals).length; if (n < cfg.items.length) return toast("Mark every line first");
      const score = Object.values(vals).reduce((a, b) => a + b, 0) / (cfg.items.length * 2) * 100;
      const txt = cfg.items.map((t, i) => `${t}: ${["Not yet", "Sometimes", "Yes"][vals[i]]}`).join("; ") + ($("[data-note]", el).value.trim() ? ". Note: " + $("[data-note]", el).value.trim() : "");
      WP.data.addObs(ch.id, `${cfg.title}: ${txt}`, ctx.cat); ctx.session().finish({ acc: score, note: cfg.title });
      $("[data-fb]", el).textContent = "Saved to " + ch.name + "'s progress."; toast("Observation saved");
    };
    return { destroy() {} };
  };

  /* ================================================================ WRITING PAD (with teacher feedback) ================================================================ */
  /* cfg.prompts: [{title, intro(html), questions[], words[], min}]  */
  W.writepad = function (el, cfg, ctx) {
    let p = 0, piece = null;
    el.innerHTML = `<div class="wp-chips" data-ps>${cfg.prompts.map((x, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-p="${i}">${esc(x.title)}</button>`).join("")}<button type="button" class="wp-chip" data-rand>🎲 Surprise me</button></div>
      <div class="wp-prompt" data-prompt></div>
      <div class="field"><label>Title</label><input class="input wp-kidfont" data-title></div>
      <textarea class="wp-paper" data-text placeholder="Start writing here…"></textarea>
      <div class="row small" style="justify-content:space-between;margin:6px 0"><span data-wc>0 words</span><span data-checks></span></div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-save>💾 Save</button><button type="button" class="wp-big ghost" data-read>🔊 Read aloud</button><button type="button" class="wp-big ghost" data-print>🖨 Print</button><button type="button" class="wp-big ghost" data-new>New page</button></div>
      <details class="wp-teacher" data-fbbox><summary>Teacher feedback</summary>
        <div class="wp-rubric">${["Ideas and content", "Organisation", "Language and vocabulary", "Spelling and punctuation"].map((c, i) => `<label>${c}<select class="select" data-r="${i}"><option value="">–</option><option value="1">1 · Beginning</option><option value="2">2 · Developing</option><option value="3">3 · Good</option><option value="4">4 · Excellent</option></select></label>`).join("")}</div>
        <textarea class="textarea" rows="2" data-comment placeholder="Comment for the child"></textarea><button type="button" class="btn btn-soft btn-sm" data-savefb style="margin-top:6px">Save feedback</button></details>
      <div data-list></div>`;
    const sess = { s: null };
    function prompt() { const x = cfg.prompts[p]; $("[data-prompt]", el).innerHTML = `${x.intro || ""}${x.questions && x.questions.length ? `<ol class="wp-qs">${x.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ol>` : ""}${x.words && x.words.length ? `<div class="wp-bank">${x.words.map((w) => `<button type="button" class="wp-word">${esc(w)}</button>`).join("")}</div>` : ""}`; if (!piece) $("[data-title]", el).value = x.title; checks(); }
    function checks() {
      const v = $("[data-text]", el).value.trim(), words = v ? v.split(/\s+/).length : 0, x = cfg.prompts[p], min = x.min || cfg.min || 30;
      const sents = v.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
      const list = [["Capital letters at the start", sents.length > 0 && sents.every((s) => /^[A-Z"'“0-9]/.test(s.trim()))], ["Full stops at the end", /[.!?]["'”]?$/.test(v)], [`At least ${min} words`, words >= min], ["Uses word-bank words", !x.words || !x.words.length || x.words.some((w) => v.toLowerCase().includes(w.toLowerCase()))]];
      $("[data-wc]", el).textContent = words + (words === 1 ? " word" : " words");
      $("[data-checks]", el).innerHTML = list.map(([t, ok]) => `<span class="wp-ck ${ok ? "ok" : ""}">${ok ? "✔" : "○"} ${t}</span>`).join(" ");
      return list;
    }
    function list() {
      const ch = WP.data.child(), items = WP.data.portfolio(ch ? ch.id : "guest", ctx.cat);
      $("[data-list]", el).innerHTML = items.length ? `<h3 class="wp-h3">Saved writing (${items.length})</h3><ul class="saved">${items.map((it) => `<li><span class="s-name">${esc(it.title || "Untitled")}</span><small class="muted">${new Date(it.at).toLocaleDateString()}${it.fb && it.fb.scores ? " · feedback given" : ""}</small><button type="button" data-open="${it.id}">Open</button><button type="button" data-del="${it.id}" aria-label="Delete">✕</button></li>`).join("")}</ul>` : "";
    }
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-p]"); if (b) { p = +b.dataset.p; $$("[data-p]", el).forEach((x) => x.classList.toggle("on", x === b)); piece = null; $("[data-text]", el).value = ""; prompt(); }
      if (e.target.closest("[data-rand]")) { const k = Math.floor(Math.random() * cfg.prompts.length); $(`[data-p="${k}"]`, el).click(); }
      const w = e.target.closest(".wp-word"); if (w) { const t = $("[data-text]", el); t.value = (t.value.replace(/\s+$/, "") + " " + w.textContent).trimStart(); t.focus(); checks(); }
      const o = e.target.closest("[data-open]"); if (o) { const it = WP.data.portfolio().find((x) => x.id === o.dataset.open); if (!it) return; piece = it; $("[data-title]", el).value = it.title; $("[data-text]", el).value = it.text; const k = cfg.prompts.findIndex((x) => x.title === it.prompt); if (k >= 0) { p = k; $$("[data-p]", el).forEach((x) => x.classList.toggle("on", +x.dataset.p === k)); } prompt(); $$("[data-r]", el).forEach((s) => (s.value = it.fb && it.fb.scores ? it.fb.scores[s.dataset.r] || "" : "")); $("[data-comment]", el).value = it.fb ? it.fb.comment || "" : ""; checks(); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: "smooth" }); }
      const d = e.target.closest("[data-del]"); if (d && confirm("Delete this writing?")) { WP.data.delPiece(d.dataset.del); if (piece && piece.id === d.dataset.del) piece = null; list(); }
    });
    $("[data-text]", el).addEventListener("input", () => { if (!sess.s) sess.s = ctx.session(); checks(); });
    $("[data-save]", el).onclick = () => {
      const text = $("[data-text]", el).value.trim(); if (!text) return toast("Write something first");
      const ch = WP.data.child(), c = checks(), acc = c.filter((x) => x[1]).length / c.length * 100;
      piece = Object.assign(piece || { id: uid(), at: Date.now() }, { child: ch ? ch.id : "guest", cat: ctx.cat, prompt: cfg.prompts[p].title, title: $("[data-title]", el).value.trim() || cfg.prompts[p].title, text, updated: Date.now() });
      WP.data.savePiece(piece); (sess.s || ctx.session()).finish({ acc, note: piece.title }); sess.s = null; list(); toast("Saved" + (ch ? " for " + ch.name : ""));
    };
    $("[data-savefb]", el).onclick = () => { if (!piece) return toast("Save the writing first, then add feedback"); piece.fb = { scores: $$("[data-r]", el).map((s) => +s.value || 0), comment: $("[data-comment]", el).value.trim(), at: Date.now() }; WP.data.savePiece(piece); list(); toast("Feedback saved"); };
    $("[data-read]", el).onclick = () => say(($("[data-title]", el).value ? $("[data-title]", el).value + ". " : "") + $("[data-text]", el).value);
    $("[data-new]", el).onclick = () => { if ($("[data-text]", el).value.trim() && !confirm("Start a new page? Save first if you want to keep this one.")) return; piece = null; $("[data-text]", el).value = ""; prompt(); };
    $("[data-print]", el).onclick = () => { const box = document.createElement("div"); box.innerHTML = `<div class="ws-page-print"><h2>${esc($("[data-title]", el).value)}</h2><div style="white-space:pre-wrap;font-family:Andika,sans-serif;font-size:14pt;line-height:2">${esc($("[data-text]", el).value)}</div></div>`; SK.printEl(box); };
    prompt(); list(); return { destroy() {} };
  };

  /* ================================================================ TEMPLATE WRITER (letters, notices, invitations…) ================================================================ */
  W.template = function (el, cfg, ctx) {
    let t = cfg.templates[0]; const vals = {};
    el.innerHTML = `<div class="wp-chips" data-ts>${cfg.templates.map((x, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-t="${i}">${esc(x.name)}</button>`).join("")}</div>
      <div class="split" style="margin-top:12px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)"><div data-form></div><div><div class="wp-letter" data-out></div><p class="small muted" data-tips></p>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-save>💾 Save</button><button type="button" class="wp-big ghost" data-print>🖨 Print</button><button type="button" class="wp-big ghost" data-ex>Fill example</button></div></div></div>`;
    function form() { $("[data-form]", el).innerHTML = `<p class="small muted">${esc(t.about)}</p>` + t.fields.map((f) => `<div class="field"><label>${esc(f[1])}</label>${f[3] ? `<textarea class="textarea" rows="3" data-f="${f[0]}" placeholder="${esc(f[2])}"></textarea>` : `<input class="input" data-f="${f[0]}" placeholder="${esc(f[2])}">`}</div>`).join(""); out(); }
    function v() { const o = {}; $$("[data-f]", el).forEach((x) => (o[x.dataset.f] = x.value.trim())); return o; }
    function out() { const o = v(); $("[data-out]", el).innerHTML = t.render(o, (k, ph) => (o[k] ? esc(o[k]).replace(/\n/g, "<br>") : `<span class="ph">${esc(ph)}</span>`)); const missing = t.fields.filter((f) => !o[f[0]]).length; $("[data-tips]", el).textContent = missing ? `${missing} part(s) still empty. Grey text shows what goes there.` : "✔ All parts of the format are filled in."; }
    el.addEventListener("input", (e) => { if (e.target.dataset.f) { if (!vals.s) vals.s = ctx.session(); out(); } });
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-t]"); if (b) { t = cfg.templates[+b.dataset.t]; $$("[data-t]", el).forEach((x) => x.classList.toggle("on", x === b)); form(); } });
    $("[data-ex]", el).onclick = () => { $$("[data-f]", el).forEach((x) => (x.value = t.example[x.dataset.f] || "")); out(); };
    $("[data-print]", el).onclick = () => SK.printEl($("[data-out]", el));
    $("[data-save]", el).onclick = () => { const o = v(), filled = t.fields.filter((f) => o[f[0]]).length; if (!filled) return toast("Fill in the form first"); const ch = WP.data.child();
      WP.data.savePiece({ id: uid(), at: Date.now(), child: ch ? ch.id : "guest", cat: ctx.cat, prompt: t.name, title: t.name, text: $("[data-out]", el).innerText });
      (vals.s || ctx.session()).finish({ acc: filled / t.fields.length * 100, note: t.name }); vals.s = null; toast("Saved" + (ch ? " for " + ch.name : "")); };
    form(); return { destroy() {} };
  };

  /* ================================================================ DIARY ================================================================ */
  W.diary = function (el, cfg, ctx) {
    const MOODS = ["😀", "🙂", "😐", "😢", "😠", "🤩"];
    el.innerHTML = `<div class="wp-diary"><div class="row" style="justify-content:space-between"><input type="date" class="input" data-date style="width:auto"><div class="wp-moods">${MOODS.map((m) => `<button type="button" data-m="${m}" aria-label="Mood">${m}</button>`).join("")}</div></div>
      <div class="wp-bank" style="margin:10px 0">${cfg.prompts.map((p) => `<button type="button" class="wp-word" data-q>${esc(p)}</button>`).join("")}</div>
      <textarea class="wp-paper" data-text placeholder="Dear Diary, today…"></textarea><div class="small muted" data-wc>0 words</div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-save>💾 Save today's page</button></div></div><div data-list></div>`;
    const today = new Date(); $("[data-date]", el).value = today.toISOString().slice(0, 10); let mood = "", sess = null;
    el.addEventListener("click", (e) => { const m = e.target.closest("[data-m]"); if (m) { mood = m.dataset.m; $$("[data-m]", el).forEach((x) => x.classList.toggle("on", x === m)); } const q = e.target.closest("[data-q]"); if (q) { const t = $("[data-text]", el); t.value = (t.value ? t.value.replace(/\s+$/, "") + "\n\n" : "") + q.textContent + " "; t.focus(); }
      const o = e.target.closest("[data-open]"); if (o) { const it = WP.data.portfolio().find((x) => x.id === o.dataset.open); if (it) { $("[data-text]", el).value = it.text; $("[data-date]", el).value = it.date; } }
      const d = e.target.closest("[data-del]"); if (d && confirm("Delete this diary page?")) { WP.data.delPiece(d.dataset.del); list(); } });
    $("[data-text]", el).oninput = (e) => { if (!sess) sess = ctx.session(); const n = e.target.value.trim().split(/\s+/).filter(Boolean).length; $("[data-wc]", el).textContent = n + " words"; };
    function list() { const ch = WP.data.child(), items = WP.data.portfolio(ch ? ch.id : "guest", ctx.cat); $("[data-list]", el).innerHTML = items.length ? `<h3 class="wp-h3">My diary</h3><ul class="saved">${items.map((it) => `<li><span class="s-name">${esc(it.title)}</span><button type="button" data-open="${it.id}">Open</button><button type="button" data-del="${it.id}" aria-label="Delete">✕</button></li>`).join("")}</ul>` : ""; }
    $("[data-save]", el).onclick = () => { const text = $("[data-text]", el).value.trim(); if (!text) return toast("Write something first"); const ch = WP.data.child(), date = $("[data-date]", el).value;
      const ex = WP.data.portfolio(ch ? ch.id : "guest", ctx.cat).find((x) => x.date === date);
      WP.data.savePiece(Object.assign(ex || { id: uid(), at: Date.now() }, { child: ch ? ch.id : "guest", cat: ctx.cat, date, title: new Date(date).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }) + " " + mood, text }));
      const n = text.split(/\s+/).length; (sess || ctx.session()).finish({ acc: Math.min(100, n / (cfg.min || 40) * 100), note: "Diary " + date }); sess = null; list(); toast("Diary page saved"); };
    list(); return { destroy() {} };
  };

  /* ================================================================ EDITING AND PROOFREADING ================================================================ */
  /* cfg.sets: { name: [[wrong, right, hint], …] } */
  W.edit = function (el, cfg, ctx) {
    const names = Object.keys(cfg.sets); let set = names[0];
    el.innerHTML = `<div class="wp-chips" data-sets>${names.map((n, i) => `<button type="button" class="wp-chip ${i ? "" : "on"}" data-s="${esc(n)}">${esc(n)}</button>`).join("")}</div><div data-ex></div>`;
    const norm = (s) => s.replace(/\s+/g, " ").trim();
    let api = null;
    function run() { api && api.destroy(); const items = shuffle(cfg.sets[set]);
      api = W.typecheck($("[data-ex]", el), { rounds: Math.min(5, items.length), gen: (i) => { const [wrong, right, hint] = items[i]; return { prompt: `<span class="small muted">${esc(hint)}</span><br><span class="wp-wrong">${esc(wrong)}</span><br><span class="small">Fix the sentence below:</span>`, prefill: wrong, multi: right.length > 60, answer: right,
        check: (v) => norm(v) === norm(right) ? { ok: true, msg: "Corrected!" } : { ok: false, msg: norm(v) === norm(wrong) ? "You have not changed anything yet." : "Close! Check it again." } }; } }, ctx); }
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-s]"); if (b) { set = b.dataset.s; $$("[data-s]", el).forEach((x) => x.classList.toggle("on", x === b)); run(); } });
    run(); return { destroy() { api && api.destroy(); } };
  };

  /* ================================================================ DICTATION ================================================================ */
  W.dictation = function (el, cfg, ctx) {
    const D = () => WP.data.dict();
    el.innerHTML = `<div class="split" style="grid-template-columns:minmax(0,340px) minmax(0,1fr);margin-top:0"><div class="panel"><h3 class="wp-h3" style="margin-top:0">Teacher: dictation list</h3>
      <div class="field"><label>List name</label><input class="input" data-name placeholder="e.g. Week 3 words"></div>
      <div class="field"><label>Words or sentences (one per line)</label><textarea class="textarea" rows="6" data-items>${esc(cfg.sample.join("\n"))}</textarea></div>
      <div class="wp-tools" style="justify-content:flex-start"><button type="button" class="btn btn-soft btn-sm" data-savelist>Save list</button></div><div data-lists></div></div>
      <div class="panel" data-run><div class="row"><label class="check"><input type="checkbox" data-paper> <span>Child writes on paper (teacher marks)</span></label><label class="small"><b>Speed</b> <select class="select" data-rate style="width:auto"><option value="0.6">Slow</option><option value="0.8" selected>Normal</option><option value="1">Fast</option></select></label></div>
      <div class="wp-tools"><button type="button" class="wp-big wp-go" data-start>▶ Start dictation</button></div><div data-stage></div></div></div><div data-hist></div>`;
    const lists = () => { const d = D(); $("[data-lists]", el).innerHTML = d.lists.length ? `<ul class="saved">${d.lists.map((l, i) => `<li><span class="s-name">${esc(l.name)}</span><small class="muted">${l.items.length}</small><button type="button" data-load="${i}">Load</button><button type="button" data-dl="${i}" aria-label="Delete">✕</button></li>`).join("")}</ul>` : ""; };
    function hist() { const ch = WP.data.child(), r = D().results.filter((x) => x.child === (ch ? ch.id : "guest"));
      $("[data-hist]", el).innerHTML = r.length ? `<h3 class="wp-h3">Dictation history${ch ? " · " + esc(ch.name) : ""}</h3><div style="overflow-x:auto"><table class="wp-table"><thead><tr><th>Date</th><th>List</th><th>Score</th><th>Mistakes</th></tr></thead><tbody>${r.slice(-12).reverse().map((x) => `<tr><td>${new Date(x.at).toLocaleDateString()}</td><td>${esc(x.list)}</td><td><b>${x.score}/${x.total}</b></td><td class="small">${x.mistakes.map((m) => `${esc(m.want)} → <i>${esc(m.got || "(not written)")}</i>`).join("; ") || "None 🎉"}</td></tr>`).join("")}</tbody></table></div>${r.length > 1 ? `<p class="small">Improvement: first ${Math.round(r[0].score / r[0].total * 100)}% → latest ${Math.round(r[r.length - 1].score / r[r.length - 1].total * 100)}%</p>` : ""}` : ""; }
    el.addEventListener("click", (e) => {
      const l = e.target.closest("[data-load]"), d = e.target.closest("[data-dl]");
      if (l) { const x = D().lists[+l.dataset.load]; $("[data-name]", el).value = x.name; $("[data-items]", el).value = x.items.join("\n"); }
      if (d && confirm("Delete this list?")) { const x = D(); x.lists.splice(+d.dataset.dl, 1); WP.data.setDict(x); lists(); }
    });
    $("[data-savelist]", el).onclick = () => { const items = $("[data-items]", el).value.split("\n").map((s) => s.trim()).filter(Boolean); if (!items.length) return toast("Add some words first"); const x = D(), name = $("[data-name]", el).value.trim() || "List " + (x.lists.length + 1); x.lists = x.lists.filter((q) => q.name !== name); x.lists.unshift({ name, items }); WP.data.setDict(x); lists(); toast("List saved"); };
    $("[data-start]", el).onclick = () => {
      const items = $("[data-items]", el).value.split("\n").map((s) => s.trim()).filter(Boolean); if (!items.length) return toast("Add words or sentences first");
      const paper = $("[data-paper]", el).checked, rate = +$("[data-rate]", el).value, name = $("[data-name]", el).value.trim() || "Dictation", sess = ctx.session(); let i = 0; const res = [];
      const stage = $("[data-stage]", el), norm = (s) => s.toLowerCase().replace(/[^a-z0-9ঀ-৿ ]/g, "").replace(/\s+/g, " ").trim();
      function show() {
        if (i >= items.length) { const score = res.filter((r) => r.ok).length; const x = D(), ch = WP.data.child(); x.results.push({ at: Date.now(), child: ch ? ch.id : "guest", list: name, score, total: items.length, mistakes: res.filter((r) => !r.ok).map((r) => ({ want: r.want, got: r.got })) }); WP.data.setDict(x); sess.finish({ acc: score / items.length * 100, note: name }); summary(stage, score / items.length * 100, () => $("[data-start]", el).click(), `<p>${score} of ${items.length} correct.</p>`); hist(); return; }
        stage.innerHTML = `<div class="wp-prog"><i style="width:${i / items.length * 100}%"></i></div><p class="wp-say">Number ${i + 1} of ${items.length}. Listen and write.</p><div class="wp-tools"><button type="button" class="wp-big" data-hear>🔊 Say it again</button></div>${paper
          ? `<div class="field"><label>What the child wrote (optional, to record the mistake)</label><input class="input" data-got></div><div class="wp-tools"><button type="button" class="wp-big ghost" data-no>✘ Wrong</button><button type="button" class="wp-big wp-go" data-yes>✔ Correct</button></div>`
          : `<input class="wp-type" data-got autocomplete="off" spellcheck="false" placeholder="Type what you hear"><div class="wp-tools"><button type="button" class="wp-big wp-go" data-ok>✔ Next</button></div>`}`;
        speak(items[i], { rate }); $("[data-hear]", stage).onclick = () => speak(items[i], { rate });
        const rec = (ok) => { const got = $("[data-got]", stage).value.trim(); res.push({ want: items[i], got, ok: ok == null ? norm(got) === norm(items[i]) : ok }); i++; show(); };
        if (paper) { $("[data-yes]", stage).onclick = () => rec(true); $("[data-no]", stage).onclick = () => rec(false); } else { $("[data-ok]", stage).onclick = () => rec(null); $("[data-got]", stage).addEventListener("keydown", (e) => e.key === "Enter" && rec(null)); $("[data-got]", stage).focus(); }
      }
      show();
    };
    lists(); hist(); return { destroy() {} };
  };

  /* ================================================================ LETTER LAB (alphabet formation) ================================================================ */
  W.letterlab = function (el, cfg, ctx) {
    const sets = cfg.sets; let set = Object.keys(sets)[0], ch = sets[set][0], mode = "trace", sub = null;
    el.innerHTML = `<div class="seg" data-sets>${Object.keys(sets).map((s, i) => `<button type="button" class="${i ? "" : "on"}" data-set="${s}">${s}</button>`).join("")}</div><div class="wp-letters" data-ls></div>
      <div class="seg" data-modes style="margin:10px 0"><button type="button" class="on" data-m="trace">✏️ Trace</button><button type="button" data-m="alone">✍ Write alone</button><button type="button" data-m="find">🔎 Find it</button><button type="button" data-m="wrong">🧐 Spot the wrong one</button></div><div data-area></div>`;
    function letters() { $("[data-ls]", el).innerHTML = sets[set].map((c) => `<button type="button" class="${c === ch ? "on" : ""}" data-c="${c}">${c}</button>`).join(""); }
    function area() {
      sub && sub.destroy(); const a = $("[data-area]", el);
      if (mode === "trace" || mode === "alone") sub = W.trace(a, { options: [{ label: ch, glyphs: [WP.LETTERS[ch], WP.LETTERS[ch]] }], modes: false, opts: { hideGuide: mode === "alone" }, tip: mode === "alone" ? "Write the letter on your own. Start at the green dot." : `Trace ${ch}. Press 👀 Show me to see how it is written.` }, Object.assign({}, ctx, { practice: "Letter " + ch }));
      if (mode === "find") sub = W.quiz(a, { rounds: 6, gen: () => { const pool = sets[set], t = pick(pool), opts = shuffle([t].concat(shuffle(pool.filter((x) => x !== t)).slice(0, 3))); return { prompt: "Listen and tap the letter.", say: t, choices: opts.map((o) => ({ h: `<span class="wp-L">${o}</span>`, ok: o === t })) }; } }, ctx);
      if (mode === "wrong") sub = W.quiz(a, { rounds: 6, gen: () => { const pool = sets[set].filter((x) => !/[oOxXsSlIi]/.test(x)), t = pick(pool), bad = Math.floor(Math.random() * 4), tf = pick(["scale(-1,1)", "scale(1,-1)", "rotate(90deg)"]); return { prompt: `One <b>${t}</b> is written the wrong way. Tap it.`, choices: [0, 1, 2, 3].map((k) => ({ h: `<span class="wp-L" style="display:inline-block;transform:${k === bad ? tf : "none"}">${t}</span>`, ok: k === bad })) }; } }, ctx);
    }
    el.addEventListener("click", (e) => {
      const s = e.target.closest("[data-set]"); if (s) { set = s.dataset.set; ch = sets[set][0]; $$("[data-set]", el).forEach((x) => x.classList.toggle("on", x === s)); letters(); area(); }
      const c = e.target.closest("[data-c]"); if (c) { ch = c.dataset.c; letters(); if (mode === "trace" || mode === "alone") area(); say(ch); }
      const m = e.target.closest("[data-m]"); if (m) { mode = m.dataset.m; $$("[data-m]", el).forEach((x) => x.classList.toggle("on", x === m)); area(); }
    });
    letters(); area(); return { destroy() { sub && sub.destroy(); } };
  };
})();
