import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Tooltip } from "@mui/material";

const HeaderPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ bgcolor: "secondary.main" }}>
      {/* Header */}
      <Toolbar>
        {/* Title */}
        <Tooltip title="Go to Home" placement="bottom-start">
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Recruiting Platform
          </Typography>
        </Tooltip>

        {/* Show user info, after login */}
        {user ? (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.email} | ({user.role})
            </Typography>
            {user.role === "RECRUITER" && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/job-offers/create")}
                  sx={{ mr: 1 }}
                >
                  Create Job Offer
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/recruiter-dashboard")}
                  sx={{ mr: 1 }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/all-job-offers")} // 🌟 Add All Job Offers button
                  sx={{ mr: 1 }}
                >
                  All Job Offers
                </Button>
              </>
            )}
            <Button color="inherit" onClick={logout}>
              {/* 🌟 Use logout from AuthContext */}
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => navigate("/signup")} // 🌟 Use /register
              sx={{ mr: 1 }}
            >
              Sign Up
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/signin")} // 🌟 Use /login
              sx={{ mr: 1 }}
            >
              Sign In
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderPage;
