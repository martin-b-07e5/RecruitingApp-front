import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register } from "../services/authService";
import HeaderPage from "./HeaderPage"; // 🌟 Import Header
import FooterPage from "./FooterPage";
import { Helmet, HelmetProvider } from "react-helmet-async";
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
    companyIds: [], // 🌟 Initialize for backend payload
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompaniesChange = (event, values) => {
    // 🌟 Convert input strings to numbers and validate
    const newCompanyIds = values
      .map((value) => parseInt(value, 10))
      .filter((id) => !isNaN(id) && id >= 1 && id <= 25);
    setFormData({ ...formData, companyIds: [...new Set(newCompanyIds)] });
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
      <HelmetProvider>
        <Helmet>
          <title>Register | Recruiting Platform</title>
        </Helmet>
      </HelmetProvider>

      <HeaderPage />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register as a Recruiter
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
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

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
          />
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            margin="normal"
            fullWidth
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

          <Autocomplete
            multiple
            freeSolo
            options={[]} // 🌟 Allow free input for company IDs
            value={formData.companyIds.map((id) => id.toString())} // 🌟 Convert IDs to strings for display
            onChange={handleCompaniesChange}
            disabled={formData.role === "CANDIDATE"} // 🌟 Disable for CANDIDATE
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index }); // 🌟 Avoid key spread warning
                return <Chip key={index} label={option} {...tagProps} />;
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company IDs (type 1-25, press Enter)"
                margin="normal"
                fullWidth
                onKeyDown={(e) => {
                  // 🌟 Add company ID on Enter or comma
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const inputValue = params.inputProps.value.trim();
                    const id = parseInt(inputValue, 10);
                    if (
                      !isNaN(id) &&
                      id >= 1 &&
                      id <= 25 &&
                      !formData.companyIds.includes(id)
                    ) {
                      setFormData({
                        ...formData,
                        companyIds: [...formData.companyIds, id],
                      });
                      params.inputProps.onChange({ target: { value: "" } }); // 🌟 Clear input
                    }
                  }
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>

      <FooterPage />
    </Container>
  );
};

export default RegisterPage;
