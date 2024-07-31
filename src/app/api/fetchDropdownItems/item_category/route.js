import { NextResponse } from "next/server";
import db from "../../../db.js";

// POST: Create a new item category
export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [result] = await db.query(
      "INSERT INTO item_category (name) VALUES (?)",
      [name]
    );

    return NextResponse.json(
      { message: "Item category created successfully", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating item category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing item category
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and Name are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "UPDATE item_category SET name = ? WHERE id = ?",
      [name, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Item category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an existing item category
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const [result] = await db.query("DELETE FROM item_category WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Item category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
