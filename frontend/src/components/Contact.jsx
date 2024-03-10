import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stack from "@mui/material/Stack";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <Card className="container" sx={{ maxWidth: 400, margin: "auto", marginTop: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" marginBottom={2}>
          <Button
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ color: "#3f51b5", borderColor: "#3f51b5" }}
          >
            Go Back
          </Button>
        </Stack>

        <Typography variant="h4" component="div" sx={{ marginTop: 1, marginBottom: 2, color: "#3f51b5" }}>
          Contact
        </Typography>

        <div className="contact-info">
          <Stack direction="column" spacing={1} marginBottom={2}>
            <Typography variant="h6">
              <LocationOnIcon fontSize="small" /> Our Address:
            </Typography>
            <Typography>6521 AL Hwy 69 S, Suit N,</Typography>
            <Typography>Tuscaloosa, AL 35405</Typography>
          </Stack>

          <Stack direction="column" spacing={1} marginBottom={2}>
            <Typography variant="h6">
              <PhoneIcon fontSize="small" /> Phone:
            </Typography>
            <Typography>(866)-919-1246</Typography>
          </Stack>

          <Stack direction="column" spacing={1}>
            <Typography variant="h6">
              <EmailIcon fontSize="small" /> Email:
            </Typography>
            <Typography>info@aimplusmedicalsupplies.com</Typography>
            <Typography>aimplusmedicalsupplies.com</Typography>
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;