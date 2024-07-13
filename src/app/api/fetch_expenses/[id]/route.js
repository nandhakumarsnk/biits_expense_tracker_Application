import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nandhakumar@123",
  database: "biits_expense_tracker",
});

export async function GET(request, { params }) {
  console.log(params.id);
  const { id: emp_id } = params; // Destructure `emp_id` from `params`

  console.log(emp_id);

  if (!emp_id) {
    return NextResponse.json(
      { error: "Please provide emp_id" },
      { status: 400 }
    );
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM expense_details WHERE emp_id = ?",
      [emp_id]
    );

    console.log(results);

    const formattedResults = results.map((expense) => {
      expense.receipt = JSON.parse(expense.receipt);
      expense.date = new Date(expense.date).toISOString().split("T")[0];
      return expense;
    });

    return NextResponse.json({ expenses: formattedResults });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
