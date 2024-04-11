import React from 'react'; // Importing necessary modules from React
import { Link, Outlet, useLocation } from 'react-router-dom'; // Importing Link, Outlet, and useLocation from react-router-dom
import { styled } from '@mui/system'; // Importing styled from MUI system
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
} from '@mui/material'; // Importing specific components from Material-UI
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
  } from '@mui/icons-material'; // Importing specific icons from Material-UI icons

import ClickableBox from './ClickableBox'; // Importing ClickableBox component from local file

const drawerWidth = 250; // Defining drawer width

// Styling the Drawer component using styled from MUI system
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

// Functional component Dashboard
export default function Dashboard({username}) {
  const [open, setOpen] = React.useState(false); // State variable to manage drawer open/close
  const location = useLocation(); // Getting current location using useLocation hook from react-router-dom

  // Function to toggle drawer open/close
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  return (
    // Container component to contain the Dashboard content
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {/* Drawer component for navigation */}
        <Drawer variant="permanent" open={open} sx={{ zIndex: 1200 }}>
            {/* Toolbar for drawer */}
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
                >
                {/* IconButton to toggle drawer */}
                <IconButton onClick={toggleDrawer}
                sx={{ color: 'white' }}>
                    {open ? <ChevronLeftIcon sx={{fontSize: '42px'}}/> : <ChevronRightIcon sx={{fontSize: '42px'}}/>}
                </IconButton>
            </Toolbar>
            <Divider />
            {/* List for navigation links */}
            <List component="nav">
                <React.Fragment>
                    {/* List item for Profile */}
                    <ListItemButton component={Link} to="/dashboard/profile">
                    <ListItemIcon sx={{color: "white"}}>
                        <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                        <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                            Profile
                        </Typography>
                        }
                    />
                    </ListItemButton>
                    {/* List item for Glucose Logs */}
                    <ListItemButton component={Link} to="/dashboard/glucose-logs">
                    <ListItemIcon sx={{color: "white"}}>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                            Glucose Logs
                        </Typography>
                        }
                    />
                    </ListItemButton>
                    {/* List item for Appointments */}
                    <ListItemButton component={Link} to="/dashboard/appointments">
                    <ListItemIcon sx={{color: "white"}}>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                        <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                            Appointments
                        </Typography>
                        }
                    />
                    </ListItemButton>
                    {/* List item for Notifications */}
                    <ListItemButton component={Link} to="/dashboard/notifications">
                    <ListItemIcon sx={{color: "white"}}>
                        <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                        <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
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
            {/* Container for main content */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Typography for dashboard title */}
                <Typography variant="h6" gutterBottom component="div">
                    {username}'s Dashboard
                </Typography>
                {/* Conditionally rendering ClickableBox components based on location */}
                {location.pathname === "/dashboard" && (
                    <Box sx={{ display: 'flex', alignContent: 'vertical', gap: '40px', flexWrap: 'wrap' }}>
                        <ClickableBox title="Log Your Glucose" path="/dashboard/glucose-logs" icon={EditNoteIcon} />
                        <ClickableBox title="Notifications" path="/dashboard/notifications" icon={PriorityHighIcon} />
                        <ClickableBox title="Appointments"path="/dashboard/appointments" icon={EditCalendarIcon} />
                        <ClickableBox title="Profile" path="/dashboard/profile" icon={AccountBoxIcon}/>
                        <ClickableBox title="Product Info" path="/dashboard/products" icon={MedicalServicesIcon}/>
                        <ClickableBox title="Blank Medical Forms" path="/dashboard/medical-forms" icon={PrintIcon}/>
                    </Box>
                )}
                {/* Rendering nested routes */}
                <Outlet />
            </Container>
        </Box>
    </Box>
  );
}
