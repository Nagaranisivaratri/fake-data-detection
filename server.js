const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// 🔴 GOOGLE SHEETS WEB APP URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzoy8Um1JkOe_9lYcB-5x8QjrV1-Fdd2Mh9o9Tk1h1REeScNXeKdo5XPVwzufCyJ1vYRA/exec";

// Serve HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const data = req.body;
  console.log("Received:", data);

  try {
    const fetch = (await import("node-fetch")).default;

    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    res.send("Saved to Google Sheet successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to save data");
  }
});

// IMPORTANT: Render uses dynamic PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
