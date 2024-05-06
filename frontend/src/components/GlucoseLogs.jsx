import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CssBaseline, TextField, Container, Box, Typography, Paper, Grid, Table, TableRow, TableCell, TableBody } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { VictoryChart, VictoryLine, VictoryTooltip } from 'victory';

export default function GlucoseLogs() {
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState('');
    const [glucoseLevel, setGlucoseLevel] = useState('');
    const [logs, setLogs] = useState([]);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => { fetchLogs(); }, []);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/dashboard/glucose', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setLogs(responseData.glucose_logs);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const recordLog = async () => {
        const log = { glucose_level: glucoseLevel, creation_date: dateTime };
        try {
            const response = await fetch('http://127.0.0.1:5000/dashboard/glucose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(log),
            });
            if (response.ok) {
                console.log('Log recorded successfully');
                fetchLogs();
            }
        } catch (error) {
            console.error('Error recording log:', error);
        }
    };

    const deleteLog = async (logID) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/dashboard/glucose?glucose_log_id=${logID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                console.log('Log deleted successfully');
                fetchLogs();
            }
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };

    const GlucoseChart = ({ logs }) => {
        const formattedLogs = logs.map(log => ({
            x: new Date(log.creation_date),
            y: log.glucose_level,
            label: `Date: ${new Date(log.creation_date).toLocaleDateString()}, Glucose Level: ${log.glucose_level}`
        }));
    
        return (
            <div>
                <h2>Glucose Logs</h2>
                <VictoryChart
                    width={1000}
                    height={320}
                    padding={{ top: 20, bottom: 40, left: 50, right: 50 }}
                    domainPadding={{ x: 20, y: 20 }}
                >
                    <VictoryLine
                        labelComponent={<VictoryTooltip />}
                        data={formattedLogs}
                        x="x"
                        y="y"
                        labels={({ datum }) => datum.label}
                        style={{
                            data: { stroke: "#007bff", strokeWidth: 5 }
                        }}
                    />
                </VictoryChart>
            </div>
        );
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
            <GlucoseChart logs={logs}></GlucoseChart>
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
                                onChange={(e) => setDateTime(formatDateTime(e.target.value))}
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
                                sx={{ mt: 3 }}
                                onClick={recordLog}
                            >
                                Record Log
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                        <Paper elevation={6} sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Previous Glucose Logs:
                            </Typography>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Date & Time</TableCell>
                                        <TableCell>Glucose Level (mg/dL)</TableCell>
                                    </TableRow>
                                    {logs.slice().reverse().map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{formatDateTime(log.creation_date)}</TableCell>
                                            <TableCell>{log.glucose_level} mg/dL</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="error" onClick={() => deleteLog(log.id)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}