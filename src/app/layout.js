import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";

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
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
