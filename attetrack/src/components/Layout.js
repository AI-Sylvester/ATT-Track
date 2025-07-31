// src/Layout.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';

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
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavChange = (event, newValue) => {
    if (newValue === 'logout') {
      handleLogout();
    } else {
      navigate(newValue);
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ bgcolor: '#f7e600', color: '#000' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: "'Cinzel', serif" }}>
            Attendance
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: '#0a151f', width: 32, height: 32 }}>A</Avatar>
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

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid #ccc',
        }}
        elevation={8}
      >
        <BottomNavigation value={navValue} onChange={handleNavChange} showLabels>
          <BottomNavigationAction label="Home" value="/home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Emp Master" value="/empmaster" icon={<GroupsIcon />} />
            <BottomNavigationAction label="Punch Time" value="/punch" icon={<GroupsIcon />} />
          <BottomNavigationAction label="Attendance" value="/logs" icon={<LogoutIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;
