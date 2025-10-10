// src/api/bookApi.js
import apiClient from "./apiClient";

// get all books
export const getAllBooks = async () => {
  const res = await apiClient.get("/books");
  return res.data;
};

// search books
export const searchBooks = async (keyword) => {
  const res = await apiClient.get(`/books/search?keyword=${keyword}`);
  return res.data;
};

// add new book
export const addBook = async (bookData) => {
  const res = await apiClient.post("/books", bookData);
  return res.data;
};

// update book
export const updateBook = async (id, bookData) => {
  const res = await apiClient.put(`/books/${id}`, bookData);
  return res.data;
};

// delete book
export const deleteBook = async (id) => {
  const res = await apiClient.delete(`/books/${id}`);
  return res.data;
};
