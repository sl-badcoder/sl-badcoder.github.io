(() => {
  "use strict";
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table");
  const id = params.get("id");
  const rows = Object.hasOwn(window.siteData, table) ? window.siteData[table] : null;
  const entry = rows?.find(row => row.id === id);
  const main = document.getElementById("detail-main");
  if (rows) {
    document.querySelector(".back-link").href = "index.html?query=" + encodeURIComponent("SELECT * FROM " + table + ";");
  }
  if (!entry) {
    document.title = "Entry not found · Senad-Leandro";
    document.getElementById("detail-title").textContent = "Entry not found";
    document.getElementById("detail-summary").textContent = "This row does not exist. Return to the SQL shell and choose another result.";
    main.classList.add("detail-error");
    return;
  }

  const title = entry.title || entry.name || entry.role || entry.course || entry.topic;
  document.title = title + " · Senad-Leandro";
  document.getElementById("detail-kicker").textContent = table + " / " + id;
  document.getElementById("detail-title").textContent = title;
  document.getElementById("detail-summary").textContent = entry.summary;
  const sections = document.getElementById("detail-sections");

  function addSection(heading, value) {
    if (!value) return;
    const section = document.createElement("section");
    section.className = "detail-section";
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    h2.textContent = heading;
    p.textContent = value;
    section.append(h2, p);
    sections.append(section);
  }

  addSection("Details", entry.detail);
  addSection("Outcome", entry.outcome);

  if (entry.link) {
    const section = document.createElement("section");
    section.className = "detail-section";
    const h2 = document.createElement("h2");
    const link = document.createElement("a");
    h2.textContent = "Explore";
    link.href = entry.link;
    link.textContent = entry.link.startsWith("http") ? "Open the video ↗" : "Read the article ↗";
    if (entry.link.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    section.append(h2, link);
    sections.append(section);
  }

  const meta = document.getElementById("detail-meta");
  const labels = [entry.category, entry.year, entry.organization, entry.institution, entry.period, entry.author, entry.status, entry.progress, entry.tools, entry.language].filter(Boolean);
  labels.forEach(value => {
    const tag = document.createElement("span");
    tag.textContent = value;
    meta.append(tag);
  });
})();
