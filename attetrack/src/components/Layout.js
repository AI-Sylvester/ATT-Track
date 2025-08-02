import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Paper,
  Box,
  Fab,
} from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PunchClockRoundedIcon from '@mui/icons-material/PunchClockRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [navValue, setNavValue] = useState(location.pathname);

  useEffect(() => {
    setNavValue(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
   localStorage.removeItem('appToken');
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Top AppBar */}
      <AppBar position="fixed" elevation={1} sx={{ bgcolor: '#1c1c1c', color: '#f5f5f5' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 500 }}>
            AttendanceTrack
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: '#f7e600', color: '#000' }}>A</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ mt: 8, px: 2 }}>
        <Outlet />
      </Box>

      {/* Floating Bottom Navigation */}
    <Paper
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 5,
    borderTop: '1px solid #e0e0e0',
    zIndex: 1000,
    boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.08)',
    transition: 'background 0.3s ease',
  }}
  elevation={6}
>
  {/* Left Icons */}
  <Box sx={{ display: 'flex', gap: 3 }}>
    <IconButton
      onClick={() => handleNav('/empmaster')}
      sx={{
        position: 'relative',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'scale(1.15)' },
      }}
    >
      <PeopleAltRoundedIcon
        sx={{
          color: navValue === '/empmaster' ? '#1976d2' : '#777',
          fontSize: 28,
          transition: 'color 0.3s ease',
        }}
      />
    </IconButton>
    <IconButton
      onClick={() => handleNav('/summary')}
      sx={{
        position: 'relative',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'scale(1.15)' },
      }}
    >
      <PunchClockRoundedIcon
        sx={{
          color: navValue === '/summary' ? '#1976d2' : '#777',
          fontSize: 28,
          transition: 'color 0.3s ease',
        }}
      />
    </IconButton>
  </Box>

  {/* Center FAB (Home) */}
  <Fab
    color="primary"
    onClick={() => handleNav('/home')}
    sx={{
      position: 'absolute',
      top: -30,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1100,
      bgcolor: '#1976d2',
      boxShadow: '0 8px 18px rgba(25, 118, 210, 0.5)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        bgcolor: '#125399',
        transform: 'translateX(-50%) scale(1.1)',
        boxShadow: '0 10px 25px rgba(25, 118, 210, 0.8)',
      },
    }}
  >
    <HomeRoundedIcon />
  </Fab>

  {/* Right Icons */}
  <Box sx={{ display: 'flex', gap: 3 }}>
    <IconButton
      onClick={() => handleNav('/logs')}
      sx={{
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'scale(1.15)' },
      }}
    >
      <FactCheckRoundedIcon
        sx={{
          color: navValue === '/logs' ? '#1976d2' : '#777',
          fontSize: 28,
          transition: 'color 0.3s ease',
        }}
      />
    </IconButton>
    <IconButton
      onClick={() => handleNav('/leavelist')}
      sx={{
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'scale(1.15)' },
      }}
    >
      <EventNoteRoundedIcon
        sx={{
          color: navValue === '/leavelist' ? '#1976d2' : '#777',
          fontSize: 28,
          transition: 'color 0.3s ease',
        }}
      />
    </IconButton>
  </Box>
</Paper>

    </Box>
  );
};

export default Layout;
