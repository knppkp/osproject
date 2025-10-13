import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import "./signUp.css";

import icon from "../assets/poll_icon.svg";

// Zod schema for sign up
const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUp() {
  const [response, setResponse] = useState(null);
  const navigate = useNavigate(); // to navigate after successful sign up

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data) => {
    api
      .post("/api/users/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        setResponse(res.data);
        alert("Sign Up Successful!");
        reset();
        navigate("/"); // redirect to login page
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Sign Up Failed. Please try again.");
      });
  };

  return (
    <div className="app-container">
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="login-card">
        <img src={icon} alt="login icon" className="login-icon" />
        <p className="login-text">Sign Up</p>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Name" {...register("name")} />
          {errors.name && <p className="error">{errors.name.message}</p>}

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

          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}

          <div className="center">
            <p className="hoverLine">
              <Link to="/">Already have an account? Log In</Link>
            </p>
          </div>

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        {response && (
          <div className="api-response">
            <p>{response.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
