import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import noData from "../../../public/images/nodata.png";
import axios from "axios";
import { Placeholder } from "react-bootstrap";
import ViewExpenseReceipts from "./ViewExpenseReceipts";
import AddRefund from "./AddRefund";
import { FaRegEye } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

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

  const fetchExpensesData = useCallback(async () => {
    try {
      setReceiptLoading(true);
      if (employeeId) {
        let endpoint = `${process.env.NEXT_PUBLIC_GET_EMPLOYEE_EXPENSES}${employeeId}`;
        // let endpoint = `http://localhost:3000/api/fetch_expenses/${employeeId}`;

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
  }, [employeeId]);

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
  return (
    <>
      <p
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
