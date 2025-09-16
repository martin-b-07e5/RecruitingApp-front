import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login as loginService } from "../services/authService";
import HeaderPage from "./HeaderPage";
import FooterPage from "./FooterPage";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🌟 Validate inputs
    if (!formData.email || !formData.password) {
      setError("❌ Email and password are required");
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.email.length < 5 ||
      formData.email.length > 254
    ) {
      setError("❌ Email must be 5-254 characters and valid");
      return;
    }
    if (formData.password.length < 6) {
      setError("❌ Password must be at least 6 characters");
      return;
    }

    console.log(
      "🚀 ~ file: LoginPage.jsx ~ line ~48 ~ handleSubmit ~ formData",
      formData
    );
    console.log("Sending payload:", formData); // 🌟 Debug payload

    try {
      const response = await loginService(formData);
      login(
        {
          email: response.email,
          role: response.role,
          companyId: response.companyId || [],
        },
        response.token
      );
      navigate("/"); // 🌟 Redirect to home
    } catch (error) {
      setError(error.message || "❌ Login failed");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 🌟 Header */}
      <HeaderPage />

      {/* Body (login) */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "300px",
        }} // 🌟 Expand and center
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              autoFocus
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </Box>
        </Box>
      </Container>

      {/* 🌟 Footer */}
      <FooterPage />
    </Box>
  );
};

export default LoginPage;
