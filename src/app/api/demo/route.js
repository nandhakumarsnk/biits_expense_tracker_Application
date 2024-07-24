// import { NextResponse } from "next/server";

// export async function GET(request, content) {
//   return NextResponse.json({ nandha: "khrir;jfroi" });
// }

import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { Formidable } from "formidable";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = new Formidable({
    keepExtensions: true,
    uploadDir: path.join(process.cwd(), "public/assets"),
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(
          NextResponse.json(
            { status: "Error", message: err.message },
            { status: 500 }
          )
        );
      }

      const file = files.file;
      if (!file) {
        return resolve(
          NextResponse.json({ error: "No files received." }, { status: 400 })
        );
      }

      try {
        const fileData = await fs.readFile(file.filepath);
        const base64String = fileData.toString("base64");
        const newFilePath = path.join(
          process.cwd(),
          "public/assets",
          file.newFilename + ".txt"
        );
        await fs.writeFile(newFilePath, base64String);

        return resolve(NextResponse.json({ message: "Success", status: 201 }));
      } catch (error) {
        console.error("Error occurred:", error);
        return resolve(NextResponse.json({ message: "Failed", status: 500 }));
      }
    });
  });
}
