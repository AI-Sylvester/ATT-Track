// AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './config';
import { PushNotifications } from '@capacitor/push-notifications';

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';



function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const registerDeviceToken = async (token) => {
    const empnumber = localStorage.getItem('empnumber');
    if (!empnumber) {
      console.warn('No empnumber in localStorage');
      return;
    }

    try {
      await axios.post(`${apiUrl}/auth/register-token`, {
        empnumber,
        token,
      });
      console.log('✅ Token registered on server');
    } catch (err) {
      console.error('❌ Failed to register token:', err);
    }
  };

  const getPushToken = async () => {
    try {
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive !== 'granted') {
        console.warn('🚫 Push permission not granted');
        return;
      }

      return new Promise((resolve, reject) => {
        PushNotifications.addListener('registration', async (token) => {
          console.log('✅ FCM Token:', token.value);
          await registerDeviceToken(token.value);
          resolve(token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('❌ Push registration error:', error);
          reject(error);
        });

        PushNotifications.register();
      });
    } catch (err) {
      console.error('❌ Error getting push token:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${apiUrl}${endpoint}`, {
        username,
        password,
      });

      if (response.data.message.includes('successful')) {
        alert(response.data.message);

        if (isLogin) {
          localStorage.setItem('appToken', response.data.token);
          localStorage.setItem('empnumber', username);
          await getPushToken();
          navigate('/home');
        } else {
          setIsLogin(true);
        }
      } else {
        alert(response.data.error || 'Operation failed');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error during authentication');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: '#f0f2f5' }}
    >
      <Paper
        elevation={6}
        sx={{
          width: isMobile ? '90%' : 400,
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
<Avatar
  src="/logo192.png"
  variant="square"
  sx={{
    width: 80,
    height: 80,
    mb: 2,
    mx: 'auto',
    objectFit: 'contain',
    bgcolor: 'transparent',
  }}
/>

         

        <Typography variant="h5" gutterBottom>
          {isLogin ? 'Login' : 'Register'}
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1, mb: 2 }}
        >
          {isLogin ? 'Login' : 'Register'}
        </Button>

        <Typography variant="body2">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Box
            component="span"
            sx={{
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
}

export default AuthPage;
