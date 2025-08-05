import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Checkbox, FormControlLabel,
  Table, TableHead, TableRow, TableCell, TableBody,Container,
  Paper, Typography, 
} from '@mui/material';
import { apiUrl } from './config';
import { Autocomplete } from '@mui/material';

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
          Add Employee
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
<DialogContent dividers>
  <Box
    component="form"
    onSubmit={handleSubmit}
    noValidate
    sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
  >
    <Container disableGutters>
      {/* Row 1 */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Emp Number"
          value={formData.EmpNumber}
          fullWidth
          InputProps={{ readOnly: true }}
          variant="outlined"
        />
        <TextField
          label="Name"
          value={formData.Name}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="DOB"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.DOB}
          onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
          fullWidth
          variant="outlined"
        />
      </Box>

      {/* Row 2 */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <TextField
          label="DOJ"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.DOJ}
          onChange={(e) => setFormData({ ...formData, DOJ: e.target.value })}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Mobile"
          value={formData.Mobile}
          onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Alternate Mobile"
          value={formData.Mobile2}
          onChange={(e) => setFormData({ ...formData, Mobile2: e.target.value })}
          fullWidth
          variant="outlined"
        />
      </Box>

      {/* Row 3 */}
<Box sx={{ width: '100%', mb: 2 }}>

        <Autocomplete
          freeSolo
          options={departments}
          value={formData.Department}
          onInputChange={(event, newValue) =>
            setFormData({ ...formData, Department: newValue })
          }
          renderInput={(params) => (
            <TextField {...params} label="Department" fullWidth variant="outlined" />
          )}
        />
        <TextField
          label="Designation"
          value={formData.Designation}
          onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Address"
          multiline
          minRows={2}
          value={formData.Address}
          onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
          fullWidth
          variant="outlined"
        />
      </Box>

      {/* Row 4 */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <TextField
          label="Guardian Name"
          value={formData.GuardianName}
          onChange={(e) => setFormData({ ...formData, GuardianName: e.target.value })}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Guardian Number"
          value={formData.GuardianNumber}
          onChange={(e) => setFormData({ ...formData, GuardianNumber: e.target.value })}
          fullWidth
          variant="outlined"
        />
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          <TextField
            label="Password"
            type="password"
            value={formData.Password}
            onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
            fullWidth
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ alignSelf: 'center' }}
          />
        </Box>
      </Box>
    </Container>
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
