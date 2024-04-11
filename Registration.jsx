import React, { useState } from 'react'; // Importing necessary modules from React
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
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
} from '@mui/material'; // Importing necessary components from Material-UI
import AccountBoxIcon from '@mui/icons-material/AccountBox'; // Importing AccountBoxIcon from Material-UI

// Functional component Registration
export default function Registration() {
    const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

    const [showSnackbar, setShowSnackbar] = useState(false); // State to manage snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to manage snackbar message
    const [formData, setFormData] = useState({ // State to store form data
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    // Function to handle changes in input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Function to handle user registration
    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setSnackbarMessage(data.message); // Setting snackbar message with response data
                setShowSnackbar(true); // Showing the snackbar
            } else {
                console.error('HTTP error:', response.status);
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
                <AccountBoxIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Need an account?
                </Typography>
                {/* Registration form */}
                <Box component="form" noValidate onSubmit={handleRegistration} sx={{ mt: 3 }}>
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
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* Other input fields */}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, fontWeight: 'bold'}}
                    >
                        Sign Up
                    </Button>
                    {/* Button to navigate to login page */}
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
            {/* Snackbar for displaying messages */}
            <Snackbar
                    open={showSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setShowSnackbar(false)}
                    message={
                        <span style={{ fontSize: '22px', fontWeight: 'bold', alignContent: 'center'}}>
                            {snackbarMessage}
                        </span>
                    }
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}
