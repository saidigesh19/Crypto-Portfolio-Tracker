import { useState } from "react";
import person from "../../assets/react.svg";
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
import { signup } from "../../api/auth";


// Register component handles user registration logic and UI
const Register = () => {
  // State for form data, error messages, and loading status
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form fields before submitting
  const validate = () => {
    const { name, email, password, confirmpassword } = data;
    // Check for empty fields
    if (!name || !email || !password || !confirmpassword) {
      setError("All fields are required");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    // Confirm password match
    if (confirmpassword !== password) {
      setError("Password and Confirm Password should be same");
      return false;
    }

    setError(null);
    return true;
  };

  // Handle form submission and user registration
  const register = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      // Call signup API with user data
      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result) {
        // Extract user info from API response
        const newUser = result.user || result;
        // Get user ID from possible fields or fallback
        const userId = newUser?._id || newUser?.id || newUser?.userId || "demo-user";
        // Store user info in localStorage for session persistence
        localStorage.setItem("userId", userId);
        localStorage.setItem("user", JSON.stringify(newUser));
        // Redirect to home/dashboard
        navigate("/");
      }
    } catch (err) {
      // Show error alert and set error state
      alert("Registration failed: " + (err.message || err));
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };


  // Render registration form UI
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
            {/* Registration icon */}
            <img src={person} alt="person" style={{ width: 64 }} />
            <Typography variant="h5">Create your account</Typography>
            {/* Show error alert if any */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Registration form */}
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
              {/* Name input */}
              <TextField
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                size="small"
              />
              {/* Email input */}
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                size="small"
              />
              {/* Password input */}
              <TextField
                label="Password"
                name="password"
                type="password"
                value={data.password}
                onChange={handleChange}
                required
                size="small"
              />
              {/* Confirm Password input */}
              <TextField
                label="Confirm Password"
                name="confirmpassword"
                type="password"
                value={data.confirmpassword}
                onChange={handleChange}
                required
                size="small"
              />

              {/* Submit button */}
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

            {/* Link to login page */}
            <Button variant="text" onClick={() => navigate("/")} sx={{ color: "#fff" }}>
              Already have an account? Log in
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

// Export Register component
export default Register;
