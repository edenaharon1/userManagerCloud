// backend/routes/clients.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Clients route works!" });
});

module.exports = router;
