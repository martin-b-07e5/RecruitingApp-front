import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const HeaderPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // 🌟 State for menu
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

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

        {/* Hamburger Menu for small screens */}
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleMenuOpen}
          sx={{ display: { xs: "block", sm: "none" } }} // 🌟 Show <600px
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {/* Show user info, after login */}
          {user
            ? [
                <MenuItem key="user-info" disabled sx={{ opacity: 1 }}>
                  <Typography variant="body2">
                    {user.email} | ({user.role})
                  </Typography>
                </MenuItem>,
                user.role === "RECRUITER" && [
                  <MenuItem
                    key="create-job-offer"
                    onClick={() => handleNavigation("/job-offers/create")}
                  >
                    Create Job Offer
                  </MenuItem>,
                  <MenuItem
                    key="dashboard"
                    onClick={() => handleNavigation("/recruiter-dashboard")}
                  >
                    Dashboard
                  </MenuItem>,
                  <MenuItem
                    key="all-job-offers"
                    onClick={() => handleNavigation("/all-job-offers")}
                  >
                    All Job Offers
                  </MenuItem>,
                ],
                user.role === "CANDIDATE" && (
                  <MenuItem
                    key="candidate-dashboard"
                    onClick={() => handleNavigation("/candidate-dashboard")}
                  >
                    Dashboard
                  </MenuItem>
                ),
                <MenuItem key="sign-out" onClick={handleLogout}>
                  Sign Out
                </MenuItem>,
              ]
            : [
                <MenuItem key="signup" onClick={() => handleNavigation("/signup")}>
                  Sign Up
                </MenuItem>,
                <MenuItem key="signin" onClick={() => handleNavigation("/signin")}>
                  Sign In
                </MenuItem>,
              ]}
        </Menu>
        {/* Regular buttons for larger screens */}
        <Typography
          variant="body1"
          sx={{ mr: 2, display: { xs: "none", sm: "block" } }} // 🌟 Hide <600px
        >
          {user && `${user.email} | (${user.role})`}
        </Typography>
        {user ? (
          <>
            {user.role === "RECRUITER" && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/job-offers/create")}
                  sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }} // 🌟 Hide <600px
                >
                  Create Job Offer
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/recruiter-dashboard")}
                  sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/all-job-offers")}
                  sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
                >
                  All Job Offers
                </Button>
              </>
            )}
            {user.role === "CANDIDATE" && (
              <Button
                color="inherit"
                onClick={() => navigate("/candidate-dashboard")}
                sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
              >
                Dashboard
              </Button>
            )}
            <Button
              color="inherit"
              onClick={logout}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => navigate("/signup")}
              sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
            >
              Sign Up
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/signin")}
              sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
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
