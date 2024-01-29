import React, {useState} from "react";
import {Outlet} from "react-router-dom";
import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";
import "../css/home_page.css";
import groundfloor from "../images/00_thegroundfloor.png";
import lowerlevel1 from "../images/00_thelowerlevel1.png";
import lowerlevel2 from "../images/00_thelowerlevel2.png";
import firstfloor from "../images/01_thefirstfloor.png";
import secondfloor from "../images/02_thesecondfloor.png";
import thirdfloor from "../images/03_thethirdfloor.png";

interface FloorImages {
    groundfloor: string;
    lowerlevel1: string;
    lowerlevel2: string;
    firstfloor: string;
    secondfloor: string;
    thirdfloor: string;
}

export default function HomePage() {
    // State to keep track of the selected floor
    const [selectedFloor, setSelectedFloor] = useState<keyof FloorImages>("groundfloor");

    // Function to handle floor selection change
    const handleFloorChange = (floor: keyof FloorImages) => {
        setSelectedFloor(floor);
    };

    // Mapping of floor names to their corresponding images
    const floorImages: FloorImages = {
        groundfloor,
        lowerlevel1,
        lowerlevel2,
        firstfloor,
        secondfloor,
        thirdfloor,
    };

    return (
        <body>
        <div className="App">
            <header className="App-header">
                <div className="title">Welcome to Home Page</div>
                <div className="logo">
                    <img src={logo} alt="Hospital Logo"/>
                </div>
            </header>
            <div className="navbar">
                <div className="navbar-butn">
                    <a href="/home">Home</a>
                </div>
                <div className="navbar-butn">
                    <a href="/csvdata">CSV Data</a>
                </div>
                <div className="navbar-butn">
                    <a href="/requestForm">Request Form</a>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Admin Options</button>
                    <div className="dropdown-content">
                        <a href="/servicerequestform">Service Request Form</a>
                        <a href="/servicerequestlist">List of Service Requests</a>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Floor</button>
                    <div className="dropdown-content">
                        {/* Dropdown options for selecting the floor */}
                        <a onClick={() => handleFloorChange("lowerlevel1")}>
                            Lower Level 1
                        </a>
                        <a onClick={() => handleFloorChange("lowerlevel2")}>
                            Lower Level 2
                        </a>
                        <a onClick={() => handleFloorChange("groundfloor")}>
                            Ground Floor
                        </a>
                        <a onClick={() => handleFloorChange("firstfloor")}>
                            First Floor
                        </a>
                        <a onClick={() => handleFloorChange("secondfloor")}>
                            Second Floor
                        </a>
                        <a onClick={() => handleFloorChange("thirdfloor")}>
                            Third Floor
                        </a>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Profile</button>
                    <div className="dropdown-content">
                        <a href="/home">View Profile</a>
                        <link
                            rel="stylesheet"
                            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                        />
                        <a href="/settings">
                            <div className="fa fa-gear fa-spin"></div>
                            Settings
                        </a>
                        <a href="/">Log Out</a>
                    </div>
                </div>
                <div id="map-container">
                    {/* Display the selected floor image */}
                    <img src={floorImages[selectedFloor]} alt="floor" id="map-image"/>
                </div>

                <Outlet/>
            </div>
        </div>
        </body>
    );
}
