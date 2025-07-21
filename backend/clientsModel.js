const pool = require('./db'); // הנתיב לקובץ החיבור שלך

// הוספת רשומה
async function addClient(name, phone, email) {
  const [result] = await pool.execute(
    'INSERT INTO Customers (name, phone, email) VALUES (?, ?, ?)',
    [name, phone, email]
  );
  return result.insertId;
}

// קריאת כל הרשומות
async function getClients() {
  const [rows] = await pool.query('SELECT * FROM Customers');
  return rows;
}

// קריאת רשומה לפי ID
async function getClientById(id) {
  const [rows] = await pool.query('SELECT * FROM Customers WHERE id = ?', [id]);
  return rows[0]; // מחזיר אובייקט או undefined אם לא קיים
}

// עדכון רשומה
async function updateClient(id, name, phone, email) {
  const [result] = await pool.execute(
    'UPDATE Customers SET name = ?, phone = ?, email = ? WHERE id = ?',
    [name, phone, email, id]
  );
  return result.affectedRows; // כמה שורות עודכנו
}

// מחיקת רשומה
async function deleteClient(id) {
  const [result] = await pool.execute(
    'DELETE FROM Customers WHERE id = ?',
    [id]
  );
  return result.affectedRows; // כמה שורות נמחקו
}

module.exports = {
  addClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};
