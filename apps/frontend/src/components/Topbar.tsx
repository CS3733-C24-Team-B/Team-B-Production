import React, {useEffect, useState} from "react";
import logo from "../images/BandW-Logo-White.png";
import "../css/topbar.css";
import {useAuth0} from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import axios from "axios";
import {Employee} from "database";

export default function Topbar() {
    const {user, isAuthenticated, getAccessTokenSilently, loginWithRedirect} = useAuth0();
    const [employee, setEmployee] = useState<Employee>();
    const [profilePicture, setProfilePicture] = useState("");

    useEffect(() => {
        async function fetch() {

            if (isAuthenticated) {
                let accessToken: string = "";
                try {
                    accessToken = await getAccessTokenSilently();
                } catch (error) {
                    await loginWithRedirect();
                }

                const res2 = await axios.get("/api/employee/" + user!.email, {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });

                setEmployee(res2.data);

                const res = await axios.get("/api/employee/profile-picture/" + user!.email, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        responseType: "arraybuffer"
                    }
                });

                setProfilePicture(res.data ? "data:image;base64," + res.data : user!.picture!);

            }
        }

        fetch().then();
    }, [isAuthenticated, getAccessTokenSilently, user, loginWithRedirect]);

    const LoginButton = () => {
        const {loginWithRedirect, user} = useAuth0();
        console.log(user);
        return (
            <Button variant="contained" color="primary" onClick={() => loginWithRedirect()}
                    style={{backgroundColor: "white", color: "black", maxHeight: '50%', fontSize: '70%'}}>
                Login
            </Button>
        );
    };

    return (
        <div className={"TopGreen"}>
            <a href="https://www.brighamandwomens.org" target="_blank">
                <img src={logo} className={"logo-style"} alt="hospital logo"/>
            </a>
            <div className="translate-card" id="google_translate_element"></div>
            <div className={"profile-card"}>
                {isAuthenticated ?
                    <p className={"profile-text"}>
                        {employee === undefined ? "" : employee.firstName + " " + employee.lastName}
                    </p> : <></>}
                {isAuthenticated ?
                    <a href={"/profile-info"}>
                    <img src={profilePicture} className={"profile-icon"}
                         alt="profile picture"/> </a> : <LoginButton/>}
            </div>
        </div>
    );
}
