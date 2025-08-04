import React from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  Paper,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Home = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const theme = useTheme();
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Employee Master',
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      color: 'primary',
      path: '/empmaster',
    },
    {
      label: 'Punch Time',
      icon: <AccessTimeIcon sx={{ fontSize: 28 }} />,
      color: 'secondary',
      path: '/punch',
    },
    {
      label: 'Leave / Permission',
      icon: <EventNoteIcon sx={{ fontSize: 28 }} />,
      color: 'error',
      path: '/leave',
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
        paddingTop: theme.spacing(10),
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          color: '#1a202c',
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          mb: 3,
        }}
        align="center"
      >
        Admin Portal
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))'}
        gap={3}
        width="100%"
        maxWidth={720}
      >
        {actions.map((action) => (
          <Paper
            key={action.label}
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 3,
              bgcolor: '#ffffff',
              transition: 'transform 0.2s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              },
            }}
          >
            <Box mb={1}>{action.icon}</Box>
            <Button
              variant="contained"
              color={action.color}
              fullWidth
              size="medium"
              onClick={() => navigate(action.path)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
                py: 1,
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
