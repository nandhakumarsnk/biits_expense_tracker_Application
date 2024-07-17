"use client";
import React, { useState } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const LoginPage = () => {
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
        user_role: "0",
        redirect: false,
        callbackUrl: "http://localhost:3000/admin",
      });

      if (result?.ok) {
        console.log("Login successful:", result);
        if (typeof window !== "undefined") {
          window.location.href = "/admin";
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Employee ID:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .login-container h1 {
          text-align: center;
          margin-bottom: 1rem;
        }
        .login-container form {
          display: flex;
          flex-direction: column;
        }
        .login-container form div {
          margin-bottom: 1rem;
        }
        .login-container form label {
          margin-bottom: 0.5rem;
          display: block;
        }
        .login-container form input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .login-container form .error {
          color: red;
          margin-bottom: 1rem;
        }
        .login-container form button {
          padding: 0.75rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .login-container form button:disabled {
          background-color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
