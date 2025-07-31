import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/Login';
import Home from './components/Home';
import EmpMaster from './components/EmpMaster';
import Layout from './components/Layout';
import PunchTime from './components/PunchTime';
import TodayPunches from './components/TodayAttendance';
import usePushNotifications from './components/pushnotification';

// Wrapper to provide empnumber and trigger push setup
function PushWrapper({ children }) {
  const empnumber = localStorage.getItem('empnumber'); // or adjust key if different
  usePushNotifications(empnumber);
  return children;
}

function App() {
  return (
    <Router>
      <PushWrapper>
        <Routes>
          {/* Login (no layout) */}
          <Route path="/" element={<AuthPage />} />

          {/* Routes inside Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/empmaster" element={<EmpMaster />} />
            <Route path="/punch" element={<PunchTime />} />
            <Route path="/logs" element={<TodayPunches />} />
          </Route>
        </Routes>
      </PushWrapper>
    </Router>
  );
}

export default App;
