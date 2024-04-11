import React, { useState, useEffect } from 'react'; // Importing necessary modules from React
import { TextField, Button, Typography, Box, CssBaseline, Paper, Container } from '@mui/material'; // Importing necessary components from Material-UI
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'; // Importing ArrowBackIcon from Material-UI
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom

// Functional component ProfilePage
const ProfilePage = () => {
  const [editing, setEditing] = useState(false); // State to manage editing mode
  const [errorMessage, setErrorMessage] = useState(''); // State to manage error messages
  const [profileInfo, setProfileInfo] = useState({ // State to store profile information
    first_name: '',
    last_name: '',
    dob: '',
    primary_phone: '',
    secondary_phone: '',
    address: '',
    primary_insurance: '',
    id_number: '',
    contact_person: '',
    doctor_name: '',
    doctor_phone: '',
    doctor_fax: '',
  });
  const token = localStorage.getItem('jwtToken'); // Getting JWT token from local storage
  const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

  // useEffect hook to fetch profile information when the component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  // Function to handle editing mode
  const handleEdit = () => {
    setEditing(true);
  };

  // Function to save changes and exit editing mode
  const handleSave = () => {
    setEditing(false);
  };

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  // Function to fetch profile information from the backend
  const fetchProfile = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/dashboard/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const dataBody = await response.json();
            if (dataBody.status === 'success') {
              setProfileInfo(dataBody.data); // Updating profileInfo state with fetched data
            } else {
                setErrorMessage(data.message);
            }
        } else {
            setErrorMessage('HTTP error: ' + response.status);
        }
    } catch (error) {
        setErrorMessage('An error occurred: ' + error.message + '.');
    }
};

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: '20px', marginTop: '30px' }}>
        <div sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '800px', // Increase maximum width
          margin: 'auto',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}>
          <CssBaseline />
          {editing ? ( // Conditional rendering based on editing mode
            <> {/* Fragment */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={handleSave}
                sx={{ mb: 2, width: '150px', height: '40px' }}
                >
                Go Back
              </Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ ml: 4, mb: 2, width: '100px', height: '40px' }}
                >
                  Save
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Box sx={{ flex: 1, marginRight: '20px' }}>
                  {/* Input fields for editing profile information */}
                  <Typography variant="h4" sx={{ marginBottom: '12px', fontWeight: 'bold' }}>Edit Profile Information</Typography>
                  <TextField
                    name="first_name"
                    label="First Name"
                    value={profileInfo.first_name}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  {/* Other input fields */}
                </Box>
              </Box>
            </>
          ) : (
            <> {/* Fragment */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 2, width: '150px', height: '40px' }}
                >
                Go Back
              </Button>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Profile Information</Typography>
              {/* Displaying profile information */}
              <Typography><span style={{ fontWeight: 'bold' }}>First Name:</span> {profileInfo.first_name}</Typography>
              {/* Other profile information */}
              <Button variant="contained" color="primary" onClick={handleEdit} sx={{ marginTop: '16px' }}>
                Edit
              </Button>
            </>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default ProfilePage; // Exporting ProfilePage component
