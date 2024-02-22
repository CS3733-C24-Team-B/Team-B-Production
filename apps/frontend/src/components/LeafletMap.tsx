import {MapContainer, Tooltip, ImageOverlay, CircleMarker, Polyline, Popup, Marker, SVGOverlay} from 'react-leaflet';
import "../css/leaflet.css";
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
import lowerlevel1 from "../images/00_thelowerlevel1.png";
import lowerlevel2 from "../images/00_thelowerlevel2.png";
import firstfloor from "../images/01_thefirstfloor.png";
import secondfloor from "../images/02_thesecondfloor.png";
import thirdfloor from "../images/03_thethirdfloor.png";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import {
    InternalTransportRequest, LanguageRequest,
    MaintenanceRequest,
    MedicineRequest,
    SanitationRequest
} from "common/src/serviceRequestTypes.ts";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import {createSvgIcon} from "@mui/material/utils";

const GokuIcon = createSvgIcon(
    // credit: Created by eric from the Noun Project - https://thenounproject.com/icon/goku-58041/
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
         viewBox="0 0 100 125" enable-background="new 0 0 100 100" xmlSpace="preserve">
        <path fill="#000000" d="M74.902,65.634l20.051-11.192l-14.17-0.853l8.146-7.297l-18.137,1.417c0,0-0.389-2.868-4.109-6.589
        c-2.267-2.267-7.367-3.755-7.367-3.755s0.726-9.244-4.446-17.463c-3.274-4.287-10.007-5.421-16.737-7.263
        c5.172,14.736,3.259,20.546,3.259,20.546s-7.439-8.29-15.799-9.565c-4.887-0.284-15.09,5.101-20.564,8.714
        c19.36,10.06,21.486,20.191,21.486,20.191c-7.156,0.637-19.696,8.076-19.696,8.076c15.444,2.976,20.617,6.659,20.617,6.659
         l-8.572,4.96l17.335,1.739c-1.01-0.729-3.214-3.383-3.66-4.894c-0.468-1.586-0.282-6.684,1.31-6.996
         c0.827-0.163,1.418,0.222,1.766,0.74c-0.035-0.367-0.05-0.729-0.05-1.088c0-7.582,7.298-12.98,14.864-12.98
         c7.922,0,17.327,2.781,16.588,10.932c0.348-0.52-0.838,2.232-0.01,2.396c1.59,0.313,1.776,5.41,1.309,6.996
         c-0.471,1.586-2.889,4.455-3.815,5.011c-0.44,0.26-0.763,0.313-0.981,0.297c-0.13,0.561-0.267,1.044-0.408,1.447l11.791-0.41
         l-5.454-2.621l15.303-4.535L74.902,65.634z"/>
        <path fill="#000000"
              d="M50.73,85.646c-0.146,0-0.251-0.004-0.304-0.006c-0.052,0.002-0.158,0.006-0.305,0.006
              c-0.876,0-2.528-0.104-3.751-0.781c-3.847-2.137-8.516-7.17-8.997-8.082c-0.214-0.406-0.416-0.986-0.615-1.764
              c-0.247-0.064-0.504-0.179-0.768-0.332c-1.075-0.642-3.618-3.677-4.134-5.418c-0.4-1.357-0.409-5.224,0.635-6.947
              c0.323-0.531,0.732-0.852,1.217-0.947c0.401-0.078,0.793-0.064,1.148,0.035c0.093-3.656,1.806-7.043,4.848-9.564
              c2.919-2.422,6.827-3.811,10.722-3.811c6.642,0,12.284,1.837,15.095,4.913c1.621,1.772,2.369,3.934,2.228,6.424
              c0.089,0.231,0.021,0.476-0.075,0.823c-0.168,0.604-0.255,1.025-0.263,1.259c0.368,0.146,0.687,0.438,0.948,0.869
              c1.043,1.721,1.035,5.59,0.637,6.944c-0.516,1.744-3.059,4.779-4.133,5.418c-0.266,0.156-0.522,0.271-0.771,0.334
              c-0.199,0.777-0.4,1.357-0.613,1.763c-0.479,0.911-5.146,5.944-8.998,8.084C53.259,85.542,51.607,85.646,50.73,85.646z
              M50.428,84.223l0.035,0.002c0.009,0,0.105,0.004,0.268,0.004c0.465,0,2.058-0.043,3.062-0.603c3.664-2.035,8.068-6.834,8.432-7.504
              c0.135-0.256,0.349-0.795,0.605-1.906l0.136-0.59l0.624,0.043c0.062,0,0.241-0.021,0.549-0.203c0.752-0.446,3.077-3.176,3.498-4.6
              c0.355-1.205,0.245-4.599-0.49-5.812c-0.117-0.197-0.224-0.281-0.275-0.289c-0.282-0.057-0.523-0.225-0.676-0.471
              c-0.014-0.021-0.025-0.043-0.037-0.066l-0.096,0.144l0.026-0.297c-0.204-0.568-0.03-1.353,0.196-2.177l0.025-0.289
              c0.203-2.233-0.414-4.153-1.834-5.707c-2.547-2.788-7.799-4.452-14.05-4.452c-3.57,0-7.148,1.271-9.817,3.483
              c-2.798,2.32-4.339,5.443-4.339,8.789c0,0.346,0.016,0.688,0.047,1.021l0.258,2.779l-1.552-2.318
              c-0.255-0.381-0.601-0.527-1.04-0.439c-0.054,0.01-0.158,0.092-0.278,0.289c-0.735,1.215-0.845,4.605-0.488,5.812
              c0.421,1.424,2.745,4.151,3.499,4.602c0.307,0.183,0.484,0.201,0.547,0.201h0.018l0.605-0.045l0.137,0.592
              c0.257,1.111,0.471,1.65,0.605,1.906c0.362,0.67,4.77,5.471,8.432,7.504c1.006,0.56,2.599,0.603,3.062,0.603
              c0.162,0,0.261-0.004,0.27-0.004L50.428,84.223z"/>
        <path fill="#000000"
              d="M33.033,61.948l4.038,4.604l-0.426-3.684l3.33,3.117c0,0-0.708-4.252,0.142-6.637
              c1.087-2.314,3.897-3.638,3.897-3.638s-0.328,8.358,0.354,11.902c2.221-4.275,8.998-12.398,12.683-13.816
              c1.062,4.369-0.425,11.24-1.062,14.522c3.261-3.493,7.511-10.247,7.723-11.688c0,0,0.491,0.252,0.708,0.779
               c0.372,0.903-0.991,5.881-1.698,7.864c0.99-0.592,2.905-2.055,2.905-2.055l-1.772,3.754c0,0,4.746-3.094,5.242-3.896
               c1.016-1.438,2.977-12.47,2.977-12.47l-30.039-6.73l-11.194,8.432L33.033,61.948z"/>
        {/*<text x="0" y="115" fill="#000000" font-size="5px" font-weight="bold"*/}
        {/*      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by eric*/}
        {/*    steltenpohl</text>*/}
        {/*<text x="0" y="120" fill="#000000" font-size="5px" font-weight="bold"*/}
        {/*      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun*/}
        {/*    Project</text>*/}
    </svg>,
    'Goku',
);

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
                        if (!doAnimation) {
                            const midX = transX(startX) + dx / 2;
                            const midY = transY(startY) + dy / 2;
                            const angle = Math.atan(dy / dx);
                            const xMod = (dx === 0) ? 1 : -dx / Math.abs(dx);
                            const yMod = (dx >= 0) ? -1 : 1;
                            const pathLength = Math.sqrt(dx * dx + dy * dy);
                            if (pathLength > 0.2) {
                                temp.push(<Polyline
                                    positions={[[midY, midX], [midY + 0.1 * Math.sin(angle + Math.PI / 4) * yMod, midX + 0.1 * Math.cos(angle + Math.PI / 4) * xMod]]}
                                    color={edgeColor}
                                    weight={5}></Polyline>);
                                temp.push(<Polyline
                                    positions={[[midY, midX], [midY + 0.1 * Math.sin(angle - Math.PI / 4) * yMod, midX + 0.1 * Math.cos(angle - Math.PI / 4) * xMod]]}
                                    color={edgeColor}
                                    weight={5}></Polyline>);
                            }
                        }
                    } else if (prevFloor !== "") {
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
                        floorChanges++;
                    }
                    startX = nodeIDToXPos(nr);
                    startY = nodeIDToYPos(nr);
                } else {
                    if (startX >= 0 && startY >= 0) {
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
    }, [currLevel, doAnimation, edgeColor, edgeData, nodeData, pathData, showEdges]);

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
                        <Polyline
                            positions={linePoints}
                            color={"white"} weight={5} opacity={0.65} ref={(r) => {
                            r?.bringToFront();
                            r?.redraw();
                        }}></Polyline>
                        :
                        <SVGOverlay
                            bounds={new LatLngBounds(new LatLng(animateData[startDraw.current].lat - 1, animateData[startDraw.current].lng - 1), new LatLng(animateData[startDraw.current].lat + 1, animateData[startDraw.current].lng + 1))}>
                            <GokuIcon/>
                        </SVGOverlay>)
            );
        }
    }

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
        if (nodeStart !== "" && nodeIDToFloor(nodeStart) === currLevel) {
            return (
                <CircleMarker fillOpacity={1}
                              center={new LatLng(transY(nodeIDToYPos(nodeStart)), transX(nodeIDToXPos(nodeStart)))}
                              radius={6}
                              color={nodeColor}>
                </CircleMarker>
            );
        }
    }

    function drawNodeEnd() {
        if (nodeStart !== "" && nodeIDToFloor(nodeEnd) === currLevel) {
            return (
                <Marker position={new LatLng(transY(nodeIDToYPos(nodeEnd)), transX(nodeIDToXPos(nodeEnd)))}>
                </Marker>
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
        return closestID;
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
                                value={nodeIDtoName(nodeStart)}
                                ListboxProps={{style: {fontFamily: 'Lato'}}}
                                onChange={(newValue) => {
                                    if (newValue !== null && newValue.target.innerText !== undefined) {
                                        const nId = nametoNodeID(newValue.target.innerText);
                                        setNodeStart(nId);
                                    } else {
                                        setNodeStart("");
                                        setPathData([]);
                                    }
                                }}
                            />
                        </div>
                        <div className="autocomplete-rows" style={{marginBottom: '10%', width: '100%'}}>
                            {/* End Node */}
                            <LocationOnIcon style={{marginRight: '3%'}}/>
                            <Autocomplete
                                disablePortal
                                options={currNodes.map(({longName}) => ({label: longName}))}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params}
                                                                    label={<p className="autocomplete-text">End
                                                                        Node...</p>}/>}
                                value={nodeIDtoName(nodeEnd)}
                                ListboxProps={{style: {fontFamily: 'Lato'}}}
                                onChange={(newValue) => {
                                    if (newValue !== null && newValue.target.innerText !== undefined) {
                                        const nId = nametoNodeID(newValue.target.innerText);
                                        setNodeEnd(nId);
                                        props.changeDrawer(true);
                                        props.changeTopbar(nId);
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
                center={[17, 25]}
                zoom={5}
                minZoom={5}
                maxZoom={8}
                scrollWheelZoom={true}
                maxBoundsViscosity={1.0}
                maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 56))}
                ref={lMap}
                className={"leaflet-container"}
            >
                <ImageOverlay
                    url={selectedFloor} //"src/images/00_thelowerlevel1.png"
                    bounds={new LatLngBounds(new LatLng(0, 3), new LatLng(34, 53))}
                    interactive={true}
                    eventHandlers={{
                        click: (ev) => {
                            if (!showEdges && !showNodes) {
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
                                                      setNodeStart(nodeEnd);
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
                            lMap!.current.setZoom(5);
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
    goku: false
};
