import { MapContainer, Tooltip, ImageOverlay, CircleMarker, Polyline, Popup } from 'react-leaflet';
import "../css/leaflet.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LatLng, LatLngBounds } from "leaflet";
import AuthenticationButton from "./AuthenticationButton.tsx";
import { Button, Autocomplete, Drawer } from "@mui/material";
import TextField from "@mui/material/TextField";
import {PathPrinter} from "./PathPrinter.tsx";

interface MapProps {
    imageSource: string;
    currLevel: string;
}

export default function LeafletMap({ imageSource, currLevel }: MapProps) {
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    const [nodeStart, setNodeStart] = useState("");
    const [nodeEnd, setNodeEnd] = useState("");
    const [pathData, setPathData] = useState([]);
    const [lineData, setLineData] = useState<JSX.Element[]>([]);
    const [showEdges, setShowEdges] = useState(false);
    const [useAStar, setUseAStar] = useState(false);
    const [directions, setDirections] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer open/close

    useEffect(() => {
        // Fetch data from APIs
        async function fetchData() {
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

        fetchData();
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
                const { longName } = roomData;
                accumulator.push(longName);
                return accumulator;
            }, []);
            setPathData(nodeIDs);
        }

        fetch().then();
    }, [nodeEnd, nodeStart]);

    useEffect(() => {
        const nameToXPos = (name: string) => {
            return nodeData.find(({longName}) =>
                name === longName
            )!["xcoord"];
        };

        const nameToYPos = (name: string) => {
            return nodeData.find(({longName}) =>
                name === longName
            )!["ycoord"];
        };

        const nameToFloor = (name: string) => {
            return nodeData.find(({longName}) =>
                name === longName
            )!["floor"];
        };

        const transX = (xp: number) => {
            return xp * 50 / 5000;
        };

        const transY = (yp: number) => {
            return 34.8 - (yp * 34 / 3400);
        };

        function nodeIDtoName(nId: string) {
            return nodeData.find(({nodeID}) =>
                nodeID === nId
            )!["longName"];
        }

        let startX = -1;
        let startY = -1;
        let prevFloor = "";
        const temp: JSX.Element[] = [];
        if (showEdges) {
            edgeData.map(({startNodeID, endNodeID}) => {
                const startName = nodeIDtoName(startNodeID);
                const endName = nodeIDtoName(endNodeID);
                if (nameToFloor(startName) === currLevel && nameToFloor(endName) === currLevel) {
                    const x1 = transX(nameToXPos(startName));
                    const y1 = transY(nameToYPos(startName));
                    const x2 = transX(nameToXPos(endName));
                    const y2 = transY(nameToYPos(endName));
                    temp.push(<Polyline
                        positions={[[y1, x1], [y2, x2]]}
                        color={"green"} weight={5}></Polyline>);
                }
            });
        } else {
            pathData.map((nr) => {
                if (nameToFloor(nr) === currLevel) {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(<Polyline
                            positions={[[transY(startY), transX(startX)], [transY(nameToYPos(nr)), transX(nameToXPos(nr))]]}
                            color={"green"} weight={5}></Polyline>);
                    } else if (prevFloor !== "") {
                        temp.push(
                            <Popup position={[transY(nameToYPos(nr)), transX(nameToXPos(nr))]} autoClose={false}>
                                {"Arrive from floor " + prevFloor}
                            </Popup>
                        );
                    }
                    startX = nameToXPos(nr);
                    startY = nameToYPos(nr);
                } else {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(
                            <Popup position={[transY(startY), transX(startX)]} autoClose={false}>
                                {"Go to floor " + nameToFloor(nr)}
                            </Popup>
                        );
                    }
                    prevFloor = nameToFloor(nr);
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

    const currNodes = nodeData.filter(({floor}) => {
        return floor === currLevel;
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
    function handleDirections(){
    setDirections(!directions);
    }
    return (
        <div>
            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                    ModalProps={{BackdropProps: {invisible: true}}}>
                <nav className="navbar" style={{width: '250px'}}>
                    <ul>
                        <Button variant="contained" onClick={handleDirections}>Text
                            Directions</Button>
                        {directions && <PathPrinter startNode={nodeStart} endNode={nodeEnd}/>}
                    </ul>

                </nav>
                <div className="map-buttons">
                    <Autocomplete
                        disablePortal
                        options={currNodes.map(({longName}) => ({label: longName}))}
                        sx={{width: 300}}
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
                <div style={{ marginTop: "10px" }}></div>
                <div className="map-buttons">
                    <Autocomplete
                        disablePortal
                        options={currNodes.map(({longName}) => ({label: longName}))}
                        sx={{width: 300}}
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
            </Drawer>
            <div className="map-buttons">
                <Autocomplete
                    disablePortal
                    options={currNodes.map(({longName}) => ({label: longName}))}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Search"/>}
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
                <div className="map-options">
                    <Button variant="contained" onClick={() => setShowEdges(!showEdges)}
                            style={{backgroundColor: "white", color: "black"}}>
                        {showEdges ? "Hide All Edges" : "Show All Edges"}
                    </Button>
                </div>
                <div className="button2">
                    <Button
                        variant="contained"
                        style={{backgroundColor: useAStar ? "grey" : "white", color: "black"}}
                        onClick={() => {
                            axios.post(`/api/db-get-path/change`);
                            setUseAStar(!useAStar);
                        }}
                    >
                        Use A*
                    </Button>
                </div>
                <div className="button3">
                    <AuthenticationButton/>
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
            >
                <ImageOverlay
                    url={imageSource} //"src/images/00_thelowerlevel1.png"
                    bounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
                />
                {nodeData.map(({nodeID, longName, xcoord, ycoord, floor}) => (
                    floor === currLevel ? (
                        <CircleMarker
                            key={nodeID}
                            center={[34.8 - (ycoord * 34 / 3400), xcoord * 50 / 5000]}
                            radius={6}
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
                            }}
                        >
                            <Tooltip>{`${longName}: ${xcoord}, ${ycoord}`}</Tooltip>
                        </CircleMarker>
                    ) : null
                ))}
                {lineData}
            </MapContainer>
        </div>
    );
}
