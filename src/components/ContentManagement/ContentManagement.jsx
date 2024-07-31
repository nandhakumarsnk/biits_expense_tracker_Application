import React from "react";
import Item_Category from "./Item_Category";
import Sub_Category from "./Sub_Category";
import Image from "next/image";
import { HiOutlineLogout } from "react-icons/hi";

import biitslogo from "../../../public/images/biitsLogo.png";

const ContentManagement = () => {
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
            className="btn nav-bar-button mx-3 mt-3"
            // onClick={handleSignOut}
          >
            Logout
            <span>
              <HiOutlineLogout color="red" size={25} />
            </span>
          </button>
        </div>
      </div>
      <Item_Category />
      <Sub_Category />
    </div>
  );
};

export default ContentManagement;
