"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import { NextAuthProvider } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Router } from "next/router";
import Loading from "@/components/Loading/PageLoading/Loading";
import Header from "@/components/HeaderSidebar/Header";
import Sidebar from "@/components/HeaderSidebar/Sidebar";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

// export const metadata = {
//   title: "BIITS- EXPENSE TRACKER",
//   description: "bIITS- Expense Tracker Application",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const excludedPages = ["/", "/login"];

  const isExcludedPage = excludedPages.includes(pathname);
  const [loading, setLoading] = useState(false);
  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeComplete", () => setLoading(false));
  Router.events.on("routeChangeError", () => setLoading(false));
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextAuthProvider>
          <ToastContainer
            limit={3}
            pauseOnFocusLoss={false}
            autoClose={2000}
            newestOnTop
            theme="colored"
          />
          {/* {children} */}

          {isExcludedPage === true ? (
            <div className="container-fluid">
              <div className="row">
                {loading && <Loading />}
                {children}
              </div>
            </div>
          ) : (
            <div className="container-fluid">
              <div className="row">
                <Header />
              </div>
              <div className="row">
                <div className="col-sm-2">
                  {isExcludedPage === true ? "" : <Sidebar />}
                </div>
                <div className="col-sm-10">
                  {loading && <Loading />}
                  {children}
                </div>
              </div>
            </div>
          )}
        </NextAuthProvider>
      </body>
    </html>
  );
}
