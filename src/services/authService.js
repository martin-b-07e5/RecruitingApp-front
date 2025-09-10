import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;  // Expect { token, email, role }
  } catch (error) {
    console.error(error);
    throw error.response?.data || '❌ Registration failed';
  }
};

