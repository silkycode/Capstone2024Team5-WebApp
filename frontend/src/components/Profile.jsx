import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  return (
    <div>
      {editing ? (
        <>
          <TextField
            name="name"
            label="Name"
            value={profileInfo.name}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            value={profileInfo.email}
            onChange={handleChange}
          />
          <TextField
            name="bio"
            label="Bio"
            multiline
            rows={4}
            value={profileInfo.bio}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4">Profile Information</Typography>
          <Typography>Name: {profileInfo.name}</Typography>
          <Typography>Email: {profileInfo.email}</Typography>
          <Typography>Bio: {profileInfo.bio}</Typography>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;