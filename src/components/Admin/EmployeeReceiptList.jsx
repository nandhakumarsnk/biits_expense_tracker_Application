import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import noData from "../../../public/images/nodata.png";
import axios from "axios";
import { Placeholder } from "react-bootstrap";
import ViewExpenseReceipts from "./ViewExpenseReceipts";
import AddRefund from "./AddRefund";
import { FaDownload, FaRegEye } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { convertDataYYYYMMDD } from "@/services/helperfunctions";

const renderPlaceholders = (length) => {
  const placeholders = Array.from({ length }, (_, index) => (
    <div key={index} className="placeHolder_loading">
      <Placeholder as="p" animation="glow">
        <Placeholder
          xs={12}
          size={"lg"}
          style={{ height: "50px", borderRadius: "10px" }}
        />
      </Placeholder>
    </div>
  ));

  return placeholders;
};

const EmployeeReceiptList = ({ setIndividualReceipts, employeeId }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [expensesList, setExpensesList] = useState([]);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [addRefundModal, setAddRefundModal] = useState(false);
  // const [expenseReceiptImages, setExpenseReceiptImages] = useState(null);
  const [refundDetails, setRefundDetails] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const setDateRange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  console.log(startDate);
  console.log(endDate);

  console.log(convertDataYYYYMMDD(startDate));
  console.log(convertDataYYYYMMDD(endDate));

  const fetchExpensesData = useCallback(async () => {
    try {
      setReceiptLoading(true);
      if (employeeId) {
        let endpoint = `${process.env.NEXT_PUBLIC_GET_EMPLOYEE_EXPENSES}${employeeId}`;

        if (startDate !== null && endDate !== null) {
          let convertedStartDate = convertDataYYYYMMDD(startDate);
          let convertedEndDate = convertDataYYYYMMDD(endDate);

          endpoint += `?start_date=${convertedStartDate}&end_date=${convertedEndDate}`;
        }

        const response = await axios.get(endpoint);
        console.log(response, "this is response");

        if (response.status === 200) {
          setExpensesList(response.data?.expenses);
        } else {
          console.error(
            "Error fetching data from the API: ",
            response.status,
            response.statusText
          );
        }

        setReceiptLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data from the API: ", error);
      setReceiptLoading(false);
    }
  }, [employeeId, startDate, endDate]);

  console.log(expensesList);

  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "pending";
      case "Partially Paid":
        return "partially-paid";
      case "Fully Paid":
        return "fully-paid";
      default:
        return "";
    }
  };

  const handleTabChange = () => {
    const updatedPath = `${pathname}`;
    router.replace(updatedPath, { shallow: true });
  };

  const downloadExcel = () => {
    const data = expensesList.map((expense) => ({
      ID: expense.id,
      "Employee ID": expense.emp_id,
      "Employee Name": expense.emp_name,
      Date: expense.date,
      "Item Category": expense.items
        .map((item) => item.item_category)
        .join(", "),
      "Item Subcategory": expense.items
        .map((item) => item.item_subcategory)
        .join(", "),
      Description: expense.items.map((item) => item.description).join(", "),
      Amount: expense.items.map((item) => item.amount).join(", "),
      "Amount in INR": expense.items
        .map((item) => item.amount_in_INR)
        .join(", "),

      Attachments: expense.items
        .map((item) =>
          item.attachments
            .map(
              (attachment) =>
                `${process.env.NEXT_PUBLIC_EMPLOYEE_RECEIPT_IMAGE}/${attachment}`
            )
            .join(", ")
        )
        .join("; "),

      "Refund Status": expense.refund_status,
      "Refund Receipts": expense.refund_receipt
        .map(
          (receipt) =>
            `${process.env.NEXT_PUBLIC_EMPLOYEE_RECEIPT_IMAGE}/${receipt}`
        )
        .join(", "),
      "Created At": expense.created_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, `Expenses_${employeeId}.xlsx`);
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-auto">
          <p
            className="mb-0"
            onClick={() => {
              setIndividualReceipts(false);
              localStorage.removeItem("setIndividualReceipts");
              localStorage.removeItem("setEmployeeId");
              handleTabChange();
            }}
          >
            <MdOutlineKeyboardBackspace color="#1e1e75" size={40} /> &nbsp;
            <span className="back-btn">back</span>
          </p>
        </div>
      </div>
      <div className="row mb-3">
        <div className="d-flex justify-content-end mt-auto">
          <div className="col-sm-auto selectDate me-3 ">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              className="form-control"
              placeholderText="Select date range"
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
            />
          </div>
          <button className="download-btn" onClick={downloadExcel}>
            <FaDownload /> &nbsp;
            <span>Download as Excel</span>
          </button>
        </div>
      </div>

      <div className="row">
        <div className="app-table-pink">
          <div className="allApp-scroll px-3">
            <table className="table">
              <thead className="custom-table-head">
                <tr className="text-center">
                  <th scope="col" className="appHead">
                    S.no
                  </th>
                  <th scope="col" className="appHead">
                    Employee Id
                  </th>
                  <th scope="col" className="appHead">
                    Date
                  </th>
                  {/* <th scope="col" className="appHead">
                  Items
                </th> */}
                  <th scope="col" className="appHead">
                    View Details
                  </th>
                  <th scope="col" className="appHead">
                    Refund Status
                  </th>
                  <th scope="col" className="appHead">
                    Refund Receipts
                  </th>
                </tr>
              </thead>

              <tbody className="allApp-scroll px-3">
                {receiptLoading ? (
                  <tr>
                    {" "}
                    <td colSpan="9">{renderPlaceholders(10)}</td>{" "}
                  </tr>
                ) : (
                  <>
                    {expensesList.length === 0 ? (
                      <>
                        <tr>
                          <td colSpan="7">
                            <div className=" d-flex justify-content-center align-items-center mt-5">
                              <Image
                                src={noData}
                                className="no-data-found-img"
                                alt="No data"
                                width={300}
                                height={300}
                              ></Image>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : (
                      expensesList
                        ?.slice()
                        .reverse()
                        .map((expense, index) => (
                          <tr
                            key={expense.id}
                            className="custom-table-body text-center"
                          >
                            <td>{index + 1}</td>
                            <td>{expense?.emp_id}</td>
                            <td>{expense?.date}</td>

                            <td>
                              <p
                                onClick={() => {
                                  setShowReceiptModal(true);
                                  setRefundDetails(expense);
                                }}
                                className="view-btn"
                              >
                                view
                                {/* <FaRegEye color="#1e1e75" size={25} /> */}
                              </p>
                            </td>
                            <td
                              className={getStatusClass(expense?.refund_status)}
                            >
                              {expense?.refund_status}
                            </td>
                            <td>
                              {expense?.refund_receipt.length != 0 ? (
                                <p
                                  onClick={() => {
                                    setAddRefundModal(true);
                                    setRefundDetails(expense);
                                  }}
                                >
                                  <FaRegEye
                                    size={25}
                                    className="add-icon-btn"
                                  />
                                </p>
                              ) : (
                                <p
                                  onClick={() => {
                                    setAddRefundModal(true);
                                    setRefundDetails(expense);
                                  }}
                                >
                                  <IoAddCircleOutline
                                    size={25}
                                    className="add-icon-btn"
                                  />
                                </p>
                              )}
                            </td>
                          </tr>
                        ))
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ViewExpenseReceipts
          showReceiptModal={showReceiptModal}
          setShowReceiptModal={setShowReceiptModal}
          // expenseReceiptImages={expenseReceiptImages}
          refundDetails={refundDetails}
        />
        <AddRefund
          addRefundModal={addRefundModal}
          setAddRefundModal={setAddRefundModal}
          refundDetails={refundDetails}
          fetchExpensesData={fetchExpensesData}
        />
      </div>
    </>
  );
};

export default EmployeeReceiptList;
