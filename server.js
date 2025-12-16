const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// 🔴 PUT YOUR NEW APPS SCRIPT URL HERE
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxALCnSyu4u_M8SctDxmSyY2PPZKZ4plJG8v8Dstnc-c5uTu0fQi4y9YRNeQ8LFMNZmEw/exec";

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
