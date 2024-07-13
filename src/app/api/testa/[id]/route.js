import { NextResponse } from "next/server";

console.log("working");
export async function GET(request, { params }) {
  try {
    // const { id } = request.query; // Destructure `id` from `req.query`

    const { id } = params; // Destructure `id` from `params`
    console.log(`Received ID: ${id}`);
    if (!id) {
      return NextResponse.error("ID parameter is missing", { status: 400 });
    }

    // Your logic here based on `id`
    return NextResponse.json({ message: `Received ID: ${id}` });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.error("Internal server error", { status: 500 });
  }
}
