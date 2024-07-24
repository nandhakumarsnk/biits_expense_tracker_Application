import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs-extra";
import db from "../../db.js";

export const POST = async (req) => {
  const formData = await req.formData();

  console.log(formData);

  const emp_id = formData.get("emp_id");
  const emp_name = formData.get("emp_name");
  const date = formData.get("date");
  console.log(emp_id, emp_name, date);

  if (!emp_id || !emp_name || !date) {
    return NextResponse.json(
      { error: "Please provide all required fields" },
      { status: 400 }
    );
  }

  const items = [];
  let i = 0;
  while (formData.has(`item[${i}]item_category`)) {
    const item_category = formData.get(`item[${i}]item_category`);
    const item_subcategory = formData.get(`item[${i}]item_subcategory`);
    const description = formData.get(`item[${i}]description`);
    const amount = formData.get(`item[${i}]amount`);
    const amount_in_INR = formData.get(`item[${i}]amount_in_INR`);

    console.log(item_category);
    console.log(item_subcategory);
    console.log(description);
    console.log(amount);
    console.log(amount_in_INR);

    if (
      !item_category ||
      !item_subcategory ||
      !description ||
      !amount ||
      !amount_in_INR
    ) {
      i++;
      continue;
    }

    const itemAttachments = [];
    let j = 0;

    while (formData.has(`item[${i}]attachment[${j}]`)) {
      // const file = await formData.get(`item[${i}]attachment[${j}`);
      const file = formData.get(`item[${i}]attachment[${j}]`);

      console.log(file);
      // Check if the file is from a browser or React Native
      if (file.name) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, "_");
        const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
        await fs.ensureDir(uploadDir);
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, buffer);
        itemAttachments.push(`/uploads/${emp_id}/${filename}`);
      } else {
        // const { base64, fileName, originalPath, type, uri, width } = file;

        const { base64, fileName } = JSON.parse(file);

        console.log(base64);
        console.log(fileName);

        // Create a buffer from the base64 string
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Define the path to save the image
        const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
        await fs.ensureDir(uploadDir);
        const filePath = path.join(uploadDir, fileName);

        // Save the image file
        await fs.writeFile(filePath, buffer);
        itemAttachments.push(`/uploads/${emp_id}/${fileName}`);
      }

      j++;
    }

    items.push({
      id: i + 1,
      item_category,
      item_subcategory,
      description,
      amount: parseFloat(amount),
      amount_in_INR: parseFloat(amount_in_INR),
      attachments: itemAttachments,
    });

    i++;
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: "No valid items provided" },
      { status: 400 }
    );
  }

  try {
    await db.query(
      "INSERT INTO expense_details (emp_id, emp_name, date, items) VALUES (?, ?, ?, ?)",
      [emp_id, emp_name, date, JSON.stringify(items)]
    );

    return NextResponse.json(
      { message: "Expense details stored successfully", data: formData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal server error:", error);

    return NextResponse.json({ UpdatedError: error }, { status: 400 });
  }
};
