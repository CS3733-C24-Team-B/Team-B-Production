import React, { useState } from "react";
import { Avatar, Typography, Container, Paper, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    paper: {
        marginTop: 22.5,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Center both vertically and horizontally
    },
    avatar: {
        width: 100,
        height: 100,
    },
    form: {
        width: '100%',
        marginTop: 20,
    },
    button: {
        marginTop: 20,
    },
});

export default function ProfilePage() {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChangePassword = () => {
        // Handle password change logic
        alert('Password changed successfully');
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar} alt="User Avatar" src="https://example.com/avatar.jpg" />

                <Typography variant="h5" gutterBottom>
                    John Doe
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    john.doe@example.com
                </Typography>

                <form className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Change Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        className={classes.button}
                        onClick={() => alert('Username changed successfully')}
                    >
                        Change Username
                    </Button>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Change Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePasswordVisibility}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePasswordVisibility}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        className={classes.button}
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
