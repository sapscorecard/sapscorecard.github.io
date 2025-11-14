const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_RcjTCeOrRM0qFOm6YOlS6VqE7IOOXlUZf3_8u5JDxD85xSQa6cod58erBn7cnI4qrIJh7CXRVQQQ/pub?gid=0&single=true&output=csv";
async function loadData() {
  const response = await fetch(SHEET_URL);
  const text = await response.text();
  const rows = text.split("\n").map(r => r.split(","));
  rows.shift(); // remove header row

  // Group by sector
  const groups = {};
  rows.forEach(row => {
    const [Sector, KPI, Baseline, Current, 2030Target, 2040Target, 2050Target, Notes] = row;
    if (!sector) return;
    if (!groups[sector]) groups[sector] = [];
    groups[sector].push({ kpi, baseline, current, target, notes });
  });

  const container = document.getElementById("scorecard");

  Object.keys(groups).forEach(sector => {
    const panel = document.createElement("div");
    panel.className = "score-panel";

    const header = document.createElement("div");
    header.className = "score-header";
    header.innerHTML = `
      <span>${sector}</span>
      <span class="arrow">▶</span>
    `;

    const content = document.createElement("div");
    content.className = "score-content";

    // Add KPIs under the panel
    groups[sector].forEach(item => {
      const kpiBlock = document.createElement("div");
      kpiBlock.className = "kpi-block";

      kpiBlock.innerHTML = `
        <div class="metric-row"><div class="metric-label">KPI:</div><div>${item.KPI}</div></div>
        <div class="metric-row"><div class="metric-label">Baseline:</div><div>${item.Baseline}</div></div>
        <div class="metric-row"><div class="metric-label">Current:</div><div>${item.Current}</div></div>
        <div class="metric-row"><div class="metric-label">2030 Target:</div><div>${item.2030Target}</div></div>
        <div class="metric-row"><div class="metric-label">2030 Target:</div><div>${item.2040Target}</div></div>
        <div class="metric-row"><div class="metric-label">2030 Target:</div><div>${item.2050Target}</div></div>
      `;

      content.appendChild(kpiBlock);

      if (item.notes) {
        const notesDiv = document.createElement("div");
        notesDiv.className = "score-notes";
        notesDiv.textContent = item.Notes;
        content.appendChild(notesDiv);
      }
    });

    // Collapsing functionality
    header.addEventListener("click", () => {
      const visible = content.style.display === "block";
      content.style.display = visible ? "none" : "block";
      header.querySelector(".arrow").textContent = visible ? "▶" : "▼";
    });

    panel.appendChild(header);
    panel.appendChild(content);
    container.appendChild(panel);
  });
}

loadData();
}

loadData();
