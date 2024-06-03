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
  Typography,
} from '@mui/material';
import {
    EditCalendar as EditCalendarIcon,
    MedicalServices as MedicalServicesIcon,
    Print as PrintIcon,
    Notifications as NotificationsIcon,
    EditNote as EditNoteIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
  } from '@mui/icons-material';
import ClickableBox from './ClickableBox';


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: 250,
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

export default function Dashboard({ role, username }) {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();

    const toggleDrawer = () => { setOpen(!open); };
  
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
                            {open ? <ChevronLeftIcon sx={{fontSize: '42px'}}/> : <ChevronRightIcon sx={{fontSize: '42px'}}/>}
                        </IconButton>
                    </Toolbar>
                <Divider />
                <List component="nav">
                    <React.Fragment>
                        {role === 'admin' ? (
                            <>
                                <ListItemButton component={Link} to="/dashboard/account-management">
                                    <ListItemIcon sx={{color: "white"}}>
                                        <AssignmentIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                                Accounts
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                                <ListItemButton component={Link} to="/dashboard/tasks">
                                    <ListItemIcon sx={{color: "white"}}>
                                        <PeopleIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                                Tasks
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                                <ListItemButton component={Link} to="/dashboard/logs">
                                    <ListItemIcon sx={{color: "white"}}>
                                        <NotificationsIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                                Logs
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                                <ListItemButton component={Link} to="/dashboard/tasks">
                                    <ListItemIcon sx={{color: "white"}}>
                                        <NotificationsIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                                Status
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
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
                    {location.pathname === "/dashboard" && (
                        <Box sx={{ display: 'flex', alignContent: 'vertical', gap: '30px', flexWrap: 'wrap' }}>
                        {role === 'admin' ? (
                            <>
                                <ClickableBox title="Manage Accounts" path="/dashboard/account-management" icon={AssignmentIcon} />
                                <ClickableBox title="View Tasks" path="/dashboard/tasks" icon={AssignmentIcon} />
                                <ClickableBox title="App Logs" path="/dashboard/logs" icon={AssignmentIcon} />
                                <ClickableBox title="App Status" path="/dashboard/status" icon={AssignmentIcon} />
                            </>
                        ) : (
                            <>
                                <ClickableBox title="Log Your Glucose" path="/dashboard/glucose-logs" icon={AssignmentIcon} />
                                <ClickableBox title="Appointments" path="/dashboard/appointments" icon={EditCalendarIcon} />
                                <ClickableBox title="Notifications" path="/dashboard/notifications" icon={NotificationsIcon} />
                                <ClickableBox title="Product Info" path="/dashboard/products" icon={MedicalServicesIcon} />
                                <ClickableBox title="Blank Medical Forms" path="/dashboard/medical-forms" icon={PrintIcon} />
                            </>
                        )}
                        </Box>
                    )}
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}