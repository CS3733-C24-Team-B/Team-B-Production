import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, TextField, Typography, } from "@mui/material";
import "../css/login_page.css";


export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorShake, setErrorShake] = useState(false);

    const handleLogin = () => {
        if (username === "admin" && password === "admin") {
            navigate("/home");
        } else {
            setErrorMessage("Incorrect username or password. Please try again.");
            setErrorShake(true); // Triggering the shake animation
            setTimeout(() => setErrorShake(false), 500); // Resetting the shake animation after 500ms
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
                    className={errorShake ? "shake" : ""} // Applying the shake class conditionally
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Checkbox defaultChecked color="primary" />
                    <Typography variant="body2" color="black">
                        Remember me
                    </Typography>
                </Box>
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
