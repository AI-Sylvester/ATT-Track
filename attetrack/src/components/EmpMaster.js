import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Checkbox, FormControlLabel,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, Grid, MenuItem
} from '@mui/material';
import { apiUrl } from './config';

export default function EmpMaster() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(initialFormState());
  const [editId, setEditId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  function initialFormState() {
    return {
      EmpNumber: '', Name: '', DOB: '', Department: '', Mobile: '', Mobile2: '',
      DOJ: '', Address: '', Designation: '', GuardianName: '', GuardianNumber: '',
      Password: '', Active: true
    };
  }

  const fetchEmployees = async () => {
    const res = await axios.get(`${apiUrl}/employee`);
    setEmployees(res.data);
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${apiUrl}/employee/departments`);
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments', err);
    }
  };

  const handleAdd = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/employee/next-empnumber`);
      setFormData({ ...initialFormState(), EmpNumber: data.nextEmpNumber.toString() });
      setEditId(null);
      setOpenDialog(true);
    } catch (err) {
      alert('Failed to fetch next EmpNumber');
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      EmpNumber: emp.EmpNumber || '',
      Name: emp.Name || '',
      DOB: emp.DOB?.slice(0, 10) || '',
      Department: emp.Department || '',
      Mobile: emp.Mobile || '',
      Mobile2: emp.Mobile2 || '',
      DOJ: emp.DOJ?.slice(0, 10) || '',
      Address: emp.Address || '',
      Designation: emp.Designation || '',
      GuardianName: emp.GuardianName || '',
      GuardianNumber: emp['G.Number'] || '',
      Password: emp.Password || '',
      Active: emp.Active ?? true,
    });
    setEditId(emp.ID);
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${apiUrl}/employee/${editId}` : `${apiUrl}/employee`;
    const method = editId ? axios.put : axios.post;

    try {
      await method(url, formData);
      setOpenDialog(false);
      setFormData(initialFormState());
      setEditId(null);
      fetchEmployees();
    } catch (err) {
      alert('❌ Error saving employee');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight="bold" color="primary.dark">
          Employee Master
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          + Add Employee
        </Button>
      </Box>

      <Paper elevation={4} sx={{ overflowX: 'auto', borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>EmpNumber</b></TableCell>
              <TableCell><b>Department</b></TableCell>
              <TableCell><b>Mobile</b></TableCell>
              <TableCell><b>Mobile2</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
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
                { label: 'Emp Number', key: 'EmpNumber' },
                { label: 'Name', key: 'Name' },
                { label: 'DOB', key: 'DOB', type: 'date' },
                { label: 'Mobile', key: 'Mobile' },
                { label: 'Mobile2', key: 'Mobile2' },
                { label: 'DOJ', key: 'DOJ', type: 'date' },
                { label: 'Address', key: 'Address' },
                { label: 'Designation', key: 'Designation' },
                { label: 'Guardian Name', key: 'GuardianName' },
                { label: 'Guardian Number', key: 'GuardianNumber' },
                { label: 'Password', key: 'Password', type: 'password' },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.key}>
                  <TextField
                    label={field.label}
                    type={field.type || 'text'}
                    fullWidth
                    value={formData[field.key]}
                    InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Department"
                  select
                  fullWidth
                  value={formData.Department}
                  onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

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
