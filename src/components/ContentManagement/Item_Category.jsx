"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Item_Category = () => {
  const [loading, setLoading] = useState(false);
    const [addItemCategory, setAddItemCategory] = useState("");
  const [selectedItemCategory, setSelectedItemCategory] = useState(null);
  const [showItemCategoryEditModal, setShowItemCategoryEditModal] =
    useState(false);
  const [itemCategoryList, setItemCategoryList] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "" });


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
      let endpoint = `${process.env.NEXT_PUBLIC_ITEM_CATEGORIES}`;
      const response = await axios.post(endpoint, {
        name: addItemCategory,
      });
      console.log(response, "this is response");

      if (response?.data) {
        toast.success(`Item Category Added Successfully`, {
          theme: "colored",
          autoClose: 2500,
          position: "top-center",
        });
        setLoading(false);
        getListOfItemCategories();
      }
      setAddItemCategory("");
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
  const handleEditClick = (item) => {
    setSelectedItemCategory(item);
    setFormData({ id: item?.category?.value, name: item?.category?.label });
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
          let endpoint = `${process.env.NEXT_PUBLIC_ITEM_CATEGORIES}`;
          const response = await axios.delete(endpoint, {
            data: {
              id: itemId,
            },
          });
          console.log("response", response);
          if (response?.status) {
            toast.success(`Item Category Deleted Successfully`, {
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
      let endpoint = `${process.env.NEXT_PUBLIC_ITEM_CATEGORIES}`;
      const response = await axios.put(endpoint, {
        id: formData.id,
        name: formData?.name,
      });
      if (response?.data) {
        toast.success(`Item Category Edited Successfully`, {
          theme: "colored",
          autoClose: 2500,
          position: "top-center",
        });
        getListOfItemCategories();
      }
      setFormData({ id: "", name: "" });
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
        <div className="col-sm-4">
          <div className="mb-3">
            <label htmlFor="designation" className="form-label custom-label">
              Item Category
            </label>
            <input
              type="text"
              className="form-control custom-form-control"
              id="designation"
              value={addItemCategory}
              onChange={(e) => setAddItemCategory(e.target.value)}
              placeholder="Enter Item Category"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            onClick={handleAddItemCategory}
            className="btn purple-button"
          >
            {loading ? "Please wait.." : "Add Item Category"}
          </button>
        </div>
        <div className="col-sm-8">
          <div className="table-wrapper">
            <table className="table">
              <thead className="sticky-table-head">
                <tr>
                  <th scope="col" style={{ width: "60px" }}>
                    Slno
                  </th>
                  <th scope="col">Item Category</th>
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
                    itemCategoryList?.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.category?.label}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditClick(item)}
                          >
                            <MdEdit />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDeleteClick(item.category?.value)
                            }
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
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
            <Form.Label>Designation Type</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
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

export default Item_Category;
