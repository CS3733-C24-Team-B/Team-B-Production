import React, {useEffect, useState} from "react";
//import {Outlet} from "react-router-dom";
//import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";
import "../css/home_page.css";
import groundfloor from "../images/00_thegroundfloor.png";
import lowerlevel1 from "../images/00_thelowerlevel1.png";
import lowerlevel2 from "../images/00_thelowerlevel2.png";
import firstfloor from "../images/01_thefirstfloor.png";
import secondfloor from "../images/02_thesecondfloor.png";
import thirdfloor from "../images/03_thethirdfloor.png";
import axios from "axios";
// import Canvas from "../components/Canvas.tsx";
//import PathHandler from "../components/PathHandler.tsx";
import Navbar from "../components/Navbar.tsx";
import {MenuItem, TextField} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import LeafletMap from "../components/LeafletMap.tsx";
import {CreateEmployee} from "common/src/employeeTypes.ts";

interface FloorImages {
    groundfloor: string;
    lowerlevel1: string;
    lowerlevel2: string;
    firstfloor: string;
    secondfloor: string;
    thirdfloor: string;
}

const FloorLevel =  [
    {
        floor: "groundfloor",
        level: "0"
    },
    {
        floor: "lowerlevel1",
        level: "L1"
    },
    {
        floor: "lowerlevel2",
        level: "L2"
    },
    {
        floor: "firstfloor",
        level: "1"
    },
    {
        floor: "secondfloor",
        level: "2"
    },
    {
        floor: "thirdfloor",
        level: "3"
    }
];

export default function HomePage() {
    // State to keep track of the selected floor
    const [selectedFloor, setSelectedFloor] = useState<keyof FloorImages>(
        "lowerlevel1"
    );
    const [selectedLevel, setSelectedLevel] = useState("L1");
    // const [nodeData, setNodeData] = useState([]);
    const { user, isAuthenticated} = useAuth0();

    useEffect(() => {
        async function fetch() {
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            } catch {
                console.log("post error");
            }
            const res = await axios.get("/api/db-load-nodes");

            console.log(res.data);
            //setNodeData(res.data);
        }

        fetch().then();
    }, []);
    
    useEffect(() => {
        async function createAuthenticatedEmployee() {
            const employeeInfo: CreateEmployee = {
                email: user!.email!,
                firstName: "",
                lastName: ""
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
    // const filterFunction = () => {
    //     let input: HTMLInputElement | null = document.getElementById(
    //         "myInput"
    //     ) as HTMLInputElement;
    //     let div: HTMLElement | null = document.getElementById(
    //         "myDropdown"
    //     );
    //
    //     let visibleCount = 5;
    //
    //     if (input && div) {
    //         let filter = input.value.toUpperCase();
    //         let a = div.getElementsByTagName("a");
    //
    //         for (let i = 0; i < a.length; i++) {
    //             let txtValue = a[i].textContent || a[i].innerText;
    //
    //             if (filter === "" || txtValue.toUpperCase().indexOf(filter) > -1) {
    //                 if (visibleCount > 0) {
    //                     a[i].style.display = "";
    //                     visibleCount--;
    //                 } else {
    //                     a[i].style.display = "none";
    //                 }
    //             } else {
    //                 a[i].style.display = "none";
    //             }
    //         }
    //     }
    // };

    // Mapping of floor names to their corresponding images
    const floorImages: FloorImages = {
        groundfloor,
        lowerlevel1,
        lowerlevel2,
        firstfloor,
        secondfloor,
        thirdfloor,
    };

    // floor to level change
    const floorToLevel = (inputFloor:string) => {
        let output = "0";
        FloorLevel.map(({floor, level}) => {
            if(inputFloor === floor) {
                output = level;
            }
        });
        return output;
    };

    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>

            <div className="info-container">
                <div className="floor-container">
                    <TextField
                        select
                        value={selectedFloor}
                        onChange={(event) => {
                            handleFloorChange(event.target.value as keyof FloorImages, floorToLevel(event.target.value));
                        }}
                        variant="outlined"
                        size="small"
                        style={{backgroundColor: "white",}}
                    >
                        <MenuItem value="lowerlevel1">Lower Level 1</MenuItem>
                        <MenuItem value="lowerlevel2">Lower Level 2</MenuItem>
                        <MenuItem value="groundfloor">Ground Floor</MenuItem>
                        <MenuItem value="firstfloor">First Floor</MenuItem>
                        <MenuItem value="secondfloor">Second Floor</MenuItem>
                        <MenuItem value="thirdfloor">Third Floor</MenuItem>
                    </TextField>
                </div>

                <div className="map-container">
                    {/*<Canvas*/}
                    {/*    imageSource={floorImages[selectedFloor]}*/}
                    {/*    currLevel={selectedLevel}*/}
                    {/*/>*/}
                    {/*<Outlet/>*/}
                    <LeafletMap imageSource={floorImages[selectedFloor]} currLevel={selectedLevel}/>
                    {/*<PathHandler/>*/}
                </div>
            </div>
        </div>
    );
}

