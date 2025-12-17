const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 🔴 Your Google Apps Script Web App URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyVaSfB2tXawhpALHOZuzc-q7PJEJ_QLVQtO5Ew-qeKTC8VnUotVqftzL407-IpHDgJdQ/exec";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;

    console.log("📤 Sending to Google:", req.body);

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });

    const text = await response.text();
    console.log("📥 Google response:", text);

    if (!response.ok) {
      throw new Error("Google Sheet write failed");
    }

    res.send("Saved Successfully ✅");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Failed to save data");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);


