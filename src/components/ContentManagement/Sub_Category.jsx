"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Sub_Category = () => {
  const [loading, setLoading] = useState(false);
  const [addItemCategory, setAddItemCategory] = useState("");
  const [selectedItemCategory, setSelectedItemCategory] = useState(null);
  const [showItemCategoryEditModal, setShowItemCategoryEditModal] =
    useState(false);
  const [itemCategoryList, setItemCategoryList] = useState(null);
  const initialFormDate = {
    id: "",
    item_category_id: "",
    name: "",
  };
  const [formData, setFormData] = useState(initialFormDate);
  let serialNumber = 1;

  const initialSubCategory = {
    item_category_id: "",
    name: "",
  };
  const [addSubCategory, setAddSubCategory] = useState(initialSubCategory);

  const getListOfItemCategories = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = `${process.env.NEXT_PUBLIC_GET_ITEM_CATEGORIES}`;
      const response = await axios.get(endpoint);
      console.log(response, "this is response");

      if (response.status === 200) {
        setItemCategoryList(response?.data?.dropdownData);
        setLoading(false);
      }
    } catch (err) {
      console.log("Error in fetching ", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListOfItemCategories();
  }, [getListOfItemCategories]);

  const handleAddItemCategory = async () => {
    try {
      setLoading(true);
      let endpoint = `${process.env.NEXT_PUBLIC_SUB_CATEGORIES}`;
      const response = await axios.post(endpoint, {
        item_category_id: addSubCategory?.item_category_id,
        name: addSubCategory?.name,
      });
      console.log(response, "this is response");

      if (response?.data) {
        toast.success(`Item Sub Category Added Successfully`, {
          theme: "colored",
          autoClose: 2500,
          position: "top-center",
        });
        setLoading(false);
        getListOfItemCategories();
      }
      setAddSubCategory(initialSubCategory);
    } catch (err) {
      console.log("Error in fetching ", err);
      setLoading(false);
      toast.error(`Something Went Wrong!`, {
        theme: "colored",
        autoClose: 2500,
        position: "top-center",
      });
    }
  };

  //   item.category?.label
  const handleEditClick = (item, subItem) => {
    console.log(item);
    console.log(subItem);
    setSelectedItemCategory(item);
    setFormData({
      id: subItem?.value,
      item_category_id: item?.value,
      name: subItem?.label,
    });
    setShowItemCategoryEditModal(true);
  };

  const handleClose = () => {
    setShowItemCategoryEditModal(false);
    setSelectedItemCategory(null);
  };

  const handleDeleteClick = async (itemId) => {
    console.log(itemId);
    try {
      const willCancel = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#9426B2",
        cancelButtonColor: "#B50000",
      });

      if (willCancel.isConfirmed) {
        try {
          let endpoint = `${process.env.NEXT_PUBLIC_SUB_CATEGORIES}`;
          const response = await axios.delete(endpoint, {
            data: {
              id: itemId,
            },
          });
          console.log("response", response);
          if (response?.status) {
            toast.success(`Item SubCategory Deleted Successfully`, {
              theme: "colored",
              autoClose: 2500,
              position: "top-center",
            });
            getListOfItemCategories();
          }
        } catch (error) {
          console.log("Error in deleting the item category", error);
          toast.error(`Something Went Wrong!`, {
            theme: "colored",
            autoClose: 2500,
            position: "top-center",
          });
        }
      } else {
        console.log("Cancelled deletion!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  //   const handleChange = (e) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   };

  const handleSubmit = async () => {
    try {
      let endpoint = `${process.env.NEXT_PUBLIC_SUB_CATEGORIES}`;
      const response = await axios.put(endpoint, {
        id: formData?.id,
        item_category_id: formData?.item_category_id,
        name: formData?.name,
      });
      if (response?.data) {
        toast.success(`Item SubCategory Edited Successfully`, {
          theme: "colored",
          autoClose: 2500,
          position: "top-center",
        });
        getListOfItemCategories();
      }
      setFormData(initialFormDate);
    } catch (error) {
      console.log("Error in editing the designation", error);
      toast.error(`Something Went Wrong!`, {
        theme: "colored",
        autoClose: 2500,
        position: "top-center",
      });
    }
    handleClose();
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-3">
          <div className="">
            <label htmlFor="hoursSelect" className="form-label custom-label">
              Select Item Category
            </label>
            <select
              id="hoursSelect"
              className="form-select"
              value={addSubCategory?.item_category_id}
              onChange={(e) =>
                setAddSubCategory({
                  ...addSubCategory,
                  item_category_id: e.target.value,
                })
              }
            >
              {itemCategoryList?.map((item, index) => (
                <option key={index} value={item?.category?.value}>
                  {item?.category?.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label custom-label">
              Enter SubCategory
            </label>
            <input
              type="text"
              className="form-control custom-form-control"
              id="designation"
              value={addSubCategory?.name}
              onChange={(e) =>
                setAddSubCategory({ ...addSubCategory, name: e.target.value })
              }
              placeholder="Enter Item Category"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            onClick={handleAddItemCategory}
            className="btn purple-button"
          >
            {loading ? "Please wait.." : "Add Item SubCategory"}
          </button>
        </div>
        <div className="col-sm-9">
          <div className="table-wrapper">
            <table className="table">
              <thead className="sticky-table-head">
                <tr>
                  <th scope="col" style={{ width: "60px" }}>
                    Slno
                  </th>
                  <th scope="col">Item Category</th>
                  <th scope="col">Item Sub Category</th>
                  <th scope="col" style={{ width: "100px" }}>
                    Edit
                  </th>
                  <th scope="col" style={{ width: "100px" }}>
                    Delete
                  </th>
                </tr>
              </thead>
              {loading ? null : ( // <Loader />
                <tbody>
                  {itemCategoryList &&
                    itemCategoryList?.map((item, index) =>
                      item.subcategories.map((subcategory) => (
                        <tr key={subcategory.value}>
                          {/* <th scope="row">{index + 1}</th> */}
                          <th>{serialNumber++}</th>
                          <td>{item.category?.label}</td>
                          <td>{subcategory?.label}</td>
                          <td>
                            <button
                              className="btn btn-light btn-sm"
                              onClick={() =>
                                handleEditClick(item.category, subcategory)
                              }
                            >
                              <MdEdit color="purple" size={25} />
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-light btn-sm"
                              onClick={() =>
                                handleDeleteClick(subcategory?.value)
                              }
                            >
                              <MdDelete color="purple" size={25} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <Modal show={showItemCategoryEditModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDesignationType">
            <div className="">
              <label htmlFor="hoursSelect" className="form-label custom-label">
                Select Item Category
              </label>
              <select
                id="hoursSelect"
                className="form-select"
                value={formData?.item_category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    item_category_id: e.target.value,
                  })
                }
              >
                {itemCategoryList?.map((item, index) => (
                  <option key={index} value={item?.category?.value}>
                    {item?.category?.label}
                  </option>
                ))}
                <option>test</option>
              </select>
            </div>
            <Form.Label>Designation Type</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
            />
          </Form.Group>
          <Button
            type="submit"
            className="mt-3 edit-update-button"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Sub_Category;
