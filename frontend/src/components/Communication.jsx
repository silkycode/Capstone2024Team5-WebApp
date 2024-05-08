import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function CommunicationPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message
  const sendMessage = () => {
    if (message.trim() !== '') {
      // Add the new message to the list of messages
      setMessages([...messages, message]);
      // Clear the message input field
      setMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Communication Tools
      </Typography>
      {/* Render the list of messages */}
      <Box sx={{ maxWidth: 400, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <Typography key={index} variant="body1" gutterBottom>
            {msg}
          </Typography>
        ))}
      </Box>
      {/* Input field for typing a new message */}
      <TextField
        label="Type your message"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ width: '100%', mb: 2 }}
      />
      {/* Button to send the message */}
      <Button variant="contained" onClick={sendMessage}>
        Send
      </Button>
    </Box>
  );
}
