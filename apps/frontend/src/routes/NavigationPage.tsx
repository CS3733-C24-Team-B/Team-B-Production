import React, {useEffect, useState} from "react";
import "../css/home_page.css";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import LeafletMap from "../components/Pathfinding/LeafletMap.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {
    Autocomplete, autocompleteClasses, Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup, IconButton,
    MenuItem, Modal, Switch
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsIcon from '@mui/icons-material/Directions';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TextField from "@mui/material/TextField";
import axios from "axios";
import MiniMap from "../components/ServiceRequests/LeafletMiniMap.tsx";

const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    border: '10px solid #012d5a',
    boxShadow: 24,
    p: 4
};

const mapStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function NavigationPage() {
    const {user} = useAuth0();
    console.log(user);
    const [nodeData, setNodeData] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [showNodes, setShowNodes] = useState(localStorage.getItem("showNodes") !== null ? localStorage.getItem("showNodes") === "true" : true);
    const [showEdges, setShowEdges] = useState(localStorage.getItem("showEdges") !== null ? localStorage.getItem("showEdges") === "true" : false);
    const [showHalls, setShowHalls] = useState(localStorage.getItem("showHalls") !== null ? localStorage.getItem("showHalls") === "true" : false);
    const [showIcons, setShowIcons] = useState(localStorage.getItem("showIcons") !== null ? localStorage.getItem("showIcons") === "true" : false);
    const [doAnimation, setDoAnimation] = useState(localStorage.getItem("doAnimation") !== null ? localStorage.getItem("doAnimation") === "true" : true);
    const [algorithm, setAlgorithm] = useState(0);
    const [nodeEnd, setNodeEnd] = useState("");
    const [zoomNode, setZoomNode] = useState("");
    const [nodeColor, setNodeColor] = useState(localStorage.getItem("nodeColor") !== null ? localStorage.getItem("nodeColor") : "#3388ff");
    const [edgeColor, setEdgeColor] = useState(localStorage.getItem("edgeColor") !== null ? localStorage.getItem("edgeColor") : "#008000");
    const [goku, setGoku] = useState(localStorage.getItem("goku") !== null ? localStorage.getItem("goku") === "false" : true);
    const [defaultLocation, setDefaultLocation] = useState(localStorage.getItem("defaultLocation") !== null ? localStorage.getItem("defaultLocation") : "");
    const [useDefault, setUseDefault] = useState(localStorage.getItem("useDefault") !== null ? localStorage.getItem("useDefault") === "true" : false);
    const [openMenu, setOpenMenu] = useState(false);
    const [showPopups, setShowPopups] = useState(localStorage.getItem("showPopups") !== null ? localStorage.getItem("showPopups") === "true" : true);
    const [showMap, setShowMap] = useState(false);
    const topbarElems: React.ReactNode[] = [];
    useEffect(() => {
        async function fetch() {
            //  console.log(`${data.startNode}`);
            const res2 = await axios.get(`/api/path/currentAlg`);
            const res3 = await axios.get("/api/nodes/read");

            setAlgorithm(res2.data);
            setNodeData(res3.data);
        }

        fetch().then();
    }, []);
    useEffect(() => {
        if (!user) {
            localStorage.removeItem("goku");
        }
    }, [user]);
    const currNodes = nodeData.filter(({nodeType}) => {
        return nodeType !== "HALL";
    });

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

    topbarElems.push(
        <div className={"navigation-autocomplete"}>
            <Autocomplete
                disablePortal
                options={currNodes.map(({longName}) => ({label: longName}))}
                size={"small"}
                renderInput={(params) => <TextField {...params}
                                                    label={<p className={"search-label"}>Find Your {<span
                                                        className={"action-text"}>Destination</span>}
                                                    </p>} variant={"outlined"}/>}
                popupIcon={<SearchIcon/>}
                sx={{
                    [`& .${autocompleteClasses.popupIndicator}`]: {
                        transform: "none"
                    },
                    '& input': {
                        fontFamily: 'Lato'
                    },
                }}
                ListboxProps={{style: {fontFamily: 'Lato'}}}
                value={{"label": nodeIDtoName(nodeEnd)}}
                onChange={(newValue) => {
                    const input = newValue.target as HTMLElement;
                    if (input.innerText !== undefined) {
                        const nId = nametoNodeID(input.innerText);
                        setNodeEnd(nId);
                        setZoomNode(nId);
                        setOpenDrawer(true);
                    } else {
                        setNodeEnd("");
                    }
                }}
            />
        </div>
    );

    topbarElems.push(<Button
        sx={{color: 'black', width: '15%', textTransform: 'none', fontSize: '20px', fontFamily: 'Lato'}}
        endIcon={<DirectionsIcon/>}
        onClick={() => {
            setOpenDrawer(!openDrawer);
        }}>
        Directions
    </Button>);

    function numToSearchType(num: number) {
        switch (num) {
            case 0:
                return "A Star";
            case 1:
                return "BFS";
            case 2:
                return "DFS";
            case 3:
                return "Dijkstra";
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
            case "Dijkstra":
                return 3;
        }
        return 0;
    }

    const ChooseAlgo = (
        <div style={{width: '40%', alignSelf: 'center', marginTop: '5%', marginBottom: '5%'}}>
            <TextField
                select
                value={numToSearchType(algorithm)}
                onChange={(event) => {
                    setAlgorithm(searchTypeToNum(event.target.value));
                }}
                label="Pathfinding Algorithm"
                size="small"
                style={{backgroundColor: "white", color: "black", fontSize: '1.5vh', minWidth: '100%'}}
                InputProps={{style: {fontFamily: 'Lato'}}}
            >
                {<MenuItem value={"A Star"} sx={{fontFamily: 'Lato'}}>A*</MenuItem>}
                {<MenuItem value={"BFS"} sx={{fontFamily: 'Lato'}}>BFS</MenuItem>}
                {<MenuItem value={"DFS"} sx={{fontFamily: 'Lato'}}>DFS</MenuItem>}
                {<MenuItem value={"Dijkstra"} sx={{fontFamily: 'Lato'}}>Dijkstra</MenuItem>}
            </TextField>
        </div>
    );

    interface NodeType {
        label: string,
        nid: string
    }

    function setDefLoc(nId: string) {
        setDefaultLocation(nId);
        localStorage.setItem("defaultLocation", nId);
    }

    const SettingsMenu = (
        <Modal
            open={openMenu}
            onClose={() => {
                setOpenMenu(false);
            }}
            style={{fontFamily: 'Lato'}}>
            <Box sx={modalStyle}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', gap: '75%', marginTop: '-2%'}}>
                    <div>
                        <p className={"header"}> Settings </p>
                    </div>
                    <IconButton style={{alignSelf: 'end'}} onClick={() => setOpenMenu(false)}>
                        <CloseIcon/>
                    </IconButton>
                </div>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%', gap: '10%'}}>
                        <div style={{alignSelf: 'right', marginLeft: '7%'}}>
                            <FormGroup style={{minWidth: '50%', padding: 15}}>
                                <FormControlLabel
                                    style={{marginTop: '-10%'}}
                                    control={<Checkbox checked={showNodes} onClick={() => {
                                        localStorage.setItem("showNodes", !showNodes + "");
                                        setShowNodes(!showNodes);
                                        if(showNodes) {setShowIcons(!showNodes); setShowHalls(!showNodes);}
                                        if(!showNodes) {setShowHalls(!showNodes);}
                                    }}/>}
                                    label={<p className={"settings-text"}>Show Nodes</p>}/>
                                <FormControlLabel
                                    style={{marginTop: '-5%'}}
                                    control={<Switch disabled={!showNodes} checked={showHalls}
                                                       onClick={() => {
                                                           localStorage.setItem("showHalls", !showHalls + "");
                                                           setShowHalls(!showHalls);
                                                       }}/>}
                                    label={<p className={!showNodes ? "goku-disabled" : "goku-text"}>Hall Nodes</p>}/>
                                <FormControlLabel
                                    style={{marginTop: '-5%'}}
                                    control={<Switch disabled={!showNodes} checked={showIcons}
                                                       onClick={() => {
                                                           localStorage.setItem("showIcons", !showIcons + "");
                                                           setShowIcons(!showIcons);
                                                       }}/>}
                                    label={<p className={!showNodes ? "goku-disabled" : "goku-text"}>Icon Nodes</p>}/>
                                <FormControlLabel
                                    style={{marginTop: '-5%'}}
                                    control={<Checkbox checked={useDefault}
                                                       onClick={() => {
                                                           localStorage.setItem("useDefault", !useDefault + "");
                                                           setUseDefault(!useDefault);
                                                       }}/>}
                                    label={<p className={"settings-text"}>Default Start</p>}/>
                            </FormGroup>
                        </div>
                        <div style={{alignSelf: 'right'}}>
                            <FormGroup style={{minWidth: '50%', padding: 15}}>
                                <FormControlLabel
                                    style={{marginTop: '-10%'}}
                                    control={<Checkbox checked={showEdges} onClick={() => {
                                        localStorage.setItem("showEdges", !showEdges + "");
                                        setShowEdges(!showEdges);
                                    }}/>}
                                    label={<p className={"settings-text"}>Show Edges</p>}/>
                                <FormControlLabel
                                    style={{marginTop: '-5%'}}
                                    control={<Checkbox checked={showPopups}
                                                       onClick={() => {
                                                           localStorage.setItem("doAnimation", "false");
                                                           setDoAnimation(false);
                                                           localStorage.setItem("showPopups", !showPopups + "");
                                                           setShowPopups(!showPopups);
                                                       }}/>}
                                    label={<p className={"settings-text"}>Show Popups</p>}/>
                                <FormControlLabel
                                    style={{marginTop: '-5%'}}
                                    control={<Checkbox checked={doAnimation}
                                                       onClick={() => {
                                                           localStorage.setItem("showPopups", "false");
                                                           setShowPopups(false);
                                                           localStorage.setItem("doAnimation", !doAnimation + "");
                                                           setDoAnimation(!doAnimation);
                                                           if (doAnimation) {setGoku(!doAnimation);}
                                                           if (!doAnimation) {setGoku(!doAnimation);}
                                                       }}/>}
                                    label={<p className={"settings-text"}>Animate Path</p>}/>
                                <FormControlLabel
                                    style={{marginTop: '-5%'}}
                                    control={<Switch disabled={!doAnimation} checked={goku} onClick={() => {
                                        localStorage.setItem("goku", !goku + "");
                                        setGoku(!goku);
                                    }}/>}
                                    label={<p className={!doAnimation ? "goku-disabled" : "goku-text"}>Goku Animation</p>}/>
                            </FormGroup>
                        </div>
                    </div>
                {useDefault ?
                <div style={{alignSelf: 'center', width: '85%', marginTop: '-1%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%', gap: '10%', marginBottom: '5%'}}>
                        <Autocomplete
                            sx={{width: '90%'}}
                            disablePortal
                            options={currNodes.map(({nodeID, longName}): NodeType => (
                                {label: longName, nid: nodeID}
                            ))}
                            size={"small"}
                            value={{label: nodeIDtoName(defaultLocation!), nid: defaultLocation!}}
                            renderInput={(params) =>
                                <TextField {...params} label=" Default Starting Location" variant="standard"/>}
                            //value={{label: nodeIDtoName(location), nid: location}}
                            getOptionLabel={(nd: NodeType) =>
                                `${nd.label}`
                            }
                            getOptionKey={(nd: NodeType) =>
                                `${nd.nid}`
                            }
                            onChange={(newValue, val) => {
                                if (val !== null) {
                                    setDefaultLocation(val.nid);
                                    localStorage.setItem("defaultLocation", val.nid);
                                } else {
                                    setDefaultLocation("");
                                    localStorage.setItem("defaultLocation", "");
                                }
                            }}
                        />
                        <Button variant={"outlined"} style={{
                            color: "#34AD84",
                            width: 220, fontSize: '0.7em'
                        }} onClick={() => setShowMap(true)}>
                            Choose From Map
                        </Button>
                    </div>
                </div> : <></>}
                    <Divider/>
                    {ChooseAlgo}
                    <Divider/>
                    <div className={"color-settings"}>
                        <p className={"settings-text"} style={{paddingLeft: 15, marginBottom: '-2%', marginTop: '1%'}}>Node Color</p>
                        <input className="Settings-Color-Selector1" type="color" style={{marginTop: '3%'}}
                               value={(nodeColor === null ? "#3388ff" : nodeColor!)}
                               onChange={(e) => {
                                   localStorage.setItem("nodeColor", e.target.value);
                                   setNodeColor(e.target.value);
                               }}/>
                    </div>
                    <div className={"color-settings"}>
                        <p className={"settings-text"} style={{paddingLeft: 15}}>Edge Color</p>
                        <input className="Settings-Color-Selector2" type="color"
                               value={(edgeColor === null ? "#008000" : edgeColor!)}
                               onChange={(e) => {
                                   localStorage.setItem("edgeColor", e.target.value);
                                   setEdgeColor(e.target.value);
                               }}/>
                    </div>
            </Box>
        </Modal>
);
topbarElems.push(
    <Button
        sx={{color: 'black', width: '15%', textTransform: 'none', fontSize: '20px', fontFamily: 'Lato'}}
            endIcon={<SettingsIcon/>}
            onClick={() => {
                setOpenMenu(true);
            }}>
            Settings
        </Button>);
    topbarElems.push(SettingsMenu);

    return (
        <div className={"NavigationContainer"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <Navbar/> {/* NavBlue css fixes this to the left */}
            <div className={"NavigationBackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"NavigationTwoRows"}>
                    <div className={"MapControls"}>
                        <div className={"ControlsLeft"}>
                            {topbarElems}
                        </div>
                    </div>
                    <div className={"MapArea"}>
                        <LeafletMap openDrawer={openDrawer}
                                    nodesShow={showNodes}
                                    edgesShow={showEdges}
                                    hallsShow={showHalls}
                                    animate={doAnimation}
                                    algo={algorithm}
                                    endNode={nodeEnd}
                                    changeTopbar={setNodeEnd}
                                    changeDrawer={setOpenDrawer}
                                    nodeColor={nodeColor!}
                                    edgeColor={edgeColor!}
                                    goku={goku}
                                    defaultStart={defaultLocation!}
                                    useDefault={useDefault}
                                    changeDefault={setUseDefault}
                                    zoomNode={zoomNode}
                                    showPopups={showPopups}
                                    showIcons={showIcons}/>
                    </div>
                </div>
            </div>
            <Modal
                open={showMap}
                onClose={() => {
                    setShowMap(false);
                }}
                style={{fontFamily: 'Lato'}}
            >
                <Box sx={mapStyle}>
                    <MiniMap change={setDefLoc} setClose={setShowMap}/>
                </Box>
            </Modal>
        </div>
    );
}

