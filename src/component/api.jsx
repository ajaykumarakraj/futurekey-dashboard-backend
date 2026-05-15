// src/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://api.almonkdigital.in/api/admin",
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(

  // success response
  (response) => response,

  // error response
  async (error) => {

    // agar token invalid hua
    if (error.response?.status === 401) {

      // localStorage clear
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  window.location.href = "/login";
    
    
    }

    return Promise.reject(error);
  }
);

export default api;