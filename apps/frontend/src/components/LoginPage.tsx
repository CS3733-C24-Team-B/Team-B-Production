import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, TextField, Typography, } from "@mui/material";
import "../css/login_page.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = () => {
        if (username === "admin" && password === "admin") {
            navigate("/home");
        } else {
            setErrorMessage("Incorrect username or password. Please try again.");
        }
    };

    const handleCreateAcc = () => {
        navigate("/createacc");
    };

    const handleForgotPass = () => {
        navigate("/forgotpass");
    };

    return (
        <Box className="App">
            <Box className="login-box">
                <Typography variant="h4" color="#115293" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                />
                <Checkbox defaultChecked color="primary" sx={{ mb: 2 }} />
                <Button variant="contained" onClick={handleLogin} fullWidth>
                    Log In
                </Button>
                {errorMessage && (
                    <Typography key="error-message" variant="body2" color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                    <Button variant="text" onClick={handleForgotPass} sx={{ mr: 1 }}>
                        Forgot Password?
                    </Button>
                    <Button variant="text" onClick={handleCreateAcc}>
                        Create Account
                    </Button>
                </Box>
            </Box>
            <Outlet />
        </Box>
    );
}

