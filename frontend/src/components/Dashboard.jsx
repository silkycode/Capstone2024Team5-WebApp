import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Stack } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Stack spacing={2} direction="column">
        <Button
          variant="contained"
          onClick={() => navigate("/products")}
        >
          View Products
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/glucose")}
        >
          Glucose Logs
        </Button>
        {/* Uncomment below if you want to use the BackButton image as a back button
        <Button
          variant="contained"
          startIcon={<img src={BackButton} alt="Go Back" />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        */}
      </Stack>
    </Container>
  );
};

export default Dashboard;
