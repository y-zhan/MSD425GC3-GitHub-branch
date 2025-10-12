import apiClient from "./apiClient";

// Student Login
export const studentLogin = async (credentials) => {
  const res = await apiClient.post("/login/student", credentials);
  return res.data;
};

// Get All Borrow Records
export const getAllBorrowRecords = async () => {
  const res = await apiClient.get("/borrow_records");
  return res.data;
};

// Borrow Book
export const borrowBook = async ({ user_id, book_id, days }) => {
  const res = await apiClient.post("/borrow", { user_id, book_id, days });
  return res.data;
};

// Return Book
export const returnBook = async (record_id) => {
  const res = await apiClient.put(`/borrow/return/${record_id}`);
  return res.data;
};

// Get Blacklist Users
export const getBlacklist = async () => {
  const res = await apiClient.get("/blacklist");
  return res.data;
};
