import React from "react"; // Importing necessary modules from React
import { Link, useNavigate } from 'react-router-dom'; // Importing Link and useNavigate from react-router-dom
import { AppBar, Toolbar, Button, IconButton } from '@mui/material'; // Importing necessary components from Material-UI
import { 
  Help as HelpIcon, 
  ContactMail as ContactIcon, 
  AccountCircle as AccountCircleIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material'; // Importing necessary icons from Material-UI
import TitleLogo from '../assets/images/svgs/title-removebg-preview.png'; // Importing company logo

// Styles for buttons
const buttonStyles = {
  fontSize: '1.3rem',
  padding: '15px',
};

// Functional component Header
export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

  return (
    // Header bar with app title and navigation buttons
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1500, backgroundColor: '#fff' }}>
      <Toolbar sx={{ color: '#333', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Company logo */}
        <IconButton edge="start" sx={{ mr: 2 }}>
          <img src={TitleLogo} alt="Company Logo" height="100px" />
        </IconButton>
        <div>
          {/* Help button */}
          <Button component={Link} to="/help" sx={buttonStyles}>
            <HelpIcon />
            <span style={{ marginLeft: '6px' }}>Help</span>
          </Button>
          {/* Contact Us button */}
          <Button component={Link} to="/contact" sx={buttonStyles}>
            <ContactIcon />
            <span style={{ marginLeft: '6px' }}>Contact Us</span>
          </Button>
          {/* Dashboard button */}
          <Button component={Link} to={isLoggedIn ? "/dashboard" : "/"} sx={buttonStyles}>
            <AccountCircleIcon />
            <span style={{ marginLeft: '6px' }}>Dashboard</span>
          </Button>
          {/* Logout button (visible only when user is logged in) */}
          {isLoggedIn && (
          <Button onClick={() => {
            localStorage.removeItem('jwtToken'); // Properly clear the token on logout
            setIsLoggedIn(false); 
            navigate('/');}} 
            sx={buttonStyles}>
            <LogoutIcon />
            <span style={{ marginLeft: '6px' }}>Log Out</span>
          </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
