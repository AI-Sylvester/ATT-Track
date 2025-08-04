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
        case 'Today': return date.isSame(today, 'day');
        case 'Week': return date.isSame(today, 'week');
        case 'Month': return date.isSame(today, 'month');
        case 'LastMonth': return date.isSame(today.subtract(1, 'month'), 'month');
        default: return true;
      }
    });
  };

  return (
    <Box p={isMobile ? 1.5 : 4}>
      <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600} color="primary" gutterBottom>
        Leave / Permission Records
      </Typography>

      <ButtonGroup
        variant="outlined"
        sx={{ mb: 3, flexWrap: 'wrap' }}
        size={isMobile ? 'small' : 'medium'}
      >
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={f === filter ? 'contained' : 'outlined'}
            onClick={() => setFilter(f)}
            sx={{ minWidth: 100, mb: isMobile ? 1 : 0, textTransform: 'capitalize' }}
          >
            {f}
          </Button>
        ))}
      </ButtonGroup>

      <Paper elevation={4} sx={{ overflow: 'auto', borderRadius: 2 }}>
        {loading ? (
          <Box textAlign="center" p={4}>
            <CircularProgress />
          </Box>
        ) : getFilteredRecords().length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography variant="body1">No records found.</Typography>
          </Box>
        ) : (
          <Table size="small" sx={{ minWidth: 1000, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell
                  sx={{
                    position: 'sticky',
                    left: 0,
                    backgroundColor: '#e3f2fd',
                    zIndex: 1,
                    fontWeight: 600,
                  }}
                >
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dept</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Session</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Perm. Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Approved By</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
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
                      '&:hover': { backgroundColor: '#f0f7ff' },
                    }}
                  >
                    <TableCell
                      sx={{
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#fff',
                        zIndex: 1,
                        fontWeight: 500,
                      }}
                    >
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
