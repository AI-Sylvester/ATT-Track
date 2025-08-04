import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Stack,
  Chip,
  TextField,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from './config';

function TodayPunches() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(`${apiUrl}/punchtime/today`)
      .then((res) => setLogs(res.data))
      .catch((err) => console.error('❌ Logs fetch error:', err));
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.Name?.toLowerCase().includes(search.toLowerCase()) ||
    log.Empnumber?.toLowerCase().includes(search.toLowerCase())
  );

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
        Today’s Punch Logs
      </Typography>

      <TextField
        fullWidth
        size="small"
        label="Search Name or Emp#"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        <List dense sx={{ width: '100%' }}>
          {filteredLogs.map((log, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 1.2,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#f9f9f9',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: '#1976d2',
                      width: 38,
                      height: 38,
                      fontSize: 16,
                    }}
                  >
                    {log.Name?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={600}>
                      {log.Name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {log.Empnumber} | {log.Department}
                    </Typography>
                  }
                />

                <Stack spacing={0.7} alignItems="flex-end" sx={{ minWidth: 90 }}>
                  <Chip
                    label={log.AttendType.toUpperCase()}
                    color={log.AttendType === 'CheckIn' ? 'success' : 'error'}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      height: 24,
                      textTransform: 'uppercase',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: '#6b7280', fontSize: '0.72rem' }}
                  >
                    {log.EntryTime}
                  </Typography>
                </Stack>
              </ListItem>
              {index < filteredLogs.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}

          {filteredLogs.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ py: 3 }}
            >
              No records found.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default TodayPunches;
