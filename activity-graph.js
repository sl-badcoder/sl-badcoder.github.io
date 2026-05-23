const GITHUB_USERNAME = "sl-badcoder";

async function fetchGitHubActivity(username) {
  const proxy = "https://corsproxy.io/?";
  const url = proxy + `https://github.com/users/${username}/contributions`;

  const response = await fetch(url);
  const html = await response.text();
  const container = document.createElement("div");
  container.innerHTML = html;

  // Try to find any elements with data-date and data-count attributes (likely inside SVG)
  const rects = container.querySelectorAll("[data-date][data-count]");
  if (rects.length > 0) {
    // Parse the rects data first (preferred)
    const data = {};
    rects.forEach(rect => {
      const date = rect.getAttribute("data-date");
      const count = parseInt(rect.getAttribute("data-count"));
      if (date) data[date] = count;
    });
    return data;
  }

  // If no rects found, fallback to parsing table cells by aria-label or title
  const table = container.querySelector("table.ContributionCalendar-grid");
  if (!table) {
    console.error("Contribution table not found!");
    return {};
  }

  const data = {};
  const cells = table.querySelectorAll("td");
  cells.forEach(td => {
    // Sometimes the count is in a title element inside the cell
    const titleEl = td.querySelector("title");
    let label = titleEl ? titleEl.textContent : (td.getAttribute("aria-label") || td.getAttribute("title"));
    if (!label) return;

    // Match formats like:
    // "July 1, 2024: 2 contributions"
    // or "No contributions on July 1, 2024"
    const contribMatch = label.match(/(\w+ \d{1,2}, \d{4}): (\d+) contribution/);
    if (contribMatch) {
      const dateStr = contribMatch[1];
      const count = parseInt(contribMatch[2], 10);
      const date = formatDate(dateStr);
      if (date) data[date] = count;
    } else {
      const noContribMatch = label.match(/No contributions on (\w+ \d{1,2}, \d{4})/);
      if (noContribMatch) {
        const dateStr = noContribMatch[1];
        const date = formatDate(dateStr);
        if (date) data[date] = 0;
      }
    }
  });

  return data;
}

// Helper to reliably parse GitHub date string like "July 1, 2024" to "YYYY-MM-DD"
function formatDate(dateStr) {
  // Parse manually:
  // dateStr: "July 1, 2024"
  const [monthName, dayComma, year] = dateStr.split(" ");
  const day = parseInt(dayComma.replace(",", ""), 10);
  const months = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12"
  };
  const month = months[monthName];
  if (!month || !day || !year) return null;
  return `${year}-${month}-${day.toString().padStart(2, "0")}`;
}

function normalizeGitHubData(ghData) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365);

  const dates = [];
  const values = [];
  let cumulative = 0;

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().substring(0, 10);
    const daily = ghData[dateStr] || 0;
    cumulative += daily;
    dates.push(dateStr);
    values.push(cumulative);
  }

  const max = values[values.length - 1] || 1;
  const normalized = values.map(v => v / max);
  return { dates, normalized };
}

async function renderChart() {
  const ghData = await fetchGitHubActivity(GITHUB_USERNAME);
  console.log("GitHub Data Parsed:", ghData);
  const { dates, normalized } = normalizeGitHubData(ghData);

  const ctx = document.getElementById("activityChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: `${GITHUB_USERNAME} GitHub Commits`,
        data: normalized,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { display: false },
        y: {
          title: { display: true, text: "Normalized Cumulative GitHub Commits" },
          min: 0,
          max: 1
        }
      }
    }
  });
}

renderChart();
