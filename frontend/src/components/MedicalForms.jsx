import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from '../assets/images/svgs/white-go-back-button.png';
import { Button, Grid, Paper, Typography, Link } from '@mui/material';

// from assets folder
import AIMMedicaidCommercialCMN from '../assets/PDF/AIM-Medicaid_Commericial-CMN-11_23.pdf';
import AIMMedicareCMN from '../assets/PDF/AIM-Medicare-CMN-5_9_23.pdf';

const MedicalForms = () => {
  const navigate = useNavigate();

  // Documents array
  const documents = [
    { name: 'AIM Plus Medicaid Commericial CMN', docPath: AIMMedicaidCommercialCMN },
    { name: 'AIM Plus Medicare CMN', docPath: AIMMedicareCMN },
  ];

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<img src={BackButton} alt="Go Back" />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }} // Inline styling for margin-bottom
      >
        Go Back
      </Button>
      <Typography variant="h4" component="div" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Medical Forms
      </Typography>
      <Grid container spacing={2}>
        {documents.map((doc, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper sx={{ p: 2, textAlign: 'center' }}> {/* Inline styling for padding and text alignment */}
              <Typography variant="h6">{doc.name}</Typography>
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

export default MedicalForms;