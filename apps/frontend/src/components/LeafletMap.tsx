import {MapContainer, Tooltip, ImageOverlay, CircleMarker, Polyline, Popup} from 'react-leaflet';
import "../css/leaflet.css";
import React, {useState, useEffect, useRef, Ref} from "react";
import axios from "axios";
import {LatLng, LatLngBounds} from "leaflet";
import AuthenticationButton from "./AuthenticationButton.tsx";
import {Button, Autocomplete, Drawer, MenuItem, FormControlLabel, Checkbox, FormGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import {PathPrinter} from "./PathPrinter.tsx";
import L from "leaflet";

// import groundfloor from "../images/00_thegroundfloor.png";
import lowerlevel1 from "../images/00_thelowerlevel1.png";
import lowerlevel2 from "../images/00_thelowerlevel2.png";
import firstfloor from "../images/01_thefirstfloor.png";
import secondfloor from "../images/02_thesecondfloor.png";
import thirdfloor from "../images/03_thethirdfloor.png";

const FloorLevel = [
    {
        floor: lowerlevel1,
        level: "L1"
    },
    {
        floor: lowerlevel2,
        level: "L2"
    },
    {
        floor: firstfloor,
        level: "1"
    },
    {
        floor: secondfloor,
        level: "2"
    },
    {
        floor: thirdfloor,
        level: "3"
    }
];

export default function LeafletMap() {
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    const [nodeStart, setNodeStart] = useState("");
    const [nodeEnd, setNodeEnd] = useState("");
    const [pathData, setPathData] = useState([]);
    const [lineData, setLineData] = useState<JSX.Element[]>([]);
    const [showNodes, setShowNodes] = useState(true);
    const [showEdges, setShowEdges] = useState(false);
    const [showHalls, setShowHalls] = useState(false);
    const [useAStar, setUseAStar] = useState(0);
    const [directions, setDirections] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer open/close
    const [currLevel, setCurrLevel] = useState("L1");
    const [selectedFloor, setSelectedFloor] = useState(lowerlevel1);
    const lMap: Ref<L.Map> = useRef();


    useEffect(() => {
        async function fetch() {
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            } catch {
                console.log("post error");
            }
            const res = await axios.get("/api/db-load-nodes");
            const res3 = await axios.get("/api/db-load-edges");

            setNodeData(res.data);
            setEdgeData(res3.data);
        }

        fetch().then();
    }, []);

    useEffect(() => {
        async function fetch() {
            const res2 = await axios.get(`/api/db-get-path/${nodeStart}/${nodeEnd}`);

            let nodeIDs = res2.data.reduce((accumulator: string[], roomData: {
                nodeID: string;
                xcoord: number;
                ycoord: number;
                floor: string;
                building: string;
                nodeType: string;
                longName: string;
                shortName: string;
            }) => {
                const {nodeID} = roomData;
                accumulator.push(nodeID);
                return accumulator;
            }, []);
            setPathData(nodeIDs);
        }

        fetch().then();
    }, [nodeEnd, nodeStart]);

    useEffect(() => {
        const nodeIDToXPos = (nId: string) => {
            return nodeData.find(({nodeID}) =>
                nId === nodeID
            )!["xcoord"];
        };

        const nodeIDToYPos = (nId: string) => {
            return nodeData.find(({nodeID}) =>
                nId === nodeID
            )!["ycoord"];
        };

        const nodeIDToFloor = (nId: string) => {
            console.log(nodeData.find(({nodeID}) =>
                nId === nodeID
            ));
            return nodeData.find(({nodeID}) =>
                nId === nodeID
            )!["floor"];
        };

        const transX = (xp: number) => {
            return xp * 50 / 5000;
        };

        const transY = (yp: number) => {
            return 34.8 - (yp * 34 / 3400);
        };

        let startX = -1;
        let startY = -1;
        let prevFloor = "";
        const temp: JSX.Element[] = [];
        if (showEdges) {
            edgeData.map(({startNodeID, endNodeID}) => {
                if (nodeIDToFloor(startNodeID) === currLevel && nodeIDToFloor(endNodeID) === currLevel) {
                    const x1 = transX(nodeIDToXPos(startNodeID));
                    const y1 = transY(nodeIDToYPos(startNodeID));
                    const x2 = transX(nodeIDToXPos(endNodeID));
                    const y2 = transY(nodeIDToYPos(endNodeID));
                    temp.push(<Polyline
                        positions={[[y1, x1], [y2, x2]]}
                        color={"green"} weight={5}></Polyline>);
                }
            });
        } else {
            let floorChanges: number = 1;
            pathData.map((nr) => {
                if (nodeIDToFloor(nr) === currLevel) {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(<Polyline
                            positions={[[transY(startY), transX(startX)], [transY(nodeIDToYPos(nr)), transX(nodeIDToXPos(nr))]]}
                            color={"green"} weight={5}></Polyline>);
                        const dx = transX(nodeIDToXPos(nr)) - transX(startX);
                        const dy = transY(nodeIDToYPos(nr)) - transY(startY);
                        const midX = transX(startX) + dx / 2;
                        const midY = transY(startY) + dy / 2;
                        const angle = Math.atan(dy / dx);
                        const xMod = (dx === 0) ? 1 : -dx / Math.abs(dx);
                        const yMod = (dx >= 0) ? -1 : 1;
                        const pathLength = Math.sqrt(dx * dx + dy * dy);
                        console.log("ANGLE: " + angle);
                        if (pathLength > 0.2) {
                            temp.push(<Polyline
                                positions={[[midY, midX], [midY + 0.1 * Math.sin(angle + Math.PI / 4) * yMod, midX + 0.1 * Math.cos(angle + Math.PI / 4) * xMod]]}
                                color={"green"} weight={5}></Polyline>);
                            temp.push(<Polyline
                                positions={[[midY, midX], [midY + 0.1 * Math.sin(angle - Math.PI / 4) * yMod, midX + 0.1 * Math.cos(angle - Math.PI / 4) * xMod]]}
                                color={"green"} weight={5}></Polyline>);
                        }
                    } else if (prevFloor !== "") {
                        temp.push(
                            <Popup position={[transY(nodeIDToYPos(nr)), transX(nodeIDToXPos(nr))]} autoClose={false}>
                                {floorChanges + ". Arrive from floor " + prevFloor}
                            </Popup>
                        );
                        floorChanges++;
                    }
                    startX = nodeIDToXPos(nr);
                    startY = nodeIDToYPos(nr);
                } else {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(
                            <Popup position={[transY(startY), transX(startX)]} autoClose={false}>
                                {floorChanges + ". Go to floor " + nodeIDToFloor(nr)}
                            </Popup>
                        );
                        floorChanges++;
                    }
                    prevFloor = nodeIDToFloor(nr);
                    startX = -1;
                    startY = -1;
                }
            });
        }
        setLineData(temp);
    }, [currLevel, edgeData, nodeData, pathData, showEdges]);

    useEffect(() => {
        async function fetch() {
            //  console.log(`${data.startNode}`);
            const res2 = await axios.get(`/api/db-get-path/currentAlg`);
            setUseAStar(res2.data);

        }

        fetch().then();
    }, []);

    // function selectNode(event: LeafletMouseEvent) {
    //     event.target.setStyle({
    //         color: "green"
    //     });
    //     if (selectedNodes.length >= 2) {
    //         selectedNodes[0]!.sourceTarget.setStyle({
    //             color: "#3388ff"
    //         });
    //         selectedNodes.splice(0, 1);
    //     }
    //     selectedNodes.push(event);
    //     setSelectedNodes(selectedNodes);
    // }

    function nametoNodeID(name: string) {
        return nodeData.find(({longName}) =>
            longName === name
        )!["nodeID"];
    }

    function nodeIDtoName(nId: string) {
        const node = nodeData.find(({nodeID}) =>
            nodeID === nId
        );
        if (node !== undefined) {
            return node!["longName"];
        } else {
            return "";
        }
    }

    const floorToLevel = (inputFloor: string) => {
        let output = "0";
        FloorLevel.map(({floor, level}) => {
            if (inputFloor === floor) {
                output = level;
            }
        });
        return output;
    };

    const currNodes = nodeData.filter(({nodeType}) => {
        return nodeType !== "HALL";
    });

    useEffect(() => {
        // Open the drawer automatically when nodeEnd is selected
        if (nodeEnd) {
            setIsDrawerOpen(true);
        }
    }, [nodeEnd]);


    useEffect(() => {
        // Open the drawer automatically when nodeEnd is selected
        if (nodeEnd) {
            setIsDrawerOpen(true);
        }
    }, [nodeEnd]);

    function handleDirections() {
        setDirections(!directions);
    }

    function numToSearchType(num: number) {
        switch (num) {
            case 0:
                return "A Star";
            case 1:
                return "BFS";
            case 2:
                return "DFS";
        }
        return "A Star";
    }

    function searchTypeToNum(str: string) {
        switch (str) {
            case "A Star":
                return 0;
            case "BFS":
                return 1;
            case "DFS":
                return 2;
        }
        return 0;
    }

    return (
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
            {/* Drawer for additional controls */}
            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                    ModalProps={{BackdropProps: {invisible: true}}}>
                <div className="drawer-content" style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
                    <div className="drawer-search-bars" style={{marginBottom: '10px', width: '100%'}}>
                        <div className="nav-buttons" style={{marginBottom: '10px', width: '100%', maxWidth: '300px'}}>
                            {/* Start Node */}
                            <Autocomplete
                                disablePortal
                                options={currNodes.map(({longName}) => ({label: longName}))}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params} label="Start Node..."/>}
                                value={nodeIDtoName(nodeStart)}
                                onChange={(newValue) => {
                                    if (newValue !== null && newValue.target.innerText !== undefined) {
                                        const nId = nametoNodeID(newValue.target.innerText);
                                        setNodeStart(nId);
                                    } else {
                                        setNodeStart("");
                                    }
                                }}
                            />
                        </div>
                        <div className="nav-buttons" style={{width: '100%', maxWidth: '300px'}}>
                            {/* End Node */}
                            <Autocomplete
                                disablePortal
                                options={currNodes.map(({longName}) => ({label: longName}))}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params} label="End Node..."/>}
                                value={nodeIDtoName(nodeEnd)}
                                onChange={(newValue) => {
                                    if (newValue !== null && newValue.target.innerText !== undefined) {
                                        const nId = nametoNodeID(newValue.target.innerText);
                                        setNodeEnd(nId);
                                    } else {
                                        setNodeEnd("");
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Show/Hide Edges */}
                    <div style={{display: "flex", marginBottom: '20px', width: '100%', maxWidth: '300px'}}>
                        <Button variant="contained" size="small" onClick={() => setShowEdges(!showEdges)} style={{
                            backgroundColor: "white",
                            color: "black",
                            marginRight: '20px',
                            fontSize: '1.5vh',
                            width: '8vw'
                        }}>
                            {showEdges ? "Hide All Edges" : "Show All Edges"}
                        </Button>
                        {/* Use A* */}

                        <TextField
                            select
                            value={numToSearchType(useAStar)}
                            onChange={(event) => {
                                setUseAStar(searchTypeToNum(event.target.value));
                                console.log(`changing path finding to type ${searchTypeToNum(event.target.value)}`);
                                axios.post(`/api/db-get-path/change/${searchTypeToNum(event.target.value)}`);
                            }}
                            size="small"
                            style={{backgroundColor: "white", color: "black", fontSize: '1.5vh', width: '8vw'}}
                        >

                            {<MenuItem value={"A Star"}>A*</MenuItem>}
                            {<MenuItem value={"BFS"}>BFS</MenuItem>}
                            {<MenuItem value={"DFS"}>DFS</MenuItem>}
                        </TextField>
                    </div>
                    {/* Text Directions */}
                    <div>
                        <Button variant="contained" size="small" onClick={handleDirections}
                                style={{
                                    backgroundColor: "#012D5A",
                                    width: '15.5vw',
                                    marginBottom: '20px',
                                    marginRight: '30px',
                                    fontSize: '1.5vh'
                                }}>
                            Text Directions
                        </Button>
                    </div>

                    <div style={{display: 'grid', maxWidth: '100%'}}>

                        {directions && <PathPrinter startNode={nodeStart} endNode={nodeEnd}/>}
                    </div>
                </div>
            </Drawer>
            <div className="map-buttons">
                <div className="floor-button">
                    <TextField
                        select
                        value={selectedFloor}
                        onChange={(event) => {
                            console.log(lMap);
                            lMap!.current.setZoom(5);
                            setSelectedFloor(event.target.value);
                            setCurrLevel(floorToLevel(event.target.value));
                        }}
                        variant="outlined"
                        size="small"
                        style={{backgroundColor: "white",}}
                    >
                        <MenuItem value={lowerlevel1}>Lower Level 1</MenuItem>
                        <MenuItem value={lowerlevel2}>Lower Level 2</MenuItem>
                        {/*<MenuItem value="groundfloor">Ground Floor</MenuItem>*/}
                        <MenuItem value={firstfloor}>First Floor</MenuItem>
                        <MenuItem value={secondfloor}>Second Floor</MenuItem>
                        <MenuItem value={thirdfloor}>Third Floor</MenuItem>
                    </TextField>
                </div>

                <div className="search-button">
                    <Autocomplete
                        disablePortal
                        options={currNodes.map(({longName}) => ({label: longName}))}
                        sx={{backgroundColor: 'white'}}
                        renderInput={(params) => <TextField {...params} label="Search"/>}
                        value={nodeIDtoName(nodeEnd)}
                        size={"small"}
                        onChange={(newValue) => {
                            if (newValue !== null && newValue.target.innerText !== undefined) {
                                const nId = nametoNodeID(newValue.target.innerText);
                                setNodeEnd(nId);
                            } else {
                                setNodeEnd("");
                            }
                        }}
                    />
                </div>

                <div className="button3">
                    <AuthenticationButton/>
                </div>
                <div className="checkboxes">
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={showNodes} onClick={() => setShowNodes(!showNodes)}/>} label="Show Nodes"/>
                        <FormControlLabel control={<Checkbox checked={showEdges} onClick={() => setShowEdges(!showEdges)}/>} label="Show Edges"/>
                        <FormControlLabel control={<Checkbox checked={showHalls} onClick={() => setShowHalls(!showHalls)}/>} label="Show Halls"/>
                    </FormGroup>
                </div>
            </div>
            <MapContainer
                center={[17, 25]}
                zoom={5}
                minZoom={5}
                maxZoom={8}
                scrollWheelZoom={true}
                maxBoundsViscosity={1.0}
                maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
                ref={lMap}
            >
                <ImageOverlay
                    url={selectedFloor} //"src/images/00_thelowerlevel1.png"
                    bounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
                />
                {nodeData.map(({nodeID, longName, xcoord, ycoord, floor, nodeType}) => (
                    ((floor === currLevel && showNodes && (showHalls || nodeType !== "HALL")) ?
                        <CircleMarker center={new LatLng(34.8 - (ycoord * 34 / 3400), xcoord * 50 / 5000)} radius={6}
                                      eventHandlers={{
                                          click: () => {
                                              if (!showEdges) {
                                                  if (nodeStart === "") {
                                                      setNodeStart(nodeID);
                                                  } else if (nodeEnd === "") {
                                                      setNodeEnd(nodeID);
                                                  } else {
                                                      setNodeStart(nodeEnd);
                                                      setNodeEnd(nodeID);
                                                  }
                                              }
                                          }
                                      }}>
                            <Tooltip>
                                {longName + ": " + xcoord + ", " + ycoord}
                            </Tooltip>
                        </CircleMarker> : <></>)
                ))}
                {lineData}
            </MapContainer>
        </div>
    );
}
