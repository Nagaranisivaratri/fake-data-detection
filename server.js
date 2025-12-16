const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// 🔴 REPLACE WITH YOUR NEW GOOGLE SCRIPT URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxMV9Evoc-ptkH2DBhfUKGTDJJUL54WeD-3AoAV_fUvHsQZy-d8HxwQMjlNtmFIh1ZSYg/exec";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Sheet error:", text);
      return res.status(500).send("Failed to save data");
    }

    res.send("Saved Successfully");
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Failed to save data");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
