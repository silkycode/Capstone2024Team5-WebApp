import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function ClickableBox({ title, path, icon: Icon }) {
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
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '20px',
                }}
                >
                {Icon && <Icon sx={{ color: 'white', fontSize: 40 }} />}
                <Typography variant="h5" component="div" color="white" fontWeight={'bold'} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    {title}
                </Typography>
                </Box>
            </Box>
        </Link>
    );
};