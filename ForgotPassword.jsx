import React, { useState } from 'react'; // Importing necessary modules from React
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Typography,
  Snackbar, // Importing specific components from Material-UI
} from '@mui/material'; // Importing necessary components from Material-UI
import EmailIcon from '@mui/icons-material/Email'; // Importing EmailIcon from Material-UI icons

// Functional component ForgotPassword
export default function ForgotPassword() {
    const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

    // State variables for response message and form data
    const [responseMessage, setResponseMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
    });

    // Function to handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    // Setting response message and resetting form data if successful
                    setResponseMessage(data.message);
                    setFormData({
                      email:'',
                    });
                } else {
                    // Setting response message if unsuccessful
                    setResponseMessage(data.message);
                }
            } else {
              console.error('HTTP error:', response.status)
            }
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };
  
    return (
        // Main container for the forgot password form
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
            {/* Avatar for the email icon */}
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <EmailIcon />
            </Avatar>
            {/* Title for the forgot password form */}
            <Typography component="h1" variant="h5">
              Forgot password? We can help!
            </Typography>
            {/* Form for submitting email for password recovery */}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                autoFocus
                onChange={handleInputChange}
              />
              {/* Button to submit the form */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
              >
                Send Recovery Email
              </Button>
              {/* Button to navigate back */}
              <Button variant="contained" 
                sx={{ mt: 1, mb: 1, fontWeight: 'bold'}} 
                fullWidth color="primary" 
                onClick={() => navigate('/')}
              >
                  Back
              </Button>
              {/* Display response message */}
              {responseMessage && (
                <Typography variant="body2" sx={{ mt: 1, fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>
                {responseMessage}
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
    );
}
