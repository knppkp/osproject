import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

import icon from "./assets/poll_icon.svg";

// Zod schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

function App() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/users/login", {
        email: data.email,
        password: data.password,
      });

      console.log("Login Response:", response.data);

      const { user_id, name, email } = response.data.user;
      localStorage.setItem(
        "userSession",
        JSON.stringify({ id: user_id, name, email })
      );

      alert("Login Successful!");
      reset();
      navigate("/homepage");
    } catch (err) {
      console.error("Login Error:", err);
      setApiError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="app-container">
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="login-card">
        <img src={icon} alt="login icon" className="login-icon" />
        <p className="login-text">Login</p>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}

          {apiError && <p className="error">{apiError}</p>}

          <div className="center">
            <p className="hoverLine">
              <Link to="/signup">Don’t have an account? Sign up</Link>
            </p>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
