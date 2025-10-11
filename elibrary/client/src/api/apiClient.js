import axios from "axios";

const BASE_URL = "https://3ke6e5jn18.execute-api.ap-southeast-2.amazonaws.com/default/elibrary_lambda";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

export default apiClient;




