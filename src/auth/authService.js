import axios from "axios";
import { VITE_API_BASE_URL } from "../config/apiConfig";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${VITE_API_BASE_URL}/auth/register`, userData);
    return response.data; // Expect { token, email, role }
  } catch (error) {
    console.error(error);
    throw error.response?.data || "❌ Registration failed";
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${VITE_API_BASE_URL}/auth/login`, userData);
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
      `${VITE_API_BASE_URL}/job-offers/create`,
      jobOfferData,
      bearer_token
    );
    return response.data; // Expect { token, email, role }
  } catch (error) {
    console.error(error);
    throw error.response?.data || "❌ Job offer creation failed";
  }
};
