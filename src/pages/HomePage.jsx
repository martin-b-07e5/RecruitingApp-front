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
  const [error, setError] = useState(null); // 🌟 Add error state
  const [applications, setApplications] = useState([]);

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
        setError(error.response?.data || "❌ Failed to fetch job offers");
      }
    };

    // Fetch candidate's applications
    const fetchApplications = async () => {
      if (user?.role === "CANDIDATE") {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/job-applications/getCandidateJobApplications",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setApplications(response.data || []);
        } catch (error) {
          console.error("Fetch candidate applications error: ", error);
          setError(error.response?.data || "❌ Failed to fetch candidate applications");
        }
      }
    };
    fetchJobOffers();
    fetchApplications();
  }, [user, token]);

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
      // Refresh applications
      const responseApps = await axios.get(
        "http://localhost:8080/api/job-applications/getCandidateJobApplications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(responseApps.data || []);
    } catch (error) {
      console.error("Apply to job offer error: ", error);
      setError(error.response?.data || "❌ Failed to apply to job offer"); // 🌟 Use backend error message
    }
  };

  // Handle withdraw application
  const handleWithdraw = async (applicationId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/job-applications/withdrawApplication/${applicationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      alert("✅ Application withdrawn successfully");
      // Refresh applications
      const response = await axios.get(
        "http://localhost:8080/api/job-applications/getCandidateJobApplications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(response.data || []);
    } catch (error) {
      console.error("Withdraw application error: ", error);
      setError(error.response?.data || "❌ Failed to withdraw application");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} pt={6}>
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
      <Container maxWidth="false" sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Job Offers
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid
          container
          spacing={3}
          //   sx={{ justifyContent: "space-between" /* 🌟 Better spacing */ }}
          sx={{ justifyContent: "center" }}
        >
          {jobOffers.map((job) => {
            const application = applications.find((app) => {
            //   console.log("Checking application:", app, "for job.id:", job.id); // 🌟 Debug each application. important
              return app.jobOfferId === job.id; // 🌟 Match jobOfferId
            });
            // console.log("Application for job", job.id, ":", application); // 🌟 Debug final application. important
            return (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column" /* 🌟 Consistent height */,
                    height: "100%",
                    maxWidth: 290,
                    minWidth: 290,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.companyName || `Company ID ${job.companyId}`}
                    </Typography>
                    <Typography variant="body2" sx={{ minHeight: 60 }}>
                      {job.description}
                    </Typography>
                    <Typography variant="body2">Salary: {job.salary}</Typography>
                    <Typography variant="body2">Location: {job.location}</Typography>
                    <Typography variant="body2">Type: {job.employmentType}</Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between" }}>
                    {user?.role === "CANDIDATE" && (
                      <>
                        {/* Apply */}
                        <Button
                          variant="contained"
                          onClick={() => {
                            console.log("Application for job", job.id, ":", application);
                            handleApply(job.id);
                          }}
                          disabled={
                            application &&
                            (application.status === "PENDING" ||
                              application.status === "WITHDRAWN")
                          }
                        >
                          Apply
                        </Button>

                        {/* Withdraw */}
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            handleWithdraw(application.id);
                          }}
                          disabled={application?.status !== "PENDING"}
                        >
                          Withdraw
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ py: 2, bgcolor: "grey.200", textAlign: "center", color: "text.secondary" }}
      >
        <Typography variant="body2">
          © 2025 Recruiting Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
