/* ============================================================
   WebCraft Academy — Progress Store (localStorage)
   ============================================================ */

const ProgressStore = (() => {
  const KEY = "webcraft-progress-v1";
  const listeners = [];

  function fresh() {
    return { completed: {}, quiz: {}, history: [] };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== "object") return fresh();
      return {
        completed: parsed.completed || {},
        quiz: parsed.quiz || {},
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    } catch {
      return fresh();
    }
  }

  let state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch { /* storage unavailable — progress is simply session-only */ }
  }

  function notify() {
    const snap = snapshot();
    listeners.forEach((fn) => {
      try { fn(snap); } catch { /* listener errors must not break the store */ }
    });
  }

  function pushHistory(entry) {
    state.history.unshift(entry);
    state.history = state.history.slice(0, 30);
  }

  /* ---------- lesson completion ---------- */

  function isDone(lessonId) {
    return !!state.completed[lessonId];
  }

  function setDone(lessonId, done) {
    if (!!state.completed[lessonId] === !!done) return;
    if (done) state.completed[lessonId] = true;
    else delete state.completed[lessonId];
    pushHistory({ t: Date.now(), type: done ? "done" : "undone", lesson: lessonId });
    save();
    notify();
  }

  function toggle(lessonId) {
    setDone(lessonId, !isDone(lessonId));
    return isDone(lessonId);
  }

  /* ---------- quiz results ---------- */

  function quizResult(lessonId) {
    return state.quiz[lessonId] || null;
  }

  function recordQuiz(lessonId, score, total) {
    const prev = state.quiz[lessonId];
    if (!prev || score > prev.score) {
      state.quiz[lessonId] = { score, total };
    }
    pushHistory({ t: Date.now(), type: "quiz", lesson: lessonId, score, total });
    save();
    notify();
  }

  /* ---------- aggregates ---------- */

  function courseProgress(course) {
    const lessons = [];
    course.modules.forEach((m) => m.lessons.forEach((l) => lessons.push(l)));
    const done = lessons.filter((l) => isDone(l.id)).length;
    const firstIncomplete = lessons.find((l) => !isDone(l.id)) || null;
    return {
      done,
      total: lessons.length,
      pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
      firstIncomplete,
      lessons,
    };
  }

  function snapshot() {
    let lessonsTotal = 0;
    let lessonsDone = 0;
    let coursesDone = 0;
    let coursesStarted = 0;
    let perfectQuizzes = 0;
    let quizzesTaken = 0;

    (typeof COURSES !== "undefined" ? COURSES : []).forEach((course) => {
      const cp = courseProgress(course);
      lessonsTotal += cp.total;
      lessonsDone += cp.done;
      if (cp.done > 0) coursesStarted++;
      if (cp.total > 0 && cp.done === cp.total) coursesDone++;
    });

    Object.keys(state.quiz).forEach((id) => {
      const q = state.quiz[id];
      quizzesTaken++;
      if (q.score === q.total) perfectQuizzes++;
    });

    return {
      lessonsDone,
      lessonsTotal,
      coursesDone,
      coursesStarted,
      quizzesTaken,
      perfectQuizzes,
      pct: lessonsTotal ? Math.round((lessonsDone / lessonsTotal) * 100) : 0,
    };
  }

  function historyList(limit = 8) {
    return state.history.slice(0, limit);
  }

  function reset() {
    state = fresh();
    save();
    notify();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  }

  return {
    isDone,
    setDone,
    toggle,
    quizResult,
    recordQuiz,
    courseProgress,
    snapshot,
    historyList,
    reset,
    subscribe,
  };
})();
