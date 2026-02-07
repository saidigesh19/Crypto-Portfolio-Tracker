import { useState } from "react";
import person from "../assets/react.svg";
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
import { signup } from "../api/auth";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, email, password, confirmpassword } = data;
    if (!name || !email || !password || !confirmpassword) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (confirmpassword !== password) {
      setError("Password and Confirm Password should be same");
      return false;
    }

    setError(null);
    return true;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result) {
        const newUser = result.user || result;
        const userId = newUser?._id || newUser?.id || newUser?.userId || "demo-user";
        localStorage.setItem("userId", userId);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/");
      }
    } catch (err) {
      console.log(err, "Try again");
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img src={person} alt="person" style={{ width: 64 }} />
            <Typography variant="h5">Create your account</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <Box
              component="form"
              onSubmit={register}
              sx={{
                width: "100%",
                mt: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <TextField
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                size="small"
              />
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                size="small"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={data.password}
                onChange={handleChange}
                required
                size="small"
              />
              <TextField
                label="Confirm Password"
                name="confirmpassword"
                type="password"
                value={data.confirmpassword}
                onChange={handleChange}
                required
                size="small"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, color: "#fff" }}
              >
                {loading ? "Creating..." : "Sign Up"}
              </Button>
            </Box>

            <Button variant="text" onClick={() => navigate("/")} sx={{ color: "#fff" }}>
              Already have an account? Log in
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
