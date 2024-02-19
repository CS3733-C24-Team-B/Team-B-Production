import React from 'react';
import Button from "@mui/material/Button";
import { useAuth0 } from '@auth0/auth0-react';

const AuthenticationButton = () => {
    const { isAuthenticated } = useAuth0();

    return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

const LoginButton = () => {
    const { loginWithRedirect, user } = useAuth0();
    console.log(user);
    return (
        <Button variant="contained" color="primary" onClick={() => loginWithRedirect()}
                style={{ backgroundColor: "white" , color: "black", maxHeight: '50%', fontSize: '70%', marginTop: '1.5vh'}}>
            Login
        </Button>
    );
};

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button variant="contained" color="primary" onClick={() => logout()}
                style={{ backgroundColor: "white" , color: "black", maxHeight: '50%', fontSize: '70%', marginTop: '1.5vh'}}>
            Log Out
        </Button>
    );
};

export default AuthenticationButton;
