import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import HeaderPage from "./HeaderPage";
import FooterPage from "./FooterPage";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

const BASE_API_URL = "http://localhost:8080/api";

const CandidateDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.role !== "CANDIDATE") {
        setError("❌ You must be a candidate to view this dashboard");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_API_URL}/job-applications/getCandidateJobApplications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(response.data || []);
      } catch (error) {
        console.error("Fetch applications error:", error);
        if (error.response?.status === 401) {
          setError("❌ You must be a candidate to view this dashboard");
          navigate("/login");
        } else {
          setError(error.response?.data || "❌ Failed to fetch applications");
        }
      }
    };

    fetchApplications();
  }, [user, token, navigate]);

  const handleWithdraw = async (applicationId) => {
    try {
      await axios.delete(
        `${BASE_API_URL}/job-applications/withdrawApplication/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError(null);
      alert("✅ Application withdrawn successfully");
      setApplications(applications.filter((app) => app.id !== applicationId));
    } catch (error) {
      console.error("Withdraw application error: ", error);
      setError(error.response?.data || "❌ Failed to withdraw application");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} pt={6}>
      <HelmetProvider>
        <Helmet>
          <title>Candidate Dashboard | Recruiting Platform</title>
        </Helmet>
      </HelmetProvider>

      {/* Header */}
      <HeaderPage />

      <Container maxWidth={false} sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" align="center" gutterBottom>
          Job Applications
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {/* grid */}
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {applications.length === 0 ? (
            <Typography variant="body1">No applications found.</Typography>
          ) : (
            applications.map((app) => (
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
                      {app.jobOfferId}- {app.jobOfferTitle || "Unknown Job"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {app.companyId}- {app.companyName || "Unknown Company"}
                    </Typography>
                    <Typography variant="body2">Status: {app.status}</Typography>
                    <Typography variant="body2">
                      {/* Applied: {new Date(app.appliedAt).toLocaleDateString()} */}
                      Applied: {new Date(app.appliedAt).toISOString().split("T")[0]}
                      {/* split('T')[0] takes the part before the T, resulting in only YYYY-MM-DD. */}
                    </Typography>

                    <Typography>&nbsp;</Typography>
                    <Typography>Recruiter: {app.recruiterId}- {app.recruiterFirstName} {app.recruiterLastName}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleWithdraw(app.id)}
                      disabled={app.status !== "PENDING"}
                    >
                      Withdraw
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Footer */}
      <FooterPage />
    </Box>
  );
};

export default CandidateDashboard;
