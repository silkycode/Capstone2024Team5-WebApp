import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from '../assets/images/svgs/white-go-back-button.png';
import { Button, Grid, Paper, Typography, Link } from '@mui/material';

const MedicalForms = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const getDocumentPath = (docName) => `${process.env.PUBLIC_URL}/assets/PDF/${docName}`;

  const documents = [
    { name: 'AIM Plus Medicaid Commericial CMN', docName: `AIM-Medicaid_Commericial-CMN-11_23.pdf` },
    { name: 'AIM Plus Medicare CMN', docName: `AIM-Medicare-CMN-5_9_23.pdf` },
  ];

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.backButton}
        startIcon={<img src={BackButton} alt="Go Back" />}
        onClick={() => navigate('/')}
      >
        Go Back
      </Button>
      <Typography variant="h4" component="div" gutterBottom>
        Medical Forms
      </Typography>
      <Grid container spacing={2} className={classes.container}>
        {documents.map((doc, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper className={classes.paper}>
              <Typography variant="h6">{doc.name}</Typography>
              <Link href={getDocumentPath(doc.docName)} target="_blank" sx={{ textDecoration: 'none' }}>
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