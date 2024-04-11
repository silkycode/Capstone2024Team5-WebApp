import React, { useState } from "react";  // Importing necessary modules from React
import { useNavigate } from "react-router-dom";  // Importing useNavigate hook from react-router-dom
import {
  Avatar,
  Button,
  CssBaseline,
  Container,
  Box,
  Typography,
  Link,
  TextField,
  Grid,
} from "@mui/material";  // Importing specific components from Material-UI
import LocationOnIcon from "@mui/icons-material/LocationOn";  // Importing LocationOnIcon from Material-UI icons
import PhoneIcon from "@mui/icons-material/Phone";  // Importing PhoneIcon from Material-UI icons
import EmailIcon from "@mui/icons-material/Email";  // Importing EmailIcon from Material-UI icons

// Functional component Contact
export default function Contact() {
  const navigate = useNavigate();  // Initializing useNavigate hook for navigation

  const [responseMessage, setResponseMessage] = useState('');  // State variable to manage response message
  const [formData, setFormData] = useState({  // State variable to manage form data
    name: '',
    email: '',
    message: '',
  });

  // Function to handle input change in the form fields
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
        const response = await fetch('http://127.0.0.1:5000/services/contact', {
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
                  email: '',
                  name: '',
                  message: '',
                });
            } else {
              setResponseMessage(data.message);
            }
        } else {
            setErrorMessage('HTTP error: ' + response.status);
        }
    } catch (error) {
        setErrorMessage('An error occurred: ' + error.message + '.');
    }
};

  return (
    // Container component to contain the contact form and information
    <Container component="main" maxWidth="md">
      <CssBaseline />
      {/* Grid component to layout the content */}
      <Grid container spacing={4} justifyContent="center">
        {/* Grid item for displaying address and contact information */}
        <Grid item md={6} mt={3} xs={12}>
          <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
            >
            {/* Avatar and Typography components for displaying address */}
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LocationOnIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Our Address
            </Typography>
            <Typography>
              6521 AL Hwy 69 S, Suit N,
              <br />
              Tuscaloosa, AL 35405
            </Typography>

            {/* Avatar and Typography components for displaying phone number */}
            <Avatar sx={{ m: 1, mt: 3, bgcolor: "primary.main" }}>
            <PhoneIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Phone
            </Typography>
            <Typography>(866)-919-1246</Typography>

            {/* Avatar and Typography components for displaying email */}
            <Avatar sx={{ m: 1, mt: 3, bgcolor: "primary.main" }}>
              <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Email
            </Typography>
            <Typography>info@aimplusmedicalsupplies.com</Typography>
            <Link
              href="http://www.aimplusmedicalsupplies.com"
              target="_blank"
              rel="noopener"
              >
              http://www.aimplusmedicalsupplies.com
            </Link>
          </Box>
        </Grid>
        {/* Grid item for contact form */}
        <Grid item mt={3} md={6} xs={12}>
          <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
            >
            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
            Send us a Message
            </Typography>
            {/* Form for sending a message */}
            <form onSubmit={handleSubmit} sx={{ width: "100%", mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                autoFocus
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Your Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                id="message"
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              />
              {/* Button to submit the form */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 1, fontWeight: 'strong' }}
                >
                Send Message
              </Button>
            </form>
            {/* Button to navigate back */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2, fontWeight: 'strong' }}
              onClick={() => navigate("/")}
              >
              Back
            </Button>
            {/* Displaying response message if any */}
            {responseMessage && (
              <Typography variant="body2" sx={{ mt: 1, fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>
              {responseMessage}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
