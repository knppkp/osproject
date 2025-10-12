// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Link } from "react-router-dom";
// import "./signUp.css";

// // Zod schema for sign up
// const signUpSchema = z
//   .object({
//     name: z.string().min(1, { message: "Name is required" }),
//     email: z.string().email({ message: "Invalid email" }),
//     password: z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters" }),
//     confirmPassword: z
//       .string()
//       .min(1, { message: "Please confirm your password" }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"], // error message goes to confirmPassword
//   });

// function SignUp() {
//   const [response, setResponse] = useState(null);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signUpSchema),
//   });

//   const onSubmit = (data) => {
//     console.log("Sign Up Data:", data);
//     alert("Sign Up Successful!");
//     reset();
//   };

//   useEffect(() => {
//     // Data to send
//     const data = {
//       name: "John Doe",
//       email: "john@example.com",
//       password: "password123",
//     };

//     // POST request
//     fetch("http://localhost:5000/api/users/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Response from API:", data);
//         setResponse(data);
//       })
//       .catch((err) => {
//         console.error("Error:", err);
//       });
//   }, []);

//   return (
//     <div className="app-container">
//       <div className="login-card">
//         <p className="login-text">Sign Up</p>

//         <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
//           <input type="text" placeholder="Name" {...register("name")} />
//           {errors.name && <p className="error">{errors.name.message}</p>}

//           <input type="email" placeholder="Email" {...register("email")} />
//           {errors.email && <p className="error">{errors.email.message}</p>}

//           <input
//             type="password"
//             placeholder="Password"
//             {...register("password")}
//           />
//           {errors.password && (
//             <p className="error">{errors.password.message}</p>
//           )}

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             {...register("confirmPassword")}
//           />
//           {errors.confirmPassword && (
//             <p className="error">{errors.confirmPassword.message}</p>
//           )}
//           <p className="hoverLine">
//             <Link to="/">Already have an account? Log In</Link>
//           </p>

//           <button type="submit" className="login-button">
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUp;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./signUp.css";

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
    axios
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
      <div className="login-card">
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

          <p className="hoverLine">
            <Link to="/">Already have an account? Log In</Link>
          </p>

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
