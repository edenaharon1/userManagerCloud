// backend/routes/reminders.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Reminders route works!" });
});

module.exports = router;
