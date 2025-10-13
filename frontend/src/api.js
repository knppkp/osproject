import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://osproject-2m70.onrender.com" || "http://localhost:5000",
});

export default api;