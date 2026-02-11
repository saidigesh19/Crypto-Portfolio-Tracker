import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getCookie, deleteCookie } from '../utils/cookies';

// Accepts hideAddHolding prop to optionally hide the Add Holding button
const Header = ({ actionSlot, hideAddHolding }) => {
  // Get user name from localStorage or cookies
  let userName = "";
  try {
    let user = localStorage.getItem("user");
    if (!user) {
      const cookieUser = getCookie("user");
      if (cookieUser) user = cookieUser;
    }
    if (user) {
      if (typeof user === "string") user = JSON.parse(user);
      userName = user?.name || "";
      // Capitalize first letter of each word
      userName = userName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  } catch {}
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Open user menu
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close user menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle user logout: clear storage/cookies and redirect
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    deleteCookie("token");
    deleteCookie("user");
    deleteCookie("userId");
    handleClose();
    navigate("/");
  };

  // Render app bar with user info and menu
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(6px)",
        background: "linear-gradient(90deg, rgba(6,12,28,0.9), rgba(8,16,36,0.85))",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 12px 28px rgba(2,6,23,0.6)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TimelineIcon
            alt="logo"
            style={{ width: 34, height: 34, borderRadius: 8 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.3,
              color: "#e6eef8",
            }}
          >
            Crypto Tracker
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Show Add Holding button unless hidden by prop */}
          {!hideAddHolding && (
            <Box sx={{ mr: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate("/add-holding")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add Holding
              </Button>
            </Box>
          )}
          <IconButton
            onClick={handleOpen}
            aria-controls="profile-menu"
            aria-haspopup="true"
          >
            <Avatar
              src={AccountCircleIcon}
              alt="profile"
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(255,255,255,0.06)",
              }}
            />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {userName && (
              <Box sx={{ px: 2, py: 1, fontWeight: 600, color: '#6366f1', textAlign: 'center' }}>
                {userName}
              </Box>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
