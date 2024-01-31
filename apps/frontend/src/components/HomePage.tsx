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
import Canvas from "./Canvas.tsx";
import PathHandler from "./PathHandler.tsx";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

interface FloorImages {
    groundfloor: string;
    lowerlevel1: string;
    lowerlevel2: string;
    firstfloor: string;
    secondfloor: string;
    thirdfloor: string;
}

export default function HomePage() {
    const [selectedFloor, setSelectedFloor] = useState<keyof FloorImages>("lowerlevel1");
    // const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);

    const handleFloorChange = (floor: keyof FloorImages) => {
        setSelectedFloor(floor);
    };

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
                <div className="title">Navigation Page</div>
                <div className="logo">
                    <img src={logo} alt="Hospital Logo"/>
                </div>
            </header>
            <Navbar/>
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
            <div id="map-container">
                <Canvas imageSource={floorImages[selectedFloor]} width={window.innerWidth}/>
                {/*<img src={floorImages[selectedFloor]} alt="floor" id="map-image" />*/}
                {/*{clickPosition && (*/}
                {/*    <div style={{ position: 'absolute', left: clickPosition.x, top: clickPosition.y }}>*/}
                {/*        <div style={{ width: 20, height: 2, backgroundColor: 'red', position: 'absolute', transform: 'translate(-50%, -50%)' }} />*/}
                {/*        <div style={{ width: 2, height: 20, backgroundColor: 'red', position: 'absolute', transform: 'translate(-50%, -50%)' }} />*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
            <Outlet/>
            <PathHandler/>
            <Footer/>
        </div>
        </body>
    );
}
