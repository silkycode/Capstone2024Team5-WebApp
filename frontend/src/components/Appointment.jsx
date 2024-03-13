import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Container, Box, Typography, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon} from '@mui/icons-material';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
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
    const appointment = { doctor, dateTime, notes };
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
    const response = await fetch('http://127.0.0.1:5000/dashboard/appointments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ appointment_id: appointmentId }),
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
            name="doctor_name"
            label="Doctor Name"
            type="text"
            InputLabelProps={{ shrink: true }}
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="notes"
            label="Notes/Description"
            type="text"
            InputLabelProps={{ shrink: true }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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