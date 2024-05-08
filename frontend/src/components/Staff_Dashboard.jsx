import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  List,
  Divider,
  IconButton,
  Container,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  AccountBox as AccountBoxIcon,
  EditCalendar as EditCalendarIcon,
  MedicalServices as MedicalServicesIcon,
  Print as PrintIcon,
  EditNote as EditNoteIcon,
  PriorityHigh as PriorityHighIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

import ClickableBox from './ClickableBox';

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

export default function StaffDashboard({ username }) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} sx={{ zIndex: 1200 }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            {open ? <ChevronLeftIcon sx={{ fontSize: '42px' }} /> : <ChevronRightIcon sx={{ fontSize: '42px' }} />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <React.Fragment>
            <ListItemButton component={Link} to="/staff-dashboard/profile">
              <ListItemIcon sx={{ color: "white" }}>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                    Profile
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton component={Link} to="/staff-dashboard/schedule">
              <ListItemIcon sx={{ color: "white" }}>
                <EditCalendarIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                    Schedule
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton component={Link} to="/staff-dashboard/patients">
              <ListItemIcon sx={{ color: "white" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                    Patients
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton component={Link} to="/staff-dashboard/notifications">
              <ListItemIcon sx={{ color: "white" }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                    Notifications
                  </Typography>
                }
              />
            </ListItemButton>
          </React.Fragment>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom component="div">
            {username}'s Dashboard
          </Typography>
          {location.pathname === "/staff-dashboard" && (
            <Box sx={{ display: 'flex', alignContent: 'vertical', gap: '40px', flexWrap: 'wrap' }}>
              <ClickableBox title="Manage Glucose Logs" path="/staff-dashboard/gluclose" icon={EditNoteIcon} />
              <ClickableBox title="Notifications" path="/staff-dashboard/notifications" icon={PriorityHighIcon} />
              <ClickableBox title="Manage Patients" path="/staff-dashboard/patients" icon={PeopleIcon} />
              <ClickableBox title="Profile" path="/staff-dashboard/profile" icon={AccountBoxIcon} />
              <ClickableBox title="Medical Services" path="/staff-dashboard/medical-services" icon={MedicalServicesIcon} />
              <ClickableBox title="Communication" path="/staff-dashboard/communication" icon={PrintIcon} />
            </Box>
          )}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
