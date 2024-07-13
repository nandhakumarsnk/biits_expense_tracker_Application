import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs-extra";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nandhakumar@123",
  database: "biits_expense_tracker",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req) => {
  const formData = await req.formData();

  const emp_id = formData.get("emp_id");
  const date = formData.get("date");
  const items = formData.get("items");
  const amount = formData.get("amount");
  const receiptFiles = formData.getAll("receipt");

  if (!emp_id || !date || !items || !amount || receiptFiles.length === 0) {
    return NextResponse.json(
      { error: "Please provide all required fields" },
      { status: 400 }
    );
  }

  const receiptPaths = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);

  try {
    // Ensure the directory exists
    await fs.ensureDir(uploadDir);

    for (const file of receiptFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replaceAll(" ", "_");
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      receiptPaths.push(`/uploads/${emp_id}/${filename}`);
    }

    await db.query(
      "INSERT INTO expense_details (emp_id, date, items, receipt, amount) VALUES (?, ?, ?, ?, ?)",
      [emp_id, date, items, JSON.stringify(receiptPaths), amount]
    );

    return NextResponse.json(
      { message: "Expense details stored successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
