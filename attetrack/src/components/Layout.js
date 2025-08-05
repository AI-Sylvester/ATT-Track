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
            <Avatar sx={{ bgcolor: '#f5f4f0ff', color: '#000' }}>A</Avatar>
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
<Paper
  elevation={10}
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 4,
    zIndex: 1200,
    boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
  }}
>
  {/* Left Group */}
  <Box sx={{ display: 'flex', gap: 4 }}>
    <IconButton
      onClick={() => handleNav('/empmaster')}
      sx={{
        color: navValue === '/empmaster' ? '#1976d2' : '#6b7280',
        transition: 'all 0.2s',
        '&:hover': {
          color: '#0d47a1',
        },
      }}
    >
      <PeopleAltRoundedIcon sx={{ fontSize: 26 }} />
    </IconButton>
    <IconButton
      onClick={() => handleNav('/summary')}
      sx={{
        color: navValue === '/summary' ? '#1976d2' : '#6b7280',
        transition: 'all 0.2s',
        '&:hover': {
          color: '#0d47a1',
        },
      }}
    >
      <PunchClockRoundedIcon sx={{ fontSize: 26 }} />
    </IconButton>
  </Box>

  {/* Center Floating FAB */}
  <Box
    sx={{
      position: 'absolute',
      top: -10,
      left: '50%',
      transform: 'translateX(-50%)',
    }}
  >
    <Fab
      onClick={() => handleNav('/home')}
      size="medium"
      sx={{
        bgcolor: '#1976d2',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
        '&:hover': {
          bgcolor: '#125399',
        },
      }}
    >
      <HomeRoundedIcon />
    </Fab>
  </Box>

  {/* Right Group */}
  <Box sx={{ display: 'flex', gap: 4 }}>
    <IconButton
      onClick={() => handleNav('/logs')}
      sx={{
        color: navValue === '/logs' ? '#1976d2' : '#6b7280',
        transition: 'all 0.2s',
        '&:hover': {
          color: '#0d47a1',
        },
      }}
    >
      <FactCheckRoundedIcon sx={{ fontSize: 26 }} />
    </IconButton>
    <IconButton
      onClick={() => handleNav('/leavelist')}
      sx={{
        color: navValue === '/leavelist' ? '#1976d2' : '#6b7280',
        transition: 'all 0.2s',
        '&:hover': {
          color: '#0d47a1',
        },
      }}
    >
      <EventNoteRoundedIcon sx={{ fontSize: 26 }} />
    </IconButton>
  </Box>
</Paper>



    </Box>
  );
};

export default Layout;
