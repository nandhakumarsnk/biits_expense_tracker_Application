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
  for (let i = 0; ; i++) {
    console.log(i);

    const item_category = formData.get(`item[${i}]item_category`);
    const item_subcategory = formData.get(`item[${i}]item_subcategory`);
    const description = formData.get(`item[${i}]description`);
    const amount = formData.get(`item[${i}]amount`);
    const amount_in_INR = formData.get(`item[${i}]amount_in_INR`);

    console.log(
      item_category,
      item_subcategory,
      description,
      amount,
      amount_in_INR
    );

    if (
      !description &&
      !item_category &&
      !item_subcategory &&
      !amount &&
      !amount_in_INR
    ) {
      break;
    }

    const attachments = [];
    for (let j = 0; ; j++) {
      const file = formData.get(`item[${i}]attachment[${j}]`);
      if (!file) break;
      attachments.push(file);
    }

    const itemAttachments = [];
    // const itemAttachments = ["/uploads/demo11/example_img_large.jpg"];
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      emp_id
      // `item_${i}`
    );

    await fs.ensureDir(uploadDir);
    for (const file of attachments) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replaceAll(" ", "_");
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      itemAttachments.push(`/uploads/${emp_id}/${filename}`);
    }

    if (
      description &&
      item_category &&
      item_subcategory &&
      amount &&
      amount_in_INR
    ) {
      items.push({
        id: i + 1,
        item_category,
        item_subcategory,
        description,
        amount: parseFloat(amount),
        amount_in_INR: parseFloat(amount_in_INR),
        attachments: itemAttachments,
      });
    }
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
      { message: "Expense records added." },
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
