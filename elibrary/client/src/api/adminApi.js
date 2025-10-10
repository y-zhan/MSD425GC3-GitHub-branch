// src/api/adminApi.js
import apiClient from "./apiClient";

// get user
export const getAllUsers = async () => {
  const res = await apiClient.get("/users");
  return res.data;
};

// get balck list
export const getBlacklist = async () => {
  const res = await apiClient.get("/blacklist");
  return res.data;
};

// add user to blacklist
export const addToBlacklist = async (data) => {
  const res = await apiClient.post("/blacklist/add", data);
  return res.data;
};

// remove user from blacklist
export const removeFromBlacklist = async (userId) => {
  const res = await apiClient.delete(`/blacklist/remove/${userId}`);
  return res.data;
};

