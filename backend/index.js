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


// בדיקת התחברות למסד הנתונים לפני התחלת השרת
const db = require("./db"); 

async function startServer() {
  try {
    // ניסיון חיבור למסד
    const connection = await db.getConnection();
    console.log("✅ Successfully connected to the database.");
    connection.release();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running...`));

  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1); // מפסיק את התהליך אם אין חיבור למסד
  }
}

startServer();


// טיפול בשגיאות
app.use((err, req, res, next) => {
  console.error("General error:", err);
  res.status(500).json({ message: "An error occurred on the server", error: err.message });
});
