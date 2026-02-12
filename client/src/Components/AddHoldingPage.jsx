import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button } from '@mui/material';
import AddHolding from './holdings/AddHolding';
import Header from './Header';

const AddHoldingPage = () => {
  const navigate = useNavigate();

  // Handler called after a holding is successfully added
  const handleAdded = (newHolding) => {
    // After adding, navigate back to dashboard
    navigate('/dashboard');
  };

  // Render the add holding form and header
  return (
    <>
      {/* App header without Add Holding button */}
      <Header hideAddHolding />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            {/* Title and close button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Add New Holding</Typography>
              <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')}>Close</Button>
            </div>
            {/* AddHolding form component */}
            <AddHolding onHoldingAdded={handleAdded} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

// Export AddHoldingPage component
export default AddHoldingPage;
