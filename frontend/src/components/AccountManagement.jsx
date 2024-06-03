import React, { useState, useEffect } from 'react';
import { fetchWithRetry } from '../authUtils';
import { TextField, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Box, Typography, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { SettingsApplications as SettingsApplicationsIcon, Delete as DeleteIcon, Edit as EditIcon, Undo as UndoIcon } from '@mui/icons-material';

export default function AccountManagement() {
    const [searchString, setSearchString] = useState('');
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [usernameToDelete, setUsernameToDelete] = useState('');
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});
    const [emailError, setEmailError] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        setPage(0);
    }, [debouncedSearchString, setPage]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchString]);

    useEffect(() => {
        if (debouncedSearchString !== '') {
            setPage(0);
            fetchUsers();
        } else {
            setUsers([]);
            setErrorMessage('');
        }
    }, [debouncedSearchString]);

    const fetchUsers = async() => {
        try {
            const response = await fetchWithRetry(`http://127.0.0.1:5000/admin/manage-accounts?search_string=${debouncedSearchString}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUsers(userData);
                setErrorMessage('');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        }
    };

    const confirmDeleteUser = async () => {

        if (usernameToDelete !== users.find(user => user.account_id === deleteUserId)?.username) {
            setErrorMessage('Entered username does not match.');
            return;
        }

        try {
            const response = await fetchWithRetry(`http://127.0.0.1:5000/admin/manage-accounts?user_id=${deleteUserId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                fetchUsers();
                setOpenConfirmationDialog(false);
                setUsernameToDelete('');
                setErrorMessage('');
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        }
    };

    const handleInputChange = (e) => {
        setSearchString(e.target.value);
    };

    const handleDeleteUser = async (userId) => {
        setDeleteUserId(userId);
        setOpenConfirmationDialog(true);
    };

    const handleUndeleteUser = async (userId) => {
        try {
            const response = await fetchWithRetry(`http://127.0.0.1:5000/admin/undelete?user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                fetchUsers();
                setErrorMessage('');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        }
    };

    const handleEditUser = async (userId) => {
        setEditUserId(userId);
        const user = users.find(user => user.account_id === userId);
        setEditedUserData(user);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);  
    };

    const handleEditInputChange = (e) => {
        setEditedUserData({
            ...editedUserData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateUser = async () => {
        // do nothing if no values are sent
        if (
            (!editedUserData.username || !editedUserData.username.trim()) &&
            (!editedUserData.email || !editedUserData.email.trim()) &&
            (!editedUserData.password || !editedUserData.password.trim())
        ) {
            return;
        }

        try {
            const response = await fetchWithRetry(`http://127.0.0.1:5000/admin/manage-accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: editUserId,
                    ...editedUserData
                }),
            });
            if (response.ok) {
                fetchUsers();
                setEditUserId(null);
                setErrorMessage('');
                setEmailError('');
            } else if (response.status === 400) {
                setEmailError('Invalid email format.');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error);
        }
    };

    const handleUsernameClick = (userId) => {
        setSelectedUserId(userId);
    };

    const handleBackToTable = () => {
        setSelectedUserId(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            {selectedUserId ? (
                <div>
                    <Typography variant="h5" gutterBottom>User Details</Typography>
                    <Typography variant="body1" gutterBottom><strong>User ID:</strong> {selectedUserId}</Typography>
                    {users.map(user => {
                        if (user.account_id === selectedUserId) {
                            return (
                                <div key={user.account_id}>
                                    <Typography variant="body1" gutterBottom><strong>Username:</strong> {user.username}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Email:</strong> {user.email}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Last Login Date:</strong> {user.last_login_date}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Date Created:</strong> {user.date_created}</Typography>
                                </div>
                            );
                        }
                        return null;
                    })}
                    <Button onClick={handleBackToTable} variant="contained" sx={{ mt: 2 }}>Back to User Table</Button>
                </div>
            ) : (
                <>
                    <TextField
                        label="Search Users"
                        variant="outlined"
                        value={searchString}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ backgroundColor: '#f0f2f5' }}>
                                <TableRow>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Last Login Date</TableCell>
                                    <TableCell>Date Created</TableCell>
                                    <TableCell>To Be Deleted</TableCell>
                                    <TableCell>Deletion Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                                    <TableRow key={user.account_id} sx={{ '&:hover': { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#f5f5f5' } }}>
                                        <TableCell>{user.account_id}</TableCell>
                                        <TableCell sx={{ textAlign: 'left' }}>
                                            <Button onClick={() => handleUsernameClick(user.account_id)}>{user.username}</Button>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.last_login_date}</TableCell>
                                        <TableCell>{user.date_created}</TableCell>
                                        <TableCell>{user.deleted}</TableCell>
                                        <TableCell>{user.delete_time}</TableCell>
                                        <TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                                            {user.deleted ? (
                                                <IconButton color="primary" onClick={() => handleUndeleteUser(user.account_id)}>
                                                    <UndoIcon />
                                                </IconButton>
                                            ) : (
                                                <>
                                                    <IconButton color="primary" onClick={() => handleEditUser(user.account_id)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => handleDeleteUser(user.account_id, user.username)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[25, 50, 100]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
                <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to delete this user?</p>
                        <TextField
                            label="Enter Username"
                            variant="outlined"
                            value={usernameToDelete}
                            onChange={(e) => setUsernameToDelete(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        {errorMessage && <Typography variant="body2" color="error">{errorMessage}</Typography>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmationDialog(false)}>Cancel</Button>
                        <Button onClick={confirmDeleteUser} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            <Dialog open={Boolean(editUserId)} onClose={() => setEditUserId(null)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Username (optional)"
                        variant="outlined"
                        name="username"
                        value={editedUserData.username || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        margin="dense"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="New Email (optional)"
                        variant="outlined"
                        name="email"
                        value={editedUserData.email || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        error={Boolean(emailError)}
                        helperText={emailError}
                    />
                    <TextField
                        label="New Password (optional)"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={editedUserData.password || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditUserId(null)}>Cancel</Button>
                    <Button onClick={handleUpdateUser} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}