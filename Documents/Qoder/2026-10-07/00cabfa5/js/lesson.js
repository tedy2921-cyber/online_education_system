/* ============================================================
   Lesson page — content blocks, playgrounds, quiz, pager
   Depends on: data.js, progress.js, main.js
   ============================================================ */

(function () {
  const params = new URLSearchParams(location.search);
  const lessonId = params.get("lesson") || "html-what-is";
  const found = findLesson(lessonId);

  const main = document.getElementById("main");

  if (!found) {
    main.innerHTML = `
    <section class="page-hero"><div class="container">
      <h1>Lesson not found</h1>
      <p>That lesson id doesn't exist. Pick a course and jump back in.</p>
      <p><a class="btn btn-primary" href="courses.html" style="margin-top:18px;">${icon("arrow-left")}<span>Back to courses</span></a></p>
    </div></section>`;
    return;
  }

  const { course, moduleIndex, lesson } = found;
  const module = course.modules[moduleIndex];
  const flat = courseLessons(course);
  const idx = flat.findIndex((l) => l.id === lesson.id);
  const hasPg = (lesson.blocks || []).some((b) => b.playground);

  document.title = `${lesson.title} — ${course.title} — WebCraft Academy`;

  /* ---------- Page shell ---------- */

  main.innerHTML = `
  <section class="lesson-hero" style="--c:${course.color}">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>${icon("chevron-down")}<a href="course.html?id=${course.id}">${escapeHtml(course.title)}</a>${icon("chevron-down")}<span>${escapeHtml(module.title)}</span>
      </nav>
      <h1>${escapeHtml(lesson.title)}</h1>
      <div class="meta">
        <span class="meta-item">${icon("book")}Lesson ${idx + 1} of ${flat.length}</span>
        <span class="meta-item">${icon("clock")}${lesson.minutes} min</span>
        ${hasPg ? `<span class="meta-item">${icon("zap")}Live playground</span>` : ""}
        <span class="meta-item">${icon("help-circle")}${(lesson.quiz || []).length}-question quiz</span>
      </div>
    </div>
  </section>

  <div class="lesson-layout">
    <article class="lesson-content" id="lessonContent"></article>

    <section class="quiz" id="quizBox" aria-label="Quiz"></section>

    <nav class="lesson-pager" id="pager" aria-label="Lesson navigation"></nav>

    <div class="complete-zone" id="completeZone"></div>
  </div>`;

  /* ---------- Content blocks ---------- */

  const CALLOUT_ICONS = { tip: "bulb", warn: "warn", note: "info" };

  function renderBlocks() {
    const host = document.getElementById("lessonContent");
    host.innerHTML = (lesson.blocks || [])
      .map((b) => {
        if (b.h) return `<h2>${fmtInline(b.h)}</h2>`;
        if (b.p) return `<p>${fmtInline(b.p)}</p>`;
        if (b.list) return `<ul>${b.list.map((item) => `<li>${fmtInline(item)}</li>`).join("")}</ul>`;
        if (b.callout) {
          return `<div class="callout ${b.callout}">
            <span class="co-icon">${icon(CALLOUT_ICONS[b.callout] || "info")}</span>
            <div>
              <div class="co-title">${escapeHtml(b.title || "")}</div>
              <p>${fmtInline(b.text || "")}</p>
            </div>
          </div>`;
        }
        if (b.code !== undefined) return codeBlockHTML(b.code, b.lang);
        if (b.playground) return playgroundHTML(b.playground);
        return "";
      })
      .join("");
  }

  /* ---------- Playground ---------- */

  function playgroundHTML(pg) {
    const tabs = [
      ["html", pg.html],
      ["css", pg.css],
      ["js", pg.js],
    ].filter(([, v]) => typeof v === "string" && v.length > 0);
    const active = tabs.length ? tabs[0][0] : null;
    return `
    <div class="playground">
      <div class="pg-head">
        <span class="pg-title">${icon("play")}<span>${escapeHtml(pg.title || "Try it yourself")}</span></span>
        <button class="pg-btn" type="button" data-action="reset">${icon("refresh")}<span>Reset</span></button>
        <button class="pg-btn primary" type="button" data-action="run">${icon("zap")}<span>Run</span></button>
      </div>
      <div class="pg-tabs">
        ${tabs.map(([k]) => `<button class="pg-tab ${k === active ? "active" : ""}" type="button" data-tab="${k}">${k}</button>`).join("")}
      </div>
      <div class="pg-editors">
        ${tabs
          .map(
            ([k, v]) =>
              `<textarea class="${k === active ? "visible" : ""}" data-editor="${k}" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="${k} editor">${escapeHtml(v)}</textarea>`
          )
          .join("")}
      </div>
      <div class="pg-preview-label">${icon("monitor")}<span>Preview</span></div>
      <div class="pg-preview"><iframe sandbox="allow-scripts allow-modals" title="Live code preview"></iframe></div>
    </div>`;
  }

  /* console shim: when a playground has JS but no HTML, show console output in the preview */
  const CONSOLE_SHIM = `<script>
(function () {
  var out = document.createElement("div");
  out.style.cssText = "font: 13px/1.7 ui-monospace,Consolas,monospace; padding: 14px; white-space: pre-wrap;";
  document.body.appendChild(out);
  function fmt(v) {
    if (typeof v === "object" && v !== null) { try { return JSON.stringify(v); } catch (e) { return String(v); } }
    return String(v);
  }
  ["log", "info", "warn", "error"].forEach(function (m) {
    var orig = console[m];
    console[m] = function () {
      var line = document.createElement("div");
      line.textContent = [].map.call(arguments, fmt).join(" ");
      if (m === "error") line.style.color = "#dc2626";
      if (m === "warn") line.style.color = "#b45309";
      out.appendChild(line);
      if (orig) orig.apply(console, arguments);
    };
  });
})();
<\/script>`;

  function editorValue(pgEl, k) {
    const ta = pgEl.querySelector(`[data-editor="${k}"]`);
    return ta ? ta.value : "";
  }

  function runPlayground(pgEl) {
    let html = editorValue(pgEl, "html");
    const css = editorValue(pgEl, "css");
    const js = editorValue(pgEl, "js");
    const needsConsole = js.trim() && !html.trim();
    const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}${needsConsole ? CONSOLE_SHIM : ""}<script>${js.replace(/<\/script/gi, "<\\/script")}<\/script></body></html>`;
    pgEl.querySelector("iframe").srcdoc = doc;
  }

  const pgInitial = new Map();

  function wirePlaygrounds() {
    document.querySelectorAll(".playground").forEach((pgEl) => {
      pgInitial.set(pgEl, {
        html: editorValue(pgEl, "html"),
        css: editorValue(pgEl, "css"),
        js: editorValue(pgEl, "js"),
      });
      runPlayground(pgEl);
    });
  }

  main.addEventListener("click", (e) => {
    const tab = e.target.closest(".pg-tab");
    if (tab) {
      const pgEl = tab.closest(".playground");
      pgEl.querySelectorAll(".pg-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      pgEl.querySelectorAll("[data-editor]").forEach((ta) => ta.classList.toggle("visible", ta.dataset.editor === tab.dataset.tab));
      return;
    }
    const btn = e.target.closest(".pg-btn");
    if (btn) {
      const pgEl = btn.closest(".playground");
      if (btn.dataset.action === "run") {
        runPlayground(pgEl);
      } else if (btn.dataset.action === "reset") {
        const initial = pgInitial.get(pgEl) || {};
        pgEl.querySelectorAll("[data-editor]").forEach((ta) => {
          ta.value = initial[ta.dataset.editor] ?? "";
        });
        runPlayground(pgEl);
        toast("Playground reset", "refresh");
      }
    }
  });

  /* ---------- Quiz ---------- */

  const quizBox = document.getElementById("quizBox");

  function renderQuiz() {
    const qs = lesson.quiz || [];
    if (!qs.length) {
      quizBox.innerHTML = "";
      return;
    }
    const best = ProgressStore.quizResult(lesson.id);
    quizBox.innerHTML = `
      <div class="quiz-head">${icon("help-circle")}<h2>Check your understanding</h2></div>
      <p class="quiz-sub">${qs.length} questions · answer all, then check${best ? ` · best score: ${best.score}/${best.total}` : ""}</p>
      <div class="quiz-banner" id="quizBanner" role="status"></div>
      ${qs
        .map(
          (q, qi) => `
      <div class="quiz-q" data-q="${qi}">
        <div class="quiz-q-title"><span class="quiz-q-num">Q${qi + 1}</span>${escapeHtml(q.q)}</div>
        ${q.options
          .map(
            (opt, oi) => `
        <label class="quiz-option">
          <input type="radio" name="q${qi}" value="${oi}">
          <span>${fmtInline(opt)}</span>
        </label>`
          )
          .join("")}
        <div class="quiz-explain"><b>Why:</b> ${fmtInline(q.explain)}</div>
      </div>`
        )
        .join("")}
      <div class="quiz-actions">
        <button class="btn btn-primary" id="quizSubmit" type="button">Check answers</button>
        <button class="btn btn-ghost" id="quizRetry" type="button" hidden>${icon("refresh")}<span>Try again</span></button>
      </div>`;
  }

  quizBox.addEventListener("change", (e) => {
    const input = e.target.closest("input[type=radio]");
    if (!input) return;
    const qEl = input.closest(".quiz-q");
    qEl.querySelectorAll(".quiz-option").forEach((o) => o.classList.remove("selected"));
    input.closest(".quiz-option").classList.add("selected");
  });

  quizBox.addEventListener("click", (e) => {
    if (e.target.closest("#quizSubmit")) {
      gradeQuiz();
    } else if (e.target.closest("#quizRetry")) {
      renderQuiz();
    }
  });

  function gradeQuiz() {
    const qs = lesson.quiz;
    const answers = qs.map((_, qi) => {
      const checked = quizBox.querySelector(`input[name="q${qi}"]:checked`);
      return checked ? Number(checked.value) : null;
    });
    if (answers.includes(null)) {
      toast(`Answer all ${qs.length} questions first`, "info");
      return;
    }

    let score = 0;
    qs.forEach((q, qi) => {
      const qEl = quizBox.querySelector(`[data-q="${qi}"]`);
      qEl.querySelectorAll(".quiz-option").forEach((optEl, oi) => {
        optEl.querySelector("input").disabled = true;
        optEl.classList.add("locked");
        if (oi === q.answer) optEl.classList.add("correct");
        else if (answers[qi] === oi) optEl.classList.add("wrong");
      });
      const explain = qEl.querySelector(".quiz-explain");
      explain.classList.add("show");
      if (answers[qi] !== q.answer) explain.classList.add("bad");
      if (answers[qi] === q.answer) score++;
    });

    const banner = document.getElementById("quizBanner");
    banner.className = "quiz-banner show " + (score === qs.length ? "good" : score >= qs.length / 2 ? "mid" : "bad");
    banner.textContent =
      score === qs.length
        ? `Perfect — ${score}/${qs.length}. You have got this down.`
        : score >= qs.length / 2
        ? `${score}/${qs.length} correct. Read the explanations below, then try again.`
        : `${score}/${qs.length} correct. Re-read the lesson — it is all in there, promise.`;

    ProgressStore.recordQuiz(lesson.id, score, qs.length);

    document.getElementById("quizSubmit").hidden = true;
    document.getElementById("quizRetry").hidden = false;
    toast(score === qs.length ? "Perfect score!" : `Scored ${score} of ${qs.length}`, score === qs.length ? "trophy" : "check");
  }

  /* ---------- Pager ---------- */

  function renderPager() {
    const prev = idx > 0 ? flat[idx - 1] : null;
    const next = idx < flat.length - 1 ? flat[idx + 1] : null;
    document.getElementById("pager").innerHTML = `
      <a class="pager-btn" href="${prev ? `lesson.html?lesson=${prev.id}` : `course.html?id=${course.id}`}">
        <span class="pg-direction">${prev ? "Previous" : "Course"}</span>
        <span class="pg-name">${prev ? escapeHtml(prev.title) : escapeHtml(course.title)}</span>
      </a>
      <a class="pager-btn next" href="${next ? `lesson.html?lesson=${next.id}` : `course.html?id=${course.id}`}">
        <span class="pg-direction">${next ? "Next" : "Course"}</span>
        <span class="pg-name">${next ? escapeHtml(next.title) : "Back to course overview"}</span>
      </a>`;
  }

  /* ---------- Complete zone ---------- */

  const completeZone = document.getElementById("completeZone");

  function renderComplete() {
    const done = ProgressStore.isDone(lesson.id);
    completeZone.classList.toggle("is-done", done);
    completeZone.innerHTML = done
      ? `<p>Lesson completed — nice work! Your progress has been saved.</p>
         <button class="btn btn-success" id="czBtn" type="button" style="margin-top:16px;">${icon("undo")}<span>Undo completion</span></button>`
      : `<h3 style="margin:0 0 2px; font-size:1.1rem;">Finish this lesson?</h3>
         <p>Mark it complete to save your progress and update your dashboard stats.</p>
         <button class="btn btn-primary" id="czBtn" type="button" style="margin-top:16px;">${icon("check-circle")}<span>Mark as complete</span></button>`;
  }

  completeZone.addEventListener("click", (e) => {
    if (!e.target.closest("#czBtn")) return;
    const nowDone = ProgressStore.toggle(lesson.id);
    toast(nowDone ? "Lesson completed!" : "Completion undone", nowDone ? "check-circle" : "undo");
  });

  ProgressStore.subscribe(renderComplete);

  /* ---------- Boot ---------- */

  renderBlocks();
  wirePlaygrounds();
  renderQuiz();
  renderPager();
  renderComplete();
})();
