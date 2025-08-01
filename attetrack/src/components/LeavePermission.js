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
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const LeavePermissionForm = () => {
  const [empnumber, setEmpNumber] = useState('');
  const [type, setType] = useState('');
  const [session, setSession] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [permissionType, setPermissionType] = useState('');
  const [approvedBy, setApprovedBy] = useState(localStorage.getItem('username') || '');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (fromTime) {
      const [h, m] = fromTime.split(':').map(Number);
      const start = new Date();
      start.setHours(h, m + 90);
      const hh = String(start.getHours()).padStart(2, '0');
      const mm = String(start.getMinutes()).padStart(2, '0');
      setToTime(`${hh}:${mm}`);
    }
  }, [fromTime]);

  const handleSubmit = async () => {
    if (!empnumber || !type) {
      setStatus('Please fill required fields.');
      setOpenSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.24:5000/leaverequest', {
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
      <TextField
        fullWidth
        label="Employee Number"
        value={empnumber}
        onChange={(e) => setEmpNumber(e.target.value)}
        margin="normal"
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
          <TextField
            fullWidth
            label="Approved By"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            margin="normal"
          />
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
