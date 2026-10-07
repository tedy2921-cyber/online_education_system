/* ============================================================
   WebCraft Academy — Shared UI, icons, helpers, highlighter
   Depends on: data.js, progress.js (loaded first)
   ============================================================ */

/* ---------- SVG icon library ---------- */

const ICONS = {
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  palette: '<path d="M12 22a10 10 0 1 1 10-10c0 1.7-1.3 3-3 3h-2.2a2.4 2.4 0 0 0-1.7 4.1c.5.6.4 1.6-.3 2A9.9 9.9 0 0 1 12 22Z"/><path d="M7.5 10.5h.01"/><path d="M12 7.5h.01"/><path d="M16.5 10.5h.01"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  devices: '<rect x="1.5" y="4" width="13" height="9.5" rx="2"/><path d="M6 18h4"/><path d="M8 13.5V18"/><rect x="16" y="8.5" width="6.5" height="11.5" rx="1.5"/>',
  atom: '<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>',
  server: '<rect x="3" y="3.5" width="18" height="7" rx="2"/><rect x="3" y="13.5" width="18" height="7" rx="2"/><path d="M7 7h.01"/><path d="M7 17h.01"/>',

  check: '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 5-6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  "arrow-left": '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  spark: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>',
  trophy: '<path d="M6 9a6 6 0 0 0 12 0V3H6v6Z"/><path d="M6 5H3a3 3 0 0 0 3 5"/><path d="M18 5h3a3 3 0 0 1-3 5"/><path d="M12 15v3"/><path d="M8 21h8"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M9 14.5 7.5 21l4.5-2.5L16.5 21 15 14.5"/>',
  mountain: '<path d="m3 20 6.5-11.5 4 6.2 2.5-3.7L21 20H3Z"/><path d="m8 8 1.5 2.5L11 8l1.5 2.5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.9 6.5-6.5 2.9 2.9-6.5 6.5-2.9Z"/>',
  "graduation": '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
  undo: '<path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 2.6-7L3 7"/>',
  "help-circle": '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><path d="M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 8h.01"/><path d="M12 12v5"/>',
  warn: '<path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15v-3"/><path d="M12 15V7"/><path d="M17 15v-6"/>',
  activity: '<path d="M3 12h4l3 8 4-16 3 8h4"/>',
  flag: '<path d="M4 22V4c4-2 6 2 10 0s6-1 6-1v11s-2-1-6 1-6-2-10 0"/>',
  star: '<polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.6 12 2"/>',
};

