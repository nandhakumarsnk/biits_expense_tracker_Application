import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nandhakumar@123",
  database: "biits_expense_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool;
