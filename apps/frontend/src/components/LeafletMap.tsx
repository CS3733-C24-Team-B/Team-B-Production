import {MapContainer, Tooltip, ImageOverlay, CircleMarker, Polyline, Popup} from 'react-leaflet';
import "../css/leaflet.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {LatLng, LatLngBounds} from "leaflet";
import AuthenticationButton from "./AuthenticationButton.tsx";
import {Button, Autocomplete, MenuItem} from "@mui/material";
import TextField from "@mui/material/TextField";
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
    //const [drawLine, setDrawLine] = useState(false);
    const [pathData, setPathData] = useState([]);
    const [lineData, setLineData] = useState<JSX.Element[]>([]);
    // const [selectedNodes, setSelectedNodes] = useState<LeafletMouseEvent[]>([]);
    const [showEdges, setShowEdges] = useState(false);
    const [useAStar, setUseAStar] = useState(false);
    const [currLevel, setCurrLevel] = useState("L1");
    const [selectedFloor, setSelectedFloor] = useState(lowerlevel1);


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
            setPathData(res2.data);
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
            let floorChanges:number = 1;
            pathData.map((nr) => {
                if (nameToFloor(nr) === currLevel) {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(<Polyline
                            positions={[[transY(startY), transX(startX)], [transY(nameToYPos(nr)), transX(nameToXPos(nr))]]}
                            color={"green"} weight={5}></Polyline>);
                        const dx = transX(nameToXPos(nr)) - transX(startX);
                        const dy = transY(nameToYPos(nr)) - transY(startY);
                        const midX = transX(startX) + dx/2;
                        const midY = transY(startY) + dy/2;
                        const angle = Math.atan(dy/dx);
                        const xMod = (dx === 0) ? 1 : -dx/Math.abs(dx);
                        const yMod = (dx >= 0) ? -1 : 1;
                        const pathLength = Math.sqrt(dx*dx + dy*dy);
                        console.log("ANGLE: " + angle);
                        if(pathLength > 0.2) {
                            temp.push(<Polyline
                                positions={[[midY, midX], [midY + 0.1 * Math.sin(angle + Math.PI / 4) * yMod, midX + 0.1 * Math.cos(angle + Math.PI / 4) * xMod]]}
                                color={"green"} weight={5}></Polyline>);
                            temp.push(<Polyline
                                positions={[[midY, midX], [midY + 0.1 * Math.sin(angle - Math.PI / 4) * yMod, midX + 0.1 * Math.cos(angle - Math.PI / 4) * xMod]]}
                                color={"green"} weight={5}></Polyline>);
                        }
                    } else if (prevFloor !== "") {
                        temp.push(
                            <Popup position={[transY(nameToYPos(nr)), transX(nameToXPos(nr))]} autoClose={false}>
                                {floorChanges + ". Arrive from floor " + prevFloor}
                            </Popup>
                        );
                        floorChanges++;
                    }
                    startX = nameToXPos(nr);
                    startY = nameToYPos(nr);
                } else {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(
                            <Popup position={[transY(startY), transX(startX)]} autoClose={false}>
                                {floorChanges + ". Go to floor " + nameToFloor(nr)}
                            </Popup>
                        );
                        floorChanges++;
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

    const floorToLevel = (inputFloor: string) => {
        let output = "0";
        FloorLevel.map(({floor, level}) => {
            if (inputFloor === floor) {
                output = level;
            }
        });
        return output;
    };

    // const currNodes = nodeData.filter(({floor}) => {
    //     return floor === currLevel;
    // });

    return (
        <div>
            <div className="map-buttons">
                <TextField
                    select
                    value={selectedFloor}
                    onChange={(event) => {
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
                <Autocomplete
                    disablePortal
                    options={nodeData.map(({longName}) => (
                        {label: longName}
                    ))}
                    size={"small"}
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
                <Autocomplete
                    disablePortal
                    options={nodeData.map(({longName}) => (
                        {label: longName}
                    ))}
                    size={"small"}
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
                <div className="map-options">
                    {/* Convert checkboxes into buttons */}
                    <Button variant="contained" onClick={() => setShowEdges(!showEdges)}
                            style={{backgroundColor: "white", color: "black", height: "43px"}}>
                        {showEdges ? "Hide All Edges" : "Show All Edges"}
                    </Button>
                </div>
                <div className="button2">
                    <Button
                        variant="contained"
                        style={{backgroundColor: useAStar ? "grey" : "white", color: "black", height: "43px"}}
                        onClick={() => {
                            axios.post(`/api/db-get-path/change`);
                            setUseAStar(!useAStar);
                        }}
                    >
                        Use A*
                    </Button>
                </div>
                <div className="button3">
                    <AuthenticationButton />
                </div>
            </div>
            <MapContainer center={[34, 25]} zoom={5}
                          minZoom={5}
                          maxZoom={8}
                          scrollWheelZoom={true}
                          maxBoundsViscosity={1.0}
                          maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
            >
                <ImageOverlay
                    url={selectedFloor} //"src/images/00_thelowerlevel1.png"
                    bounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
                />
                {nodeData.map(({nodeID, longName, xcoord, ycoord, floor}) => (
                    (floor === currLevel ?
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
};
