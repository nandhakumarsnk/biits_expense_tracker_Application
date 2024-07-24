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

// import { NextResponse } from "next/server";
// import path from "path";
// import { writeFile } from "fs/promises";
// import fs from "fs-extra";
// import db from "../../db.js";
// import logger from "../../../../logger.js";

// export const POST = async (req) => {
//   const formData = await req.formData();

//   console.log(formData);

//   const emp_id = formData.get("emp_id");
//   const emp_name = formData.get("emp_name");
//   const date = formData.get("date");
//   console.log(emp_id, emp_name, date);

//   if (!emp_id || !emp_name || !date) {
//     return NextResponse.json(
//       { error: "Please provide all required fields" },
//       { status: 400 }
//     );
//   }

//   const items = [];
//   for (let i = 0; ; i++) {
//     console.log(i);

//     const item_category = formData.get(`item[${i}]item_category`);
//     const item_subcategory = formData.get(`item[${i}]item_subcategory`);
//     const description = formData.get(`item[${i}]description`);
//     const amount = formData.get(`item[${i}]amount`);
//     const amount_in_INR = formData.get(`item[${i}]amount_in_INR`);

//     logger.info("gfsdgfd", amount_in_INR);

//     console.log(
//       item_category,
//       item_subcategory,
//       description,
//       amount,
//       amount_in_INR
//     );

//     if (
//       !description &&
//       !item_category &&
//       !item_subcategory &&
//       !amount &&
//       !amount_in_INR
//     ) {
//       break;
//     }

//     // const attachments = [];
//     const attachments = [
//       {
//         originalPath:
//           "/sdcard/.transforms/synthetic/picker/0/com.android.providers.media.photopicker/media/1000000034.jpg",
//         type: "image/jpeg",
//         height: 280,
//         width: 260,
//         fileName: "1000000034.jpg",
//         fileSize: 15045,
//         uri: "file:///data/user/0/com.biitstracker/cache/rn_image_picker_lib_temp_f7771fed-91bc-41c9-972a-bd0acc087715.jpg",
//       },
//     ];

//     for (let j = 0; ; j++) {
//       const file = formData.get(`item[${i}]attachment[${j}]`);
//       if (!file) break;
//       attachments.push(file);
//     }

//     const itemAttachments = [];
//     const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);

//     await fs.ensureDir(uploadDir);
//     // for (const file of attachments) {
//     //   let buffer;
//     //   let filename;

//     //   // Check if the file is a React Native file object
//     //   if (file.uri) {
//     //     console.log("uri");
//     //     const response = await fetch(file.uri);
//     //     console.log(response);
//     //     buffer = await response.buffer();
//     //     filename = file.name.replaceAll(" ", "_");
//     //   } else {
//     //     // Handle browser file object
//     //     buffer = Buffer.from(await file.arrayBuffer());
//     //     filename = file.name.replaceAll(" ", "_");
//     //   }

//     //   const filePath = path.join(uploadDir, filename);
//     //   await writeFile(filePath, buffer);
//     //   itemAttachments.push(`/uploads/${emp_id}/${filename}`);
//     // }

//     for (const file of attachments) {
//       let buffer;
//       let filename;

//       if (file.uri) {
//         console.log("uri");
//         logger.info("qqqqqqqq##########", "aaa");
//         console.log("Handling React Native file:", file);

//         try {
//           const localFilePath = decodeURIComponent(
//             file.uri.replace("file://", "")
//           );
//           logger.info("qeeeeeeee", localFilePath);
//           buffer = await fs.readFile(localFilePath);
//           console.log(buffer);
//           filename = path.basename(localFilePath).replaceAll(" ", "_");
//         } catch (error) {
//           logger.info("inside the api");
//           logger.info(error);
//           console.error("Error reading React Native file:", error);
//           return NextResponse.json(
//             { error: "Error reading file" },
//             { status: 500 }
//           );
//         }
//       } else {
//         // Handle browser file object
//         console.log("Handling browser file:", file);
//         buffer = Buffer.from(await file.arrayBuffer());
//         filename = file.name.replaceAll(" ", "_");
//       }

