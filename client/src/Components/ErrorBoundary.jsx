import React from 'react';
import { Container, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // you could log to a remote service here
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ py: 8 }}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>Something went wrong rendering the app</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{String(this.state.error)}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Reload</Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
