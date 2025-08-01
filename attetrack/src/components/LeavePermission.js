import React, { useState, useEffect } from 'react';
import {
  Box, Button, MenuItem, TextField, FormControl, InputLabel,
  Select, Typography, Snackbar, Alert, CircularProgress, Slider,
  RadioGroup, FormControlLabel, Radio, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from './config';


const getCurrentTime = () => {
  const now = new Date();
  let minutes = now.getMinutes();
  const remainder = minutes % 5;

  // Round to nearest 5
  if (remainder < 3) {
    minutes -= remainder;
  } else {
    minutes += (5 - remainder);
  }

  // Adjust hour if minutes go over 59
  if (minutes >= 60) {
    now.setHours(now.getHours() + 1);
    minutes = 0;
  }

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
};
const LeavePermissionForm = () => {
  const [empnumber, setEmpNumber] = useState('');
  const [empname, setEmpName] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [type, setType] = useState('');
  const [session, setSession] = useState('');
   const [fromTime, setFromTime] = useState(getCurrentTime());
  const [duration, setDuration] = useState(90);
  const [manualDuration, setManualDuration] = useState('');
  const [toTime, setToTime] = useState('');
  const [permissionType, setPermissionType] = useState('');
  const approvedBy = localStorage.getItem('username') || '';
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // Confirmation dialog state

  useEffect(() => {
    axios.get(`${apiUrl}/employee/basic`)
      .then(res => setEmployeeList(res.data))
      .catch(err => console.error('Failed to load employee list:', err));
  }, []);

  useEffect(() => {
    const selected = employeeList.find(e => e.EmpNumber === empnumber);
    setEmpName(selected ? selected.Name : '');
  }, [empnumber, employeeList]);

  useEffect(() => {
    const effectiveDuration = manualDuration ? parseInt(manualDuration, 10) : duration;
    if (fromTime && effectiveDuration) {
      const [h, m] = fromTime.split(':').map(Number);
      const start = new Date();
      start.setHours(h);
      start.setMinutes(m + effectiveDuration);
      const hh = String(start.getHours()).padStart(2, '0');
      const mm = String(start.getMinutes()).padStart(2, '0');
      setToTime(`${hh}:${mm}`);
    }
  }, [fromTime, duration, manualDuration]);

  const handleSubmit = async () => {
    setConfirmOpen(false); // Close dialog
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
      setFromTime(getCurrentTime());
      setToTime('');
      setPermissionType('');
      setManualDuration('');
      setOpenSnackbar(true);
    } catch (err) {
      setStatus('❌ Error: ' + (err.response?.data?.error || 'Failed to submit.'));
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  const confirmDetails = () => {
    if (!empnumber || !type) {
      setStatus('Please fill required fields.');
      setOpenSnackbar(true);
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Leave / Permission Form</Typography>

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

     <FormControl component="fieldset" margin="normal">
  <Typography variant="subtitle1">Type</Typography>
  <RadioGroup
    row
    value={type}
    onChange={(e) => setType(e.target.value)}
    sx={{ display: 'flex', justifyContent: 'space-between' }}
  >
    <FormControlLabel
      value="Leave"
      control={<Radio />}
      label="Leave"
      sx={{ flex: 1, maxWidth: '50%' }}
    />
    <FormControlLabel
      value="Permission"
      control={<Radio />}
      label="Permission"
      sx={{ flex: 1, maxWidth: '50%' }}
    />
  </RadioGroup>
</FormControl>

  {type === 'Leave' && (
  <FormControl component="fieldset" margin="normal">
    <Typography variant="subtitle1" gutterBottom>Session</Typography>
    <RadioGroup
      row
      value={session}
      onChange={(e) => setSession(e.target.value)}
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <FormControlLabel
        value="Full"
        control={<Radio />}
        label="Full"
        sx={{ flex: 1, maxWidth: '33.33%' }}
      />
      <FormControlLabel
        value="Morning"
        control={<Radio />}
        label="Morning"
        sx={{ flex: 1, maxWidth: '33.33%' }}
      />
      <FormControlLabel
        value="Afternoon"
        control={<Radio />}
        label="A.Noon"
        sx={{ flex: 1, maxWidth: '33.33%' }}
      />
    </RadioGroup>
  </FormControl>
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

          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <TextField
              label="Manual Duration (min)"
              value={manualDuration}
              onChange={(e) => setManualDuration(e.target.value)}
              inputProps={{ type: 'number', min: 10, max: 90 }}
              helperText="Overrides slider"
              sx={{ width: '150px' }}
            />

            <Box flexGrow={1}>
              <Typography variant="body2" gutterBottom>
                Duration: {manualDuration || duration} minutes
              </Typography>
              <Slider
                value={duration}
                onChange={(e, newVal) => setDuration(newVal)}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={10}
                max={90}
                disabled={!!manualDuration}
              />
            </Box>
          </Box>

          <TextField
            fullWidth
            label="To Time (auto)"
            value={toTime}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

        <FormControl component="fieldset" margin="normal">
  <Typography variant="subtitle1">Permission Type</Typography>
  <RadioGroup
    row
    value={permissionType}
    onChange={(e) => setPermissionType(e.target.value)}
    sx={{ display: 'flex', justifyContent: 'space-between' }}
  >
    <FormControlLabel
      value="OD"
      control={<Radio />}
      label="OD"
      sx={{ flex: 1, maxWidth: '50%' }}
    />
    <FormControlLabel
      value="Own"
      control={<Radio />}
      label="Own"
      sx={{ flex: 1, maxWidth: '50%' }}
    />
  </RadioGroup>
</FormControl>
        </>
      )}

      <Box mt={2}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={confirmDetails}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>

      {/* Snackbar for status */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="info" variant="filled">{status}</Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Emp No:</strong> {empnumber}<br />
            <strong>Name:</strong> {empname}<br />
            <strong>Type:</strong> {type}<br />
            {type === 'Leave' && <><strong>Session:</strong> {session}<br /></>}
            {type === 'Permission' && (
              <>
                <strong>From:</strong> {fromTime}<br />
                <strong>To:</strong> {toTime}<br />
                <strong>Permission Type:</strong> {permissionType}<br />
              </>
            )}
         
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeavePermissionForm;
