import React, {useEffect, useState} from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/profile_page.css";
import {useAuth0} from "@auth0/auth0-react";
import AuthenticationButton from "../components/AuthenticationButton.tsx";
import axios from "axios";
import {Button} from "@mui/material";

export default function ProfilePage() {
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
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
        <div className={"Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"Profile-page-TwoColumns"}>
                    <div className={"Profile-page-TwoRows"}>
                        <div className={"Profile-pic-main-TestCard"}>
                            {isAuthenticated ? <img className={"Profile-page-pic"} src={user && user.picture}/> :
                                <AuthenticationButton/>}
                            <div className={"Profile-page-text"}>
                                <p className={"Profile-page-firstcard-text"}> {user&&getNameOrEmail(user!.email!)} </p>
                                <p className={"Profile-page-firstcard-text"}> {user&&user.email} </p>
                            </div>
                            <div className={"Profile-page-edit-button"}>
                            <Button variant="contained" color="primary"
                                    style={{backgroundColor: "#34AD84"}}>
                                Update Info
                            </Button>
                            </div>
                        </div>
                        <div className={"TestCard"}></div>
                    </div>
                    <div className={"Profile-page-ThreeRows"}>
                        <div className={"TwoColumnsFirstRow"}>
                            <div className={"Profile-page-top-TestCard"}></div>
                            <div className={"Profile-page-top-TestCard"}></div>
                            <div className={"Profile-page-top-TestCard"}></div>
                        </div>
                        <div className={"Profile-page-TwoColumnsSecondRow"}>
                            <div className={"TestCard"}></div>
                            <div className={"Profile-page-TwoColumnsSecondRow-SecondColumns"}>
                                <div className={"SecondRow_SecondColumn-TestCard"}></div>
                                <div className={"SecondRow_SecondColumn-TestCard"}></div>
                            </div>
                        </div>
                        <div className={"Profile-page-TwoColumnsThirdRow"}>
                            <div className={"Profile-page-bottom-TestCard"}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
