const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Google Apps Script Web App URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbz4ArOZbpv4UYhtuOxXRYORIean1Y-sO3LkGYtU8jbqZy5WVQGW5St6B2vZMnaVJj0CfQ/exec";


// Serve HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission
app.post("/submit", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    console.log("Google Script response:", text);

    if (!response.ok) {
      throw new Error(text);
    }

    res.send("Saved Successfully");
  } catch (error) {
    console.error("Google Sheet Error:", error.message);
    res.status(500).send("Failed to save data");
  }
});

// ✅ Render dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

