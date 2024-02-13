import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button variant="contained" color="primary" onClick={() => logout({ returnTo: window.location.origin })}
                style={{ backgroundColor: "white" , color: "#012D5A", height: "43px"}}>
            Log Out
        </Button>
    );
};

export default LogoutButton;
