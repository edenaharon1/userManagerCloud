const pool = require('./db'); // שנה את הנתיב למיקום המדויק של קובץ החיבור שלך

pool.getConnection()
  .then(conn => {
    console.log("✅ Connection to DB succeeded!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Connection to DB failed:", err);
  });
