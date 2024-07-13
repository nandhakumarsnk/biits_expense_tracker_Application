import { NextResponse } from "next/server";
import db from "../../db.js";

export async function GET() {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM emp_details", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    console.log(results, "results");
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ message: err.message });
  }
}


