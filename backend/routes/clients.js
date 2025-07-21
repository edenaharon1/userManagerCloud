const express = require("express");
const router = express.Router();
const clientsModel = require("../clientsModel"); // שנה לנתיב נכון

// קריאת כל הלקוחות
router.get("/", async (req, res) => {
  try {
    const clients = await clientsModel.getClients();
    res.json({ clients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

// יצירת לקוח חדש
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "יש למלא את כל השדות" });
  }

  try {
    const insertId = await clientsModel.addClient(name, phone, email);
    const newClient = await clientsModel.getClientById(insertId);
    res.status(201).json({ client: newClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה ביצירת לקוח" });
  }
});

// עדכון לקוח
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "יש למלא את כל השדות" });
  }

  try {
    const affectedRows = await clientsModel.updateClient(id, name, phone, email);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "לקוח לא נמצא" });
    }
    const updatedClient = await clientsModel.getClientById(id);
    res.json({ client: updatedClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בעדכון לקוח" });
  }
});

// מחיקת לקוח
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const affectedRows = await clientsModel.deleteClient(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "לקוח לא נמצא" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה במחיקת לקוח" });
  }
});

module.exports = router;
