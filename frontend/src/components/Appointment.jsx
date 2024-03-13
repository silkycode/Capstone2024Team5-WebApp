import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Container, Box, Typography, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon} from '@mui/icons-material';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  // Fetch appointments from the backend
  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const fetchAppointments = async () => {
    const response = await fetch('http://127.0.0.1:5000/dashboard/appointments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      const { appointments } = responseData.data;
      setAppointments(appointments);
    }

  };

  const recordAppointment = async () => {
    const appointment = { title, date, time };
    const response = await fetch('http://127.0.0.1:5000/dashboard/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
      fetchAppointments(); 
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
      {appointments && (
        <Paper elevation={6} sx={{ marginTop: 4, padding: 2 }}>
          <Typography variant="6" gutterBottom>
            Scheduled Appointments
          </Typography>
          {appointments.map((appointment) => (
            <Box key={appointment.appointment_id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>
                {appointment.doctor_name} - {appointment.appointment_notes} at {formatDate(appointment.appointment_date)}
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