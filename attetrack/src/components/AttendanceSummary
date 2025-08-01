import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from './config';

function AttendanceSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${apiUrl}/punchtime/summary`)
      .then(res => setSummary(res.data))
      .catch(err => console.error('❌ Fetch summary error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Today's Attendance Summary
      </Typography>

      <Paper elevation={3} sx={{ overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Emp Number</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Check In</strong></TableCell>
                <TableCell><strong>Check Out</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.EmpNumber}</TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.CheckIn || '-'}</TableCell>
                  <TableCell>{row.CheckOut || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}

export default AttendanceSummary;
