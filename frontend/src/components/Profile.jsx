import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, CssBaseline, Paper, Container } from '@mui/material';
import { ArrowBack as ArrowBackIcon} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileInfo, setProfileInfo] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    primary_phone: '',
    secondary_phone: '',
    address: '',
    primary_insurance: '',
    medical_id: '',
    contact_person: '',
  });
  const token = localStorage.getItem('jwtToken');
  useEffect(() => {
    fetchProfile();
  }, []);

  const navigate = useNavigate();

  const handleEdit = () => {
    setEditing(true);
  };

  // TODO: Send a POST to update info
  const handleSave = () => {
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

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
              setProfileInfo(dataBody.data);
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
          {editing ? (
            <>
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
                  <Typography variant="h4" sx={{ marginBottom: '12px', fontWeight: 'bold' }}>Edit Profile Information</Typography>
                  <TextField
                    name="first_name"
                    label="First Name"
                    value={profileInfo.first_name}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="last_name"
                    label="Last Name"
                    value={profileInfo.last_name}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    value={profileInfo.dob}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="primary_phone"
                    label="Primary Phone"
                    value={profileInfo.primary_phone}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="secondary_phone"
                    label="Secondary Phone"
                    value={profileInfo.secondary_phone}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    name="address"
                    label="Address"
                    multiline
                    rows={4}
                    value={profileInfo.address}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="primary_insurance"
                    label="Primary Insurance"
                    value={profileInfo.primary_insurance}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="medical_id"
                    label="ID Number"
                    value={profileInfo.medical_id}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                  <TextField
                    name="contact_person"
                    label="Contact Person"
                    value={profileInfo.contact_person}
                    onChange={handleChange}
                    sx={{ marginBottom: '12px' }}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <>
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
              <Typography><span style={{ fontWeight: 'bold' }}>First Name:</span> {profileInfo.first_name}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Last Name:</span> {profileInfo.last_name}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Date of Birth:</span> {profileInfo.dob}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Primary Phone:</span> {profileInfo.primary_phone}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Secondary Phone:</span> {profileInfo.secondary_phone}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Address:</span> {profileInfo.address}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Primary Insurance:</span> {profileInfo.primary_insurance}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Medical ID Number:</span> {profileInfo.id_number}</Typography>
              <Typography><span style={{ fontWeight: 'bold' }}>Contact Person:</span> {profileInfo.contact_person}</Typography>
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

export default ProfilePage;