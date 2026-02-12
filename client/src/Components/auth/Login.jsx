import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { login } from "../../api/auth";
import LockIcon from '@mui/icons-material/Lock';
import { setCookie } from '../../utils/cookies';

export default function Login() {
  // State for email, password, error message, and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // Call login API with email and password
      const data = await login({ email, password });
      if (data) {
        // Store token if present
        if (data.token) localStorage.setItem("token", data.token);

        // Extract user info from API response
        const user = data.user || data;
        // Get user ID from possible fields or fallback
        const userId =
          user?._id ||
          user?.id ||
          user?.userId ||
          user?.idStr ||
          user ||
          "demo-user";

        // Store userId in cookies and user info in localStorage
        setCookie("userId", userId);
        localStorage.setItem("user", JSON.stringify(user));
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      // Show error alert and set error message
      alert("Login failed: " + (err.message || err));
      setMsg(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Render login form UI
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ background: 'linear-gradient(135deg, #181c2f 0%, #232946 80%, #6366f1 100%)', color: 'var(--text)', boxShadow: '0 8px 32px rgba(76,81,255,0.10)', border: 'none', borderRadius: '24px', backdropFilter: 'blur(8px)' }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <LockIcon sx={{ fontSize: 80 }} />
            <Typography variant="h5">Welcome back</Typography>

            {msg && <Alert severity="error">{msg}</Alert>}

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ width: "100%", mt: 1 }}
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 1 }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))', color: '#e6eef8', fontWeight: 700 }}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </Box>

            <Button
              variant="text"
              onClick={() => navigate("/register")}
              sx={{ color: "#fff" }}
            >
              Create an account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
