import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,Grid,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from '@mui/material';
import { apiUrl } from './config';

export default function EmpMaster() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    EmpNumber: '', Name: '', DOB: '', Department: '', Mobile: '', Mobile2: '',
    DOJ: '', Address: '', Designation: '', GuardianName: '', GuardianNumber: '',
    Password: '', Active: true
  });
  const [editId, setEditId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchEmployees = async () => {
    const res = await axios.get(`${apiUrl}/employee`);
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${apiUrl}/employee/${editId}`
      : `${apiUrl}/employee`;

    const method = editId ? axios.put : axios.post;

    await method(url, formData);
    setFormData({
      EmpNumber: '', Name: '', DOB: '', Department: '', Mobile: '', Mobile2: '',
      DOJ: '', Address: '', Designation: '', GuardianName: '', GuardianNumber: '',
      Password: '', Active: true
    });
    setEditId(null);
    setOpenDialog(false);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
setFormData({
  EmpNumber: emp.EmpNumber || '',
  Name: emp.Name || '',
  DOB: emp.DOB || '',
  Department: emp.Department || '',
  Mobile: emp.Mobile || '',
  Mobile2: emp.Mobile2 || '',
  DOJ: emp.DOJ || '',
  Address: emp.Address || '',
  Designation: emp.Designation || '',
  GuardianName: emp.GuardianName || '',
  GuardianNumber: emp["G.Number"] || '',  // 🟢 FIX HERE
  Password: emp.Password || '',
  Active: emp.Active ?? true,
});
    setEditId(emp.ID);
    setOpenDialog(true);
  };

 const handleAdd = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/employee/next-empnumber`);
    setFormData({
      EmpNumber: data.nextEmpNumber.toString(),
      Name: '', DOB: '', Department: '', Mobile: '', Mobile2: '',
      DOJ: '', Address: '', Designation: '', GuardianName: '', GuardianNumber: '',
      Password: '', Active: true
    });
    setEditId(null);
    setOpenDialog(true);
  } catch (err) {
    console.error('Failed to fetch next EmpNumber', err);
    alert('Failed to fetch next EmpNumber');
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
   <Box p={2}>
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
    <Typography variant="h5">Employee Master</Typography>
    <Button variant="contained" color="primary" onClick={handleAdd}>
      Add Employee
    </Button>
  </Box>

  <Paper elevation={3} sx={{ overflowX: 'auto' }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>EmpNumber</TableCell>
          <TableCell>Department</TableCell>
          <TableCell>Mobile</TableCell>
          <TableCell>Mobile2</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.ID}>
            <TableCell>{emp.Name}</TableCell>
            <TableCell>{emp.EmpNumber}</TableCell>
            <TableCell>{emp.Department}</TableCell>
            <TableCell>{emp.Mobile}</TableCell>
            <TableCell>{emp.Mobile2}</TableCell>
            <TableCell>
              <Button variant="outlined" size="small" onClick={() => handleEdit(emp)}>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>

  <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
    <DialogTitle>{editId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
    <DialogContent>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {[
            { label: 'EmpNumber', value: formData.EmpNumber, key: 'EmpNumber' },
            { label: 'Name', value: formData.Name, key: 'Name' },
            { label: 'DOB', value: formData.DOB, key: 'DOB', type: 'date' },
            { label: 'Department', value: formData.Department, key: 'Department' },
            { label: 'Mobile', value: formData.Mobile, key: 'Mobile' },
            { label: 'Mobile2', value: formData.Mobile2, key: 'Mobile2' },
            { label: 'DOJ', value: formData.DOJ, key: 'DOJ', type: 'date' },
            { label: 'Address', value: formData.Address, key: 'Address' },
            { label: 'Designation', value: formData.Designation, key: 'Designation' },
            { label: 'Guardian Name', value: formData.GuardianName, key: 'GuardianName' },
            { label: 'Guardian Number', value: formData.GuardianNumber, key: 'GuardianNumber' },
            { label: 'Password', value: formData.Password, key: 'Password', type: 'password' },
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <TextField
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                value={field.value}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.Active}
                  onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        {editId ? 'Update' : 'Save'}
      </Button>
    </DialogActions>
  </Dialog>
</Box>

  );
}

