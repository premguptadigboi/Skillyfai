/* Skillyfai writing helpers.
   SKTrace(el, opts): four-line tracing canvas with finger / stylus / mouse input and a simple tracing check.
   SKSheet(text, opts): printable four-line handwriting rows (SVG), used by worksheets. */
(function () {
  "use strict";
  const FONT = "Andika, 'Plus Jakarta Sans', sans-serif";
  const fontReady = (document.fonts && document.fonts.load) ? document.fonts.load("700 80px Andika").catch(() => {}) : Promise.resolve();

  window.SKTrace = function (wrap, opts = {}) {
    wrap.classList.add("trace-wrap");
    wrap.innerHTML = "";
    const guide = document.createElement("canvas"), ink = document.createElement("canvas");
    wrap.append(guide, ink);
    const g = guide.getContext("2d"), k = ink.getContext("2d");
    let text = opts.text || "", showGuide = opts.guide !== false, strokes = [], cur = null, W = 0, H = 0, dpr = 1;
    let color = opts.color || "#3b3bb3", onStroke = opts.onStroke || null;

    const L = () => ({ top: H * 0.16, mid: H * 0.41, base: H * 0.66, desc: H * 0.86 });
    function fontSize(t) {
      const l = L(); let fs = (l.base - l.top) / 0.72;
      g.font = `700 ${fs}px ${FONT}`;
      const w = g.measureText(t).width; if (w > W * 0.9) fs *= (W * 0.9) / w;
      return fs;
    }
    function drawLines(ctx) {
      const l = L();
      ctx.lineWidth = Math.max(1, H * 0.006);
      [["top", "#9db4e8", []], ["mid", "#9db4e8", [H * 0.02, H * 0.02]], ["base", "#e98a8a", []], ["desc", "#9db4e8", []]].forEach(([n, c, dash]) => {
        ctx.beginPath(); ctx.setLineDash(dash); ctx.strokeStyle = c; ctx.moveTo(0, l[n]); ctx.lineTo(W, l[n]); ctx.stroke();
      });
      ctx.setLineDash([]);
    }
    function drawGuide() {
      g.clearRect(0, 0, W, H); drawLines(g);
      if (!text || !showGuide) return;
      const fs = fontSize(text); g.font = `700 ${fs}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.fillStyle = "rgba(120,130,170,.16)"; g.fillText(text, W / 2, L().base);
      g.setLineDash([fs * 0.04, fs * 0.05]); g.lineWidth = Math.max(1.5, fs * 0.018); g.strokeStyle = "rgba(90,98,140,.65)";
      g.strokeText(text, W / 2, L().base); g.setLineDash([]);
    }
    function drawInk() {
      k.clearRect(0, 0, W, H); k.lineCap = "round"; k.lineJoin = "round";
      strokes.forEach((s) => {
        k.strokeStyle = s.c; k.lineWidth = H * 0.04; k.beginPath();
        s.p.forEach(([x, y], i) => (i ? k.lineTo(x * W, y * H) : k.moveTo(x * W, y * H)));
        if (s.p.length === 1) k.lineTo(s.p[0][0] * W + 0.1, s.p[0][1] * H);
        k.stroke();
      });
    }
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect(); W = r.width; H = r.height;
      [guide, ink].forEach((c) => { c.width = W * dpr; c.height = H * dpr; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); });
      drawGuide(); drawInk();
    }
    const pos = (e) => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    ink.addEventListener("pointerdown", (e) => { e.preventDefault(); ink.setPointerCapture(e.pointerId); cur = { c: color, p: [pos(e)] }; strokes.push(cur); drawInk(); });
    ink.addEventListener("pointermove", (e) => { if (!cur) return; e.preventDefault(); ((e.getCoalescedEvents && e.getCoalescedEvents().length) ? e.getCoalescedEvents() : [e]).forEach((ev) => cur.p.push(pos(ev))); drawInk(); });
    const end = () => { if (cur) { cur = null; onStroke && onStroke(); } };
    ink.addEventListener("pointerup", end); ink.addEventListener("pointercancel", end);
    new ResizeObserver(size).observe(wrap);
    fontReady.then(size);

    /* Tracing check: how much of the letter shape is covered by ink, and how much ink is off the shape */
    function check() {
      if (!text) return { cover: 0, off: 0, stars: 0 };
      const w = 240, h = Math.round((240 * H) / W) || 135, sx = w / W;
      const m = document.createElement("canvas"); m.width = w; m.height = h; const mc = m.getContext("2d");
      const fs = fontSize(text) * sx; mc.font = `700 ${fs}px ${FONT}`; mc.textAlign = "center"; mc.textBaseline = "alphabetic"; mc.fillStyle = "#000"; mc.fillText(text, w / 2, L().base * sx);
      const near = document.createElement("canvas"); near.width = w; near.height = h; const nc = near.getContext("2d");
      nc.font = mc.font; nc.textAlign = "center"; nc.textBaseline = "alphabetic"; nc.lineWidth = H * 0.05 * sx; nc.lineJoin = "round"; nc.strokeStyle = "#000"; nc.fillStyle = "#000";
      nc.fillText(text, w / 2, L().base * sx); nc.strokeText(text, w / 2, L().base * sx);
      const ic = document.createElement("canvas"); ic.width = w; ic.height = h; const icx = ic.getContext("2d"); icx.lineCap = "round"; icx.lineJoin = "round";
      strokes.forEach((s) => { icx.lineWidth = H * 0.06 * sx; icx.beginPath(); s.p.forEach(([x, y], i) => (i ? icx.lineTo(x * w, y * h) : icx.moveTo(x * w, y * h))); icx.stroke(); });
      const M = mc.getImageData(0, 0, w, h).data, N = nc.getImageData(0, 0, w, h).data, I = icx.getImageData(0, 0, w, h).data;
      let mask = 0, hit = 0, inkN = 0, off = 0;
      for (let i = 3; i < M.length; i += 4) {
        const inM = M[i] > 100, inI = I[i] > 100;
        if (inM) { mask++; if (inI) hit++; }
        if (inI) { inkN++; if (N[i] < 100) off++; }
      }
      const cover = mask ? hit / mask : 0, offR = inkN ? off / inkN : 0;
      const score = cover - offR * 0.8;
      return { cover, off: offR, stars: !strokes.length ? 0 : score > 0.55 ? 3 : score > 0.35 ? 2 : score > 0.15 ? 1 : 0 };
    }
    return {
      setText(t) { text = t; strokes = []; drawGuide(); drawInk(); },
      setGuide(on) { showGuide = on; drawGuide(); },
      setColor(c) { color = c; },
      clear() { strokes = []; drawInk(); },
      undo() { strokes.pop(); drawInk(); },
      reveal(on) { const s = showGuide; showGuide = on; drawGuide(); showGuide = s; },
      hasInk: () => strokes.length > 0,
      check, redraw: size
    };
  };

  /* Printable handwriting rows. mode: trace | model (first dark, rest trace) | copy (model then empty rows) */
  const escX = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  window.SKSheet = function (lines, opts = {}) {
    const H = opts.rowH || 70, W = 1000, rep = opts.repeat || 1, mode = opts.mode || "trace";
    const row = (txt, style) => {
      const top = H * 0.14, mid = H * 0.4, base = H * 0.66, desc = H * 0.88, fs = (base - top) / 0.72;
      const textEl = !txt ? "" : style === "dark"
        ? `<text x="12" y="${base}" font-family="Andika, sans-serif" font-weight="700" font-size="${fs}" fill="#333">${escX(txt)}</text>`
        : `<text x="12" y="${base}" font-family="Andika, sans-serif" font-weight="700" font-size="${fs}" fill="#e9ebf3" stroke="#9aa0bb" stroke-width="1.1" stroke-dasharray="3 3">${escX(txt)}</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMinYMid meet" style="display:block;margin-bottom:${opts.gap ?? 6}px">
        <line x1="0" x2="${W}" y1="${top}" y2="${top}" stroke="#a9bce8" stroke-width="1.2"/>
        <line x1="0" x2="${W}" y1="${mid}" y2="${mid}" stroke="#a9bce8" stroke-width="1" stroke-dasharray="6 6"/>
        <line x1="0" x2="${W}" y1="${base}" y2="${base}" stroke="#e79a9a" stroke-width="1.4"/>
        <line x1="0" x2="${W}" y1="${desc}" y2="${desc}" stroke="#a9bce8" stroke-width="1.2"/>${textEl}</svg>`;
    };
    let out = "";
    lines.forEach((t) => {
      if (mode === "copy") { out += row(t, "dark"); for (let i = 0; i < rep; i++) out += row("", ""); }
      else if (mode === "model") { out += row(t, "dark"); for (let i = 0; i < rep; i++) out += row(t, "trace"); out += row("", ""); }
      else { for (let i = 0; i < rep; i++) out += row(t, "trace"); }
    });
    return out;
  };

  /* Fit text to a sheet row width (approximate) */
  window.SKSheet.fit = function (text, chars) {
    const words = text.split(/\s+/), out = []; let line = "";
    words.forEach((w) => { if ((line + " " + w).trim().length > chars && line) { out.push(line); line = w; } else line = (line + " " + w).trim(); });
    if (line) out.push(line); return out;
  };
})();
