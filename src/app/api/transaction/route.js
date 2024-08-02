// import db from "../../db.js";
// import { NextResponse } from "next/server";

// export const POST = async (req) => {
//   const formData = await req.formData();

//   const emp_id = formData.get("emp_id");
//   const credit_debit = formData.get("credit_debit");
//   const amount = parseFloat(formData.get("amount"));

//   if (!emp_id || !credit_debit || isNaN(amount)) {
//     return NextResponse.json(
//       { message: "Missing required fields" },
//       { status: 400 }
//     );
//   }

//   try {
//     let remainingAmount = amount;
//     // if (credit_debit === "debit") {
//     //   const [latestRecord] = await db.query(
//     //     "SELECT remaining_amount FROM transactions WHERE emp_id = ? ORDER BY date DESC, id DESC LIMIT 1",
//     //     [emp_id]
//     //   );

//     //   if (latestRecord.length > 0) {
//     //     remainingAmount = parseFloat(latestRecord[0].remaining_amount) - amount;
//     //   }
//     // }

//     const [latestRecord] = await db.query(
//       "SELECT remaining_amount FROM transactions WHERE emp_id = ? ORDER BY date DESC, id DESC LIMIT 1",
//       [emp_id]
//     );

//     if (latestRecord.length > 0) {
//       const latestRemainingAmount = parseFloat(
//         latestRecord[0].remaining_amount
//       );
//       if (credit_debit === "credit") {
//         remainingAmount = latestRemainingAmount + amount;
//       } else if (credit_debit === "debit") {
//         remainingAmount = latestRemainingAmount - amount;
//         if (remainingAmount < 0) {
//           const insufficientAmount = amount - latestRemainingAmount;
//           return NextResponse.json(
//             { message: "Insufficient balance.", insufficientAmount },
//             { status: 400 }
//           );
//         }
//       }
//     } else if (credit_debit === "debit") {
//       return NextResponse.json(
//         { message: "Insufficient balance. No previous records found." },
//         { status: 400 }
//       );
//     }

//     await db.query(
//       "INSERT INTO transactions (emp_id, credit_debit, amount, remaining_amount, date) VALUES (?, ?, ?, ?, NOW())",
//       [
//         emp_id,
//         credit_debit,
//         amount,
//         remainingAmount,
//         // credit_debit === "credit" ? null : JSON.stringify("items"),
//       ]
//     );

//     return NextResponse.json(
//       { message: "Transaction added successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal server error", error },
//       { status: 500 }
//     );
//   }
// };

import db from "../../db.js";
import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export const POST = async (req) => {
  const formData = await req.formData();

  const emp_id = formData.get("emp_id");
  const emp_name = formData.get("emp_name");
  const date = formData.get("date");
  const credit_debit = formData.get("credit_debit");
  const amount = parseFloat(formData.get("amount"));

  if (!emp_id || !credit_debit || isNaN(amount)) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const items = [];
  let i = 0;
  while (formData.has(`item[${i}]item_category`)) {
    const item_category = formData.get(`item[${i}]item_category`);
    const item_subcategory = formData.get(`item[${i}]item_subcategory`);
    const description = formData.get(`item[${i}]description`);
    const itemAmount = formData.get(`item[${i}]amount`);
    const amount_in_INR = formData.get(`item[${i}]amount_in_INR`);
    const currency = formData.get(`item[${i}]currency`);

    if (
      !item_category ||
      !item_subcategory ||
      !description ||
      !itemAmount ||
      !amount_in_INR ||
      !currency
    ) {
      i++;
      continue;
    }

    const itemAttachments = [];
    let j = 0;

    while (formData.has(`item[${i}]attachment[${j}]`)) {
      const file = formData.get(`item[${i}]attachment[${j}]`);

      if (file.name) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, "_");
        const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
        await fs.ensureDir(uploadDir);
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, buffer);
        itemAttachments.push(`/uploads/${emp_id}/${filename}`);
      } else {
        const { base64, fileName } = JSON.parse(file);

        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
        await fs.ensureDir(uploadDir);
        const filePath = path.join(uploadDir, fileName);

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
      amount: parseFloat(itemAmount),
      amount_in_INR: parseFloat(amount_in_INR),
      currency,
      attachments: itemAttachments,
    });

    i++;
  }

  if (credit_debit === "debit" && items.length === 0) {
    return NextResponse.json(
      { message: "No valid items provided" },
      { status: 400 }
    );
  }

  try {
    let remainingAmount = amount;
    const [latestRecord] = await db.query(
      "SELECT remaining_amount FROM transactions WHERE emp_id = ? ORDER BY created_at DESC, id DESC LIMIT 1",
      [emp_id]
    );
    console.log([latestRecord]);
    if (latestRecord.length > 0) {
      const latestRemainingAmount = parseFloat(
        latestRecord[0].remaining_amount
      );
      if (credit_debit === "credit") {
        remainingAmount = latestRemainingAmount + amount;
      } else if (credit_debit === "debit") {
        remainingAmount = latestRemainingAmount - amount;
        if (remainingAmount < 0) {
          return NextResponse.json(
            { message: "Insufficient balance.", latestRemainingAmount },
            { status: 400 }
          );
        }
      }
    } else if (credit_debit === "debit") {
      return NextResponse.json(
        { message: "Insufficient balance. No previous records found." },
        { status: 400 }
      );
    }
    console.log("working");
    const currentDate = new Date();
    await db.query(
      "INSERT INTO transactions (emp_id,emp_name,date, credit_debit, amount, remaining_amount, items, created_at ) VALUES (?,?,?, ?, ?, ?, ?, NOW())",
      [
        emp_id,
        emp_name,
        credit_debit === "debit" ? date : currentDate,
        credit_debit,
        amount,
        remainingAmount,
        credit_debit === "credit" ? null : JSON.stringify(items),
      ]
    );

    console.log("working");

    return NextResponse.json(
      { message: "Transaction added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
};
