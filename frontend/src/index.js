import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SignUp from "./signUp/signUp";
import Homepage from "./homePage/homePage";
import CreatePoll from "./createPoll/createPoll";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/createpoll" element={<CreatePoll />} />
    </Routes>
  </BrowserRouter>
);
