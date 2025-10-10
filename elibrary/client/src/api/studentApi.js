// src/api/studentApi.js
import apiClient from "./apiClient";

// login api
export const loginUser = async (username, password, role) => {
  const path = role === "admin" ? "/login/admin" : "/login/student";
  const res = await apiClient.post(path, { username, password });
  return res.data;
};

// get all borrowing records
export const getAllBorrowRecords = async () => {
  const res = await apiClient.get("/borrow_records");
  return res.data;
};

// borrow
export const borrowBook = async (payload) => {
  const res = await apiClient.post("/borrow", payload);
  return res.data;
};

// return
export const returnBook = async (recordId) => {
  const res = await apiClient.put(`/borrow/return/${recordId}`);
  return res.data;
};
