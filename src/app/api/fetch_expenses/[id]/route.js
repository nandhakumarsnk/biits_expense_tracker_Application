import { NextResponse } from "next/server";
import db from "../../../db.js";

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
      // // expense.receipt = JSON.parse(expense.receipt);
      // expense.date = new Date(expense.date).toISOString().split("T")[0];

      const date = new Date(expense.date);
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);

      // Format the date as needed (e.g., yyyy-MM-dd HH:mm:ss)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
      const day = String(date.getDate()).padStart(2, "0");

      expense.date = `${year}-${month}-${day}`;

      if (expense.refund_receipt) {
        try {
          expense.refund_receipt = JSON.parse(expense.refund_receipt);
        } catch (error) {
          console.error("Error parsing refund_receipt:", error);
          expense.refund_receipt = [];
        }
      } else {
        expense.refund_receipt = [];
      }

      // // Parse the items field from JSON string to an array
      // if (expense.items) {
      //   try {
      //     expense.items = JSON.parse(expense.items);
      //   } catch (error) {
      //     console.error("Error parsing items:", error);
      //     expense.items = [1];
      //   }
      // } else {
      //   expense.items = [2];
      // }

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
