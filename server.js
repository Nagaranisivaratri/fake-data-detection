const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// ✅ Update this with your LATEST deployed URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwMzx9Y5KiaQ5l1P7lUjP7Uj2yqDvLZ26Ni0oOuxHAfrOiVrHqpdYtQORU0riSIMCNAiA/exec";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    
    console.log("Sending data to Google Sheets:", req.body);
    
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body),
      redirect: "follow" // Important for Google Apps Script
    });

    const text = await response.text();
    console.log("Google Sheets response:", text);

    if (!response.ok) {
      console.error("Apps Script error:", text);
      return res.status(500).send("Google Sheet rejected data");
    }

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

