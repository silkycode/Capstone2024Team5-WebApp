import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Box, Grid } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/dashboard/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        const responseData = await response.json();
        // Order notifications by importance so user isn't randomly bombarded
        const orderedNotifications = responseData.notifications.sort((a, b) => b.importance - a.importance);
        setNotifications(orderedNotifications);
      } else {
        console.error('Failed to fetch notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getBackgroundColor = (importance) => {
    switch (importance) {
      case 3:
        return '#FFCDD2';
      case 2:
        return '#FFF9C4';
      case 1:
        return '#C8E6C9';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Go Back
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Notifications
          <Typography variant="body2" sx={{ marginLeft: 2, color: '#666', fontWeight: 'bold', fontSize: 22}}>
            ({notifications.length} total)
          </Typography>
        </Typography>
      </Grid>
      {notifications.map((notification) => (
        <Grid item xs={12} key={notification.id}>
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, backgroundColor: getBackgroundColor(notification.importance), borderLeft: `6px solid ${getBackgroundColor(notification.importance)}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                {formatDate(notification.creation_date)}
              </Typography>
            </Box>
            <Box sx={{ marginTop: 1 }}>
              <Typography variant="body2" sx={{ fontSize: 16, color: '#333' }}>
                {notification.notification}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Notifications;