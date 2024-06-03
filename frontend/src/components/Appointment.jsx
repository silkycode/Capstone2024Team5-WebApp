import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CssBaseline, TextField, Container, Box, Typography, Paper, Grid } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import jsPDF from 'jspdf'
import 'jspdf-autotable'


export default function Appointment() {
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
            const response = await fetch('http://127.0.0.1:5000/dashboard/appointments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setAppointments(responseData.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const recordAppointment = async () => {
        const appointment = { date: dateTime, doctor_name: doctorName, notes: notes };
        try {
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
        } catch (error) {
            console.error('Error recording appointment:', error);
        }
    };

    const deleteAppointment = async (appointmentID) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/dashboard/appointments?appointment_id=${appointmentID}`, {
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

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Date & Time", "Doctor Name", "Notes"];
        let sortedAppointments = [...appointments];
        sortedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        const tableRows = [];
    
        sortedAppointments.forEach(appointment => {
            const formattedDateTime = formatDateTime(appointment.date);
            const appointmentData = [
                formattedDateTime,
                appointment.doctor_name,
                appointment.notes
            ];
            tableRows.push(appointmentData);
        });
    
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '_');
        const fileName = `appointments_${formattedDate}.pdf`;
    
        const title = `Your Appointments\nGenerated: ${currentDate.toLocaleString()}`;
        doc.text(title, 14, 20);
    
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            styles: {
                overflow: 'linebreak',
                cellWidth: 'wrap',
                cellPadding: 2,
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
            },
            margin: { top: 20 },
            tableWidth: 'auto',
            tableHeight: 'auto',
        });

        doc.save(fileName);
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
                    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                        <Paper elevation={6} sx={{ padding: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={exportToPDF}
                                sx={{ mb: 2}}
                            >
                                Export to PDF
                            </Button>
                            <Typography variant="h6" gutterBottom>
                                Scheduled Appointments:
                            </Typography>
                            {appointments
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map((appointment) => {
                                    const appointmentDate = new Date(appointment.date);
                                    const formattedDate = appointmentDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                                    const formattedTime = appointmentDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                    
                                    return (
                                        <Paper key={appointment.id} elevation={6} sx={{ padding: 2, marginBottom: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {formattedDate} at {formattedTime}
                                                </Typography>
                                                <Button variant="outlined" color="error" onClick={() => deleteAppointment(appointment.id)}>
                                                    Delete
                                                </Button>
                                            </Box>
                                            <Box sx={{ marginTop: 1 }}>
                                                <Typography variant="body1" sx={{ textAlign: 'right', paddingBottom: 1 }}>
                                                    Dr. {appointment.doctor_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: 16 }}>
                                                    {appointment.notes}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}