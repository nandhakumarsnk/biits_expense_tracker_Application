import { NextResponse } from "next/server";
import db from "../../db.js";


export async function GET() {
  try {
    const [results] = await db.query("SELECT * FROM emp_details");
    return NextResponse.json({ employees: results });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
