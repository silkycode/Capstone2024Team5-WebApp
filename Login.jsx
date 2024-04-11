import React, { useState } from 'react'; // Importing React and useState hook
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Typography,
} from '@mui/material'; // Importing necessary components from Material-UI
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Importing LockOutlinedIcon from Material-UI

// Functional component Login
export default function Login({ setIsLoggedIn, setUsername }) {
    const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

    // State variables to store form data and error message
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle input change and update form data accordingly
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        // Checking if the email and password match the predefined values
        if (formData.email === 'user' && formData.password === 'password') {
            setIsLoggedIn(true); // Setting isLoggedIn state to true
        } 
        try {
            // Making a POST request to the login endpoint with form data
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // If the response is successful, parse the data
                const data = await response.json();
                if (data.status === 'success') {
                    localStorage.setItem('jwtToken', data.access_token); // Storing JWT token in local storage
                    setUsername(data.username); // Setting username using setUsername function
                    setIsLoggedIn(true); // Setting isLoggedIn state to true
                } else {
                    setErrorMessage(data.message); // Setting error message if login is unsuccessful
                }
            } else {
                setErrorMessage('HTTP error: ' + response.status); // Setting error message for HTTP error
            }
        } catch (error) {
            setErrorMessage('An error occurred: ' + error.message + '.'); // Setting error message for general error
        }
    };
            
    return (
        // Main container for login form
        <Container component="main" maxWidth="xs">
            <CssBaseline /> {/* Normalizing CSS */}
            {/* Box for arranging components vertically */}
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                {/* Avatar representing lock icon */}
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                {/* Title */}
                <Typography component="h1" variant="h5">
                Welcome!
                </Typography>
                {/* Form for login */}
                <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
                    {/* Text field for email */}
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
                    {/* Text field for password */}
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
                    {/* Error message display */}
                    {errorMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMessage}
                        </Typography>
                    )}
                    {/* Button for submitting login form */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
                        >
                        Sign In
                    </Button>
                    {/* Button for navigating to forgot password page */}
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
                {/* Link to registration page */}
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
