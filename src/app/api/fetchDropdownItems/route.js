
import { NextResponse } from "next/server";
import db from "../../db";

export async function GET(request) {
  try {
    // Fetch all categories
    const categoriesQuery = `
      SELECT id AS value, name AS label
      FROM item_category;
    `;
    const categories = await db.query(categoriesQuery);
    console.log(categories);

    // Fetch all subcategories
    const subcategoriesQuery = `
      SELECT id AS value, name AS label, item_category_id AS categoryId
      FROM sub_category;
    `;
    const subcategories = await db.query(subcategoriesQuery);
    console.log(subcategories);

    // Organize subcategories by categoryId
    const categorizedSubcategories = {};
    subcategories[0].forEach((subcategory) => {
      if (!categorizedSubcategories[subcategory.categoryId]) {
        categorizedSubcategories[subcategory.categoryId] = [];
      }
      categorizedSubcategories[subcategory.categoryId].push({
        value: subcategory.value,
        label: subcategory.label,
      });
    });

    // Prepare data to send as response
    const dropdownData = categories[0].map((category) => ({
      category: {
        value: category.value,
        label: category.label,
      },
      subcategories: categorizedSubcategories[category.value] || [],
    }));

    // Return successful response with dropdown data
    return NextResponse.json({ dropdownData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dropdown items:", error);
    return NextResponse.json(
      { error: "Failed to fetch dropdown items" },
      { status: 500 }
    );
  }
}
