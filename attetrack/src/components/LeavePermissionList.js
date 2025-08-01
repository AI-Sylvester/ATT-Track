import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  ButtonGroup,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { apiUrl } from './config';

const FILTERS = ['Today', 'Week', 'Month', 'LastMonth'];

const LeavePermissionList = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('Today');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/leave`);
        setRecords(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };

    fetchRecords();
  }, []);

  const formatTime = (t) => (t ? t.slice(0, 5) : '-');

  const getFilteredRecords = () => {
    const today = dayjs();

    return records.filter((r) => {
      const date = dayjs(r.EntryDate);
      switch (filter) {
        case 'Today':
          return date.isSame(today, 'day');
        case 'Week':
          return date.isSame(today, 'week');
        case 'Month':
          return date.isSame(today, 'month');
        case 'LastMonth':
          return date.isSame(today.subtract(1, 'month'), 'month');
        default:
          return true;
      }
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Leave / Permission Requests
      </Typography>

      <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={f === filter ? 'contained' : 'outlined'}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </ButtonGroup>

      <Paper>
        {loading ? (
          <Box textAlign="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Emp Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Session</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Perm. Type</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredRecords().map((row) => (
                <TableRow key={row.ID}>
                  <TableCell>{row.EmpNumber}</TableCell>
                  <TableCell>{row.Type}</TableCell>
                  <TableCell>{row.Session || '-'}</TableCell>
                  <TableCell>{formatTime(row.FromTime)}</TableCell>
                  <TableCell>{formatTime(row.ToTime)}</TableCell>
                  <TableCell>{row.PermissionType || '-'}</TableCell>
                  <TableCell>{row.ApprovedBy || '-'}</TableCell>
                  <TableCell>
                    {dayjs(row.EntryDate).format('DD-MM-YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default LeavePermissionList;
