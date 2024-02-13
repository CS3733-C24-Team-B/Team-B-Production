import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

const LoginButton = () => {
    const { loginWithRedirect, user } = useAuth0();
    console.log(user);
    return (
        <Button variant="contained" color="primary" onClick={() => loginWithRedirect({ returnTo: window.location.origin })}
                style={{ backgroundColor: "white" , color: "#012D5A", height: "43px"}}>
            Login
        </Button>
    );
};

export default LoginButton;
