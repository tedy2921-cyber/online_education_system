/* ============================================================
   Homepage — hero, paths, featured courses, testimonials
   Depends on: data.js, progress.js, main.js
   ============================================================ */

(function () {
  /* ---------- Hero ---------- */

  const heroBadge = document.getElementById("heroBadge");
  if (heroBadge) {
    heroBadge.innerHTML = `${icon("spark")}<span>Interactive &middot; Beginner friendly &middot; 100% free</span>`;
  }

  const startBtn = document.getElementById("startBtn");
  const ctaStart = document.getElementById("ctaStart");

  function firstIncompleteLesson() {
    for (const course of COURSES) {
      const { firstIncomplete } = ProgressStore.courseProgress(course);
      if (firstIncomplete) return firstIncomplete;
    }
    return null;
  }

  function wireStart(btn, startedLabel, freshLabel) {
    if (!btn) return;
    const next = firstIncompleteLesson();
    if (ProgressStore.snapshot().lessonsDone > 0 && next) {
      btn.href = `lesson.html?lesson=${next.id}`;
      btn.innerHTML = `${icon("play")}<span>${startedLabel}</span>`;
    } else {
      btn.href = "lesson.html?lesson=html-what-is";
      btn.innerHTML = `${icon("play")}<span>${freshLabel}</span>`;
    }
  }

  wireStart(startBtn, "Continue learning", "Start learning — it's free");
  wireStart(ctaStart, "Continue learning", "Start Lesson 1 — it's free");

  const browseBtn = document.getElementById("browseBtn");
  if (browseBtn) browseBtn.innerHTML = `${icon("book")}<span>Browse courses</span>`;

  const heroNote = document.getElementById("heroNote");
  if (heroNote) {
    heroNote.innerHTML = `${icon("check-circle")}<span>No sign-up &middot; your progress is saved in this browser</span>`;
  }

  const heroStats = document.getElementById("heroStats");
  if (heroStats) {
    let lessons = 0;
    let minutes = 0;
    let questions = 0;
    COURSES.forEach((c) =>
      courseLessons(c).forEach((l) => {
        lessons++;
        minutes += l.minutes || 0;
        questions += (l.quiz || []).length;
      })
    );
    heroStats.innerHTML = `
      <div class="stat"><div class="stat-value"><span class="grad">${COURSES.length}</span></div><div class="stat-label">Interactive courses</div></div>
      <div class="stat"><div class="stat-value"><span class="grad">${lessons}</span></div><div class="stat-label">Bite-size lessons</div></div>
      <div class="stat"><div class="stat-value"><span class="grad">${fmtDuration(minutes)}</span></div><div class="stat-label">Of guided content</div></div>
      <div class="stat"><div class="stat-value"><span class="grad">${questions}</span></div><div class="stat-label">Quiz questions</div></div>`;
  }

  /* ---------- Eyebrows ---------- */

  const eyebrows = [
    ["pathsEyebrow", "compass", "Learning paths"],
    ["coursesEyebrow", "book", "The curriculum"],
    ["howEyebrow", "zap", "How it works"],
    ["loveEyebrow", "star", "Testimonials"],
  ];
  eyebrows.forEach(([id, ic, label]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `${icon(ic)}<span>${label}</span>`;
  });

  const viewAllBtn = document.getElementById("viewAllBtn");
  if (viewAllBtn) viewAllBtn.innerHTML = `${icon("arrow-right")}<span>View all ${COURSES.length} courses</span>`;

  /* ---------- Learning paths ---------- */

  const pathsGrid = document.getElementById("pathsGrid");
  if (pathsGrid) {
    pathsGrid.innerHTML = PATHS.map((path, i) => {
      const courses = path.courses.map(courseById).filter(Boolean);
      let target = null;
      let allDone = true;
      courses.forEach((c) => {
        const { firstIncomplete } = ProgressStore.courseProgress(c);
        if (firstIncomplete && !target) target = firstIncomplete;
        if (firstIncomplete) allDone = false;
      });
      const href = target ? `lesson.html?lesson=${target.id}` : `course.html?id=${courses[0].id}`;
      const label = allDone ? "Review path" : target && ProgressStore.snapshot().lessonsDone > 0 ? "Continue path" : "Start path";

      const steps = courses
        .map((c) => {
          const done = ProgressStore.courseProgress(c).total > 0 && ProgressStore.courseProgress(c).done === ProgressStore.courseProgress(c).total;
          return `<li>${done ? icon("check", "done") : icon(c.icon)}<span>${escapeHtml(c.title)}</span></li>`;
        })
        .join("");

      const req = (path.requires || []).map(courseById).filter(Boolean);
      const reqNote = req.length
        ? `<li style="background:transparent; color: var(--muted); font-weight:600;">${icon("lock")}<span>Prerequisite: ${req.map((c) => escapeHtml(c.title)).join(", ")}</span></li>`
        : "";

      return `
      <div class="path-card card reveal" style="--pc:${courses[0] ? courses[0].color : "var(--primary)"}">
        <div class="path-num">${String(i + 1).padStart(2, "0")}</div>
        <h3>${escapeHtml(path.title)}</h3>
        <p>${escapeHtml(path.description)}</p>
        <ul class="path-steps">${steps}${reqNote}</ul>
        <a class="card-link" href="${href}">${label}${icon("arrow-right")}</a>
      </div>`;
    }).join("");
  }

  /* ---------- Featured courses ---------- */

  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    const featured = ["html", "css", "js", "react"].map(courseById).filter(Boolean);
    featuredGrid.innerHTML = featured.map(courseCardHTML).join("");
  }

  /* ---------- Testimonials ---------- */

  const testimonialsGrid = document.getElementById("testimonialsGrid");
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = TESTIMONIALS.map(
      (t) => `
      <div class="testimonial-card card reveal">
        <div class="quote-mark">&ldquo;</div>
        <blockquote><p>${escapeHtml(t.quote)}</p></blockquote>
        <div class="t-author">
          <div class="avatar" style="background: hsl(${t.hue}, 62%, 46%)">${escapeHtml(t.initials)}</div>
          <div>
            <div class="t-name">${escapeHtml(t.name)}</div>
            <div class="t-role">${escapeHtml(t.role)}</div>
          </div>
        </div>
      </div>`
    ).join("");
  }

  /* Re-observe reveal elements rendered above */
  initReveal();
})();
