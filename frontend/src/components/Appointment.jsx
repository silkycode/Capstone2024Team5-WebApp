import React, { useState, useEffect } from 'react';
import { Avatar, Button, CssBaseline, TextField, Container, Box, Typography, Paper } from '@mui/material';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Fetch appointments from the backend
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const response = await fetch('/appointments');
    if (response.ok) {
      const appointments = await response.json();
      setAppointments(appointments);
    }
  };
  const recordAppointment = async () => {
    const appointment = { title, date, time };
    const response = await fetch('/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    });
    if (response.ok) {
      console.log('Appointment recorded successfully');
      fetchAppointments();
    }
  };

  const deleteAppointment = async (appointmentId) => {
    const response = await fetch(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('Appointment deleted successfully');
      fetchAppointments(); // Reload the appointments to update the UI
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
          Appointment Scheduler
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="date"
            label="Date"
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
            InputLabelProps={{ shrink: true }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={recordAppointment}
          >
            Schedule Appointment
          </Button>
        </Box>
      </Box>
      {appointments.length > 0 && (
        <Paper sx={{ marginTop: 4, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Scheduled Appointments
          </Typography>
          {appointments.map((appointment) => (
            <Box key={appointment.appointment_id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>
                {appointment.title} - {appointment.date} at {appointment.time}
              </Typography>
              <Button variant="outlined" color="error" onClick={() => deleteAppointment(appointment.appointment_id)}>
                Delete
              </Button>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default Appointment;