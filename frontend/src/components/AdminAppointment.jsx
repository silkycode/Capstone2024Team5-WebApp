import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CssBaseline, TextField, Container, Box, Typography, Paper, Grid } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function AppointmentsManagement() {
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [notes, setNotes] = useState('');
    const [appointments, setAppointments] = useState([]);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => { fetchAppointments(); }, []);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/appointments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setAppointments(responseData);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const recordAppointment = async () => {
        const appointment = { date: dateTime, doctor_name: doctorName, notes: notes };
        try {
            const response = await fetch('http://127.0.0.1:5000/appointments', {
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
        } catch (error) {
            console.error('Error recording appointment:', error);
        }
    };

    const deleteAppointment = async (appointmentID) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/appointments/${appointmentID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                console.log('Appointment deleted successfully');
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Go Back
            </Button>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Appointment Management
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
                                onChange={(e) => setDateTime(formatDateTime(e.target.value))}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                name="notes"
                                label="Doctor Name"
                                type="string"
                                id="notes"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                multiline
                                rows={4}
                                name="notes"
                                label="Appointment Notes"
                                type="string"
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={recordAppointment}
                            >
                                Schedule Appointment
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={6} sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Appointments:
                        </Typography>
                        {appointments.map((appointment) => (
                            <Box key={appointment.id} sx={{ marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: 1 }}>
                                    <Typography variant="subtitle1">
                                        {appointment.appointment_date}
                                    </Typography>
                                    <Button variant="outlined" color="error" onClick={() => deleteAppointment(appointment.id)}>
                                        Delete
                                    </Button>
                                </Box>
                                <Box sx={{ marginTop: 1 }}>
                                    <Typography variant="body1">
                                        {appointment.doctor_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Notes: {appointment.appointment_notes}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
