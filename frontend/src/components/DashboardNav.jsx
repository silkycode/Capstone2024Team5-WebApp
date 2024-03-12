import * as React from 'react';
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
    <ListItemButton>
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
    <ListItemButton>
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
    <ListItemButton>
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
    <ListItemButton>
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

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon sx={{color: "white"}}>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="h7" color="white" sx={{fontWeight: 'bold'}}>
            Log Out
          </Typography>
        }
      />
    </ListItemButton>
  </React.Fragment>
);