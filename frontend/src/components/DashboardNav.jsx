import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  AccountBox as AccountBoxIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard/profile">
      <ListItemIcon sx={{color: "white"}}>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}}>
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
          <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}}>
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
          <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}}>
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
          <Typography variant="h6" color="white" sx={{fontWeight: 'bold'}}>
            Notifications
          </Typography>
        }
      />
    </ListItemButton>
  </React.Fragment>
);