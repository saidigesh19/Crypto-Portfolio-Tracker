import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import logo from '../assets/react.svg';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../App';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const colorMode = useContext(ColorModeContext);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // clear local storage and navigate to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    handleClose();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(6px)',
        background: 'linear-gradient(90deg, rgba(6,12,28,0.9), rgba(8,16,36,0.85))',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 12px 28px rgba(2,6,23,0.6)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="logo" style={{ width: 34, height: 34, borderRadius: 8 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 0.3, color: '#e6eef8' }}>
            Crypto Tracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Toggle theme">
            <IconButton onClick={() => { colorMode?.toggleColorMode(); }} color="inherit">
              {colorMode?.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleOpen} aria-controls="profile-menu" aria-haspopup="true">
            <Avatar src={logo} alt="profile" sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.06)' }} />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
