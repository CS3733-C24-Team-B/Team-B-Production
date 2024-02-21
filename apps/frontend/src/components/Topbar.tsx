import React, {useEffect, useState} from "react";
import logo from "../images/BandW-Logo-White.png";
import "../css/topbar.css";
import {useAuth0} from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";
import axios from "axios";

export default function Topbar() {
    const {user, isAuthenticated, getAccessTokenSilently, logout} = useAuth0();
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        async function fetch() {
            const accessToken: string = await getAccessTokenSilently();
            const res2 = await axios.get("/api/employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            setEmployeeData(res2.data);
        }

        fetch().then();
    }, [getAccessTokenSilently, user]);

    function getNameOrEmail(userEmail: string) {
        let outFirst = "";
        let outLast = "";
        let outEmail = "";
        employeeData.find(({email, firstName, lastName}) => {
            if (userEmail === email) {
                outFirst = firstName;
                outLast = lastName;
                outEmail = email;
                return true;
            }
        });
        return (outFirst === null || outLast === null) ? outEmail : outFirst + " " + outLast;
    }

    return (
        <div className={"TopGreen"}>
            <a href="https://www.brighamandwomens.org" target="_blank">
                <img src={logo} className={"logo-style"} alt="hospital logo"/>
            </a>
            <div></div>
            <div className={"profile-card"}>
                {isAuthenticated ? <p className={"profile-text"}>{getNameOrEmail(user!.email!)}</p> : <></>}
                {isAuthenticated ? <img src={user && user.picture} className={"profile-icon"} onClick={() => logout()}
                                        alt="profile picture"/> : <AuthenticationButton/>}
            </div>
        </div>
    );
}
