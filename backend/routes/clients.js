const express = require("express");
const router = express.Router();

// מסד נתונים זמני בזיכרון (mock)
let clients = [
  { id: 1, name: "רונית כהן", email: "ronit@example.com", phone: "050-1234567" },
  { id: 2, name: "משה לוי", email: "moshe@example.com", phone: "052-7654321" },
];

// קריאת כל הלקוחות
router.get("/", (req, res) => {
  res.json({ clients });
});

// יצירת לקוח חדש
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "יש למלא את כל השדות" });
  }

  const newClient = {
    id: clients.length > 0 ? clients[clients.length - 1].id + 1 : 1,
    name,
    email,
    phone,
  };

  clients.push(newClient);
  res.status(201).json({ client: newClient });
});

// (אופציונלי) מחיקת לקוח
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  clients = clients.filter((c) => c.id !== id);
  res.status(204).send(); // ללא תוכן
});

// (אופציונלי) עדכון לקוח
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, phone } = req.body;

  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ message: "לקוח לא נמצא" });

  clients[index] = { id, name, email, phone };
  res.json({ client: clients[index] });
});

module.exports = router;
