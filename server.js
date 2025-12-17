const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// 🔴 PUT YOUR NEW APPS SCRIPT URL HERE
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbx_XnXuD8Lmj1D_wBSunMkRqhPJtwFgksfFe4_qqZJLhHo2fdrIs7PhgUFrDQup_L3W9Q/exec";

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

    const result = await response.text();

    if (!response.ok) {
      throw new Error(result);
    }

    res.send("Saved Successfully");

  } catch (err) {
    console.error("Sheet error:", err.message);
    res.status(500).send("Failed to save data");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

