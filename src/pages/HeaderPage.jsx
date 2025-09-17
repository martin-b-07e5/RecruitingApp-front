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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";

const BASE_API_URL = "http://localhost:8080/api";

const HeaderPage = () => {
  const { user, token ,logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // 🌟 State for menu
  const menuOpen = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // 🌟 Add success state

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError(null);
    setSuccess(false); // 🌟 Reset success
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
    setSuccess(false); // 🌟 Reset success
    if (success) {
      logout();
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      setError("❌ No authentication token found. Please log in again.");
      navigate("/signin");
      return;
    }
    try {
      await axios.delete(`${BASE_API_URL}/users/delete-self`, {
        headers: { Authorization: `Bearer ${token}` }, // 🌟 Use token
      });
      setSuccess(true); // 🌟 Set success state
      setError(null);
    } catch (error) {
      console.error("Delete account error:", error);
      setError(error.response?.data || "❌ Failed to delete account");
    }
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "secondary.main" }}>
      <Toolbar>
        <Tooltip title="Go to Home" placement="bottom-start">
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Recruiting Platform
          </Typography>
        </Tooltip>

        {error && (
          <Alert
            severity="error"
            sx={{ position: "absolute", top: 64, left: 16, right: 16 }}
          >
            {error}
          </Alert>
        )}

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
                // Delete account
                <MenuItem key="delete-account" onClick={handleOpenDialog}>
                  Delete Account
                </MenuItem>,
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
        {/* email and role */}
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
            {/* Delete account */}
            <Button
              color="inherit"
              onClick={handleOpenDialog}
              sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
            >
              Delete Account
            </Button>
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-account-dialog-title"
      >
        <DialogTitle id="delete-account-dialog-title">Delete Account</DialogTitle>
        <DialogContent>
          {success ? (
            <Alert severity="success" aria-live="polite">
              ✅ Account deleted successfully
            </Alert>
          ) : (
            <>
              <DialogContentText>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogContentText>
              {error && <Alert severity="error" aria-live="polite">{error}</Alert>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus={success}>
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button onClick={handleDeleteAccount} color="error">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default HeaderPage;
