import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";
import "../css/home_page.css";
import groundfloor from "../images/00_thegroundfloor.png";
import lowerlevel1 from "../images/00_thelowerlevel1.png";
import lowerlevel2 from "../images/00_thelowerlevel2.png";
import firstfloor from "../images/01_thefirstfloor.png";
import secondfloor from "../images/02_thesecondfloor.png";
import thirdfloor from "../images/03_thethirdfloor.png";
import axios from "axios";
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
    // State to keep track of the selected floor
    const [selectedFloor, setSelectedFloor] = useState<keyof FloorImages>("lowerlevel1");
    const [selectedLevel, setSelectedLevel] = useState("L1");
    const [nodeData, setNodeData] = useState([]);
    useEffect(() => {
        async function fetch() {
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            } catch {
                console.log("post error");
            }
            const res = await axios.get("/api/db-get-nodes");

            console.log(res.data);
            setNodeData(res.data);
        }

        fetch().then();
    }, []);

    const arrayNode = nodeData.map(({longName}) =>
        <a href="/home">
            {longName}
        </a>
    );

    // Function to handle floor selection change
    const handleFloorChange = (floor: keyof FloorImages, level: string) => {
        setSelectedFloor(floor);
        setSelectedLevel(level);
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

    function myFunction() {
        const dropdown = document.getElementById("myDropdown");
        if (dropdown) {
            dropdown.classList.toggle("show");
        }
    }

    function filterFunction() {
        let input: HTMLInputElement | null = document.getElementById("myInput") as HTMLInputElement;
        let div: HTMLElement | null = document.getElementById("myDropdown");

        let visibleCount = 0;

        if (input && div) {
            let filter = input.value.toUpperCase();
            let a = div.getElementsByTagName("a");

            for (let i = 0; i < a.length; i++) {
                let txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    if (visibleCount < 5) { // Change 5 to your desired limit
                        a[i].style.display = "";
                        visibleCount++;
                    }else
                        a[i].style.display = "none";
                } else {
                    a[i].style.display = "none";
                }
            }
        }
    }

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
            <div className="navbar">
                <div className="dropdown">
                    <button className="dropbtn">Floor</button>
                    <div className="dropdown-content">
                        {/* Dropdown options for selecting the floor */}
                        <a onClick={() => handleFloorChange("lowerlevel1", "L1")}>
                            Lower Level 1
                        </a>
                        <a onClick={() => handleFloorChange("lowerlevel2", "L2")}>
                            Lower Level 2
                        </a>
                        <a onClick={() => handleFloorChange("groundfloor", "L3")}>
                            Ground Floor
                        </a>
                        <a onClick={() => handleFloorChange("firstfloor", "L4")}>
                            First Floor
                        </a>
                        <a onClick={() => handleFloorChange("secondfloor", "L5")}>
                            Second Floor
                        </a>
                        <a onClick={() => handleFloorChange("thirdfloor", "L6")}>
                            Third Floor
                        </a>
                    </div>
                </div>
                <div className="dropdown">
                    <input onClick={myFunction} onKeyUp={filterFunction} type="text" placeholder="Search.."
                           id="myInput"/>
                    <div id="myDropdown" className="dropdown-content">
                        {arrayNode}
                    </div>
                </div>
            </div>

            <PathHandler/>

            <div id="map-container">
                <Canvas imageSource={floorImages[selectedFloor]} currLevel={selectedLevel}/>
            </div>
            <Outlet/>
        </div>
        <Footer/>
        </body>
    );
}
