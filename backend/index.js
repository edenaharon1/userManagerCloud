const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// טוען את הראוטים
const clientsRouter = require("./routes/clients");

// 💡 השינוי המרכזי כאן: החלפת הנתיב מ-"/api/clients" ל-"/api"
// זה מפנה את כל התעבורה שמתחילה ב-/api אל הראוטר clientsRouter.
app.use("/api/clients", clientsRouter);

// בדיקת התחברות למסד הנתונים לפני התחלת השרת
const db = require("./db"); // ← נתיב לקובץ שמייצא את החיבור

async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Successfully connected to the database.");
    connection.release();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}...`)
    );
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
}

// בדיקה בסיסית
app.get("/api/test-db", (req, res) => {
  res.json({ dbWorking: true, message: "Basic server test – working" });
});

startServer();

// טיפול בשגיאות
app.use((err, req, res, next) => {
  console.error("General error:", err);
  res.status(500).json({
    message: "An error occurred on the server",
    error: err.message,
  });
});