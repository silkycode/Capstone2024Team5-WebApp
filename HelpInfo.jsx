import React from "react"; // Importing necessary modules from React
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
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
} from "@mui/material"; // Importing necessary components from Material-UI
import LiveHelpIcon from "@mui/icons-material/LiveHelp"; // Importing LiveHelpIcon from Material-UI
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Importing ExpandMoreIcon from Material-UI

// Functional component HelpInfo
export default function HelpInfo() {
  const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

  // FAQ data array containing objects with questions and answers
  const faqData = [
    {
      question: "How do I place an order?",
      answer:
        "TBI", // To Be Implemented
    },
    {
      question: "How can I track my orders?",
      answer:
        "TBI", // To Be Implemented
    },
    {
      question: "How can I update my profile information?",
      answer:
        "TBI", // To Be Implemented
    },
  ];

  return (
    // Container for the main content with a fixed width
    <Container component="main" maxWidth="xs">
      <CssBaseline /> {/* Normalizing CSS */}
      {/* Main content wrapper */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Avatar representing help icon */}
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LiveHelpIcon />
        </Avatar>
        {/* Title */}
        <Typography component="h1" variant="h5">
          Questions? How can we help?
        </Typography>
        {/* Accordion component for displaying FAQ */}
        <Box sx={{ mt: 3 }}>
          {faqData.map((faq, index) => (
            <Accordion key={index}>
              {/* Accordion summary with question */}
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />} // Icon indicating expandable content
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              {/* Accordion details with answer */}
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        {/* Button to navigate back */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, fontWeight: 'Strong'}} // Styling for the button
          onClick={() => navigate("/")} // Navigation action on button click
        >
          Back
        </Button>
      </Box>
    </Container>
  );
};
