import apiClient from "./apiClient";

// admin login
export const adminLogin = async (credentials) => {
  const res = await apiClient.post("/login/admin", credentials);
  return res.data;
};

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
export const addToBlacklist = async ({ user_id, reason = "Violation of rules" }) => {
  const res = await apiClient.post("/blacklist/add", { user_id, reason });
  return res.data;
};

// remove user from blacklist
export const removeFromBlacklist = async (user_id) => {
  const res = await apiClient.delete(`/blacklist/remove/${user_id}`);
  return res.data;
};

