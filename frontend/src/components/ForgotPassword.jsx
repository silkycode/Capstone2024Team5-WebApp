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

    const handleForgotPwd = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setShowSnackbar(true);
          return;
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
            <Box component="form" onSubmit={handleForgotPwd} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                  <span style={{ fontSize: '22px' }}>
                      Please enter a valid email address.
                  </span>
              }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Container>
    );
  }