import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Snackbar,
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export default function Registration() {
    const navigate = useNavigate();
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleRegistration = (event) => {
        event.preventDefault();
        // placeholder for UI debugging, remember to return to API validation
        setShowSnackbar(true);
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
                <AccountBoxIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Need an account?
                </Typography>
                <Box component="form" onSubmit={handleRegistration} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
                    >
                        Sign Up
                    </Button>
                    <Button variant="contained" 
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}} 
                        fullWidth 
                        color="primary" 
                        onClick={() => navigate('/')}
                    >
                        Already have an account?
                    </Button>
                </Box>
            </Box>
            <Snackbar
                    open={showSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setShowSnackbar(false)}
                    message={
                        <span style={{ fontSize: '22px' }}>
                            Registration submitted! Check your email for verification.
                        </span>
                    }
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}