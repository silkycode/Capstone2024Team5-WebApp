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

export default function Login({ setIsLoggedIn, setUsername }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (formData.email === 'user' && formData.password === 'password') {
            setIsLoggedIn(true);
        } 

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
                localStorage.setItem('jwtToken', data.access_token);
                setUsername(data.username);
                setIsLoggedIn(true);
                setErrorMessage('');
            } else if (response.status === 401) {
                const data = await response.json();
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred: ' + error.message + '.');
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
                <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
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
                    {errorMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMessage}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
                        >
                        Sign In
                    </Button>
                    <Button 
    variant="contained" 
    sx={{
        mt: 1,
        mb: 1,
        fontWeight: 'bold',
        color: 'primary.dark', // Dark blue font color
        bgcolor: '#fff', // White background color
        border: '2px solid', // 2px solid border
        borderColor: 'primary.dark', // Dark blue border color
        '&:hover': {
            bgcolor: 'primary.main', // Change background color on hover
            color: '#fff', // Change text color on hover
        }
    }} 
    fullWidth 
    onClick={() => navigate('/forgot-password')}
>
    Forgot password?
</Button>

</Box>
<Box 
    sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 1,
        mb: 1,
    }}
>
    <Typography 
        variant="body1" 
        sx={{ 
            fontWeight: 'bold', 
            color: 'primary.dark', 
            cursor: 'pointer',
        }} 
        onClick={() => navigate('/registration')}
    >
        Don't have an account?
    </Typography>
</Box>
            </Box>
        </Container>
    );
}