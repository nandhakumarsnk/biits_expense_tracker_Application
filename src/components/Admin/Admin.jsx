"use client";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Placeholder } from "react-bootstrap";
import image1 from "../../../public/next.svg";
import EmployeeReceiptList from "./EmployeeReceiptList";

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
const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);

  const [individualReceipts, setIndividualReceipts] = useState(false);

  // const handleStatusChange = (event) => {
  //   setEmployeeId(event.target.value);
  // };
  // const clearSelectedStatus = () => {
  //   setEmployeeId(null);
  // };

  const fetchAllEmployees = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = `${process.env.NEXT_PUBLIC_FETCH_ALL_EMPLOYEE_LIST}`;
      // let endpoint = `http://localhost:3000/api/fetch_all_employees`;

      const response = await axios.get(endpoint);
      console.log(response, "this is response");

      if (response.status === 200) {
        setEmployeeList(response.data?.employees);

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data from the API: ", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees]);

  return (
    <div className="container-fluid">
      <div className="row">
        <h1 className="text-center">BIITS EXPENSE TRACKER</h1>
      </div>
      {/* <div className="row">
        <div className="col-sm-5 mx-auto">
          <div className="input-group input-group-sm selectDate ">
            <select
              className="form-select statusFilter"
              aria-label="Default select example"
              name="role"
              value={employeeId}
              onChange={handleStatusChange}
            >
              <option value="" defaultValue={"Select Meeting status"}>
                Select Employee Id
              </option>
              <option value="BIITS-001">BIITS-001</option>
              <option value="BIITS-002">BIITS-002</option>
              <option value="BIITS-003">BIITS-003</option>
              <option value="BIITS-004">BIITS-004</option>
              <option value="BIITS-005">BIITS-005</option>
              <option value="BIITS-006">BIITS-006</option>
              <option value="BIITS-007">BIITS-007</option>
              <option value="BIITS-008">BIITS-008</option>
              <option value="BIITS-092">BIITS-092</option>
            </select>
            {employeeId && (
              <span
                className="cross-container mx-2"
                onClick={clearSelectedStatus}
              >
                <span className="cross-symbol">&#10006;</span>
              </span>
            )}
          </div>
        </div>
      </div> */}
      {!individualReceipts && (
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
                    Name
                  </th>
                  <th scope="col" className="appHead">
                    Email
                  </th>
                  <th scope="col" className="appHead">
                    Pnone
                  </th>
                  <th scope="col" className="appHead">
                    View Expenses
                  </th>
                </tr>
              </thead>

              <tbody className="allApp-scroll px-3">
                {loading ? (
                  <tr>
                    {" "}
                    <td colSpan="9">{renderPlaceholders(5)}</td>{" "}
                  </tr>
                ) : (
                  <>
                    {employeeList.length === 0 ? (
                      <>
                        <tr>
                          <td colSpan="6">
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
                      employeeList?.map((employee, index) => (
                        <tr key={employee.id} className="custom-table-body">
                          <td>{index + 1}</td>
                          <td>{employee?.emp_id}</td>
                          <td>{employee?.name}</td>
                          <td>{employee?.email}</td>
                          <td>{employee?.phone}</td>
                          <td>
                            <p
                              onClick={() => {
                                setIndividualReceipts(true);
                                setEmployeeId(employee?.emp_id);
                              }}
                            >
                              View
                            </p>
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
      )}

      {individualReceipts && (
        <>
          <EmployeeReceiptList
            setIndividualReceipts={setIndividualReceipts}
            employeeId={employeeId}
          />
        </>
      )}
    </div>
  );
};

export default Admin;
