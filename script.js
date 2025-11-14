const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_RcjTCeOrRM0qFOm6YOlS6VqE7IOOXlUZf3_8u5JDxD85xSQa6cod58erBn7cnI4qrIJh7CXRVQQQ/pub?gid=0&single=true&output=csv";

async function loadData() {
  const response = await fetch(SHEET_URL);
  const text = await response.text();

  // Split CSV rows
const parsed = Papa.parse(text, {
  header: true,
  skipEmptyLines: true
});

const rows = parsed.data;

  // Group by sector
  const groups = {};
rows.forEach(row => {
  const sector       = row["Sector"];
  const kpi          = row["KPI"];
  const baseline     = row["Baseline"];
  const current      = row["Current"];
  const target2030   = row["2030Target"];
  const target2040   = row["2040Target"];
  const target2050   = row["2050Target"];
  const notes        = row["Notes"];

  const container = document.getElementById("scorecard");

  // Build UI panels
  Object.keys(groups).forEach((sector) => {
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

    // Add KPI blocks
    groups[sector].forEach((item) => {
      const kpiBlock = document.createElement("div");
      kpiBlock.className = "kpi-block";

      kpiBlock.innerHTML = `
        <div class="metric-row"><div class="metric-label">KPI:</div><div>${item.kpi || ""}</div></div>
        <div class="metric-row"><div class="metric-label">Baseline:</div><div>${item.baseline || ""}</div></div>
        <div class="metric-row"><div class="metric-label">Current:</div><div>${item.current || ""}</div></div>
        <div class="metric-row"><div class="metric-label">2030 Target:</div><div>${item.target2030 || ""}</div></div>
        <div class="metric-row"><div class="metric-label">2040 Target:</div><div>${item.target2040 || ""}</div></div>
        <div class="metric-row"><div class="metric-label">2050 Target:</div><div>${item.target2050 || ""}</div></div>
      `;

      content.appendChild(kpiBlock);

      if (item.notes) {
        const notesDiv = document.createElement("div");
        notesDiv.className = "score-notes";
        notesDiv.textContent = item.notes;
        content.appendChild(notesDiv);
      }
    });

    // Collapse / expand
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
