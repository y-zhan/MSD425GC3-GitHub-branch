import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainPage";
import LoginPage from "./loginPage";
import "antd/dist/reset.css";
import AdminPage from "./adminPage";
import StudentPage from "./studentPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/loginPage" element={<LoginPage />} />
      {/* <Route path="/" element={<AdminPage />} /> */}
      {/* <Route path="/" element={<StudentPage />} /> */}
    </Routes>
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
