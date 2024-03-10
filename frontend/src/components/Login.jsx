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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    console.log(data)
                    setIsLoggedIn(true);
                } else {
                    console.error('Login issue');
                }
            } else {
                console.error('HTTP error - ', response.status);
            }
        } catch (error) {
            console.error('Some error during login:', error);
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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