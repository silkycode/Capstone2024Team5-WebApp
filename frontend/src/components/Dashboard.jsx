import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
  Container,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
    AccountBox as AccountBoxIcon,
    People as PeopleIcon,
    Notifications as NotificationsIcon,
    Assignment as AssignmentIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
  } from '@mui/icons-material';

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

const ClickableBox = ({ title, path }) => {
    return (
        <Link to={path} style={{ textDecoration: 'none' }}>
            <Box
                sx={{
                width: '300px',
                height: '200px',
                backgroundColor: '#ff3856',
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                },
                }}
            >
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '20px',
                }}
                >
                <Typography variant="h5" component="div" color="white" fontWeight={'bold'} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    {title}
                </Typography>
                </Box>
            </Box>
        </Link>
    );
};

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
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
                <IconButton onClick={toggleDrawer}
                sx={{ color: 'white' }}>
                    {open ? <ChevronLeftIcon sx={{fontSize: '42px'}}/> : <ChevronRightIcon sx={{fontSize: '42px'}}/>}
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                <React.Fragment>
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
                <Typography variant="h4" gutterBottom component="div">
                    Hello, USER!
                </Typography>
                {location.pathname === "/dashboard" && (
                    <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <ClickableBox title="Log Your Glucose" path="/dashboard/glucose-logs" />
                        <ClickableBox title="Notifications" path="/dashboard/notifications"/>
                        <ClickableBox title="Profile" path="/dashboard/profile"/>
                        <ClickableBox title="Appointments"path="/dashboard/appointments" />
                        <ClickableBox title="Product Info" path="/dashboard"/>
                        <ClickableBox title="Blank Medical Forms" path="/dashboard"/>
                    </Box>
                )}
                <Outlet />
            </Container>
        </Box>
    </Box>
  );
}