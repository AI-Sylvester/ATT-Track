import React from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Home = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Employee Master',
      icon: <PeopleIcon fontSize="small" />,
      color: 'primary',
      path: '/empmaster',
    },
    {
      label: 'Punch Time',
      icon: <AccessTimeIcon fontSize="small" />,
      color: 'secondary',
      path: '/punch',
    },
    {
      label: 'Leave / Permission',
      icon: <EventNoteIcon fontSize="small" />,
      color: 'error',
      path: '/leave',
    },
  ];

  return (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}
    px={1}
    py={2}
    mt={8} // Push content below AppBar
  >
    <Typography
      variant="h6"
      fontWeight={600}
      sx={{
        color: '#1a202c',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        mb: 2,
      }}
      align="center"
    >
      Admin Portal
    </Typography>

    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      flexWrap="wrap"
      justifyContent="center"
      gap={2}
      width="100%"
      maxWidth={700}
    >
      {actions.map((action) => (
        <Paper
          key={action.label}
          elevation={2}
          sx={{
            width: isMobile ? '100%' : 180,
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            bgcolor: '#fff',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Button
            variant="contained"
            color={action.color}
            fullWidth
            size="small"
            onClick={() => navigate(action.path)}
            startIcon={action.icon}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 1,
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            {action.label}
          </Button>
        </Paper>
      ))}
    </Box>
  </Box>
);
};

export default Home;
