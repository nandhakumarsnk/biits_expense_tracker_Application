import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Nandhakumar@123",
//   database: "biits_expense_tracker",
// });

const db = mysql.createPool({
  host: "localhost",
  user: "expense_user",
  password: "expense_user@123",
  database: "expense",
});

export async function POST(request) {
  const { emp_id, name, email, password, user_role, phone } =
    await request.json();

  try {
    const [rows] = await db.query("SELECT * FROM emp_details WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO emp_details (emp_id, name, email, password, user_role, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [emp_id, name, email, hashedPassword, user_role, phone]
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
