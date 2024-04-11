import React, { useState, useEffect } from 'react'; // Importing necessary modules from React
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
import { Typography, Paper, Box, Button } from '@mui/material'; // Importing necessary components from Material-UI
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'; // Importing ArrowBackIcon from Material-UI

// Functional component Notifications
const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const token = localStorage.getItem('jwtToken'); // Retrieving JWT token from local storage
  const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

  // useEffect hook to fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  // Function to fetch notifications from the backend
  const fetchNotifications = async () => {
    const response = await fetch('http://127.0.0.1:5000/dashboard/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Sending JWT token in the request headers for authentication
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      const { notifications } = responseData.data;
      setNotifications(notifications); // Updating notifications state with the fetched data
    }
  };

  return (
    <div>
      {/* Button to navigate back */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />} // Icon for back arrow
        onClick={() => navigate('/')} // Click event to navigate back to home
        sx={{ mb: 2, width: '150px', height: '40px' }} // Custom styles for button
      >
        Go Back
      </Button>
      {/* Title for the page */}
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {/* Displaying notifications in a Paper component */}
      {notifications && (
        <Paper elevation={6} sx={{ marginTop: 4, padding: 2 }}>
          {/* Mapping through notifications array and displaying each notification */}
          {notifications.map((notification) => (
            <Box key={notification.status_id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {/* Displaying formatted date and notification content */}
              <Typography>
                {formatDate(notification.status_timestamp)}: {notification.notification} 
              </Typography>
              {/* Button to delete notification */}
              <Button variant="outlined" color="error" onClick={() => deleteAppointment(appointment.appointment_id)}>
                Delete
              </Button>
            </Box>
          ))}
        </Paper>
      )}
    </div>
  );
};

export default Notifications; // Exporting Notifications component
