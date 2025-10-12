// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [data, setData] = useState("");
//   const [thing, setThing] = useState("");

//   useEffect(() => {
//     axios
//       .get("/api")
//       .then((res) => {
//         setData(res.data.time.now);
//         setThing(res.data.test);
//         console.log(res.data);
//       })
//       .catch((err) => console.error(err));
//   }, []);

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

function App() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
    navigate("/homepage");
    reset();
  };

  return (
    <div className="app-container">
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="login-card">
        <p className="login-text">Log In</p>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Username" {...register("username")} />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
          <p className="hoverLine">
            <Link to="/signup">Don’t have an account? Sign up</Link>
          </p>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
