import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/system';
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  List,
  Divider,
  IconButton,
  Container,
  Typography
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './ListItems';

const drawerWidth = 250;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

const ClickableBox = ({ title, onClick }) => {
    return (
      <Box
        sx={{
          width: '400px',
          height: '200px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        }}
        onClick={onClick}
      >
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Box>
      </Box>
    );
};

const handleClick = (route) => {
    // You can handle navigation to different routes here
    console.log('Navigating to:', route);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom component="div">
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <ClickableBox title="Gulcose Logs" onClick={() => handleClick('/glucose')} />
            <ClickableBox title="My Orders" onClick={() => handleClick('/?')} />
            <ClickableBox title="Products" onClick={() => handleClick('./ListItems')} />
            <ClickableBox title="Appointments" onClick={() => handleClick('/?')} />
            {/* Add more clickable boxes as needed */}
          </Box>
        </Container>
      </Box>
    </Box>
  );
      } 