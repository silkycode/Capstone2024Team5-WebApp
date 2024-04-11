import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CssBaseline, TextField, Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon} from '@mui/icons-material';

function GlucoseLogs() {
  const [dateTime, setDateTime] = useState('');
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [logs, setLogs] = useState([]);

  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const fetchLogs = async () => {
    const response = await fetch('http://127.0.0.1:5000/dashboard/glucose', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      const { logs } = responseData.data;
      setLogs(logs);
    }
  }

  const recordLog = async () => {
    const log = { date, time, glucoseLevel };
    const response = await fetch('/api/glucose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(log),
    });
    if (response.ok) {
      console.log('Log recorded successfully');
      loadLogs();
    }
  };

  const deleteLog = async () => {
    const response = await fetch('http://127.0.0.1:5000/dashboard/glucose', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log('Log deleted successfully');
      loadLogs();
    }
  };  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2, width: '150px', height: '40px' }}
        >
        Go Back
      </Button>
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
          name="dateTime"
          label="Date & Time"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
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
      {logs && (
        <Paper elevation={6} sx={{ marginTop: 4, padding: 2 }}>
          <Typography variant="6" gutterBottom>
            Previous Glucose Logs
          </Typography>
          {logs.map((log) => (
            <Box key={log.log_id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>
               {formatDate(log.log_timestamp)}: {log.glucose_level} mg/dL 
              </Typography>
              <Button variant="outlined" color="error" onClick={() => deleteLog(log.log_id)}>
                Delete
              </Button>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
}

export default GlucoseLogs;
