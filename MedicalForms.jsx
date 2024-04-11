import React from "react"; // Importing React library
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import { Button, Grid, Paper, Typography, Link } from '@mui/material'; // Importing necessary components from Material-UI library
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing ArrowBackIcon from Material-UI

// Importing PDF files from the assets folder
import AIMMedicaidCommercialCMN from '../assets/PDF/AIM-Medicaid_Commericial-CMN-11_23.pdf';
import AIMMedicareCMN from '../assets/PDF/AIM-Medicare-CMN-5_9_23.pdf';

// Functional component MedicalForms
const MedicalForms = () => {
  const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

  // Array of documents with their names and paths
  const documents = [
    { name: 'AIM Plus Medicaid Commericial CMN', docPath: AIMMedicaidCommercialCMN },
    { name: 'AIM Plus Medicare CMN', docPath: AIMMedicareCMN },
  ];

  return (
    <div>
      {/* Button to navigate back */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />} // Icon for back arrow
        onClick={() => navigate('/')} // Click event to navigate back to home
        sx={{ mb: 2, width: '150px', height: '40px' }} // Custom styles for button
      >
        Go Back
      </Button>
      {/* Title for the page */}
      <Typography variant="h4" component="div" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Medical Forms
      </Typography>
      {/* Grid container to display documents */}
      <Grid container spacing={2}>
        {documents.map((doc, index) => (
          <Grid item xs={12} sm={6} key={index}>
            {/* Paper component to display each document */}
            <Paper elevation={6} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{doc.name}</Typography> {/* Document name */}
              {/* Link to open the PDF document in a new tab */}
              <Link href={doc.docPath} target="_blank" sx={{ textDecoration: 'none', mt: 2, display: 'block' }}>
                Open PDF
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MedicalForms; // Exporting MedicalForms component
