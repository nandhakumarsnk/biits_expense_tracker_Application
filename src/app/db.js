const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nandhakumar@123",
  database: "biits_expense_tracker",
});

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database connection established");
  }
});

module.exports = db;
