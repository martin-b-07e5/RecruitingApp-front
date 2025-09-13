import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";

const HomePage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all job offers
  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/job-offers/getAllJobOffers"
        );
        setJobOffers(response.data || []);
      } catch (error) {
        console.error("Fetch job offers error: ", error);
        setError(error.message);
        setError("❌ Failed to fetch job offers");
      }
    };
    fetchJobOffers();
  }, []);

  // Handle job application
  const handleApply = async (jobOfferId) => {
    if (!user || user.role !== "CANDIDATE") {
      setError("❌ You must be a candidate to apply for a job offer");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/job-applications/apply",
        { jobOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      alert("✅ You have successfully applied for the job offer");
    } catch (error) {
      console.error("Apply to job offer error: ", error);
      //   setError(error.message);
      //   setError("❌ Failed to apply to job offer");
      console.error("Apply to job offer error: ", error);
      setError(error.response?.data || "❌ Failed to apply to job offer"); // 🌟 Use backend error message
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recruiting Platform
          </Typography>
          {user ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.email} ({user.role})
              </Typography>
              <Button
                color="inherit"
                onClick={() =>
                  navigate(user.role === "recruiter" ? "/job-offers/create" : "/login")
                }
              >
                {user.role === "recruiter" ? "Create Job Offer" : "Login"}
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Job Offers
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3}>
          {jobOffers.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.companyName || `Company ID ${job.companyId}`}
                  </Typography>
                  <Typography variant="body2">{job.description}</Typography>
                  <Typography variant="body2">Salary: {job.salary}</Typography>
                  <Typography variant="body2">Location: {job.location}</Typography>
                  <Typography variant="body2">Type: {job.employmentType}</Typography>
                </CardContent>
                <CardActions>
                  {user?.role === "CANDIDATE" && (
                    <Button variant="contained" onClick={() => handleApply(job.id)}>
                      Apply
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, bgcolor: "grey.200", textAlign: "center" }}>
        <Typography variant="body2">
          © 2025 Recruiting Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