//       const filePath = path.join(uploadDir, filename);
//       await writeFile(filePath, buffer);
//       itemAttachments.push(`/uploads/${emp_id}/${filename}`);
//     }

//     if (
//       description &&
//       item_category &&
//       item_subcategory &&
//       amount &&
//       amount_in_INR
//     ) {
//       items.push({
//         id: i + 1,
//         item_category,
//         item_subcategory,
//         description,
//         amount: parseFloat(amount),
//         amount_in_INR: parseFloat(amount_in_INR),
//         attachments: itemAttachments,
//       });
//     }
//   }

//   if (items.length === 0) {
//     return NextResponse.json(
//       { error: "No valid items provided" },
//       { status: 400 }
//     );
//   }

//   try {
//     await db.query(
//       "INSERT INTO expense_details (emp_id, emp_name, date, items) VALUES (?, ?, ?, ?)",
//       [emp_id, emp_name, date, JSON.stringify(items)]
//     );

//     return NextResponse.json(
//       { message: "Expense details stored successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

// // ============================

// import { NextResponse, NextRequest } from "next/server";
// import path from "path";
// import fs from "fs-extra";
// import multer from "multer";
// import db from "../../db.js";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("working");
//     let uploadPath = path.join(process.cwd(), "public", "uploads");

//     if (req.body.get("emp_id")) {
//       uploadPath = path.join(uploadPath, req.body.get("emp_id"));
//     }

//     fs.ensureDirSync(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname.replace(/\s+/g, "_"));
//   },
// });

// const upload = multer({ storage: storage });

// export const POST = async (req) => {
//   // Parse multipart form data
//   await new Promise((resolve, reject) => {
//     upload.array("item_attachment")(req, {}, (err) => {
//       if (err) {
//         console.log(err, "Error uploading");
//         return reject(err);
//       }
//       resolve();
//     });
//   });

//   const formData = await req.formData();

//   console.log(formData);

//   const emp_id = formData.get("emp_id");
//   const emp_name = formData.get("emp_name");
//   const date = formData.get("date");

//   console.log(emp_id, emp_name, date);

//   if (!emp_id || !emp_name || !date) {
//     return NextResponse.json(
//       { error: "Please provide all required fields" },
//       { status: 400 }
//     );
//   }

//   const items = [];
//   let i = 0;

//   while (formData.has(`item[${i}]item_category`)) {
//     const item_category = formData.get(`item[${i}]item_category`);
//     const item_subcategory = formData.get(`item[${i}]item_subcategory`);
//     const description = formData.get(`item[${i}]description`);
//     const amount = formData.get(`item[${i}]amount`);
//     const amount_in_INR = formData.get(`item[${i}]amount_in_INR`);

//     if (
//       !item_category ||
//       !item_subcategory ||
//       !description ||
//       !amount ||
//       !amount_in_INR
//     ) {
//       i++;
//       continue;
//     }

//     const itemAttachments = [];
//     let j = 0;

//     while (formData.has(`item[${i}]attachment[${j}]`)) {
//       const file = formData.get(`item[${i}]attachment[${j}]`);

//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = file.name.replace(/\s+/g, "_");
//       const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
//       await fs.ensureDir(uploadDir);
//       const filePath = path.join(uploadDir, filename);

//       await fs.writeFile(filePath, buffer);
//       itemAttachments.push(`/uploads/${emp_id}/${filename}`);
//       j++;
//     }

//     items.push({
//       id: i + 1,
//       item_category,
//       item_subcategory,
//       description,
//       amount: parseFloat(amount),
//       amount_in_INR: parseFloat(amount_in_INR),
//       attachments: itemAttachments,
//     });

//     i++;
//   }

//   if (items.length === 0) {
//     return NextResponse.json(
//       { error: "No valid items provided" },
//       { status: 400 }
//     );
//   }

//   try {
//     await db.query(
//       "INSERT INTO expense_details (emp_id, emp_name, date, items) VALUES (?, ?, ?, ?)",
//       [emp_id, emp_name, date, JSON.stringify(items)]
//     );

//     return NextResponse.json(
//       { message: "Expense details stored successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };
