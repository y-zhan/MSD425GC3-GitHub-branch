import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./mainPage";
import LoginPage from "./loginPage";
import AdminPage from "./adminPage";
import StudentPage from "./studentPage";

// Require login to access
function ProtectedRoute({ children, role }) {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    // Redirect
    return <Navigate to="/loginPage" replace />;
  }

  const user = JSON.parse(storedUser);

  // Permission matching
  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/adminPage" replace />;
    else return <Navigate to="/studentPage" replace />;
  }

  return children;
}

// Prevent duplicate logins
function RedirectIfLoggedIn({ children }) {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.role === "admin") return <Navigate to="/adminPage" replace />;
    else return <Navigate to="/studentPage" replace />;
  }

  return children;
}

// route
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* mainpage */}
      <Route path="/" element={<MainPage />} />

      {/* login */}
      <Route
        path="/loginPage"
        element={
          <RedirectIfLoggedIn>
            <LoginPage />
          </RedirectIfLoggedIn>
        }
      />

      {/* adminpage */}
      <Route
        path="/adminPage"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* studentpage */}
      <Route
        path="/studentPage"
        element={
          <ProtectedRoute role="student">
            <StudentPage />
          </ProtectedRoute>
        }
      />

      {/* Automatically return to the home page when no route is matched */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
