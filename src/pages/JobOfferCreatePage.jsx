import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { createJobOffer } from "../auth/authService";
import HeaderPage from "./HeaderPage"; // 🌟 Import Header
import FooterPage from "./FooterPage";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

// const BASE_API_URL = "http://localhost:8080/api";
const BASE_API_URL = "http://localhost:8085/api";

const JobOfferCreatePage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "", // REMOTE, HYBRID, Mountain View, CA, etc
    employmentType: "FULL_TIME", // FULL_TIME, PART_TIME, FREELANCE
    companyId: "",
  });

  const [error, setError] = useState(null);
  const [companyIds, setCompanyIds] = useState([]);

  // 🌟 Check if user is RECRUITER and fetch their companyIds from backend
  useEffect(() => {
    if (!user || user.role !== "RECRUITER") {
      setError("❌ You must be a recruiter to create a job offer.");
      navigate("/signin");
      return;
    }
    const fetchCompanyIds = async () => {
      if (!token) {
        setError("❌ No authentication token found. Please log in again.");
        navigate("/signin");
        return;
      }
      try {
        const response = await axios.get(`${BASE_API_URL}/api/users/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyIds(response.data || []); // Expect array of Longs, e.g., [1, 3]
      } catch (err) {
        console.error("Fetch companyIds error:", err);
        setError(
          err.response?.status === 401
            ? "❌ Invalid token. Please log in again."
            : "❌ Failed to fetch company IDs"
        );
        if (err.response?.status === 401) navigate("/signin");
      }
    };
    fetchCompanyIds();
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🌟 Validate inputs
    if (
      !formData.title ||
      !formData.description ||
      !formData.salary ||
      !formData.location ||
      !formData.employmentType ||
      !formData.companyId
    ) {
      setError(
        "❌ Title, description, salary, location, employment type, and company ID are required"
      );
      return;
    }
    if (formData.title.length < 2 || formData.title.length > 100) {
      setError("❌ Title must be 2-100 characters");
      return;
    }
    if (formData.description.length < 10 || formData.description.length > 2000) {
      setError("❌ Description must be 10-2000 characters");
      return;
    }
    // salary not restriction
    // location not restriction
    if (!["FULL_TIME", "PART_TIME", "FREELANCE"].includes(formData.employmentType)) {
      setError("❌ Invalid employment type");
      return;
    }

    // Convert companyId to number (base-10)
    // company => company.id === companyIdNum: For each company object in companyIds, checks if its id property equals companyIdNum (using strict equality === to ensure type safety).
    // \!: Negates the result. If some returns false (no match), !false is true, triggering the error "❌ Invalid company ID".
    const companyIdNum = parseInt(formData.companyId, 10);
    if (
      isNaN(companyIdNum) ||
      !companyIds.some((company) => company.id === companyIdNum)
    ) {
      // 🌟 Check company.id
      setError("❌ Invalid company ID");
      return;
    }

    const payload = {
      ...formData,
      companyId: companyIdNum, // Ensure companyId is a number
    };

    console.log("Sending payload:", payload); // 🌟 Debug payload

    try {
      const response = await createJobOffer(payload);
      navigate("/"); // 🌟 Redirect to home or job offers list
    } catch (error) {
      setError(error.message || "❌ Job offer creation failed");
    }
  };

  return (
    <Box sx={{ mt: 12 }}>
      <HelmetProvider>
        <Helmet>
          <title>Create Job Offer | Recruiting Platform</title>
        </Helmet>
      </HelmetProvider>

      {/* Header - 🌟 Use Header component*/}
      <HeaderPage />

      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 4,
            marginBottom: 4,
            borderRadius: 4,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create a Job Offer
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              margin="normal"
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              margin="normal"
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
              margin="normal"
              fullWidth
            />

            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              margin="normal"
              fullWidth
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
              >
                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                <MenuItem value="PART_TIME">Part Time</MenuItem>
                <MenuItem value="FREELANCE">Freelance</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Company</InputLabel>
              <Select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
              >
                {companyIds.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
              fullWidth
            >
              Create Job Offer
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <FooterPage />
    </Box>
  );
};

export default JobOfferCreatePage;