function icon(name, cls) {
  const body = ICONS[name] || ICONS.check;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${body}</svg>`;
}

/* ---------- Small helpers ---------- */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Inline markdown-lite: `code`, **bold**, *em* (input is escaped first) */
function fmtInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function fmtDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function relTime(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function courseById(id) {
  return COURSES.find((c) => c.id === id) || null;
}

/* Flatten a course's lessons in order */
function courseLessons(course) {
  const out = [];
  course.modules.forEach((m) => m.lessons.forEach((l) => out.push(l)));
  return out;
}

/* Find { course, moduleIndex, lessonIndex, lesson } for a lesson id */
function findLesson(lessonId) {
  for (const course of COURSES) {
    for (let mi = 0; mi < course.modules.length; mi++) {
      const li = course.modules[mi].lessons.findIndex((l) => l.id === lessonId);
      if (li > -1) {
        return { course, moduleIndex: mi, lessonIndex: li, lesson: course.modules[mi].lessons[li] };
      }
    }
  }
  return null;
}

function levelBadge(level) {
  return `<span class="badge badge-${level}">${escapeHtml(level.charAt(0).toUpperCase() + level.slice(1))}</span>`;
}

/* Course card markup, shared by the homepage and the catalog */
function courseCardHTML(course) {
  const lessons = courseLessons(course);
  const minutes = lessons.reduce((sum, l) => sum + (l.minutes || 0), 0);
  const { done, total, pct, firstIncomplete } = ProgressStore.courseProgress(course);
  const label = done === 0 ? "Start course" : done === total ? "Review course" : "Continue course";
  const progressLabel = done === 0 ? `${total} lessons to go` : `${done} of ${total} lessons · ${pct}%`;
  return `
  <a class="course-card reveal" style="--c:${course.color}" href="course.html?id=${course.id}">
    <span class="icon-badge">${icon(course.icon)}</span>
    <h3>${escapeHtml(course.title)}</h3>
    <p class="course-tagline">${escapeHtml(course.tagline)}</p>
    <div class="meta">
      ${levelBadge(course.level)}
      <span class="meta-item">${icon("clock")}${fmtDuration(minutes)}</span>
      <span class="meta-item">${icon("book")}${lessons.length} lessons</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div class="course-progress-label">${progressLabel}</div>
    <span class="card-link">${label}${icon("arrow-right")}</span>
  </a>`;
}

/* ---------- Toast ---------- */

let toastTimer = null;
function toast(msg, icon_ = "check") {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.innerHTML = `${icon(icon_)}<span>${escapeHtml(msg)}</span>`;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- Syntax highlighting ---------- */

function span(cls, text) {
  return `<span class="${cls}">${text}</span>`;
}

function highlightJs(code) {
  return escapeHtml(code).replace(
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|import|from|export|default|async|await|try|catch|finally|throw|typeof|instanceof|of|in|extends)\b|\b(true|false|null|undefined|this|super)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g,
    (m, comment, str, kw, lit, num, fn) => {
      if (comment) return span("tok-comment", comment);
      if (str) return span("tok-str", str);
      if (kw) return span("tok-kw", kw);
      if (lit) return span("tok-num", lit);
      if (num) return span("tok-num", num);
      if (fn) return span("tok-fn", fn);
      return m;
    }
  );
}

function highlightHtml(code) {
  return escapeHtml(code).replace(
    /(&lt;!--[\s\S]*?--&gt;)|(&lt;!DOCTYPE[^&]*&gt;)|(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|[^&])*?)(\/?&gt;)/g,
    (m, comment, doctype, open, name, attrs, close) => {
      if (comment) return span("tok-comment", comment);
      if (doctype) return span("tok-kw", doctype);
      const attrsHl = attrs.replace(
        /("[^"]*")|([a-zA-Z-]+)(?==")/g,
        (mm, attrStr, attrName) => {
          if (attrStr) return span("tok-str", attrStr);
          return span("tok-attr", attrName);
        }
      );
      return span("tok-pun", open) + span("tok-tag", name) + attrsHl + span("tok-pun", close);
    }
  );
}

function highlightCss(code) {
  const lines = escapeHtml(code).split("\n");
  let inComment = false;
  const out = lines.map((line) => {
    const trimmed = line.trim();

    if (inComment) {
      if (trimmed.includes("*/")) inComment = false;
      return span("tok-comment", line);
    }
    if (trimmed.startsWith("/*")) {
      if (!trimmed.endsWith("*/")) inComment = true;
      return span("tok-comment", line);
    }

    const braceIdx = line.indexOf("{");
    if (braceIdx > -1 && trimmed !== "}") {
      const selector = line.slice(0, braceIdx);
      const rest = line.slice(braceIdx);
      const selHl = selector.replace(/(@[-\w]+)/g, (mm, at) => span("tok-at", at));
      return selHl + span("tok-pun", rest);
    }

    if (trimmed === "}") return span("tok-pun", line);

    /* declaration line: prop : value ; */
    const colonIdx = line.indexOf(":");
    if (colonIdx > -1) {
      const indent = line.slice(0, colonIdx).match(/^\s*/)[0];
      const prop = line.slice(indent.length, colonIdx);
      const value = line.slice(colonIdx + 1);
      const valueHl = value
        .replace(/#[0-9a-fA-F]{3,8}\b/g, (mm) => span("tok-str", mm))
        .replace(/\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|fr|ch|s|ms|deg|pt)?\b/g, (mm) => span("tok-num", mm))
        .replace(/([a-zA-Z-]+)(?=\()/g, (mm) => span("tok-fn", mm));
      if (/^[-a-zA-Z]+$/.test(prop)) {
        return indent + span("tok-prop", prop) + span("tok-pun", ":") + valueHl;
      }
    }

    return line;
  });
  return out.join("\n");
}

function highlightJson(code) {
  return escapeHtml(code).replace(
    /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|\b(\d+(?:\.\d+)?)\b/g,
    (m, str, colon, kw, num) => {
      if (str && colon) return span("tok-prop", str) + colon;
      if (str) return span("tok-str", str);
      if (kw) return span("tok-kw", kw);
      if (num) return span("tok-num", num);
      return m;
    }
  );
}

function highlightCode(code, lang) {
  switch ((lang || "").toLowerCase()) {
    case "js":
    case "jsx":
      return highlightJs(code);
    case "html":
      return highlightHtml(code);
    case "css":
      return highlightCss(code);
    case "json":
      return highlightJson(code);
    default:
      return escapeHtml(code);
  }
}

/* ---------- Code block markup ---------- */

function codeBlockHTML(code, lang) {
  return `<div class="code-block">
    <div class="code-head">
      <span class="code-lang">${escapeHtml(lang || "code")}</span>
      <button class="code-copy" type="button" data-code="${encodeURIComponent(code)}">${icon("copy")}<span>Copy</span></button>
    </div>
    <pre><code>${highlightCode(code, lang)}</code></pre>
  </div>`;
}

/* Copy buttons (event delegation, works for dynamically rendered blocks) */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".code-copy");
  if (!btn) return;
  const code = decodeURIComponent(btn.dataset.code || "");
  const label = btn.querySelector("span");
  const done = () => {
    label.textContent = "Copied!";
    setTimeout(() => (label.textContent = "Copy"), 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(done).catch(done);
  } else {
    const ta = document.createElement("textarea");
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { /* noop */ }
    ta.remove();
    done();
  }
});

/* ---------- Navbar & footer ---------- */

function renderNavbar() {
  const page = document.body.dataset.page || "";
  const links = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "courses.html", label: "Courses", key: "courses" },
    { href: "dashboard.html", label: "Dashboard", key: "dashboard" },
  ];
  const linkHtml = links
    .map((l) => `<li><a href="${l.href}" class="${page === l.key ? "active" : ""}">${l.label}</a></li>`)
    .join("");

  const host = document.getElementById("navbar");
  if (host) {
    host.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <div class="container navbar-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark">&lt;/&gt;</span>
          <span>WebCraft Academy</span>
        </a>
        <ul class="nav-links">${linkHtml}</ul>
        <div class="nav-actions">
          <a class="nav-progress" href="dashboard.html" id="navProgress" title="Your overall progress"></a>
          <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle color theme"></button>
          <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Open menu">${icon("menu")}</button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      ${links.map((l) => `<a href="${l.href}" class="${page === l.key ? "active" : ""}">${l.label}</a>`).join("")}
    </div>`;

    const themeBtn = document.getElementById("themeToggle");
    const applyThemeIcon = () => {
      themeBtn.innerHTML = document.documentElement.dataset.theme === "dark" ? icon("sun") : icon("moon");
    };
    themeBtn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("webcraft-theme", next);
      applyThemeIcon();
    });
    applyThemeIcon();

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      menuBtn.innerHTML = mobileMenu.classList.contains("open") ? icon("x") : icon("menu");
    });
  }

  updateNavProgress();
}

