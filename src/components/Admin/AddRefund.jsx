import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdCancel } from "react-icons/md";
import ModalImage from "react-modal-image";
import { toast } from "react-toastify";

const AddRefund = ({
  addRefundModal,
  setAddRefundModal,
  refundDetails,
  fetchExpensesData,
}) => {
  console.log(refundDetails);
  const initialRefundFormData = {
    refund_status: "",
    refund_receipt: [],
  };
  const [receiptFileName, setReceiptFileName] = useState("");
  const [formData, setFormData] = useState(initialRefundFormData);
  const [refundId, setRefundId] = useState(null);

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      refund_status: e.target.value,
    });
  };

  const handleArticleFile = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);

    setReceiptFileName(fileNames.join(", "));
    setFormData((prevData) => ({
      ...prevData,
      refund_receipt: [...prevData.refund_receipt, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => {
      const updatedImages = [...prevData.refund_receipt];
      updatedImages.splice(index, 1);
      return {
        ...prevData,
        refund_receipt: updatedImages,
      };
    });
  };

  const handleRefundUpdate = async () => {
    console.log(formData);
    if (!formData.refund_status || !formData.refund_receipt) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("refund_status", formData.refund_status);
    console.log(formData.refund_receipt, "nandha1");
    if (Array.isArray(formData.refund_receipt)) {
      formData.refund_receipt.forEach((file, index) => {
        formDataToSend.append(`refund_receipt[${index}]`, file);
      });
    }

    const apiEndpoint = `${process.env.NEXT_PUBLIC_REFUND_EXPENSE_EMPLOYEE_EXPENSES}${refundId}`;
    // const apiEndpoint = `http://localhost:3000/api/update_expense/${refundId}/`;

    try {
      const response = await axios.post(apiEndpoint, formDataToSend);

      console.log("response", response);

      if (response?.statusText === "OK") {
        toast.success("Refund Updated successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchExpensesData();
        setAddRefundModal(false);
      } else {
        toast.error("Failed to update Refund", {
          position: "top-center",
          autoClose: 2000,
        });
        console.error("Failed to update Refund");
        // handleClose();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Failed to update Refund", {
        position: "top-center",
        autoClose: 2000,
      });
      // setAddRefundModal(false);
    }
  };

  useEffect(() => {
    if (refundDetails) {
      setFormData({
        // refund_status: "Pending" || "Pending",
        refund_receipt: refundDetails?.refund_receipt
          ? [...refundDetails?.refund_receipt]
          : [],
      });
      setReceiptFileName(
        refundDetails?.refund_receipt ? "Images Uploaded" : ""
      );
      setRefundId(refundDetails?.id);
    } else {
      // Set default values if blogDetails is empty
      setFormData({
        // refund_status: "Pending",
        refund_receipt: [],
      });
      setReceiptFileName("");
    }
  }, [refundDetails]);

  console.log(refundDetails?.refund_status);
  return (
    <Modal
      show={addRefundModal}
      onHide={() => {
        setAddRefundModal(false);
      }}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title className="refund-heading">
          {refundDetails?.refund_status !== "Fully Paid"
            ? "ADD REFUND"
            : "REFUND RECEIPTS"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {refundDetails?.refund_receipt !== null && (
            <div className="refund-image-container">
              {refundDetails?.refund_receipt?.map((receipt, index) => (
                <div
                  key={index}
                  className="viewrefund-image-wrapper mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "1px solid orange",
                  }}
                >
                  <ModalImage
                    small={receipt}
                    large={receipt}
                    alt={`refund-image-${index}`}
                    hideDownload={true}
                    hideZoom={true}
                  />
                </div>
              ))}
            </div>
          )}

          {refundDetails?.refund_status !== "Fully Paid" && (
            <>
              <div className="refund-box p-4">
                <div className="row">
                  <p className="refund-sub-heading"> Select Refund Status</p>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      value="Fully Paid"
                      checked={formData.refund_status === "Fully Paid"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Fully Paid
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      value="Partially Paid"
                      checked={formData.refund_status === "Partially Paid"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      Partially Paid
                    </label>
                  </div>
                </div>
                <div className="row">
                  <label
                    id="fileAttachLabelbox"
                    htmlFor="fileInput"
                    className="refund-sub-heading mt-5 mb-2"
                  >
                    Upload Images
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    accept="image/*"
                    onChange={handleArticleFile}
                  />
                  {receiptFileName && (
                    <div>
                      <strong>{receiptFileName}</strong>
                    </div>
                  )}

                  <div className="blog-images-view-container d-flex justify-content-center align-items-center my-4">
                    {formData.refund_receipt.map((receiptImage, index) => (
                      <div
                        key={index}
                        className=""
                        style={{ position: "relative" }}
                      >
                        {typeof receiptImage === "string" ? (
                          <div
                            className="viewrefund-image-wrapper"
                            style={{
                              width: "100px",
                              height: "80px",
                              border: "1px solid orange",
                            }}
                          >
                            <ModalImage
                              small={receiptImage}
                              large={receiptImage}
                              alt={`blog-image-${index}`}
                              hideDownload={true}
                              hideZoom={true}
                            />
                            {/* <p>{receiptImage}</p> */}
                          </div>
                        ) : (
                          <div
                            className="viewblog-image-wrapper ms-2"
                            style={{ width: "100px", height: "100px" }}
                          >
                            <ModalImage
                              small={URL.createObjectURL(receiptImage)}
                              large={URL.createObjectURL(receiptImage)}
                              alt={`blog-image-${index}`}
                              hideDownload={true}
                              hideZoom={true}
                            />
                            {/* <p>{URL.createObjectURL(receiptImage)}</p> */}
                          </div>
                        )}

                        <MdCancel
                          size={20}
                          color="red"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: "absolute",
                            top: "-10px",
                            right: "-10px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {refundDetails?.refund_status === "Fully Paid" && (
          <Button
            className="cancel-btn"
            onClick={() => {
              setAddRefundModal(false);
            }}
          >
            Close
          </Button>
        )}
        {(refundDetails?.refund_status === "Pending" ||
          refundDetails?.refund_status === "Partially Paid") && (
          <>
            <Button
              className="cancel-btn"
              onClick={() => {
                setAddRefundModal(false);
              }}
            >
              Cancel
            </Button>

            <Button
              className="submit-btn"
              onClick={() => {
                handleRefundUpdate();
              }}
            >
              Submit
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddRefund;
