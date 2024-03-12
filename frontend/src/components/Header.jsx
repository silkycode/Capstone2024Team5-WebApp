import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { Help as HelpIcon, 
ContactMail as ContactIcon, 
ShoppingCart as OrdersIcon, 
AccountCircle as AccountCircleIcon, 
Logout as LogoutIcon } from '@mui/icons-material';

import TitleLogo from '../assets/images/svgs/title-removebg-preview.png';

const buttonStyles = {
  fontSize: '1.2rem',
  padding: '15px',
};

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  return (
    <AppBar position="sticky" sx={{ top: 0, backgroundColor: '#fff' }}>
      <Toolbar sx={{ height: '100px', color: '#333', justifyContent: 'space-between' }}>
        <div>
          <IconButton edge="start" sx={{ mr: 2 }}>
            <img src={TitleLogo} alt="Company Logo" height="100px" />
          </IconButton>
        </div>
        <div>
          <Button component={Link} to="/help" sx={buttonStyles}>
            <HelpIcon />
            Help
          </Button>
          <Button component={Link} to="/contact" sx={buttonStyles}>
            <ContactIcon />
            Contact Us
          </Button>
          <Button component={Link} to={isLoggedIn ? "/orders" : "/"} sx={buttonStyles}>
            <OrdersIcon />
            My Orders
          </Button>
          <Button component={Link} to={isLoggedIn ? "/dashboard" : "/"} sx={buttonStyles}>
            <AccountCircleIcon />
            Dashboard
          </Button>
          {isLoggedIn && (
          <Button onClick={() => {setIsLoggedIn(false); navigate('/');}} sx={buttonStyles}>
            <LogoutIcon />
            Log Out
          </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};