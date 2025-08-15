const express = require("express");
const router = express.Router();
const clientsModel = require("../clientsModel"); // שנה לנתיב נכון

// קריאת כל הלקוחות
router.get("/", async (req, res) => {
  try {
    const clients = await clientsModel.getClients();
    res.json({ clients: clients || [] }); // תמיד מחזיר מערך
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשרת בעת קריאת לקוחות" });
  }
});

// יצירת לקוח חדש
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "יש למלא את כל השדות: Name, Email, Phone" });
  }

  try {
    // סדר פרמטרים נכון
    const insertId = await clientsModel.addClient(name, email, phone);
    if (!insertId) {
      return res.status(500).json({ message: "שגיאה ביצירת לקוח במסד" });
    }

    const newClient = await clientsModel.getClientById(insertId);
    if (!newClient) {
      return res.status(500).json({ message: "לא ניתן למצוא את הלקוח שנוסף" });
    }

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

  if (isNaN(id)) return res.status(400).json({ message: "ID לא חוקי" });
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "יש למלא את כל השדות: Name, Email, Phone" });
  }

  try {
    const affectedRows = await clientsModel.updateClient(id, name, email, phone);
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

  if (isNaN(id)) return res.status(400).json({ message: "ID לא חוקי" });

  try {
    const affectedRows = await clientsModel.deleteClient(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "לקוח לא נמצא" });
    }

    res.status(200).json({ message: "לקוח נמחק בהצלחה" }); // מחזיר JSON כדי שה־frontend יוכל לקרוא
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה במחיקת לקוח" });
  }
});

module.exports = router;
