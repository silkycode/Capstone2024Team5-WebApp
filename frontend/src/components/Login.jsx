import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // placeholder for UI debugging, remember to return to API validation
        setIsLoggedIn(true);
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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Welcome!
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
                        >
                        Sign In
                    </Button>
                    <Button variant="contained" 
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}} 
                        fullWidth 
                        color="primary" 
                        onClick={() => navigate('/forgot-password')}
                        >
                        Forgot password?
                    </Button>
                    <Button variant="contained" 
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}} 
                        fullWidth 
                        color="primary" 
                        onClick={() => navigate('/registration')}
                        >
                        Don't have an account?
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}