import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <nav className="navbar navbar-expand-xl">
      <div className={"collapse navbar-collapse"} id="navbarNav">
        <ul className="navbar-nav flex-column custom-navbar sidebar">
          <Link
            href="/admin"
            className={`nav-link nav-bar-links mx-3 mt-4 ${
              pathname === "/home" ? "activeLinks" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/itemsManagement"
            className={`nav-link nav-bar-links mx-3 mt-3 ${
              pathname === "/appointment" ? "activeLinks" : ""
            }`}
          >
            Content Management
          </Link>

          <li className={`nav-item ${pathname === "/login" ? "active" : ""}`}>
            <Link href="/login">
              <button
                type="button"
                className="btn nav-bar-button mx-3 mt-3 mb-5"
                // onClick={handleSignOut}
              >
                Logout
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