function updateNavProgress() {
  const el = document.getElementById("navProgress");
  if (!el) return;
  const s = ProgressStore.snapshot();
  el.innerHTML = `
    <span class="np-track"><span class="np-fill" style="width:${s.pct}%"></span></span>
    <span class="np-label">${s.lessonsDone}/${s.lessonsTotal} lessons</span>`;
}

function renderFooter() {
  const host = document.getElementById("footer");
  if (!host) return;
  const year = new Date().getFullYear();
  host.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="index.html">
            <span class="brand-mark">&lt;/&gt;</span>
            <span>WebCraft Academy</span>
          </a>
          <p>Learn web development, one lesson at a time. Free, interactive, and paced for humans.</p>
        </div>
        <div>
          <h4 class="footer-title">Learn</h4>
          <ul class="footer-links">
            <li><a href="courses.html">All courses</a></li>
            <li><a href="index.html#paths">Learning paths</a></li>
            <li><a href="index.html#how">How it works</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-title">Courses</h4>
          <ul class="footer-links">
            ${COURSES.slice(0, 4).map((c) => `<li><a href="course.html?id=${c.id}">${escapeHtml(c.title)}</a></li>`).join("")}
          </ul>
        </div>
        <div>
          <h4 class="footer-title">You</h4>
          <ul class="footer-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="lesson.html?lesson=html-what-is">Start learning</a></li>
            <li><a href="courses.html?level=beginner">Beginner friendly</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${year} WebCraft Academy. Built for learners.</span>
        <span>Made with plain HTML, CSS &amp; JavaScript.</span>
      </div>
    </div>
  </footer>`;
}

/* ---------- Scroll reveal ---------- */

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Boot ---------- */

ProgressStore.subscribe(updateNavProgress);
renderNavbar();
renderFooter();
initReveal();
