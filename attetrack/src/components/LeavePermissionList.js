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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { apiUrl } from './config';

const FILTERS = ['Today', 'Week', 'Month', 'LastMonth'];

const LeavePermissionList = () => {
  const [records, setRecords] = useState([]);
  const [employeeList, setEmployeeList] = useState({});
  const [filter, setFilter] = useState('Today');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaveRes, empRes] = await Promise.all([
          axios.get(`${apiUrl}/leave`),
          axios.get(`${apiUrl}/employee/basic`),
        ]);

        setRecords(leaveRes.data);

        // Convert employee list to a dictionary { EmpNumber: { Name, Department } }
        const empMap = {};
        empRes.data.forEach(emp => {
          empMap[emp.EmpNumber] = { Name: emp.Name, Department: emp.Department };
        });
        setEmployeeList(empMap);
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };

    fetchData();
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
    <Box p={isMobile ? 1 : 3}>
      <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom fontWeight="bold" color="primary">
        Leave / Permission Records
      </Typography>

      <ButtonGroup
        variant="outlined"
        sx={{ mb: 2, flexWrap: 'wrap' }}
        size={isMobile ? 'small' : 'medium'}
      >
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={f === filter ? 'contained' : 'outlined'}
            onClick={() => setFilter(f)}
            sx={{ minWidth: 90, mb: isMobile ? 1 : 0 }}
          >
            {f}
          </Button>
        ))}
      </ButtonGroup>

      <Paper elevation={3} sx={{ overflow: 'auto' }}>
        {loading ? (
          <Box textAlign="center" p={3}>
            <CircularProgress />
          </Box>
        ) : getFilteredRecords().length === 0 ? (
          <Box textAlign="center" p={3}>
            <Typography>No records found.</Typography>
          </Box>
        ) : (
     <Table size="small" sx={{ minWidth: 1000, tableLayout: 'fixed' }}>
  <TableHead>
    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
     
      <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
        <b>Name</b>
      </TableCell>
      <TableCell><b>Dept</b></TableCell>
      <TableCell><b>Type</b></TableCell>
      <TableCell><b>Session</b></TableCell>
      <TableCell><b>From</b></TableCell>
      <TableCell><b>To</b></TableCell>
      <TableCell><b>Perm. Type</b></TableCell>
      <TableCell><b>Approved By</b></TableCell>
      <TableCell><b>Date</b></TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {getFilteredRecords().map((row, i) => {
      const emp = employeeList[row.EmpNumber] || {};
      return (
        <TableRow
          key={row.ID}
          sx={{
            backgroundColor: i % 2 === 0 ? '#fafafa' : 'white',
            '&:hover': { backgroundColor: '#e3f2fd' },
          }}
        >
                 <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
            {emp.Name || '-'}
          </TableCell>
          <TableCell>{emp.Department || '-'}</TableCell>
          <TableCell>{row.Type}</TableCell>
          <TableCell>{row.Session || '-'}</TableCell>
          <TableCell>{formatTime(row.FromTime)}</TableCell>
          <TableCell>{formatTime(row.ToTime)}</TableCell>
          <TableCell>{row.PermissionType || '-'}</TableCell>
          <TableCell>{row.ApprovedBy || '-'}</TableCell>
          <TableCell>{dayjs(row.EntryDate).format('DD-MM-YYYY')}</TableCell>
        </TableRow>
      );
    })}
  </TableBody>
</Table>

        )}
      </Paper>
    </Box>
  );
};

export default LeavePermissionList;
