import React from "react";
import "../css/home_page.css";
import Navbar from "../components/Navbar.tsx";
import LeafletMap from "../components/LeafletMap.tsx";

export default function HomePage() {
    return (
        <div className="Nav-container-white">
            <div className="nav-container">
                <Navbar/>
            </div>
            <LeafletMap />
        </div>
    );
}

