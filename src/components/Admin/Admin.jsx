"use client";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Placeholder } from "react-bootstrap";
import noData from "../../../public/images/nodata.png";
import EmployeeReceiptList from "./EmployeeReceiptList";
import { signOut, useSession } from "next-auth/react";
import "./admin.css";
import { FaRegEye } from "react-icons/fa";
import biitslogo from "../../../public/images/biitsLogo.png";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { HiOutlineLogout } from "react-icons/hi";

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
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);
  // const [employeeId, setEmployeeId] = useState(null);
  const [employeeId, setEmployeeId] = useState(
    localStorage.getItem("setEmployeeId") || null
  );

  const { data: session } = useSession();

  // const [individualReceipts, setIndividualReceipts] = useState(false);
  const [individualReceipts, setIndividualReceipts] = useState(
    localStorage.getItem("setIndividualReceipts") || false
  );

  useEffect(() => {
    setIndividualReceipts(localStorage.getItem("setIndividualReceipts"));
    setEmployeeId(localStorage.getItem("setEmployeeId"));
  }, []);
  // const handleStatusChange = (event) => {
  //   setEmployeeId(event.target.value);
  // };
  // const clearSelectedStatus = () => {
  //   setEmployeeId(null);
  // };

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
      clearCookies();

      toast.success("Sign Out Successfully", {
        autoClose: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }, [3000]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

  const handleTabChange = () => {
    const updatedPath = `${pathname}?tab=employee`;
    router.replace(updatedPath, { shallow: true });
  };

  return (
    <div className="container-fluid">
      <div className="row header-container">
        <div className="col-sm-auto">
          <Image src={biitslogo} className="img-brand" alt="brand-biits" />
        </div>
        <div className="col-sm">
          <h1 className="app-heading text-center mt-4">
            BIITS EXPENSE TRACKER
          </h1>
        </div>
        <div className="col-sm-1 d-flex justify-content-end">
          <button
            type="button"
            className="btn nav-bar-button mx-3 mt-3 mb-5"
            onClick={handleSignOut}
          >
            Logout
            <span>
              <HiOutlineLogout color="red" size={25} />
            </span>
          </button>
        </div>
      </div>

      {!individualReceipts && (
        <div className="app-table-pink mt-5">
          <div className="row">
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
                      Name
                    </th>
                    <th scope="col" className="appHead">
                      Email
                    </th>
                    <th scope="col" className="appHead">
                      Phone
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
                      <td colSpan="9">{renderPlaceholders(10)}</td>{" "}
                    </tr>
                  ) : (
                    <>
                      {employeeList.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="6">
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
                        employeeList?.map((employee, index) => (
                          <tr
                            key={employee.id}
                            className="custom-table-body text-center"
                          >
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
                                  handleTabChange();
                                  localStorage.setItem(
                                    "setIndividualReceipts",
                                    true
                                  );
                                  localStorage.setItem(
                                    "setEmployeeId",
                                    employee?.emp_id
                                  );
                                }}
                                // onClick={handleTabChange}
                              >
                                <FaRegEye color="#ffa700" size={25} />
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
