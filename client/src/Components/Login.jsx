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
import { login } from "../api/auth";
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const data = await login({ email, password });
      if (data) {
        if (data.token) localStorage.setItem("token", data.token);

        const user = data.user || data;
        const userId =
          user?._id ||
          user?.id ||
          user?.userId ||
          user?.idStr ||
          user ||
          "demo-user";

        localStorage.setItem("userId", userId);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
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
                sx={{ color: "#fff" }}
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
