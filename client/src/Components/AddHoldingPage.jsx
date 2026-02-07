import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button } from '@mui/material';
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Add New Holding</Typography>
              <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')}>Close</Button>
            </div>
            <AddHolding onHoldingAdded={handleAdded} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AddHoldingPage;
