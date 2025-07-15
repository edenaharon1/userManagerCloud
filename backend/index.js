const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// טוען את הראוטים
const clientsRouter = require("./routes/clients");
const remindersRouter = require("./routes/reminders");

app.use("/api/clients", clientsRouter);
app.use("/api/reminders", remindersRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/test-db", (req, res) => {
  res.json({ dbWorking: true, message: "בדיקת שרת בסיסית – עובד" });
});


// טיפול בשגיאות – חייב להיות בסוף
app.use((err, req, res, next) => {
  console.error("שגיאה כללית:", err);
  res.status(500).json({ message: "אירעה שגיאה בשרת", error: err.message });
});
