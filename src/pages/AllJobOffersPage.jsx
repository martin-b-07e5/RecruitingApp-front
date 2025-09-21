import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { Container, Typography, Box, Card, CardContent, Grid } from "@mui/material";
import HeaderPage from "./HeaderPage";
import FooterPage from "./FooterPage";

// const BASE_API_URL = "http://localhost:8080/api";
const BASE_API_URL = "http://localhost:8085/api";

// 🌟 New page to display all job offers
const AllJobOffersPage = () => {
  const { token } = useContext(AuthContext);
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/job-offers/getAllJobOffers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobOffers(response.data || []);
      } catch (error) {
        console.error("Fetch job offers error: ", error);
        setError(error.response?.data || "❌ Failed to fetch job offers");
      }
    };
    fetchJobOffers();
  }, [token]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} pt={6}>
      <HeaderPage />
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom>
          All Job Offers
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {jobOffers.map((job) => (
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

export default AllJobOffersPage;
