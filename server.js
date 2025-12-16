const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Paths
const BASE_DIR = __dirname;
const CSV_FILE = path.join(BASE_DIR, "data.csv");
const HTML_FILE = path.join(BASE_DIR, "index.html");

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(HTML_FILE);
});

// Create CSV with headers if it does not exist
if (!fs.existsSync(CSV_FILE)) {
  const header =
    "UserID,Age,Gender,City,Address,Phone,Email," +
    "Q1_PlanWork,Q2_Learning,Q3_OnTime,Q4_Distracted," +
    "Q5_CheckWork,Q6_Social,Q7_Helpful,Description," +
    "TypingSpeed,BackspaceCount,ResponseTime,TrustScore,Status\n";

  fs.writeFileSync(CSV_FILE, header);
}

// Handle form submission
app.post("/submit", (req, res) => {
  const d = req.body;

  console.log("Received:", d);

  const row =
    `${d.userId},${d.age},${d.gender},${d.city},${d.address},${d.phone},${d.email},` +
    `${d.q1},${d.q2},${d.q3},${d.q4},${d.q5},${d.q6},${d.q7},` +
    `"${d.description}",` +
    `${d.typingSpeed},${d.backspaceCount},${d.totalTime},${d.trustScore},${d.status}\n`;

  fs.appendFileSync(CSV_FILE, row);
  res.send("Saved Successfully");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
