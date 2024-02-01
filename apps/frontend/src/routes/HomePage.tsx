import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";
import "../css/home_page.css";
import groundfloor from "../images/00_thegroundfloor.png";
import lowerlevel1 from "../images/00_thelowerlevel1.png";
import lowerlevel2 from "../images/00_thelowerlevel2.png";
import firstfloor from "../images/01_thefirstfloor.png";
import secondfloor from "../images/02_thesecondfloor.png";
import thirdfloor from "../images/03_thethirdfloor.png";
import axios from "axios";
import Canvas from "../components/Canvas.tsx";
import PathHandler from "../components/PathHandler.tsx";
import Navbar from "../components/Navbar.tsx";
import SideButtons from "../components/SideButtons.tsx";

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
    const [selectedFloor, setSelectedFloor] = useState<keyof FloorImages>(
        "lowerlevel1"
    );
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

    // Function to handle floor selection change
    const handleFloorChange = (
        floor: keyof FloorImages,
        level: string
    ) => {
        setSelectedFloor(floor);
        setSelectedLevel(level);
        console.log(selectedLevel);
    };

    // Filter function
    const filterFunction = () => {
        let input: HTMLInputElement | null = document.getElementById(
            "myInput"
        ) as HTMLInputElement;
        let div: HTMLElement | null = document.getElementById(
            "myDropdown"
        );

        let visibleCount = 5;

        if (input && div) {
            let filter = input.value.toUpperCase();
            let a = div.getElementsByTagName("a");

            for (let i = 0; i < a.length; i++) {
                let txtValue = a[i].textContent || a[i].innerText;

                if (filter === "" || txtValue.toUpperCase().indexOf(filter) > -1) {
                    if (visibleCount > 0) {
                        a[i].style.display = "";
                        visibleCount--;
                    } else {
                        a[i].style.display = "none";
                    }
                } else {
                    a[i].style.display = "none";
                }
            }
        }
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
                <div className="title">Navigation Page</div>
                <div className="logo">
                    <img src={logo} alt="Hospital Logo" />
                </div>
            </header>
            <Navbar
                handleFloorChange={handleFloorChange}
                filterFunction={filterFunction} // Pass the filterFunction prop
                selectedFloor={selectedFloor}
            />
            <div className="manual-dropdown">
                <input
                    onClick={filterFunction}
                    onKeyUp={filterFunction}
                    type="text"
                    placeholder="Search.."
                    id="myInput"
                />
                <div id="myDropdown" className="dropdown-content">
                    {nodeData.map(({ longName }, index) => (
                        <a href="/home" key={index}>
                            {longName}
                        </a>
                    ))}
                </div>
            </div>
            <div id="map-container">
                <Canvas
                    imageSource={floorImages[selectedFloor]}
                    currLevel={selectedLevel}
                />
            </div>
            <Outlet />
            <PathHandler />
        </div>
        </body>
    );
}

