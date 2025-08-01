// src/pages/Home.js
import React from 'react';
import { Button, Box, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      padding={2}
      gap={4}
    >
      <Typography variant={isMobile ? 'h5' : 'h3'} fontWeight="bold" textAlign="center">
        Welcome
      </Typography>

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={isMobile ? 2 : 4}
        width="100%"
        maxWidth={400}
      >
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/empmaster')}
        >
          Employee Master
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/summary')} // optional page
        >
          Attendance
        </Button>
      </Box>
    </Box>
  );
}
