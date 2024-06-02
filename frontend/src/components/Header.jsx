import React from "react";
import { Link, useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { Help as HelpIcon, ContactMail as ContactIcon, AccountCircle as AccountCircleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import TitleLogo from '../assets/images/svgs/title-removebg-preview.png';

const buttonStyles = {
  fontSize: '1.3rem',
  padding: '15px',
};

export default function Header({ isLoggedIn, setIsLoggedIn }) {
	const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
		const jwtToken = localStorage.getItem('jwtToken')
		const sessionID = localStorage.getItem('sessionID')

		const response = await fetch('http://127.0.0.1:5000/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${jwtToken}`,
			},
			body: JSON.stringify({ session_id: sessionID })
		});

		localStorage.removeItem('jwtToken');
		localStorage.removeItem('sessionID')
		setIsLoggedIn(false);
		navigate('/');
    };

  return (
	<AppBar position="sticky" sx={{ top: 0, zIndex: 1500, backgroundColor: '#fff' }}>
		<Toolbar sx={{ color: '#333', justifyContent: 'space-between', flexWrap: 'wrap' }}>
		<IconButton edge="start" sx={{ mr: 2 }}>
			<img src={TitleLogo} alt="Company Logo" height="100px" />
		</IconButton>
		<div>
			<Button component={Link} to="/help" sx={buttonStyles}>
			<HelpIcon />
			<span style={{ marginLeft: '6px' }}>Help</span>
			</Button>
			<Button component={Link} to="/contact" sx={buttonStyles}>
			<ContactIcon />
			<span style={{ marginLeft: '6px' }}>Contact Us</span>
			</Button>
			<Button component={Link} to={isLoggedIn ? "/dashboard" : "/"} sx={buttonStyles}>
			<AccountCircleIcon />
			<span style={{ marginLeft: '6px' }}>Dashboard</span>
			</Button>
			{isLoggedIn && (
			<Button onClick={handleLogout} sx={buttonStyles}>
			<LogoutIcon />
			<span style={{ marginLeft: '6px' }}>Log Out</span>
			</Button>
			)}
		</div>
		</Toolbar>
	</AppBar>
	);
};