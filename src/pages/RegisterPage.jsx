import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register } from "../services/authService";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  Chip,
  Autocomplete,
} from "@mui/material";

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "RECRUITER",
    skills: [],
    experience: "",
    companyIds: [], // 🦄 Keep for backend payload, but no UI field
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      setError("❌ Email, password, first name, and last name are required");
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
    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      setError("❌ First name must be 2-50 characters");
      return;
    }
    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      setError("❌ Last name must be 2-50 characters");
      return;
    }
    if (formData.phone && formData.phone.length > 20) {
      setError("❌ Phone must be up to 20 characters");
      return;
    }
    if (!["CANDIDATE", "RECRUITER"].includes(formData.role)) {
      setError("❌ Role must be CANDIDATE or RECRUITER");
      return;
    }

    console.log("Sending payload:", formData); // 🌟 Debug payload

    try {
      const response = await register(formData);
      // Backend returns { token, email, role }
      login({ email: response.email, role: response.role }, response.token);
      navigate("/"); // Redirect to home until profile page is implemented
    } catch (error) {
      setError(error.message || "❌ REGISTRATION FAILED");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register as a Recruiter
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            margin="normal"
          />

          <Autocomplete
            multiple
            freeSolo
            options={[]} // 🌟 Fix options undefined error
            value={formData.skills}
            onChange={(event, values) => {
              // 🌟 Update skills from values
              const newSkills = values
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "");
              setFormData({ ...formData, skills: [...new Set(newSkills)] });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index }); // 🌟 Extract key to avoid spread warning
                return <Chip key={index} label={option} {...tagProps} />;
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Skills (type, press Enter or comma)"
                margin="normal"
                fullWidth
                onKeyDown={(e) => {
                  // 🌟 Handle comma or Enter to add skill
                  if (e.key === "," || e.key === "Enter") {
                    e.preventDefault();
                    const inputValue = params.inputProps.value.trim();
                    if (inputValue && !formData.skills.includes(inputValue)) {
                      setFormData({
                        ...formData,
                        skills: [...formData.skills, inputValue],
                      });
                      params.inputProps.onChange({ target: { value: "" } }); // 🌟 Clear input
                    }
                  }
                }}
              />
            )}
          />

          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="RECRUITER">RECRUITER</MenuItem>
            <MenuItem value="CANDIDATE">CANDIDATE</MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
