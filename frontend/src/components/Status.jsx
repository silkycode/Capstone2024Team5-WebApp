import React, { useState, useEffect } from 'react';
import { fetchWithRetry } from '../authUtils';
import { Typography, Grid, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import StorageIcon from '@mui/icons-material/Storage';

export default function Status() {
    const [status, setStatus] = useState(null);
    const [connected, setConnected] = useState(false);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchWithRetry(`http://127.0.0.1:5000/admin/server-status`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    setConnected(true);
                    const data = await response.json();
                    setStatus(data);
                } else {
                    console.error('Error fetching server status:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching server status:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ padding: '20px', borderRadius: '12px' }}>
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>
                        Server Status {connected && <CheckIcon style={{ color: 'green' }} />}
                    </Typography>
                    {status &&
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <Typography variant="body1">
                                    <b>CPU Usage:</b> {status['cpu_percent']}%
                                </Typography>
                                <Typography variant="body1">
                                    <b>Memory Usage:</b> {status['memory_percent']}%
                                </Typography>
                                <Typography variant="body1">
                                    <b>Total Memory:</b> {status['memory_total']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Used Memory:</b> {status['memory_used']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Disk Usage:</b> {status['disk_percent']}%
                                </Typography>
                                <Typography variant="body1">
                                    <b>Total Disk:</b> {status['disk_total']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Used Disk:</b> {status['disk_used']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Bytes Sent:</b> {status['bytes_sent']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Bytes Received:</b> {status['bytes_received']}
                                </Typography>
                            </div>
                        </>
                    }
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ padding: '20px', borderRadius: '12px' }}>
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>
                        Database Statistics <StorageIcon style={{ verticalAlign: 'middle' }} />
                    </Typography>
                    {status &&
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <Typography variant="body1">
                                    <b>Total Users:</b> {status['db_stats']['total_users']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Admin Users:</b> {status['db_stats']['admin_users']}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Regular Users:</b> {status['db_stats']['regular_users']}
                                </Typography>
                            </div>
                        </>
                    }
                </Paper>
            </Grid>
        </Grid>
    );
}