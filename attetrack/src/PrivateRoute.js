import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = () => {
  const token = localStorage.getItem('appToken');
  if (!token || token.split('.').length !== 3) {
    console.warn('Invalid token format');
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (err) {
    console.error('Invalid token', err);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
