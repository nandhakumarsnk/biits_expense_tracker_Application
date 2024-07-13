import React from "react";

const page = () => {
  return (
    <div>
      <h1>Nandha</h1>
    </div>
  );
};

export default page;

// import pool from "../utils/mysql.js";

// const FetchData = async () => {
//   try {
//     const connection = await pool.getConnection();
//     const [row] = await connection.query("SELECT * FROM emp_details");
//     console.log(row);
//     return row;
//   } catch (error) {
//     throw error;
//   }
// };

// FetchData()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
