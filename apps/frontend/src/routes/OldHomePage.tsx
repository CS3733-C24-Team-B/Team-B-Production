import React from "react";
import "../css/home_page.css";
import Navbar from "../components/Navbar.tsx";
import NavbarLogout from "../components/NavbarLogout.tsx";
import LeafletMap from "../components/LeafletMap.tsx";
import {useAuth0} from "@auth0/auth0-react";

export default function HomePage() {
    const {user, isAuthenticated} = useAuth0();
    console.log(user);

    return (
        <div className="Nav-container-white">
            <div className="nav-container">
                {isAuthenticated ? <Navbar /> : <NavbarLogout />}
            </div>
            <Navbar />
            <LeafletMap />
        </div>
    );
}

