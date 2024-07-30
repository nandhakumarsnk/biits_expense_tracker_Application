import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "../../db";

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

    // Check if the phone number already exists
    const [phoneRows] = await db.query(
      "SELECT * FROM emp_details WHERE phone = ?",
      [phone]
    );
    if (phoneRows.length > 0) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Check if the emplId already exists
    const [empIdRows] = await db.query(
      "SELECT * FROM emp_details WHERE emp_id = ?",
      [emp_id]
    );
    if (empIdRows.length > 0) {
      return NextResponse.json(
        { error: "Employee Id already exists" },
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
