import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs-extra";
import db from "../../db.js";
import initCors from "nextjs-cors";

export const POST = async (req) => {
  await initCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "http://127.0.0.1:5501", // You can specify your domain here
    allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
  });

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

  // Parse items field to ensure it's valid JSON
  let parsedItems;
  try {
    parsedItems = JSON.parse(items);
    if (
      !Array.isArray(parsedItems) ||
      parsedItems.some((item) => !item.item || !item.amount)
    ) {
      throw new Error("Invalid items format");
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Invalid items format, must be an array of objects with 'item' and 'amount'",
      },
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
      [
        emp_id,
        date,
        JSON.stringify(parsedItems),
        JSON.stringify(receiptPaths),
        amount,
      ]
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
