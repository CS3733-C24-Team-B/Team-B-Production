import React, {useEffect} from "react";
//import {Outlet} from "react-router-dom";
//import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";
import "../css/home_page.css";
import axios from "axios";
// import Canvas from "../components/Canvas.tsx";
//import PathHandler from "../components/PathHandler.tsx";
import Navbar from "../components/Navbar.tsx";
// import {MenuItem, TextField} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import LeafletMap from "../components/LeafletMap.tsx";
import {CreateEmployee} from "common/src/employeeTypes.ts";

export default function HomePage() {
    const { user, isAuthenticated} = useAuth0();
    
    useEffect(() => {
        async function createAuthenticatedEmployee() {
            const employeeInfo: CreateEmployee = {
                email: user!.email!,
            };
            const res = await axios.post("/api/employee", employeeInfo, {
                headers: {
                    "Content-Type":"application/json"
                }
            });
            if (res.status == 200) {
                console.log("Successfully submitted form");
            }
        }
        if(isAuthenticated) {
            createAuthenticatedEmployee().then();
        }
    }, [isAuthenticated, user]);

    return (
        <div className = "home-container">
            <div className = 'nav-container'>
                <Navbar/>
            </div>
            <LeafletMap/>
            {/*someone should delete this if you know what it was for and we dont need it*/}
            {/*<div className="info-container">*/}
            {/*    <div className="map-container">*/}
            {/*        /!*<PathHandler/>*!/*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

