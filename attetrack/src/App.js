import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/Login';
import Home from './components/Home';
import EmpMaster from './components/EmpMaster';
import Layout from './components/Layout';
import PunchTime from './components/PunchTime';
import TodayPunches from './components/TodayAttendance';
import usePushNotifications from './components/pushnotification';
import AttendanceSummary from './components/AttendanceSummary';
import LeavePermissionForm from './components/LeavePermission';
import LeavePermissionList from './components/LeavePermissionList';
import PrivateRoute from './PrivateRoute'; // ✅ Import your wrapper

function App() {
  usePushNotifications(); // ✅ Optional

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected Routes inside Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/empmaster" element={<EmpMaster />} />
          <Route path="/punch" element={<PunchTime />} />
          <Route path="/logs" element={<TodayPunches />} />
          <Route path="/summary" element={<AttendanceSummary />} />
          <Route path="/leave" element={<LeavePermissionForm />} />
          <Route path="/leavelist" element={<LeavePermissionList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;