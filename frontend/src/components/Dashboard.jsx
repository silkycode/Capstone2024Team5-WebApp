import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  List,
  Divider,
  IconButton,
  Container
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { mainListItems } from './DashboardNav';

// Components
import Appointments from './Appointments'
import GlucoseLogs from './GlucoseLogs'
import MedicalForms from './MedicalForms'
import Products from './Products'
import Profile from './Profile'
import Notifications from './Notifications'


const drawerWidth = 250;
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      background: theme.palette.primary.main,
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
  }),
);

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <Routes>
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/glucose-logs" element={<GlucoseLogs />} />
            <Route path="/dashboard/appointments" element={<Appointments />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
        </Routes>
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
            <IconButton onClick={toggleDrawer}
            sx={{ color: 'white' }}>
                {open ? <ChevronLeftIcon sx={{fontSize: '42px'}}/> : <ChevronRightIcon sx={{fontSize: '42px'}}/>}
            </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                {mainListItems}
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            }}
        >
            <Toolbar />
        </Box>
    </Box>
  );
}