import { NextResponse } from "next/server";
import path from "path";
import fs from "fs-extra";
import mysql from "mysql2/promise";

// Setup MySQL connection
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req, context) => {
  const { params } = context;

  try {
    const formData = await req.formData();

    const id = params.id;
    const refund_status = formData.get("refund_status");
    const refund_receipt = [];

    // Collect all refund_receipt files
    for (let i = 0; ; i++) {
      const file = formData.get(`refund_receipt[${i}]`);
      if (!file) break;
      refund_receipt.push(file);
    }

    // Validate inputs
    if (!id || !refund_status || refund_receipt.length === 0) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Directory where files will be uploaded
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "refunds",
      id
    );

    // Ensure the directory exists
    await fs.ensureDir(uploadDir);

    const receiptPaths = [];

    // // Process each file
    // for (const file of refund_receipt) {
    //   if (!file || !file.name) continue;
    //   const filename = file.name.replace(/ /g, "_");
    //   const filePath = path.join(uploadDir, filename);

    //   // Save the file to disk
    //   const buffer = await file.arrayBuffer();
    //   await fs.writeFile(filePath, Buffer.from(buffer));

    //   // Store the path to be saved in the database
    //   receiptPaths.push(`/uploads/refunds/${id}/${filename}`);
    // }

    // Process each refund_receipt value
    for (const value of refund_receipt) {
      if (typeof value === "string" && value.startsWith("/uploads/")) {
        // It's a URL, keep it as is
        receiptPaths.push(value);
      } else {
        // It's a file, process and save it
        const file = value;
        const filename = file.name.replace(/ /g, "_");
        const filePath = path.join(uploadDir, filename);

        // Save the file to disk
        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));

        // Store the path to be saved in the database
        receiptPaths.push(`/uploads/refunds/${id}/${filename}`);
      }
    }

    // Update database with new paths and status
    const [result] = await db.query(
      "UPDATE expense_details SET refund_receipt = ?, refund_status = ? WHERE id = ?",
      [JSON.stringify(receiptPaths), refund_status, id]
    );

    // Check if update was successful
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json(
      { message: "Expense updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
