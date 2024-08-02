import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "expense_tracker_app",
  password: "expense_user@123",
  database: "expense_db",
});

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Nandhakumar@123",
//   database: "biits_expense_tracker",
// });

module.exports = db;
