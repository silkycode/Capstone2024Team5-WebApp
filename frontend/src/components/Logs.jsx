import React, { useState, useEffect } from 'react';
import { fetchWithRetry } from '../authUtils';
import { CircularProgress, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Logs() {
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetchWithRetry('http://127.0.0.1:5000/admin/logs', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const downloadTXT = (logData, title) => {
        const content = logData.join('');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
        
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Logs
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <div>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="h5">Server Logs</Typography>
                                <Button onClick={() => downloadTXT(logs.server, 'Server Logs')} variant="contained" color="primary">
                                    Export to raw
                                </Button>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper variant="outlined" style={{ width: '100%', overflowX: 'auto' }}>
                                {logs.server.map((line, index) => (
                                    <Typography key={index} style={{ fontSize: '0.8rem', padding: '4px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff', fontFamily: 'Roboto Mono, Courier New, monospace' }}>
                                        {line}
                                    </Typography>
                                ))}
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="h5">API Logs</Typography>
                                <Button onClick={() => downloadTXT(logs.route, 'API Logs')} variant="contained" color="primary">
                                    Export to raw
                                </Button>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper variant="outlined" style={{ width: '100%', overflowX: 'auto' }}>
                                {logs.route.map((line, index) => (
                                    <Typography key={index} style={{ fontSize: '0.8rem', padding: '4px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff', fontFamily: 'Roboto Mono, Courier New, monospace' }}>
                                        {line}
                                    </Typography>
                                ))}
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="h5">Error Logs</Typography>
                                <Button onClick={() => downloadTXT(logs.error, 'Error Logs')} variant="contained" color="primary">
                                    Export to raw
                                </Button>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper variant="outlined" style={{ width: '100%', overflowX: 'auto' }}>
                                {logs.error.map((line, index) => (
                                    <Typography key={index} style={{ fontSize: '0.8rem', padding: '4px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff', fontFamily: 'Roboto Mono, Courier New, monospace' }}>
                                        {line}
                                    </Typography>
                                ))}
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="h5">Job Logs</Typography>
                                <Button onClick={() => downloadTXT(logs.job, 'Job Logs')} variant="contained" color="primary">
                                    Export to raw
                                </Button>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper variant="outlined" style={{ width: '100%', overflowX: 'auto' }}>
                                {logs.job.map((line, index) => (
                                    <Typography key={index} style={{ fontSize: '0.8rem', padding: '4px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff', fontFamily: 'Roboto Mono, Courier New, monospace' }}>
                                        {line}
                                    </Typography>
                                ))}
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="h5">Email Logs</Typography>
                                <Button onClick={() => downloadTXT(logs.email, 'Email Logs')} variant="contained" color="primary">
                                    Export to raw
                                </Button>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper variant="outlined" style={{ width: '100%', overflowX: 'auto' }}>
                                {logs.email.map((line, index) => (
                                    <Typography key={index} style={{ fontSize: '0.8rem', padding: '4px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff', fontFamily: 'Roboto Mono, Courier New, monospace' }}>
                                        {line}
                                    </Typography>
                                ))}
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}
        </div>
    );
}