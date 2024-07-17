import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs-extra";
import db from "../../db.js";

export const POST = async (req) => {
  const formData = await req.formData();

  const emp_id = formData.get("emp_id");
  const emp_name = formData.get("emp_name");
  const date = formData.get("date");
  const items = formData.get("items");

  console.log(emp_id, emp_name, date, items);

  if (!emp_id || !emp_name || !date || !items) {
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
      parsedItems.some(
        (item) =>
          !item.item_category ||
          !item.item_subcategory ||
          !item.Description ||
          !item.amount_in_INR ||
          !item.attachment
      )
    ) {
      throw new Error("Invalid items format");
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Invalid items format, must be an array of objects with 'item_category', 'item_subcategory', 'Description', 'amount_in_INR', and 'attachment'",
      },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);

  try {
    // Ensure the directory exists
    await fs.ensureDir(uploadDir);

    for (const item of parsedItems) {
      const receiptFiles = item.attachment; // Assuming 'receipt' is an array of files for each item
      const receiptPaths = [];

      if (receiptFiles && Array.isArray(receiptFiles)) {
        // for (const file of receiptFiles) {
        //   const buffer = Buffer.from(await file.arrayBuffer());
        //   const filename = file.name.replaceAll(" ", "_");
        //   const filePath = path.join(uploadDir, filename);

        //   await writeFile(filePath, buffer);
        //   receiptPaths.push(`/uploads/${emp_id}/${filename}`);
        // }
        for (const value of receiptFiles) {
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
      }

      // Update attachments in the current item
      item.attachment = receiptPaths;
    }

    await db.query(
      "INSERT INTO expense_details (emp_id, emp_name, date, items) VALUES (?, ?, ?, ?)",
      [emp_id, emp_name, date, JSON.stringify(parsedItems)]
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
