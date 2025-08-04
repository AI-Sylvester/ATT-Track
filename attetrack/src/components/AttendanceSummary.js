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
    axios
      .get(`${apiUrl}/punchtime/summary`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error('❌ Fetch summary error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          mb: 2,
          color: '#1a202c',
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          borderBottom: '2px solid #1976d2',
          display: 'inline-block',
          pb: 0.5,
        }}
      >
        Today’s Attendance Summary
      </Typography>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflowX: 'auto',
          p: 0,
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Emp Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Check In</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Check Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <TableCell>{row.EmpNumber}</TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell sx={{ color: row.CheckIn ? '#388e3c' : '#888' }}>
                    {row.CheckIn || '-'}
                  </TableCell>
                  <TableCell sx={{ color: row.CheckOut ? '#d32f2f' : '#888' }}>
                    {row.CheckOut || '-'}
                  </TableCell>
                </TableRow>
              ))}
              {summary.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#888' }}>
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}

export default AttendanceSummary;
