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

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
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
                    setValidEmail(true);
                    setShowSnackbar(true);
                } else {
                    setValidEmail(false);
                    setShowSnackbar(true);
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
            </Box>
          </Box>
          <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                message={
                  <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
                    {validEmail ? "Thank you! Check your email for recovery options." : "Please enter a valid email address."}
                  </span>
              }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Container>
    );
  }