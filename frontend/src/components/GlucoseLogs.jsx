import React, { useEffect, useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function GlucoseLogs() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const recordLog = async () => {
    const log = { date, time, glucoseLevel };
    const response = await fetch('/api/glucose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    });
    if (response.ok) {
      console.log('Log recorded successfully');
      loadLogs();
    }
  };

  const loadLogs = async () => {
    const response = await fetch('/api/glucose');
    if (response.ok) {
      const logs = await response.json();
      setLogs(logs);
    }
  };

  const deleteLog = async (logId) => {
    const response = await fetch(`/api/glucose/${logId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('Log deleted successfully');
      loadLogs(); // Reload the logs to update the UI
    }
  };  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Glucose Log Tracker
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="date"
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="time"
            label="Time"
            type="time"
            id="time"
            InputLabelProps={{ shrink: true }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="glucoseLevel"
            label="Glucose Level (mg/dL)"
            type="number"
            id="glucoseLevel"
            value={glucoseLevel}
            onChange={(e) => setGlucoseLevel(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={recordLog}
          >
            Record Log
          </Button>
        </Box>
      </Box>
      {logs.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Glucose Level (mg/dL)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>{log.glucose_level}</TableCell>
                  <TableCell>
                    <Button onClick={() => deleteLog(log.log_id)}></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default GlucoseLogs;
