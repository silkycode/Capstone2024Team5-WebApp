import React from "react";  // Importing necessary modules from React
import { Link } from "react-router-dom";  // Importing Link component from react-router-dom
import { Box, Typography } from "@mui/material";  // Importing Box and Typography components from Material-UI

// Functional component ClickableBox
const ClickableBox = ({ title, path, icon: Icon }) => {
    return (
        // Link component to navigate to the specified path when clicked
        <Link to={path} style={{ textDecoration: 'none' }}>
            {/* Box component representing the clickable box */}
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
                {/* Box component to center content vertically and horizontally */}
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '20px',
                }}
                >
                {/* Rendering icon if provided */}
                {Icon && <Icon sx={{ color: 'white', fontSize: 40 }} />}
                {/* Rendering title */}
                <Typography variant="h5" component="div" color="white" fontWeight={'bold'} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    {title}
                </Typography>
                </Box>
            </Box>
        </Link>
    );
};

export default ClickableBox;  // Exporting the component as the default export
