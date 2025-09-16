import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import HeaderPage from "./HeaderPage"; // 🌟 Import Header
import FooterPage from "./FooterPage";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const HomePage = () => {
  const { user, token } = useContext(AuthContext); // 🌟 Use logout from AuthContext
  const navigate = useNavigate();
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const [applications, setApplications] = useState([]);
  const [openApplyModal, setOpenApplyModal] = useState(false); // Modal state
  const [selectedJobOfferId, setSelectedJobOfferId] = useState(null); // Track selected job
  const [coverLetter, setCoverLetter] = useState(""); // Cover letter input

  // 🌟 delete job offer handler
  const handleDeleteJobOffer = async (jobOfferId) => {
    console.log("Delete button clicked for jobOfferId:", jobOfferId);
    // if (window.confirm("Are you sure you want to delete this job offer?")) {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/job-offers/${jobOfferId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Delete response:", response.data);
      setError(null);
      alert("✅ Job offer deleted successfully");
      setJobOffers(jobOffers.filter((job) => job.id !== jobOfferId));
    } catch (error) {
      console.error("Delete job offer error:", error.response || error);
      const errorMessage =
        error.response?.data ||
        "❌ Failed to delete job offer - Cannot delete job offer with active applications";
      setError(
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage)
      );
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
    // }
  };

  // Fetch job offers and candidate's applications
  useEffect(() => {
    // Fetch all job offers
    const fetchJobOffers = async () => {
      try {
        const endpoint =
          user?.role === "RECRUITER"
            ? `http://localhost:8080/api/job-offers/getMyJobOffers`
            : "http://localhost:8080/api/job-offers/getAllJobOffers";
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobOffers(response.data || []);
      } catch (error) {
        console.error("Fetch job offers error: ", error);
        if (error.response?.status === 401) {
          setError("❌ Unauthorized: Please log in again");
          navigate("/login");
        } else {
          setError(error.response?.data || "❌ Failed to fetch job offers");
        }
      }
    };

    // Fetch candidate's applications
    const fetchApplications = async () => {
      if (
        user?.role === "CANDIDATE" ||
        user?.role === "RECRUITER" ||
        user?.role === "ADMIN"
      ) {
        try {
          const endpoint =
            user?.role === "CANDIDATE"
              ? "http://localhost:8080/api/job-applications/getCandidateJobApplications"
              : user?.role === "ADMIN"
              ? "http://localhost:8080/api/job-applications/getAllJobApplications" // 🌟 endpoint for ADMIN
              : "http://localhost:8080/api/job-applications/getJobsApplicationsForRecruiters";
          const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(response.data || []);
        } catch (error) {
          console.error("Fetch candidate applications error: ", error);
          setError(error.response?.data || "❌ Failed to fetch candidate applications");
        }
      }
    };

    fetchJobOffers();
    fetchApplications();
  }, [user, token, navigate]);

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

  // Handle status change
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/job-applications/updateApplicationStatus/${applicationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      alert("✅ Application status updated successfully");
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Update application status error: ", error);
      setError(error.response?.data || "❌ Failed to update application status");
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
      {/* Header - 🌟 Use Header component*/}
      <HeaderPage />

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

                  <CardActions sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                    {/* CANDIDATE actions */}
                    {user?.role === "CANDIDATE" && (
                      <>
                        {/* Apply */}
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

                        {/* Withdraw */}
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
                    {(user?.role === "RECRUITER" || user?.role === "ADMIN") && (
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={application?.status || "PENDING"}
                          onChange={(e) => {
                            if (!application) {
                              // Create a new application for ADMIN if none exists
                              handleApply(job.id, "", e.target.value);
                            } else {
                              handleStatusChange(application.id, e.target.value);
                            }
                          }}
                          label="Status"
                          disabled={!application && user?.role === "RECRUITER"} // RECRUITER can't create new applications
                        >
                          {/* only show whitdrawn to recruiter */}
                          <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>{" "}
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                          <MenuItem value="INTERVIEW">Interview</MenuItem>
                          <MenuItem value="ACCEPTED">Accepted</MenuItem>
                          <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    {user?.role === "RECRUITER" && ( // 🌟 Delete button
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteJobOffer(job.id)}
                        sx={{ mb: 1 }}
                        disabled={!!application}
                      >
                        Delete
                      </Button>
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

      {/* Footer - 🌟 Use Footer component */}
      <FooterPage />
    </Box>
  );
};

export default HomePage;
