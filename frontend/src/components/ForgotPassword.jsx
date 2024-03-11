import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Typography,
  Snackbar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [responseMessage, setResponseMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Send email to backend, snackbar notification depends on what type of message comes back
    // Badly formed email -> user needs to resubmit, otherwise tries to send recovery email
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
                    setResponseMessage(data.message);
                    setFormData({
                      email:'',
                    });
                } else {
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
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Forgot password? We can help!
            </Typography>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
              >
                Send Recovery Email
              </Button>
              <Button variant="contained" 
                sx={{ mt: 1, mb: 1, fontWeight: 'bold'}} 
                fullWidth color="primary" 
                onClick={() => navigate('/')}
              >
                  Back
              </Button>
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