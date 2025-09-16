import { Box, Typography } from "@mui/material";

const FooterPage = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 2, bgcolor: "grey.200", textAlign: "center", color: "text.secondary" }}
    >
      <Typography variant="body2">
        © 2025 Recruiting Platform. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FooterPage;
