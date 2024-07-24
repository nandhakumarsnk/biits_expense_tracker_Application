import { NextResponse } from "next/server";
const fs = require("fs");
import path from "path";
import { writeFile } from "fs/promises";

export async function GET() {
  const imageData = fs.readFileSync("img.png").toString("base64");

  fs.writeFileSync("new_img.png", Buffer.from(imageData, "base64"));

  return NextResponse.json({
    status: "Successfully",
  });
}

export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  console.log(buffer);
  const filename = file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(path.join(process.cwd(), "public/" + filename), buffer);
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
