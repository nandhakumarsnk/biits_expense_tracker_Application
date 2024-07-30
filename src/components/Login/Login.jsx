// src/components/LoginForm.js

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import "./login.css";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import biitslogo from "../../../public/images/biitsLogo.png";
import adminLoginImg from "../../../public/images/admin_login_img.png";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(email, password);
      const result = await signIn("credentials", {
        email,
        password,
        user_role: "1",
        redirect: true,
        // callbackUrl: "http://localhost:3000/admin",
        // callbackUrl: "https://expenses.creowiz.com/admin",
      });
      console.log(result);
      if (result?.ok) {
        console.log("Login successful:", result);
        if (typeof window !== "undefined") {
          window.location.href = "/admin";
        }
      } else if (result?.error === "Login failed") {
        setError("Please Check the Email and Password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = async (event) => {
  //   event.preventDefault();

  //   setLoading(true);

  //   setError("");

  //   const apiEndpoint = `${process.env.NEXT_PUBLIC_LOGIN_ADMIN}`;

  //   try {
  //     const response = await axios.post(
  //       apiEndpoint,
  //       {
  //         email: email,
  //         password: password,
  //         user_role: "0",
  //       },

  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("Login successful:", response.data);

  //       // Handle successful login (e.g., redirect to dashboard)

  //       if (typeof window !== "undefined") {
  //         window.location.href = "/admin";
  //       }
  //     } else {
  //       setError("Login failed");
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       setError(error.response.data.error || "Login failed");
  //     } else {
  //       setError("An error occurred. Please try again.");
  //     }

  //     console.error("Login error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="container-fluid">
      <div className="row login-page">
        <div
          className="col-sm-5 welcome-section d-block justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="text-center p-5">
            <Image src={biitslogo} className="img-brand" alt="brand-biits" />

            <h1>Welcome to Expense Tracker</h1>
            <p>Sign in to continue access</p>
            <div>
              <a
                href="https://biitsinc.com/"
                className="text-decoration-none text-info"
              >
                B-Informative IT Services Pvt.Ltd
              </a>
            </div>
            <Image
              src={adminLoginImg}
              className="img-fluid object-fit-cover"
              width={450}
              alt="brand-biits"
            />
          </div>
        </div>
        <div className="col-sm-7 login-form-container">
          <form onSubmit={handleLogin} className="login-form">
            <h2 className="signIn">Sign In</h2>
            <div className="form-group mb-4">
              <label className="mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label className="mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* <button type="submit" className="btn btn-primary">
            Continue
          </button> */}

            {error && (
              <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
            )}
            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* <div className="social-login">
            <button className="btn btn-twitter">Sign In With Twitter</button>
            <button className="btn btn-facebook">Sign In With Facebook</button>
          </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
