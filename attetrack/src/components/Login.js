// AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './config';
import { PushNotifications } from '@capacitor/push-notifications';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const registerDeviceToken = async (token) => {
    const empnumber = localStorage.getItem('empnumber'); // ✅ read from localStorage
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
          localStorage.setItem('empnumber', username); // ✅ save for token registration
          await getPushToken();                         // ✅ trigger token registration
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
    <div style={styles.container}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSubmit} style={styles.button}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <p style={styles.toggle}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: 'auto',
    padding: 30,
    textAlign: 'center',
    background: '#f9f9f9',
    borderRadius: 10,
    marginTop: 100,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: 16,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  toggle: {
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default AuthPage;
