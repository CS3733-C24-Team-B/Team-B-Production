import React from "react";
import logo from "../images/BandW-Logo-White.png";
import "../css/topbar.css";
import {useAuth0} from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";

export default function Topbar() {
    const {user, isAuthenticated} = useAuth0();

    return (
        <div className={"TopGreen"}>
            <img src={logo} className={"logo-style"}/>
            <div></div>
            <div className={"profile-card"}>
                {isAuthenticated ? <p className={"profile-text"}>{user!.email}</p> : <></>}
                <AuthenticationButton/>
            </div>
        </div>
    );
}
