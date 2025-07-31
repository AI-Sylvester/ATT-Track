import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from './config';

export default function TodayPunches() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/punchtime/today`)
      .then(res => setLogs(res.data))
      .catch(err => console.error('❌ Logs fetch error:', err));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Today's Punch Logs</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {logs.map((log, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#1db954' }}>
                  {log.Name?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {log.Name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Dept: {log.Department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: <strong>{log.AttendType}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time: {log.EntryTime}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
