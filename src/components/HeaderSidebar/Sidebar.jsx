import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import "./sidebar.css";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();

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
    <nav className="navbar navbar-expand-xl">
      <div className={"collapse navbar-collapse"} id="navbarNav">
        <ul className="navbar-nav flex-column custom-navbar sidebar">
          <Link
            href="/admin"
            className={`nav-link nav-bar-links mx-3 mt-4 ${
              pathname === "/admin" ? "activeLinks" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/itemsManagement"
            className={`nav-link nav-bar-links mx-3 mt-3 ${
              pathname === "/itemsManagement" ? "activeLinks" : ""
            }`}
          >
            Content Management
          </Link>

          <div className="logout-container mt-auto">
            <li className={`nav-item ${pathname === "/login" ? "active" : ""}`}>
              <Link href="/login">
                <button
                  type="button"
                  className="btn nav-bar-button mx-3 mt-3 mb-5"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
