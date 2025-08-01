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
  TextField
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from './config';

function TodayPunches() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${apiUrl}/punchtime/today`)
      .then(res => setLogs(res.data))
      .catch(err => console.error('❌ Logs fetch error:', err));
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.Name?.toLowerCase().includes(search.toLowerCase()) ||
    log.Empnumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Today's Punch Logs
      </Typography>

      <TextField
        fullWidth
        size="small"
        label="Search Name or Emp#"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1 }}
      />

      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {filteredLogs.map((log, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#1db954', width: 32, height: 32, fontSize: 14 }}>
                  {log.Name?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="bold">
                    {log.Name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                 {log.Empnumber} |  {log.Department}
                  </Typography>
                }
              />

              <Stack spacing={0.5} alignItems="flex-end" sx={{ minWidth: 80 }}>
                <Chip
                  label={log.AttendType}
                  color={log.AttendType === 'CheckIn' ? 'success' : 'primary'}
                  size="small"
                  sx={{ fontSize: '0.65rem', height: 22 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {log.EntryTime}
                </Typography>
              </Stack>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default TodayPunches;
