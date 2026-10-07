/* ============================================================
   Course catalog — search + level filters
   Depends on: data.js, progress.js, main.js
   ============================================================ */

(function () {
  const eyebrow = document.getElementById("catalogEyebrow");
  if (eyebrow) eyebrow.innerHTML = `${icon("layers")}<span>Catalog</span>`;

  const searchInput = document.getElementById("searchInput");
  const filtersEl = document.getElementById("filters");
  const gridEl = document.getElementById("courseGrid");
  const emptyEl = document.getElementById("emptyState");

  const params = new URLSearchParams(location.search);
  let activeLevel = params.get("level") || "all";
  let query = "";

  const LEVELS = [
    { key: "all", label: "All levels" },
    { key: "beginner", label: "Beginner" },
    { key: "intermediate", label: "Intermediate" },
  ];

  function renderFilters() {
    filtersEl.innerHTML = LEVELS.map(
      (l) => `<button class="chip ${activeLevel === l.key ? "active" : ""}" type="button" data-level="${l.key}">${l.label}</button>`
    ).join("");
  }

  function courseMatches(course) {
    if (activeLevel !== "all" && course.level !== activeLevel) return false;
    if (!query) return true;
    const haystack = [
      course.title,
      course.tagline,
      course.description,
      ...course.outcomes,
      ...courseLessons(course).map((l) => l.title),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  }

  function renderGrid() {
    const matches = COURSES.filter(courseMatches);
    gridEl.innerHTML = matches.map(courseCardHTML).join("");
    emptyEl.hidden = matches.length > 0;
    if (matches.length === 0) {
      emptyEl.innerHTML = `${icon("search")}<h3>No courses match</h3><p>Try a different search term or clear the level filter.</p>`;
    }
    initReveal();
  }

  filtersEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeLevel = chip.dataset.level;
    renderFilters();
    renderGrid();
  });

  let debounce = null;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      query = searchInput.value.trim().toLowerCase();
      renderGrid();
    }, 120);
  });

  renderFilters();
  renderGrid();
})();
