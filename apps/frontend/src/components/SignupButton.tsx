import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import Button from "@mui/material/Button";

const SignupButton = () => {
    const {loginWithRedirect, user} = useAuth0();
    console.log(user);
    return (
        <Button variant="contained" color="primary" onClick={() => loginWithRedirect({
            authorizationParams: {
                screen_hint: "signup"
            }
        })}
                style={{backgroundColor: "white", color: "black"}}>
            Create New Employee Account
        </Button>
    );
};

export default SignupButton;
