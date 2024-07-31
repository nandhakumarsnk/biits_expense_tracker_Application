import Image from "next/image";
import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import biitslogo from "../../../public/images/biitsLogo.png";
import "./sidebar.css";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

const Header = () => {
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
  return (
    <div className="row header-container">
      <div className="col-sm-auto">
        <Image src={biitslogo} className="img-brand" alt="brand-biits" />
      </div>
      <div className="col-sm">
        <h1 className="app-heading text-center mt-4">BIITS EXPENSE TRACKER</h1>
      </div>
      <div className="col-sm-1 d-flex justify-content-end">
        <button type="button" className="btn mx-3 mt-3" onClick={handleSignOut}>
          Logout
          <span>
            <HiOutlineLogout color="red" size={25} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
