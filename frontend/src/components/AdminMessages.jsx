import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box, List, ListItem, ListItemText, Divider, Grid } from '@mui/material';
import { fetchWithRetry } from '../authUtils';

export default function AdminMessages() {
    const [formData, setFormData] = useState({
        user_id: '',
        subject: '',
        body: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchNotificationsAndMessages = async () => {
            try {
                const response = await fetchWithRetry('http://127.0.0.1:5000/dashboard/notifications', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setNotifications(data.notifications);
                    setMessages(data.messages);
                } else {
                    setErrorMessage(data.message);
                }
            } catch (error) {
                console.error('Error fetching notifications and messages:', error);
                setErrorMessage('Error fetching notifications and messages. Please try again later.');
            }
        };
        fetchNotificationsAndMessages();
    }, [successMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetchWithRetry('http://127.0.0.1:5000/admin/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setFormData({
                    user_id: '',
                    subject: '',
                    body: ''
                });
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMessage('Error sending message. Please try again later.');
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, maxWidth: 800, margin: 'auto', padding: 2 }}>
            <Paper elevation={3} sx={{ flex: '1' }}>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Send a Message
                    </Typography>
                    {errorMessage && (
                        <Typography variant="body2" color="error" gutterBottom>
                            {errorMessage}
                        </Typography>
                    )}
                    {successMessage && (
                        <Typography variant="body2" color="primary" gutterBottom>
                            {successMessage}
                        </Typography>
                    )}
                    <form onSubmit={sendMessage}>
                        <TextField
                            fullWidth
                            label="User ID"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Body"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            required
                            multiline
                            rows={4}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Send Message
                        </Button>
                    </form>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ flex: '1' }}>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Your Messages
                    </Typography>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Notifications:
                        </Typography>
                        <List>
                            {notifications.map(notification => (
                                <div key={notification.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={notification.notification}
                                            secondary={`Importance: ${notification.importance}, Created on: ${notification.creation_date}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Messages:
                        </Typography>
                        <List>
                            {messages.map(message => (
                                <div key={message.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={message.sender}
                                            secondary={
                                                <>
                                                    <Typography variant="body2" component="span" color="text.primary">
                                                        {message.subject}
                                                    </Typography>
                                                    <br />
                                                    {`Sent on: ${message.send_date}`}
                                                    <br />
                                                    {`Body: ${message.body}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};