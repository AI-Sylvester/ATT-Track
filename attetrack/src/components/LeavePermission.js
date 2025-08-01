import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Slider
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from './config';

const LeavePermissionForm = () => {
  const [empnumber, setEmpNumber] = useState('');
  const [empname, setEmpName] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [type, setType] = useState('');
  const [session, setSession] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [duration, setDuration] = useState(90);
  const [toTime, setToTime] = useState('');
  const [permissionType, setPermissionType] = useState('');
  const approvedBy = localStorage.getItem('username') || '';
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch employee list on load
  useEffect(() => {
    axios.get(`${apiUrl}/employee/basic`)
      .then(res => setEmployeeList(res.data))
      .catch(err => console.error('Failed to load employee list:', err));
  }, []);

  // Set employee name when number changes
  useEffect(() => {
    const selected = employeeList.find(e => e.EmpNumber === empnumber);
    setEmpName(selected ? selected.Name : '');
  }, [empnumber, employeeList]);

  // Auto-calculate To Time
  useEffect(() => {
    if (fromTime && duration) {
      const [h, m] = fromTime.split(':').map(Number);
      const start = new Date();
      start.setHours(h);
      start.setMinutes(m + duration);
      const hh = String(start.getHours()).padStart(2, '0');
      const mm = String(start.getMinutes()).padStart(2, '0');
      setToTime(`${hh}:${mm}`);
    }
  }, [fromTime, duration]);

  const handleSubmit = async () => {
    if (!empnumber || !type) {
      setStatus('Please fill required fields.');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/leave`, {
        empnumber,
        type,
        session,
        fromTime,
        toTime,
        permissionType,
        approvedBy
      });
      setStatus(res.data.message || 'Request submitted');
      setEmpNumber('');
      setType('');
      setSession('');
      setFromTime('');
      setToTime('');
      setPermissionType('');
      setOpenSnackbar(true);
    } catch (err) {
      setStatus('❌ Error: ' + (err.response?.data?.error || 'Failed to submit.'));
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Leave / Permission Form
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="emp-label">Employee Number</InputLabel>
        <Select
          labelId="emp-label"
          value={empnumber}
          label="Employee Number"
          onChange={(e) => setEmpNumber(e.target.value)}
        >
          {employeeList.map(emp => (
            <MenuItem key={emp.EmpNumber} value={emp.EmpNumber}>
              {emp.EmpNumber} - {emp.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Employee Name"
        value={empname}
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Leave">Leave</MenuItem>
          <MenuItem value="Permission">Permission</MenuItem>
        </Select>
      </FormControl>

      {type === 'Leave' && (
        <TextField
          select
          label="Session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          fullWidth
          margin="normal"
        >
           <MenuItem value="Full">Full</MenuItem>
          <MenuItem value="Morning">Morning</MenuItem>
          <MenuItem value="Evening">Evening</MenuItem>
        </TextField>
      )}

      {type === 'Permission' && (
        <>
          <TextField
            fullWidth
            label="From Time"
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box mt={2}>
            <Typography gutterBottom>
              Duration: {duration} minutes
            </Typography>
            <Slider
              value={duration}
              onChange={(e, newValue) => setDuration(newValue)}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={10}
              max={90}
            />
          </Box>

          <TextField
            fullWidth
            label="To Time (auto)"
            value={toTime}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Permission Type"
            value={permissionType}
            onChange={(e) => setPermissionType(e.target.value)}
            margin="normal"
          >
            <MenuItem value="OD">OD</MenuItem>
            <MenuItem value="Own">Own</MenuItem>
          </TextField>
        </>
      )}

      <Box mt={2}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="info" variant="filled">
          {status}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeavePermissionForm;
