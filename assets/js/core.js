/* Skillyfai core: shared header/footer, theme, and small helpers used by every page.
   Pages set <body data-root=".." data-page="toolkit"> and include catalog.js before this file. */
(function () {
  "use strict";
  const S = window.SKILLYFAI;
  const ROOT = (document.body.dataset.root || ".").replace(/\/$/, "");
  const url = (p) => ROOT + "/" + p;

  /* ---------- tiny DOM helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  /* ---------- storage (always safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("sk:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("sk:" + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem("sk:" + k); } catch (e) {} }
  };

  /* ---------- icons ---------- */
  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- theme ---------- */
  const savedTheme = store.get("theme", null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  const isDark = () => document.documentElement.dataset.theme === "dark" ||
    (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);

  /* ---------- header & footer ---------- */
  const page = document.body.dataset.page || "";
  const links = [
    { id: "home", name: "Home", href: "index.html" },
    { id: "toolkit", name: "Teacher Toolkit", href: "index.html#toolkit" },
    { id: "reading", name: "Reading & Language", href: "index.html#reading" },
    { id: "writing", name: "Writing", href: "index.html#writing" },
    { id: "sound-friends", name: "Sound Friends", href: S.soundFriends.url }
  ];
  const navHTML = (cls) => links.map((l) => `<a href="${url(l.href)}" class="${l.id === page ? "active" : ""}">${l.name}</a>`).join("");

  const header = h(`
    <header class="site-header">
      <div class="wrap nav">
        <a class="brand" href="${url("index.html")}" aria-label="Skillyfai home">
          <img src="${url("assets/img/logo.svg")}" alt="" width="36" height="36">
          <span class="brand-name">Skilly<span>fai</span></span>
        </a>
        <nav class="nav-links" aria-label="Main">${navHTML()}</nav>
        <div class="nav-actions">
          <a class="icon-btn" href="${url("index.html#search")}" aria-label="Search tools" title="Search tools">${ICON.search}</a>
          <button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode" title="Light / dark"></button>
          <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">${ICON.menu}</button>
        </div>
      </div>
      <nav class="mobile-nav" id="mobileNav" aria-label="Mobile">${navHTML()}</nav>
    </header>`);
  document.body.prepend(header);

  const themeBtn = $("#themeBtn");
  const paintTheme = () => { themeBtn.innerHTML = isDark() ? ICON.sun : ICON.moon; };
  paintTheme();
  themeBtn.onclick = () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next; store.set("theme", next); paintTheme();
  };
  $("#menuBtn").onclick = (e) => {
    const m = $("#mobileNav"); const open = m.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  };
  $$("#mobileNav a").forEach((a) => a.addEventListener("click", () => $("#mobileNav").classList.remove("open")));

  const toolsIn = (sec) => S.tools.filter((t) => S.categories.find((c) => c.id === t.cat).section === sec);
  const footer = h(`
    <footer class="site-footer">
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <a class="brand" href="${url("index.html")}"><img src="${url("assets/img/logo.svg")}" alt="" width="32" height="32"><span class="brand-name">Skilly<span>fai</span></span></a>
            <p class="foot-tag">${S.tagline} Free classroom tools that run in your browser. No login, nothing to install.</p>
          </div>
          ${S.sections.map((s) => `<div><h4>${s.name}</h4><ul>${toolsIn(s.id).slice(0, 6).map((t) => `<li><a href="${url(t.url)}">${t.name}</a></li>`).join("")}</ul></div>`).join("")}
        </div>
        <div class="foot-bottom"><span>&copy; ${new Date().getFullYear()} Skillyfai</span><span>Your work is saved only in this browser on this device.</span></div>
      </div>
    </footer>`);
  if (!document.body.hasAttribute("data-no-footer")) document.body.append(footer);

  /* ---------- tool page hero (breadcrumb + title from catalog) ---------- */
  const heroEl = $("#tool-hero");
  if (heroEl) {
    const t = S.tools.find((x) => x.id === heroEl.dataset.tool);
    const cat = S.categories.find((c) => c.id === t.cat);
    const sec = S.sections.find((s) => s.id === cat.section);
    document.title = t.name + " · Skillyfai";
    heroEl.className = "tool-hero wrap";
    heroEl.innerHTML = `
      <div class="crumbs"><a href="${url("index.html")}">Home</a><span>/</span><a href="${url("index.html#" + sec.id)}">${sec.name}</a>${cat.name !== sec.name ? `<span>/</span><span>${cat.name}</span>` : ""}</div>
      <div class="tool-title"><div class="t-icon" style="--tint:${t.tint}">${t.icon}</div>
        <div><h1>${t.name}</h1><p>${heroEl.dataset.sub || t.desc}</p></div></div>`;
  }
  const relEl = $("#related");
  if (relEl) {
    const t = S.tools.find((x) => x.id === relEl.dataset.tool);
    const rel = S.tools.filter((x) => x.cat === t.cat && x.id !== t.id).slice(0, 3);
    relEl.className = "wrap no-print";
    relEl.innerHTML = `<h2 style="font-size:1.1rem;margin:40px 0 14px">More ${S.categories.find((c) => c.id === t.cat).name.toLowerCase()} tools</h2><div class="tool-grid">${rel.map(card).join("")}</div>`;
  }

  function badge(t) {
    if (t.status === "app") return '<span class="badge badge-app">Sound Friends</span>';
    if (t.status === "beta") return '<span class="badge badge-beta">Beta</span>';
    return "";
  }
  function card(t) {
    return `<a class="tool-card" href="${url(t.url)}" data-id="${t.id}">
      <div class="t-top"><div class="t-icon" style="--tint:${t.tint}">${t.icon}</div>${badge(t)}</div>
      <h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><span class="t-open">Open tool ${ICON.arrow}</span></a>`;
  }

  /* ---------- toast ---------- */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = h('<div class="toast" role="status" aria-live="polite"></div>'); document.body.append(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ---------- copy / download / print ---------- */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast("Copied to clipboard"); }
    catch (e) {
      const ta = h("<textarea></textarea>"); ta.value = text; document.body.append(ta); ta.select();
      try { document.execCommand("copy"); toast("Copied to clipboard"); } catch (x) { toast("Could not copy"); }
      ta.remove();
    }
  }
  function download(name, content, type = "text/plain") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name; document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  /* Save an element as a Word-compatible .doc (HTML inside), editable in Word / Google Docs */
  function downloadDoc(name, el, title) {
    const html = `<html><head><meta charset="utf-8"><title>${esc(title || name)}</title>
      <style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:6px;vertical-align:top}th{background:#f0f0f0}h2{color:#3a3ab0}h3{color:#3a3ab0}</style></head><body>${el.innerHTML}</body></html>`;
    download(name.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + ".doc", html, "application/msword");
  }
  /* Print one element only */
  function printEl(el) {
    document.body.classList.add("printing-one");
    $$(".print-area").forEach((x) => x.classList.remove("print-area"));
    el.classList.add("print-area");
    window.print();
  }
  window.addEventListener("afterprint", () => document.body.classList.remove("printing-one"));

  /* ---------- random ---------- */
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------- share data in a link (no server needed) ---------- */
  function encodeShare(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = ""; bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decodeShare(str) {
    try {
      const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    } catch (e) { return null; }
  }

  /* ---------- speech (browser built-in, free) ---------- */
  const hasTTS = "speechSynthesis" in window;
  let voice = null;
  function pickVoice() {
    if (!hasTTS) return;
    const pref = store.get("voice", "");
    const v = speechSynthesis.getVoices();
    const lg = (x) => x.lang.replace("_", "-");
    voice = v.find((x) => x.name === pref) || v.find((x) => lg(x) === "en-IN") || v.find((x) => lg(x) === "en-GB") || v.find((x) => x.lang.startsWith("en")) || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, opts = {}) {
    return new Promise((res) => {
      if (!hasTTS || !text) { setTimeout(res, 300); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "en-IN";
      u.rate = opts.rate || 0.9; u.pitch = opts.pitch || 1;
      if (opts.onboundary) u.onboundary = opts.onboundary;
      u.onend = u.onerror = () => res();
      try { speechSynthesis.resume(); } catch (e) {}
      speechSynthesis.speak(u);
    });
  }
  const stopSpeak = () => { if (hasTTS) speechSynthesis.cancel(); };
  const englishVoices = () => (hasTTS ? speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en")) : []);

  /* Speech recognition (Chrome / Edge / Android). Resolves with a list of heard alternatives. */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function listen(lang = "en-IN") {
    return new Promise((res, rej) => {
      if (!SR) { rej(new Error("unsupported")); return; }
      const r = new SR(); r.lang = lang; r.interimResults = false; r.maxAlternatives = 5;
      let done = false;
      r.onresult = (e) => { done = true; res(Array.from(e.results[0]).map((a) => a.transcript.toLowerCase().trim())); };
      r.onerror = (e) => { if (!done) rej(new Error(e.error || "error")); };
      r.onend = () => { if (!done) res([]); };
      r.start();
    });
  }

  /* ---------- fullscreen ---------- */
  function toggleFullscreen(el) {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => toast("Full screen is not available here"));
  }

  /* ---------- simple confetti (tiny, canvas-free) ---------- */
  function celebrate() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = h('<div aria-hidden="true" style="position:fixed;inset:0;pointer-events:none;z-index:300;overflow:hidden"></div>');
    const cols = ["#5b5bd6", "#22b5a0", "#f2694a", "#ffc542", "#2f8ee0", "#d6456f"];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      const x = Math.random() * 100, d = 1.6 + Math.random() * 1.6, r = Math.random() * 360;
      p.style.cssText = `position:absolute;top:-12px;left:${x}%;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px;background:${pick(cols)};border-radius:2px;transform:rotate(${r}deg);transition:transform ${d}s cubic-bezier(.2,.7,.4,1),top ${d}s ease-in,opacity ${d}s;`;
      box.append(p);
      requestAnimationFrame(() => requestAnimationFrame(() => { p.style.top = "105%"; p.style.transform = `rotate(${r + 540}deg) translateX(${(Math.random() - .5) * 200}px)`; p.style.opacity = ".8"; }));
    }
    document.body.append(box); setTimeout(() => box.remove(), 3400);
  }

  window.SK = { S, ROOT, url, $, $$, esc, h, store, ICON, toast, copyText, download, downloadDoc, printEl, shuffle, pick, uid,
    encodeShare, decodeShare, speak, stopSpeak, hasTTS, englishVoices, listen, hasSR: !!SR, toggleFullscreen, celebrate, card, pickVoice };
})();
