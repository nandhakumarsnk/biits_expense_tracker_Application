import { NextResponse } from "next/server";

export async function GET(request, content) {
  return NextResponse.json({ Nandha: "Test API Working" });
}
