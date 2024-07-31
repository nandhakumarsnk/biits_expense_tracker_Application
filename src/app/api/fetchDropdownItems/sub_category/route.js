import { NextResponse } from "next/server";
import db from "../../../db.js";

// POST: Create a new sub-category
export async function POST(req) {
  try {
    const body = await req.json();
    const { item_category_id, name } = body;

    if (!item_category_id || !name) {
      return NextResponse.json(
        { error: "Item Category ID and Name are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "INSERT INTO sub_category (item_category_id, name) VALUES (?, ?)",
      [item_category_id, name]
    );

    return NextResponse.json(
      { message: "Sub-category created successfully", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sub-category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing sub-category
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, item_category_id, name } = body;

    if (!id || !item_category_id || !name) {
      return NextResponse.json(
        { error: "ID, Item Category ID, and Name are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "UPDATE sub_category SET item_category_id = ?, name = ? WHERE id = ?",
      [item_category_id, name, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Sub-category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sub-category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sub-category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an existing sub-category
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const [result] = await db.query("DELETE FROM sub_category WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Sub-category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sub-category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
