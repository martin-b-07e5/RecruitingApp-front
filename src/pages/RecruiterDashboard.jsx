import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import HeaderPage from "./HeaderPage"; // Import Header
import FooterPage from "./FooterPage";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// const BASE_API_URL = "http://localhost:8080/api";
const BASE_API_URL = "http://localhost:8085/api";

const RecruiterDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.role === "RECRUITER" || user?.role === "ADMIN") {
        try {
          const response = await axios.get(
            `${BASE_API_URL}/job-applications/getJobsApplicationsForRecruiters`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setApplications(response.data || []);
        } catch (error) {
          console.error("Fetch job offers error: ", error);
          setError(error.response?.data || "❌ Failed to fetch applications");
        }
      }
    };

    fetchApplications();
  }, [user, token]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${BASE_API_URL}/job-applications/updateApplicationStatus/${applicationId}`,
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} pt={6}>
      <HelmetProvider>
        <Helmet>
          <title>Job Applications Dashboard | Recruiting Platform</title>
        </Helmet>
      </HelmetProvider>

      {/* Header - Use Header component */}
      <HeaderPage />

      {/* Body */}
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Job Applications
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {applications.map((app) => (
            <Grid item xs={12} sm={6} md={4} key={app.id}>
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
                  <Typography variant="h6">
                    {app.jobOfferId}- {app.jobOfferTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Company: {app.companyId}- {app.companyName || "Unknown Company"}{" "}
                    {/* Add companyName */}
                  </Typography>
                  <Typography>
                    <hr />
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Candidate: {app.candidateFirstName} {app.candidateLastName}
                  </Typography>
                  <Typography variant="body2">Email: {app.candidateEmail}</Typography>
                  <Typography variant="body2">Phone: {app.candidatePhone}</Typography>
                  <Typography variant="body2">
                    Resume: {app.candidateResumeFile}
                  </Typography>
                  <Typography variant="body2">
                    Skills: {app.candidateSkills.join(", ")}
                  </Typography>
                  <Typography variant="body2">
                    Experience: {app.candidateExperience}
                  </Typography>
                  <Typography variant="body2">
                    Cover Letter: {app.coverLetter || "None"}
                  </Typography>
                  <Typography variant="body2">
                    {/* Applied: {new Date(app.appliedAt).toLocaleDateString()} */}
                    Applied: {new Date(app.appliedAt).toISOString().split("T")[0]}
                    {/* split('T')[0] takes the part before the T, resulting in only YYYY-MM-DD. */}
                  </Typography>
                  <Typography variant="body2">Status: {app.status}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      label="Status"
                      disabled={app.status === "WITHDRAWN"} // 🌟 Disable if status is WITHDRAWN
                    >
                      <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>{" "}
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                      <MenuItem value="INTERVIEW">Interview</MenuItem>
                      <MenuItem value="ACCEPTED">Accepted</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <FooterPage />
    </Box>
  );
};

export default RecruiterDashboard;
