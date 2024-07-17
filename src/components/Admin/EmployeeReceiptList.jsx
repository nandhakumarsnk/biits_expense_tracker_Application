import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import image1 from "../../../public/next.svg";
import axios from "axios";
import { Placeholder } from "react-bootstrap";
import ViewExpenseReceipts from "./ViewExpenseReceipts";
import AddRefund from "./AddRefund";

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
  return (
    <>
      <p
        onClick={() => {
          setIndividualReceipts(false);
        }}
      >
        back
      </p>
      <div className="row">
        <div className="allApp-scroll px-3">
          <table className="table">
            <thead className="custom-table-head">
              <tr>
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
                  View Receipts
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
                  <td colSpan="9">{renderPlaceholders(5)}</td>{" "}
                </tr>
              ) : (
                <>
                  {expensesList.length === 0 ? (
                    <>
                      <tr>
                        <td colSpan="7">
                          <div className=" d-flex justify-content-center align-items-center mt-5">
                            <Image
                              src={image1}
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
                    expensesList?.map((expense, index) => (
                      <tr key={expense.id} className="custom-table-body">
                        <td>{index + 1}</td>
                        <td>{expense?.emp_id}</td>
                        <td>{expense?.date}</td>
                        {/* <td>{expense?.items}</td> */}
                        {/* {expense?.items?.map((item, index) => {
                          <td>{item}</td>;
                        })} */}
                        <td>
                          <p
                            onClick={() => {
                              setShowReceiptModal(true);
                              // setExpenseReceiptImages(expense?.receipt);
                              setRefundDetails(expense);
                            }}
                          >
                            View
                          </p>
                        </td>
                        <td>{expense?.refund_status}</td>
                        <td>
                          {expense?.refund_receipt != null ? (
                            <p
                              onClick={() => {
                                setAddRefundModal(true);
                                setRefundDetails(expense);
                              }}
                            >
                              View
                            </p>
                          ) : (
                            <p
                              onClick={() => {
                                setAddRefundModal(true);
                                setRefundDetails(expense);
                              }}
                            >
                              Add
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
