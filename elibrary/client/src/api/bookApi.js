import apiClient from "./apiClient";

// get all books
export const getAllBooks = async () => {
  const res = await apiClient.get("/books");
  return res.data;
};

// search books
export const searchBooks = async (keyword) => {
  const res = await apiClient.get(`/books/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};

// add new book
export const addBook = async (book) => {
  const res = await apiClient.post("/books", {
    title: book.title,
    author: book.author,
    category: book.category,
    quantity: Number(book.quantity) || 1,
  });
  return res.data;
};

// update book
export const updateBook = async (id, bookData) => {
  const res = await apiClient.put(`/books/${id}`, bookData);
  return res.data;
};

// delete book
export const deleteBook = async (bookId) => {
  const res = await apiClient.delete(`/books/${bookId}`);
  return res.data;
};
