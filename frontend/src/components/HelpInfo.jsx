import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function HelpInfo() {
  const navigate = useNavigate();

  const faqData = [
    {
      question: "How do I place an order?",
      answer:
        "TBI",
    },
    {
      question: "How can I track my orders?",
      answer:
        "TBI",
    },
    {
      question: "How can I update my profile information?",
      answer:
        "TBI",
    },
  ];

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LiveHelpIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Questions? How can we help?
        </Typography>
        <Box sx={{ mt: 3 }}>
          {faqData.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, fontWeight: 'Strong'}}
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </Box>
    </Container>
  );
};