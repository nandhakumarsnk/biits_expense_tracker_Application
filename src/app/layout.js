import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import { NextAuthProvider } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BIITS- EXPENSE TRACKER",
  description: "bIITS- Expense Tracker Application",
};

export default function RootLayout({ children }) {
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
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
