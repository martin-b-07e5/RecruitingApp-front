import axios from "axios";
import { BASE_API_URL } from "../config/apiConfig";

// const BASE_API_URL = "http://localhost:8080/api";
// const BASE_API_URL = "http://localhost:8085/api";
// const BASE_API_URL = "http://146.235.58.90:8087/api";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/register`, userData);
    return response.data; // Expect { token, email, role }
  } catch (error) {
    console.error(error);
    throw error.response?.data || "❌ Registration failed";
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/login`, userData);
    return response.data; // Expect { token, email, role }
  } catch (error) {
    console.error(error);
    throw error.response?.data || "❌ Login failed";
  }
};

export const createJobOffer = async (jobOfferData) => {
  try {
    const token = localStorage.getItem("token");
    const bearer_token = { headers: { Authorization: `Bearer ${token}` } };
    console.log(jobOfferData);
    console.log(token);
    console.log(bearer_token);
    const response = await axios.post(
      `${BASE_API_URL}/job-offers/create`,
      jobOfferData,
      bearer_token
    );
    return response.data; // Expect { token, email, role }
  } catch (error) {
    console.error(error);
    throw error.response?.data || "❌ Job offer creation failed";
  }
};
