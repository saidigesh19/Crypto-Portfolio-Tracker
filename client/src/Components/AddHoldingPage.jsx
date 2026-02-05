import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography } from '@mui/material';
import AddHolding from './AddHolding';
import Header from './Header';

const AddHoldingPage = () => {
  const navigate = useNavigate();

  const handleAdded = (newHolding) => {
    // after adding, navigate back to dashboard
    navigate('/dashboard');
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Holding</Typography>
            <AddHolding onHoldingAdded={handleAdded} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AddHoldingPage;
