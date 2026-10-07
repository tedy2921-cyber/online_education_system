/* ============================================================
   Dashboard — overall progress, stats, achievements, activity
   Depends on: data.js, progress.js, main.js
   ============================================================ */

(function () {
  const eyebrow = document.getElementById("dashEyebrow");
  if (eyebrow) eyebrow.innerHTML = `${icon("chart")}<span>Progress</span>`;

  function firstIncompleteLesson() {
    for (const course of COURSES) {
      const { firstIncomplete } = ProgressStore.courseProgress(course);
      if (firstIncomplete) return firstIncomplete;
    }
    return null;
  }

  /* ---------- Hero ---------- */

  function renderHero() {
    const s = ProgressStore.snapshot();
    const hero = document.getElementById("dashHero");
    const next = firstIncompleteLesson();

    let title, blurb, buttons;
    if (s.lessonsDone === 0) {
      title = "Let's get started";
      blurb = "You have not completed any lessons yet. The first one takes about 20 minutes — no setup, no account.";
      buttons = `<a class="btn btn-primary" href="lesson.html?lesson=html-what-is">${icon("play")}<span>Start Lesson 1</span></a>
                 <a class="btn btn-outline" href="courses.html">${icon("book")}<span>Browse courses</span></a>`;
    } else if (!next) {
      title = "Course... legend!";
      blurb = "You have completed every single lesson in the curriculum. Go build something great — and show someone your portfolio.";
      buttons = `<a class="btn btn-primary" href="index.html#paths">${icon("compass")}<span>Revisit the paths</span></a>`;
    } else {
      const nextCourse = findLesson(next.id).course;
      title = "Keep the momentum going";
      blurb = `You are ${s.pct}% through the curriculum. Next up: "${next.title}" in ${nextCourse.title}.`;
      buttons = `<a class="btn btn-primary" href="lesson.html?lesson=${next.id}">${icon("play")}<span>Continue learning</span></a>
                 <a class="btn btn-outline" href="courses.html">${icon("book")}<span>Browse courses</span></a>`;
    }

    hero.innerHTML = `
      <div class="ring" style="--p:${s.pct}">
        <div class="ring-inner">
          <div>
            <div class="ring-value">${s.pct}%</div>
            <div class="ring-label">complete</div>
          </div>
        </div>
      </div>
      <div class="dash-copy">
        <h1>${title}</h1>
        <p>${blurb}</p>
        <div class="hero-cta">${buttons}</div>
      </div>`;
  }

  /* ---------- Stat cards ---------- */

  function renderStats() {
    const s = ProgressStore.snapshot();
    document.getElementById("statCards").innerHTML = `
      <div class="stat-card card">
        <span class="stat-icon">${icon("book")}</span>
        <div><div class="stat-num">${s.lessonsDone}<span style="color:var(--muted); font-size:1rem; font-weight:700;"> / ${s.lessonsTotal}</span></div><div class="stat-name">Lessons completed</div></div>
      </div>
      <div class="stat-card card">
        <span class="stat-icon amber">${icon("help-circle")}</span>
        <div><div class="stat-num">${s.quizzesTaken}</div><div class="stat-name">Quizzes taken</div></div>
      </div>
      <div class="stat-card card">
        <span class="stat-icon violet">${icon("target")}</span>
        <div><div class="stat-num">${s.perfectQuizzes}</div><div class="stat-name">Perfect scores</div></div>
      </div>
      <div class="stat-card card">
        <span class="stat-icon green">${icon("graduation")}</span>
        <div><div class="stat-num">${s.coursesDone}<span style="color:var(--muted); font-size:1rem; font-weight:700;"> / ${COURSES.length}</span></div><div class="stat-name">Courses finished</div></div>
      </div>`;
  }

  /* ---------- Course progress rows ---------- */

  function renderCourseProgress() {
    document.getElementById("coursesTitle").innerHTML = `${icon("layers")}<span>Course progress</span>`;
    const host = document.getElementById("courseProgress");

    host.innerHTML = COURSES.map((course) => {
      const { done, total, pct, firstIncomplete } = ProgressStore.courseProgress(course);
      const nextText = firstIncomplete ? `Next: ${firstIncomplete.title}` : done === 0 ? "Not started" : "Course complete";
      return `
      <a class="course-progress-row" style="--c:${course.color}" href="course.html?id=${course.id}">
        <span class="icon-badge" style="width:46px;height:46px;margin:0;">${icon(done === total ? "check-circle" : course.icon)}</span>
        <span class="cpr-info">
          <span class="cpr-top">
            <span class="cpr-title">${escapeHtml(course.title)}</span>
            <span class="cpr-pct">${pct}%</span>
          </span>
          <span class="progress-bar cpr-bar"><span class="progress-fill" style="width:${pct}%"></span></span>
          <span class="cpr-sub">${done} of ${total} lessons · ${escapeHtml(nextText)}</span>
        </span>
      </a>`;
    }).join("");
  }

  /* ---------- Achievements ---------- */

  function renderAchievements() {
    document.getElementById("achTitle").innerHTML = `${icon("trophy")}<span>Achievements</span>`;
    const s = ProgressStore.snapshot();
    const unlocked = ACHIEVEMENTS.filter((a) => a.check(s)).length;
    document.getElementById("achGrid").innerHTML =
      ACHIEVEMENTS.map((a) => {
        const got = a.check(s);
        return `
        <div class="ach-card card ${got ? "" : "locked"}">
          <div class="ach-icon">${icon(a.icon)}</div>
          <h3>${escapeHtml(a.title)}</h3>
          <p>${escapeHtml(a.desc)}</p>
          <div class="ach-state">${got ? "Unlocked" : "Locked"}</div>
        </div>`;
      }).join("") +
      `<p style="grid-column: 1 / -1; color: var(--muted); font-size: 0.88rem; margin: 6px 0 0;">${unlocked} of ${ACHIEVEMENTS.length} unlocked</p>`;
  }

  /* ---------- Activity ---------- */

  function renderActivity() {
    document.getElementById("activityTitle").innerHTML = `${icon("activity")}<span>Recent activity</span>`;
    const host = document.getElementById("activityCard");
    const items = ProgressStore.historyList(10);

    if (!items.length) {
      host.innerHTML = `
        <div class="empty-state" style="padding: 40px 20px;">
          ${icon("activity")}
          <h3 style="margin:0 0 6px;">Nothing here yet</h3>
          <p style="margin:0;">Complete a lesson or take a quiz and your activity will appear here.</p>
        </div>`;
      return;
    }

    host.innerHTML = `
      <ul class="activity-list">
        ${items
          .map((h) => {
            const info = findLesson(h.lesson);
            const title = info ? info.lesson.title : h.lesson;
            let ic = "check-circle";
            let cls = "";
            let text;
            if (h.type === "quiz") {
              ic = "help-circle";
              cls = "quiz";
              text = `Quiz on "${title}" — scored ${h.score}/${h.total}`;
            } else if (h.type === "undone") {
              ic = "undo";
              cls = "undo";
              text = `Unmarked "${title}" as complete`;
            } else {
              text = `Completed "${title}"`;
            }
            return `
            <li class="activity-item">
              <span class="activity-icon ${cls}">${icon(ic)}</span>
              <span class="activity-text">${escapeHtml(text)}</span>
              <span class="activity-time">${relTime(h.t)}</span>
            </li>`;
          })
          .join("")}
      </ul>`;
  }

  /* ---------- Reset ---------- */

  function renderReset() {
    const zone = document.getElementById("resetZone");
    zone.innerHTML = `
      <p>Wipe all progress, quiz scores and achievements stored in this browser. This cannot be undone.</p>
      <button class="btn btn-danger" id="resetBtn" type="button">${icon("trash")}<span>Reset all progress</span></button>`;

    document.getElementById("resetBtn").addEventListener("click", () => {
      if (window.confirm("Reset all progress? Every completed lesson, quiz score and achievement will be erased.")) {
        ProgressStore.reset();
        toast("Progress reset", "trash");
      }
    });
  }

  function renderAll() {
    renderHero();
    renderStats();
    renderCourseProgress();
    renderAchievements();
    renderActivity();
  }

  ProgressStore.subscribe(renderAll);
  renderReset();
  renderAll();
})();
