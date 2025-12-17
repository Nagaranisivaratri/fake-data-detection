const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ MUST be the LATEST deployed Apps Script URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwMzx9Y5KiaQ5l1P7lUjP7Uj2yqDvLZ26Ni0oOuxHAfrOiVrHqpdYtQORU0riSIMCNAiA/exec";

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
      console.error("Apps Script error:", text);
      return res.status(500).send("Google Sheet rejected data");
    }

    console.log("Saved to Google Sheet:", text);
    res.send("Saved Successfully ✅");

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Failed to save data ❌");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
