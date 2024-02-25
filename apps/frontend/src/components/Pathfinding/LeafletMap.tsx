import {
    MapContainer,
    Tooltip,
    ImageOverlay,
    CircleMarker,
    Polyline,
    Popup,
    Marker,
    SVGOverlay,
    ZoomControl
} from 'react-leaflet';
import "../../css/leaflet.css";
import React, {useState, useEffect, useRef, Ref} from "react";
import axios from "axios";
import {LatLng, LatLngBounds} from "leaflet";
import {
    Button,
    Autocomplete,
    Collapse,
    CircularProgress
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {PathPrinter} from "./PathPrinter.tsx";
import L from "leaflet";
import {useAuth0} from "@auth0/auth0-react";
import lowerlevel1 from "../../images/00_thelowerlevel1.png";
import lowerlevel2 from "../../images/00_thelowerlevel2.png";
import firstfloor from "../../images/01_thefirstfloor.png";
import secondfloor from "../../images/02_thesecondfloor.png";
import thirdfloor from "../../images/03_thethirdfloor.png";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import {
    InternalTransportRequest, LanguageRequest,
    MaintenanceRequest,
    MedicineRequest,
    SanitationRequest
} from "common/src/serviceRequestTypes.ts";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import GokuIcon from "../GokuIcon.tsx";

const FloorLevel = [
    {
        floor: lowerlevel2,
        level: "L2"
    },
    {
        floor: lowerlevel1,
        level: "L1"
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

type ServiceRequest = {
    serviceID: number,
    timeCreated: string,
    createdBy: UpdateEmployee,
    createdByID: string,
    locationID: string,
    priority: string,
    status: string,
    assignedTo: UpdateEmployee,
    assignedID: string,
    notes: string,
    sanitation: SanitationRequest,
    maintenance: MaintenanceRequest,
    internalTransport: InternalTransportRequest,
    medicine: MedicineRequest,
    language: LanguageRequest,
}

interface MapProps {
    openDrawer: boolean;
    nodesShow: boolean;
    edgesShow: boolean;
    hallsShow: boolean;
    animate: boolean;
    algo: number;
    endNode: string;
    changeTopbar: (arg0: string) => void;
    changeDrawer: (arg0: boolean) => void;
    nodeColor: string;
    edgeColor: string;
    goku: boolean;
    defaultStart: string;
    useDefault: boolean;
    changeDefault: (arg0: boolean) => void;
    zoomNode: string;
    showPopups: boolean;
}

export default function LeafletMap(props: MapProps) {
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    const [nodeStart, setNodeStart] = useState("");
    const [nodeEnd, setNodeEnd] = useState("");
    const [pathData, setPathData] = useState([]);
    const [lineData, setLineData] = useState<JSX.Element[]>([]);
    const [showNodes, setShowNodes] = useState(true);
    const [showEdges, setShowEdges] = useState(false);
    const [showHalls, setShowHalls] = useState(false);
    const [directions, setDirections] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer open/close
    const [currLevel, setCurrLevel] = useState("L1");
    const [selectedFloor, setSelectedFloor] = useState(lowerlevel1);
    const [animateData, setAnimateData] = useState<LatLng[]>([]);
    const [animateChanges, setAnimateChanges] = useState<number[]>([]);
    const [redraw, setRedraw] = useState(false);
    const [doAnimation, setDoAnimation] = useState(false);
    const startDraw = useRef(0);
    const lMap: Ref<L.Map> = useRef();
    const [floorSet, setFloorSet] = useState(new Set());
    const [nodeColor, setNodeColor] = useState(props.nodeColor);
    const [edgeColor, setEdgeColor] = useState(props.edgeColor);
    const [useDefault, setUseDefault] = useState(false);
    const [oldZoom, setOldZoom] = useState("");
    const [showPopups, setShowPopups] = useState(props.showPopups);

    // get auth0 stuff
    const {user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    console.log(user);
    const [srData, setSRData] = useState<ServiceRequest[]>([]);
    //const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        setIsDrawerOpen(props.openDrawer);
    }, [props.openDrawer]);

    useEffect(() => {
        setShowNodes(props.nodesShow);
        setShowEdges(props.edgesShow);
        setShowHalls(props.hallsShow);
        setDoAnimation(props.animate);
    }, [props.nodesShow, props.edgesShow, props.hallsShow, props.animate]);

    useEffect(() => {
        axios.post(`/api/path/change/${props.algo}`).then();
    }, [props.algo]);

    useEffect(() => {
        setNodeEnd(props.endNode);
        if (props.endNode === "") {
            setPathData([]);
        }
    }, [props.endNode]);

    useEffect(() => {
        setNodeColor(props.nodeColor);
        setEdgeColor(props.edgeColor);
    }, [props.nodeColor, props.edgeColor]);

    useEffect(() => {
        if (props.defaultStart === "" || !props.useDefault) {
            setUseDefault(false);
        } else {
            setUseDefault(true);
            setNodeStart(props.defaultStart);
        }
    }, [props.defaultStart, props.useDefault]);

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

        if(props.zoomNode !== oldZoom) {
            if (nodeIDToFloor(props.zoomNode) !== currLevel) {
                setSelectedFloor(levelToFloor(nodeIDToFloor(props.zoomNode)));
                setCurrLevel(nodeIDToFloor(props.zoomNode));
            }
            lMap!.current.setView(new LatLng(transY(nodeIDToYPos(props.zoomNode)), transX(nodeIDToXPos(props.zoomNode))), 8);
            setOldZoom(props.zoomNode);
        }
    }, [props.zoomNode, nodeData, currLevel, oldZoom]);

    useEffect(() => {
        setShowPopups(props.showPopups);
    }, [props.showPopups]);

    useEffect(() => {
        async function fetch() {

            if (isAuthenticated) {
                const accessToken: string = await getAccessTokenSilently();
                const res = await axios.get("/api/service-request", {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });
                setSRData(res.data);
            }

            const res3 = await axios.get("/api/nodes/read");
            const res4 = await axios.get("/api/edges/read");
            setNodeData(res3.data);
            setEdgeData(res4.data);
        }

        fetch().then();
    }, [isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        async function fetch() {
            const res2 = await axios.get(`/api/path/${nodeStart}/${nodeEnd}`);

            const nodeIDs = res2.data.reduce((accumulator: string[], roomData: {
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

        if (nodeStart.length > 0 && nodeEnd.length > 0) {
            fetch().then();
        }
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
            return (xp * 50 / 5000) + 3;
        };

        const transY = (yp: number) => {
            return 34.8 - (yp * 34 / 3400);
        };

        const levelToFloor = (lvl: string) => {
            return FloorLevel.slice().find(({level}) => {
                return lvl === level;
            })!["floor"];
        };

        let startX = -1;
        let startY = -1;
        let prevFloor = "";
        const temp: JSX.Element[] = [];
        const animate: LatLng[] = [];
        const changes: number[] = [];
        const fs: Set<string> = new Set();
        if (showEdges) {
            edgeData.map(({startNodeID, endNodeID}) => {
                if (nodeIDToFloor(startNodeID) === currLevel && nodeIDToFloor(endNodeID) === currLevel) {
                    const x1 = transX(nodeIDToXPos(startNodeID));
                    const y1 = transY(nodeIDToYPos(startNodeID));
                    const x2 = transX(nodeIDToXPos(endNodeID));
                    const y2 = transY(nodeIDToYPos(endNodeID));
                    temp.push(<Polyline
                        positions={[[y1, x1], [y2, x2]]}
                        color={edgeColor} weight={5}></Polyline>);
                }
            });
        } else {
            let floorChanges: number = 1;
            pathData.map((nr) => {
                if (!fs.has(nodeIDToFloor(nr))) {
                    fs.add(nodeIDToFloor(nr));
                }
                if (nodeIDToFloor(nr) === currLevel) {
                    if (startX >= 0 && startY >= 0) {
                        temp.push(<Polyline
                            positions={[[transY(startY), transX(startX)], [transY(nodeIDToYPos(nr)), transX(nodeIDToXPos(nr))]]}
                            color={edgeColor} weight={5}></Polyline>);
                        const dx = transX(nodeIDToXPos(nr)) - transX(startX);
                        const dy = transY(nodeIDToYPos(nr)) - transY(startY);
                        const steps = 80 * Math.sqrt(dy * dy + dx * dx);
                        for (let i = 0; i < steps; i++) {
                            animate.push(new LatLng(transY(startY) + dy * i / steps, transX(startX) + dx * i / steps));
                        }
                    } else if (prevFloor !== "") {
                        if(showPopups) {
                            temp.push(
                                <Popup position={[transY(nodeIDToYPos(nr)), transX(nodeIDToXPos(nr))]} autoClose={false}
                                       interactive={true}>
                                    <p> {floorChanges + ". Arrive from floor "} <span onClick={() => {
                                        setSelectedFloor(levelToFloor(prevFloor));
                                        setCurrLevel(prevFloor);
                                    }}
                                                                                      className={"floor-change-text"}>{prevFloor}</span>
                                    </p>
                                </Popup>
                            );
                        }
                        floorChanges++;
                    }
                    startX = nodeIDToXPos(nr);
                    startY = nodeIDToYPos(nr);
                } else {
                    if (startX >= 0 && startY >= 0) {
                        if(showPopups) {
                            temp.push(
                                <Popup position={[transY(startY), transX(startX)]} autoClose={false} interactive={true}>
                                    <p> {floorChanges + ". Go to floor "} <span onClick={() => {
                                        setSelectedFloor(levelToFloor(nodeIDToFloor(nr)));
                                        setCurrLevel(nodeIDToFloor(nr));
                                    }}
                                                                                className={"floor-change-text"}>{nodeIDToFloor(nr)}</span>
                                    </p>
                                </Popup>
                            );
                        }
                        floorChanges++;
                        changes.push(animate.length - 1);
                    }
                    prevFloor = nodeIDToFloor(nr);
                    startX = -1;
                    startY = -1;
                }
            });
        }
        setLineData(temp);
        setAnimateData(animate);
        setAnimateChanges(changes);
        setFloorSet(fs);
    }, [currLevel, doAnimation, edgeColor, edgeData, nodeData, pathData, showEdges, showPopups]);

    function moveLine() {
        if (animateData.length > 0) {
            startDraw.current = (startDraw.current + 1) % animateData.length;
            let end = startDraw.current + 50;
            const linePoints = [];
            animateChanges.forEach((num) => {
                if (startDraw.current <= num && end > num) {
                    end = num;
                }
            });
            if (end >= animateData.length) {
                end = animateData.length - 1;
            }
            for (let i = startDraw.current; i < end; i++) {
                linePoints.push(animateData[i]);
            }
            setTimeout(() => {
                setRedraw(!redraw);
            }, 20);
            return (
                (!props.goku ?
                        <ImageOverlay
                            className={"animated-icon"}
                            url={user! && user!.picture!}
                            bounds={new LatLngBounds(new LatLng(animateData[startDraw.current].lat - 0.5, animateData[startDraw.current].lng - 0.5), new LatLng(animateData[startDraw.current].lat + 0.5, animateData[startDraw.current].lng + 0.5))}
                            ref={(r) => {
                                r?.setZIndex(1000);
                            }}>
                        </ImageOverlay>
                        :
                        <SVGOverlay
                            bounds={new LatLngBounds(new LatLng(animateData[startDraw.current].lat - 1, animateData[startDraw.current].lng - 1), new LatLng(animateData[startDraw.current].lat + 1, animateData[startDraw.current].lng + 1))}
                            ref={(r) => {
                                r?.setZIndex(1000);
                            }}>
                            <GokuIcon/>
                        </SVGOverlay>
                )
            );
        }
    }

    const levelToFloor = (lvl: string) => {
        return FloorLevel.slice().find(({level}) => {
            return lvl === level;
        })!["floor"];
    };

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
        return nodeData.find(({nodeID}) =>
            nId === nodeID
        )!["floor"];
    };

    const transX = (xp: number) => {
        return (xp * 50 / 5000) + 3;
    };

    const transY = (yp: number) => {
        return 34.8 - (yp * 34 / 3400);
    };

    function drawNodeStart() {
        if (nodeStart !== "" && nodeData.length > 0 && nodeIDToFloor(nodeStart) === currLevel) {
            return (
                <>
                    {showPopups ? <Popup position={new LatLng(transY(nodeIDToYPos(nodeStart)), transX(nodeIDToXPos(nodeStart)))}
                            autoClose={false}>
                        <p>
                            Starting Node: <span className={"floor-change-text"}>{nodeIDtoName(nodeStart)}</span>
                        </p>
                    </Popup> : <></>}
                    <CircleMarker fillOpacity={1}
                                  center={new LatLng(transY(nodeIDToYPos(nodeStart)), transX(nodeIDToXPos(nodeStart)))}
                                  radius={8}
                                  color={nodeColor}
                                  ref={(r) => {
                                      r?.bringToFront();
                                  }}>
                    </CircleMarker>
                </>
            );
        }
    }

    function drawNodeEnd() {
        if (nodeEnd !== "" && nodeIDToFloor(nodeEnd) === currLevel) {
            return (
                <>
                    {showPopups ? <Popup position={new LatLng(transY(nodeIDToYPos(nodeEnd)), transX(nodeIDToXPos(nodeEnd)))}
                            autoClose={false}>
                        <p>
                            Ending Node: <span className={"floor-change-text"}>{nodeIDtoName(nodeEnd)}</span>
                        </p>
                    </Popup> : <></>}
                    <Marker position={new LatLng(transY(nodeIDToYPos(nodeEnd)), transX(nodeIDToXPos(nodeEnd)))}>
                    </Marker>
                </>
            );
        }
    }

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

    function getDistFromLatLng(pos: LatLng, toX: number, toY: number) {
        const xSquare = (pos.lng - toX) * (pos.lng - toX);
        const ySquare = (pos.lat - toY) * (pos.lat - toY);
        return Math.sqrt(xSquare + ySquare);
    }

    function closestNodeToLatLng(pos: LatLng) {
        let closestID = "";
        let closestDist = -1;
        nodeData.forEach(({nodeID, xcoord, ycoord, floor}) => {
            if (currLevel === floor) {
                if (closestDist === -1 || getDistFromLatLng(pos, transX(xcoord), transY(ycoord)) < closestDist) {
                    closestID = nodeID;
                    closestDist = getDistFromLatLng(pos, transX(xcoord), transY(ycoord));
                }
            }
        });
        return (closestDist < 1 ? closestID : "");
    }

    const currNodes = nodeData.filter(({nodeType}) => {
        return nodeType !== "HALL";
    });

    useEffect(() => {
        // Open the drawer automatically when nodeEnd is selected
        if (nodeEnd) {
            setIsDrawerOpen(true);
        }
    }, [nodeEnd]);

    function handleDirections() {
        setDirections(!directions);
    }

    function getReqType(nsr: ServiceRequest) {
        if (nsr.sanitation) {
            return "sanitation ";
        } else if (nsr.medicine) {
            return "medicine ";
        } else if (nsr.maintenance) {
            return "maintenance ";
        } else if (nsr.internalTransport) {
            return "internal transport ";
        } else if (nsr.language) {
            return "language ";
        }
        return "";
    }

    // add this before return statement so if auth0 is loading it shows a loading thing or if user isn't authenticated it redirects them to login page
    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    return (
        <div style={{maxHeight: '100%'}}>
            {/* Drawer for additional controls */}
            <Collapse in={isDrawerOpen} timeout="auto"
                      unmountOnExit orientation="horizontal"
                      className={"google-maps-collapse"} style={{maxWidth: 300}}>
                <div className="drawer-content">
                    <div className="drawer-search-bars" style={{marginBottom: '10px', width: '100%', minWidth: 250}}>
                        <div className="autocomplete-rows" style={{width: '100%'}}>
                            {/* Start Node */}
                            <CircleIcon style={{marginRight: '3%'}}/>
                            <Autocomplete
                                disablePortal
                                options={currNodes.map(({longName}) => ({label: longName}))}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params}
                                                                    label={<p className="autocomplete-text">Start
                                                                        Node...</p>}/>}
                                value={{label: nodeIDtoName(nodeStart)}}
                                ListboxProps={{style: {fontFamily: 'Lato'}}}
                                onChange={(newValue) => {
                                    const input = newValue.target as HTMLElement;
                                    if (input.innerText !== undefined) {
                                        const nId = nametoNodeID(input.innerText);
                                        setNodeStart(nId);
                                        setUseDefault(false);
                                        props.changeDefault(false);
                                        if(nodeIDToFloor(nId) !== currLevel) {
                                            setSelectedFloor(levelToFloor(nodeIDToFloor(nId)));
                                            setCurrLevel(nodeIDToFloor(nId));
                                        }
                                        lMap!.current.setView(new LatLng(transY(nodeIDToYPos(nId)), transX(nodeIDToXPos(nId))), 8);
                                    } else {
                                        setNodeStart("");
                                        setPathData([]);
                                    }
                                }}
                            />
                        </div>
                        <div className="autocomplete-rows" style={{marginBottom: '10%', width: '100%'}}>
                            {/* End Node */}
                            <LocationOnIcon style={{marginLeft: '3%'}}/>
                            <Autocomplete
                                disablePortal
                                options={currNodes.map(({longName}) => ({label: longName}))}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params}
                                                                    label={<p className="autocomplete-text">End
                                                                        Node...</p>}/>}
                                value={{label: nodeIDtoName(nodeEnd)}}
                                ListboxProps={{style: {fontFamily: 'Lato'}}}
                                onChange={(newValue) => {
                                    const input = newValue.target as HTMLElement;
                                    if (input.innerText !== undefined) {
                                        const nId = nametoNodeID(input.innerText);
                                        setNodeEnd(nId);
                                        props.changeDrawer(true);
                                        props.changeTopbar(nId);
                                        if(nodeIDToFloor(nId) !== currLevel) {
                                            setSelectedFloor(levelToFloor(nodeIDToFloor(nId)));
                                            setCurrLevel(nodeIDToFloor(nId));
                                        }
                                        lMap!.current.setView(new LatLng(transY(nodeIDToYPos(nId)), transX(nodeIDToXPos(nId))), 8);
                                    } else {
                                        setNodeEnd("");
                                        setPathData([]);
                                        props.changeTopbar("");
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Text Directions */}
                    <div>
                        <Button variant="contained" size="small" onClick={handleDirections}
                                style={{
                                    backgroundColor: "#012D5A",
                                    width: '100%',
                                    marginBottom: '20px',
                                    fontSize: '1.5vh'
                                }}>
                            Text Directions
                        </Button>
                    </div>

                    <div style={{display: 'grid', maxWidth: '90%'}}>
                        {directions && <PathPrinter startNode={nodeStart} endNode={nodeEnd}/>}
                    </div>
                </div>
            </Collapse>
            <MapContainer
                center={[20, 28]}
                zoomSnap={0.5}
                zoomDelta={0.5}
                zoom={5.5}
                minZoom={5}
                maxZoom={8}
                scrollWheelZoom={true}
                maxBoundsViscosity={1.0}
                maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 56))}
                ref={lMap}
                className={"leaflet-container"}
                zoomControl ={false}
            >
                <ZoomControl position="topright" />
                <ImageOverlay
                    url={selectedFloor}
                    bounds={new LatLngBounds(new LatLng(0, 3), new LatLng(34, 53))}
                    interactive={true}
                    eventHandlers={{
                        click: (ev) => {
                            if (!showEdges && !showNodes && closestNodeToLatLng(ev.latlng) !== "") {
                                if (nodeStart === "") {
                                    setNodeStart(closestNodeToLatLng(ev.latlng));
                                } else if (nodeEnd === "") {
                                    setNodeEnd(closestNodeToLatLng(ev.latlng));
                                    props.changeDrawer(true);
                                    props.changeTopbar(closestNodeToLatLng(ev.latlng));
                                } else {
                                    setNodeStart(nodeEnd);
                                    setNodeEnd(closestNodeToLatLng(ev.latlng));
                                    props.changeDrawer(true);
                                    props.changeTopbar(closestNodeToLatLng(ev.latlng));
                                }
                            }
                        }
                    }}
                />
                {nodeData.map(({nodeID, longName, xcoord, ycoord, floor, nodeType}) => (
                    ((floor === currLevel && showNodes && (showHalls || nodeType !== "HALL")) ?
                        <CircleMarker center={new LatLng(34.8 - (ycoord * 34 / 3400), (xcoord * 50 / 5000) + 3)}
                                      radius={6} color={nodeColor}
                                      eventHandlers={{
                                          click: () => {
                                              if (!showEdges) {
                                                  if (nodeStart === "") {
                                                      setNodeStart(nodeID);
                                                  } else if (nodeEnd === "") {
                                                      setNodeEnd(nodeID);
                                                      props.changeDrawer(true);
                                                      props.changeTopbar(nodeID);
                                                  } else {
                                                      if (!useDefault) {
                                                          setNodeStart(nodeEnd);
                                                      }
                                                      setNodeEnd(nodeID);
                                                      props.changeDrawer(true);
                                                      props.changeTopbar(nodeID);
                                                  }
                                              }
                                          }
                                      }}>
                            <Tooltip>
                                {/*{longName + ": " + xcoord + ", " + ycoord}*/}
                                <div>
                                    {longName}
                                    {/* Display service request data here */}
                                    {srData.map((serviceRequest) => (
                                        <div key={serviceRequest.serviceID}>
                                            {serviceRequest.locationID === nodeID && (
                                                <p>Contains {getReqType(serviceRequest)} service request <br/>
                                                    Request Status: {serviceRequest.status} <br/>
                                                    Created By: {serviceRequest.createdByID} <br/>
                                                    Assigned To: {serviceRequest.assignedID}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Tooltip>
                        </CircleMarker> : <></>)
                ))}
                {lineData}
                {nodeStart !== "" ? drawNodeStart() : <></>}
                {nodeEnd !== "" ? drawNodeEnd() : <></>}
                {doAnimation ? moveLine() : <></>}
            </MapContainer>
            <div className="floor-buttons">
                {FloorLevel.slice().reverse().map(({floor, level}) => (
                    <button
                        key={floor}
                        className={`mui-btn mui-btn--fab ${currLevel === level ? 'selected' : floorSet.has(level) ? 'highlighted' : ''}`}
                        onClick={() => {
                            lMap!.current.setZoom(5.5);
                            setSelectedFloor(floor);
                            setCurrLevel(level);
                        }}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
}

LeafletMap.defaultProps = {
    openDrawer: false,
    nodesShow: true,
    edgesShow: false,
    hallsShow: false,
    animate: false,
    algo: 0,
    goku: false,
    defaultStart: ""
};
