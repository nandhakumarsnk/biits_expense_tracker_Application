// src/components/FileUpload.js

"use client";
import { useState } from "react";

const Store = () => {
  const [file, setFile] = useState(null);
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEmpIdChange = (e) => {
    setEmpId(e.target.value);
  };

  const handleEmpNameChange = (e) => {
    setEmpName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("emp_id", empId);
    formData.append("emp_name", empName);
    formData.append("date", date);

    items.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        formData.append(`item[${index}]${key}`, item[key]);
      });
    });

    if (file) {
      formData.append("item[0]attachment[0]", file);
    }

    try {
      const response = await fetch("/api/store_expense", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="emp_id">Employee ID:</label>
        <input
          type="text"
          id="emp_id"
          name="emp_id"
          value={empId}
          onChange={handleEmpIdChange}
          required
        />
      </div>
      <div>
        <label htmlFor="emp_name">Employee Name:</label>
        <input
          type="text"
          id="emp_name"
          name="emp_name"
          value={empName}
          onChange={handleEmpNameChange}
          required
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={handleDateChange}
          required
        />
      </div>
      {items.map((item, index) => (
        <div key={index}>
          <h4>Item {index + 1}</h4>
          <label>
            Category:
            <input
              type="text"
              name="item_category"
              value={item.item_category || ""}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
          </label>
          <label>
            Subcategory:
            <input
              type="text"
              name="item_subcategory"
              value={item.item_subcategory || ""}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={item.description || ""}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={item.amount || ""}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
          </label>
          <label>
            Amount in INR:
            <input
              type="number"
              name="amount_in_INR"
              value={item.amount_in_INR || ""}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
          </label>
          <button type="button" onClick={() => handleRemoveItem(index)}>
            Remove Item
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddItem}>
        Add Item
      </button>
      <div>
        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" name="file" onChange={handleFileChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );

  function handleAddItem() {
    setItems([...items, {}]);
  }

  function handleRemoveItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }
};

export default Store;
