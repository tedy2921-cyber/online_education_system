/* ============================================================
   Course detail — hero, sticky progress sidebar, modules
   Depends on: data.js, progress.js, main.js
   ============================================================ */

(function () {
  const params = new URLSearchParams(location.search);
  const course = courseById(params.get("id") || "html");

  const main = document.getElementById("main");

  if (!course) {
    main.innerHTML = `
    <section class="page-hero"><div class="container">
      <h1>Course not found</h1>
      <p>That course id doesn't exist. Head back to the catalog to pick one.</p>
      <p><a class="btn btn-primary" href="courses.html" style="margin-top:18px;">${icon("arrow-left")}<span>Back to courses</span></a></p>
    </div></section>`;
    return;
  }

  document.title = `${course.title} — WebCraft Academy`;

  const lessons = courseLessons(course);
  const minutes = lessons.reduce((sum, l) => sum + (l.minutes || 0), 0);
  const quizCount = lessons.filter((l) => (l.quiz || []).length).length;
  const pgCount = lessons.filter((l) => (l.blocks || []).some((b) => b.playground)).length;

  /* ---------- Page shell ---------- */

  main.innerHTML = `
  <section class="course-hero" id="courseHero" style="--c:${course.color}">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>${icon("chevron-down")}<a href="courses.html">Courses</a>${icon("chevron-down")}<span>${escapeHtml(course.title)}</span>
      </nav>
      <span class="icon-badge">${icon(course.icon)}</span>
      <h1>${escapeHtml(course.title)}</h1>
      <p class="tagline">${escapeHtml(course.tagline)}</p>
      <div class="meta" id="courseMeta"></div>
    </div>
  </section>

  <div class="container">
    <div class="course-layout">
      <div id="modules"></div>

      <aside class="sticky-card card" aria-label="Course progress">
        <div id="ringBox"></div>
        <div class="stat-mini" id="statMini"></div>
        <h3 style="font-size:1rem; margin-bottom:2px;">What you'll learn</h3>
        <ul class="outcomes">
          ${course.outcomes.map((o) => `<li>${icon("check")}<span>${escapeHtml(o)}</span></li>`).join("")}
        </ul>
        <a class="btn btn-primary btn-block" id="courseCta"></a>
      </aside>
    </div>
  </div>`;

  /* ---------- Hero meta ---------- */

  document.getElementById("courseMeta").innerHTML = `
    ${levelBadge(course.level)}
    <span class="meta-item">${icon("clock")}${fmtDuration(minutes)} total</span>
    <span class="meta-item">${icon("book")}${lessons.length} lessons</span>
    <span class="meta-item">${icon("zap")}${pgCount} live playgrounds</span>
    <span class="meta-item">${icon("help-circle")}${quizCount} quizzes</span>`;

  /* ---------- Sidebar progress ---------- */

  function renderSidebar() {
    const { done, total, pct, firstIncomplete } = ProgressStore.courseProgress(course);

    document.getElementById("ringBox").innerHTML = `
      <div class="ring" style="--p:${pct}; --c:${course.color}">
        <div class="ring-inner">
          <div>
            <div class="ring-value">${pct}%</div>
            <div class="ring-label">complete</div>
          </div>
        </div>
      </div>
      <div style="text-align:center; font-weight:700; color:var(--muted); font-size:0.88rem; margin-bottom:18px;">
        ${done} of ${total} lessons done
      </div>`;

    document.getElementById("statMini").innerHTML = `
      <div><b>${lessons.length}</b><span>Lessons</span></div>
      <div><b>${fmtDuration(minutes)}</b><span>Total time</span></div>
      <div><b>${quizCount * 3}</b><span>Quiz questions</span></div>
      <div><b>${pgCount}</b><span>Playgrounds</span></div>`;

    const cta = document.getElementById("courseCta");
    if (done === 0) {
      cta.href = `lesson.html?lesson=${lessons[0].id}`;
      cta.innerHTML = `${icon("play")}<span>Start course</span>`;
    } else if (firstIncomplete) {
      cta.href = `lesson.html?lesson=${firstIncomplete.id}`;
      cta.innerHTML = `${icon("play")}<span>Continue: ${escapeHtml(firstIncomplete.title)}</span>`;
    } else {
      cta.href = `lesson.html?lesson=${lessons[0].id}`;
      cta.innerHTML = `${icon("trophy")}<span>Course complete — review</span>`;
    }
  }

  /* ---------- Modules accordion ---------- */

  function renderModules() {
    const host = document.getElementById("modules");
    host.innerHTML = course.modules
      .map((mod, mi) => {
        const rows = mod.lessons
          .map((l) => {
            const done = ProgressStore.isDone(l.id);
            const hasPg = (l.blocks || []).some((b) => b.playground);
            const quizLen = (l.quiz || []).length;
            return `
            <a class="lesson-row ${done ? "done" : ""}" href="lesson.html?lesson=${l.id}">
              <span class="lesson-icon">${icon(done ? "check-circle" : "play")}</span>
              <span class="lesson-info">
                <span class="lesson-name">${escapeHtml(l.title)}</span>
                <span class="lesson-mins">${l.minutes} min</span>
              </span>
              ${quizLen ? `<span class="quiz-dot">${quizLen}Q</span>` : ""}
              ${hasPg ? `<span class="pg-dot">LIVE</span>` : ""}
            </a>`;
          })
          .join("");

        const doneCount = mod.lessons.filter((l) => ProgressStore.isDone(l.id)).length;
        return `
        <div class="module ${mi === 0 ? "open" : ""}" data-module="${mi}">
          <button class="module-head" type="button" aria-expanded="${mi === 0}">
            <span class="module-index">${String(mi + 1).padStart(2, "0")}</span>
            <span class="module-title">${escapeHtml(mod.title)}</span>
            <span class="module-count">${doneCount}/${mod.lessons.length} done</span>
            <span class="module-chev">${icon("chevron-down")}</span>
          </button>
          <div class="module-body">${rows}</div>
        </div>`;
      })
      .join("");
  }

  document.getElementById("modules").addEventListener("click", (e) => {
    const head = e.target.closest(".module-head");
    if (!head) return;
    const mod = head.closest(".module");
    mod.classList.toggle("open");
    head.setAttribute("aria-expanded", mod.classList.contains("open"));
  });

  renderSidebar();
  renderModules();
  ProgressStore.subscribe(() => {
    renderSidebar();
    renderModules();
  });
})();
