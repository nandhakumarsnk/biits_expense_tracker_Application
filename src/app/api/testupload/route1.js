// import { NextResponse } from "next/server";
// import path from "path";
// import { writeFile } from "fs/promises";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export const POST = async (req) => {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");

//     if (!file) {
//       return NextResponse.json(
//         { error: "No files received." },
//         { status: 400 }
//       );
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filename = file.name.replaceAll(" ", "_");
//     console.log(filename);

//     try {
//       await writeFile(path.join(process.cwd(), "public/", filename), buffer);
//       return NextResponse.json({ message: "Success", status: 201 });
//     } catch (error) {
//       console.log("Error occurred: ", error);
//       return NextResponse.json({ message: "Failed", status: 500 });
//     }
//   } catch (error) {
//     console.log("Error occurred while processing form data: ", error);
//     return NextResponse.json({
//       message: "Failed to process form data",
//       status: 500,
//     });
//   }
// };

// import { NextResponse } from "next/server";
// import path from "path";
// import fs from "fs-extra";
// import multer from "multer";
// import db from "../../db.js";

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let uploadPath = path.join(process.cwd(), "public", "uploads");

//     if (req.body.emp_id) {
//       uploadPath = path.join(uploadPath, req.body.emp_id);
//     }

//     fs.ensureDirSync(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname.replace(/\s+/g, "_"));
//   },
// });

// const upload = multer({ storage: storage });

// export const POST = async (req, res) => {
//   // Parse multipart form data
//   await new Promise((resolve, reject) => {
//     upload.any()(req, {}, (err) => {
//       if (err) return reject(err);
//       resolve();
//     });
//   });

//   const formData = await req.formData();
//   console.log(formData);

//   console.log(req);

//   const emp_id = formData.get("emp_id");
//   const emp_name = formData.get("emp_name");
//   const date = formData.get("date");

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

//     // while (formData.has(`item[${i}]attachment[${j}]`)) {
//     //   const fileField = `item[${i}]attachment[${j}]`;
//     //   const file = req.files.find((f) => f.fieldname === fileField);
//     //   if (file) {
//     //     const filePath = `/uploads/${emp_id}/${file.filename}`;
//     //     itemAttachments.push(filePath);
//     //   }
//     //   j++;
//     // }

//     while (formData.has(`item[${i}]attachment[${j}]`)) {
//       const fileField = `item[${i}]attachment[${j}]`;
//       const file = formData.get(`item[${i}]attachment[${j}]`);
//       if (file) {
//         const filePath = `/uploads/${emp_id}/${file.name}`;
//         itemAttachments.push(filePath);
//       }
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

// src/app/api/testupload/route.js

import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs-extra";
import multer from "multer";
import db from "../../db.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(process.cwd(), "public", "uploads");

    if (req.body.get("emp_id")) {
      uploadPath = path.join(uploadPath, req.body.get("emp_id"));
    }

    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage: storage });

