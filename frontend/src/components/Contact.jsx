import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  Container,
  Box,
  Typography,
  Link,
  TextField,
  Grid,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function Contact() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // TODO: API endpoint for user messages
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    e.target.reset();
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Grid container spacing={4} justifyContent="center">
        <Grid item md={6} mt={3} xs={12}>
          <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LocationOnIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Our Address
            </Typography>
            <Typography>
              6521 AL Hwy 69 S, Suit N,
              <br />
              Tuscaloosa, AL 35405
            </Typography>

            <Avatar sx={{ m: 1, mt: 3, bgcolor: "primary.main" }}>
            <PhoneIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Phone
            </Typography>
            <Typography>(866)-919-1246</Typography>

            <Avatar sx={{ m: 1, mt: 3, bgcolor: "primary.main" }}>
              <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Email
            </Typography>
            <Typography>info@aimplusmedicalsupplies.com</Typography>
            <Link
              href="http://www.aimplusmedicalsupplies.com"
              target="_blank"
              rel="noopener"
              >
              http://www.aimplusmedicalsupplies.com
            </Link>
          </Box>
        </Grid>
        <Grid item mt={3} md={6} xs={12}>
          <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
            >
            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
            Send us a Message
            </Typography>
            <form onSubmit={handleSubmit} sx={{ width: "100%", mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Your Email"
                name="email"
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                id="message"
                label="Your Message"
                name="message"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 1, fontWeight: 'strong' }}
                >
                Send Message
              </Button>
            </form>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 8, fontWeight: 'strong' }}
              onClick={() => navigate("/")}
              >
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};