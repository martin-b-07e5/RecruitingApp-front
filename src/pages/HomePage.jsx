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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const HomePage = () => {
  const { user, token, logout } = useContext(AuthContext); // 🌟 Use logout from AuthContext
  const navigate = useNavigate();
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const [applications, setApplications] = useState([]);
  const [openApplyModal, setOpenApplyModal] = useState(false); // Modal state
  const [selectedJobOfferId, setSelectedJobOfferId] = useState(null); // Track selected job
  const [coverLetter, setCoverLetter] = useState(""); // Cover letter input

  // Fetch job offers and candidate's applications
  useEffect(() => {
    // Fetch all job offers
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
        { jobOfferId, coverLetter }, // Include coverLetter
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
      setOpenApplyModal(false); // Close modal
      setCoverLetter(""); // Reset cover letter
    } catch (error) {
      console.error("Apply to job offer error: ", error);
      setError(error.response?.data || "❌ Failed to apply to job offer"); // Use backend error message
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

  // Open modal for applying
  const handleOpenApplyModal = (jobId) => {
    setSelectedJobOfferId(jobId);
    setOpenApplyModal(true);
  };

  // Close modal for applying
  const handleCloseApplyModal = () => {
    setOpenApplyModal(false);
    setCoverLetter("");
    setSelectedJobOfferId(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} pt={6}>
      {/* Header */}
      <AppBar position="fixed">
        {/* 🌟 */}
        <Toolbar>
          {/* Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recruiting Platform
          </Typography>

          {/* Show user info, after login */}
          {user ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.email} | ({user.role})
              </Typography>
              {user.role === "RECRUITER" && (
                <Button color="inherit" onClick={() => navigate("/job-offers/create")}>
                  Create Job Offer
                </Button>
              )}
              <Button color="inherit" onClick={logout}>
                {" "}
                {/* 🌟 Use logout from AuthContext */}
                Logout
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
          // sx={{ justifyContent: "center" }}
          // sx={{ justifyContent: "flex-start" /* default */ }}
          // sx={{ justifyContent: "flex-end" }}
          // sx={{ justifyContent: "space-around" }}
          // sx={{ justifyContent: "space-between"}}
          sx={{ justifyContent: "space-evenly" /* Better spacing */ }}
        >
          {jobOffers.map((job) => {
            const application = applications.find((app) => {
              //   console.log("Checking application:", app, "for job.id:", job.id); // Debug each application. important
              return app.jobOfferId === job.id; // Match jobOfferId
            });
            // console.log("Application for job", job.id, ":", application); // Debug final application. important
            return (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    maxWidth: 290,
                    minWidth: 290,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.companyId}- {job.companyName || `Company ID ${job.companyId}`}
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
                        {/* Apply new */}
                        <Button
                          variant="contained"
                          onClick={() => handleOpenApplyModal(job.id)}
                          disabled={
                            application &&
                            (application.status === "PENDING" ||
                              application.status === "WITHDRAWN")
                          }
                        >
                          Apply
                        </Button>

                        {/* Withdraw new */}
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleWithdraw(application.id)}
                          disabled={!application || application.status !== "PENDING"}
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

      {/* Apply Modal */}
      <Dialog open={openApplyModal} onClose={handleCloseApplyModal}>
        <DialogTitle>Apply to Job Offer</DialogTitle>
        <DialogContent>
          <TextField
            label="Cover Letter"
            multiline
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApplyModal}>Cancel</Button>
          <Button
            onClick={() => handleApply(selectedJobOfferId, coverLetter)} // 🌟 Fixed to include coverLetter
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

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
