import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import Navbar from "../components/Navbar.tsx";
import "../css/servicelist_page.css";
import EmployeeManager from "../components/EmployeeManager.tsx";

export default function AdminViewer() {

    const {user, isAuthenticated, isLoading} = useAuth0();
    const isAdmin: boolean = isAuthenticated && user!.email! === "softengc24b@gmail.com";

    if (isLoading) {
        return <div>Loading ... </div>;
    }

    if (!isAdmin) {
        return window.location.href = "/";
    }

    return (
        <div className="node-data-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <EmployeeManager/>
        </div>
    );
}