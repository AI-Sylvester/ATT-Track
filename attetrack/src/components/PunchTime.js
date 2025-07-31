import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import { apiUrl } from './config';

export default function PunchTime() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    axios.get(`${apiUrl}/employee/basic`)
      .then(res => setEmployees(res.data))
      .catch(err => console.error('❌ Employee fetch error:', err));
  }, []);

  useEffect(() => {
    const emp = employees.find(e => e.EmpNumber === selectedEmp);
    if (emp) {
      setName(emp.Name);
      setDepartment(emp.Department);
    } else {
      setName('');
      setDepartment('');
    }
  }, [selectedEmp, employees]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          setLocation(loc);
        },
        (err) => {
          console.error('⛔ Location error:', err);
          setLocation('Unavailable');
        }
      );
    }
  }, []);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedEmp || !image || !location) {
      setStatus('Please fill all fields and take a photo.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/punchtime`, {
        empnumber: selectedEmp,
        location,
        image
      });

      setStatus(res.data.message || '✅ Punch successful');
      setOpenSnackbar(true);

      // Reset fields
      setSelectedEmp('');
      setName('');
      setDepartment('');
      setImage('');
    } catch (err) {
      setStatus('❌ Error: ' + (err.response?.data?.error || 'Failed to punch.'));
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Punch Time</Typography>

      <TextField
        fullWidth
        select
        label="Employee Number"
        value={selectedEmp}
        onChange={(e) => setSelectedEmp(e.target.value)}
        margin="normal"
      >
        {employees.map((emp) => (
          <MenuItem key={emp.EmpNumber} value={emp.EmpNumber}>
            {emp.EmpNumber}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Name"
        value={name}
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <TextField
        fullWidth
        label="Department"
        value={department}
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <TextField
        fullWidth
        label="Location"
        value={location}
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <Paper sx={{ p: 2, mt: 2, textAlign: 'center' }}>
        {image && (
          <img
            src={image}
            alt="Preview"
            style={{ width: '100%', maxHeight: 250, objectFit: 'contain' }}
          />
        )}
        <Button
          component="label"
          variant="contained"
          startIcon={<PhotoCamera />}
          sx={{ mt: 1 }}
        >
          Capture Photo
          <input
            hidden
            accept="image/*"
            capture="environment"
            type="file"
            onChange={handleCapture}
          />
        </Button>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit Punch'}
      </Button>

      {status && (
        <Typography sx={{ mt: 2, color: status.includes('✅') ? 'green' : 'red' }}>
          {status}
        </Typography>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Punch recorded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