export const POST = async (req) => {
  // Parse multipart form data
  await new Promise((resolve, reject) => {
    upload.array("item_attachment")(req, {}, (err) => {
      if (err) {
        console.log(err, "Error uploading");
        return reject(err);
      }
      resolve();
    });
  });

  const formData = await req.formData();

  const emp_id = formData.get("emp_id");
  const emp_name = formData.get("emp_name");
  const date = formData.get("date");

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

    // while (formData.has(`item[${i}]attachment[${j}]`)) {
    //   // const file = await formData.get(`item[${i}]attachment[${j}]`);
    // const file = {
    //   fileName: "example_img_large.jpg",
    //   // fileSize: 15045,
    //   // height: 280,
    //   // originalPath:
    //   //   "/sdcard/.transforms/synthetic/picker/0/com.android.providers.media.photopicker/media/1000000034.jpg",
    //   originalPath: "C:/Users/Nandha.kumar/Downloads/example_img_large.jpg",
    //   type: "image/jpg",
    //   // uri: "file:///data/user/0/com.biitstracker/cache/rn_image_picker_lib_temp_b33b1428-7090-48d1-afeb-cd2df6ba7d70.jpg",
    //   uri: "file:///Users/Nandha.kumar/Downloads/example_img_large.jpg",
    //   width: 260,
    // };
    //   // Check if the file is from a browser or React Native
    //   if (file.name) {
    //     // Browser file upload
    //     const buffer = Buffer.from(await file.arrayBuffer());
    //     const filename = file.name.replace(/\s+/g, "_");
    //     const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
    //     await fs.ensureDir(uploadDir);
    //     const filePath = path.join(uploadDir, filename);

    //     await fs.writeFile(filePath, buffer);
    //     itemAttachments.push(`/uploads/${emp_id}/${filename}`);
    //   } else {
    //     const { fileName, fileSize, height, originalPath, type, uri, width } =
    //       file;

    //     // Remove the 'file://' scheme from the URI
    //     // const absolutePath = uri.replace(/^file:\/\//, '');
    //     // console.log(absolutePath);

    //     console.log(fileName, uri);
    //     const filename = fileName.replace(/\s+/g, "_");
    //     console.log(filename);
    //     const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
    //     console.log(uploadDir);
    //     await fs.ensureDir(uploadDir);
    //     console.log("working");
    //     const filePath = path.join(uploadDir, filename);
    //     console.log(filePath);

    //     // await fs.copy(absolutePath, filePath);
    //     await fs.copy(uri, filePath);
    //     // await fs.copyFile(
    //     //   "C:\\Users\\Nandha.kumar\\Downloads\\example_img_large.jpg",
    //     //   "C:\\Expense_Tracker_Application/public/uploads/birthdayqqqqqq.jpg"
    //     // );
    //     // await fs.copyFile(uri, filePath);
    //     console.log("working");
    //     itemAttachments.push(`/uploads/${emp_id}/${filename}`);
    //   }

    //   j++;
    // }

    while (formData.has(`item[${i}]attachment[${j}]`)) {
      // const file = await formData.get(`item[${i}]attachment[${j}]`);
      // const file = {
      //   fileName: "example_img_large.jpg",
      //   originalPath:
      //     "file:///Users/Nandha.kumar/Downloads/example_img_large.jpg",
      //   type: "image/jpg",
      //   uri: "file:///Users/Nandha.kumar/Downloads/example_img_large.jpg",
      //   width: 260,
      // };

      const file = {
        base64:
          "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",
        fileName: "1000000034.jpg",
        fileSize: 15045,
        height: 280,
        originalPath:
          "/sdcard/.transforms/synthetic/picker/0/com.android.providers.media.photopicker/media/1000000034.jpg",
        type: "image/jpeg",
        uri: "file:///data/user/0/com.biitstracker/cache/rn_image_picker_lib_temp_7c441b4b-27d9-4822-ad49-7a06c880c3f3.jpg",
        width: 260,
      };

      // Check if the file is from a browser or React Native
      if (file.name1) {
        // Browser file upload
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, "_");
        const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
        await fs.ensureDir(uploadDir);
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, buffer);
        itemAttachments.push(`/uploads/${emp_id}/${filename}`);
      } else {
        const { base64, fileName, originalPath, type, uri, width } = file;

        console.log(base64);
        console.log(fileName);

        // // Remove the 'file://' scheme from the URI
        // const absolutePath = uri.replace(/^file:\/\//, "");
        // console.log(absolutePath);

        // console.log(fileName, uri);
        // const filename = fileName.replace(/\s+/g, "_");
        // console.log(filename);
        // const uploadDir = path.join(process.cwd(), "public", "uploads", emp_id);
        // console.log(uploadDir);
        // await fs.ensureDir(uploadDir);
        // console.log("working");
        // const filePath = path.join(uploadDir, filename);
        // console.log(filePath);

        // await fs.copy(absolutePath, filePath);
        // // await fs.copyFileSync(absolutePath, filePath);
        // console.log("working");
        // itemAttachments.push(`/uploads/${emp_id}/${filename}`);

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
