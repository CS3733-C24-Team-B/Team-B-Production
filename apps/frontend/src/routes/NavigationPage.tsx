import React, {SetStateAction, useEffect, useState} from "react";
import "../css/home_page.css";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import LeafletMap from "../components/Pathfinding/LeafletMap.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {
    Autocomplete, autocompleteClasses,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Menu,
    MenuItem, Switch
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsIcon from '@mui/icons-material/Directions';
import SearchIcon from '@mui/icons-material/Search';
import TextField from "@mui/material/TextField";
import axios from "axios";

export default function NavigationPage() {
    const {user} = useAuth0();
    console.log(user);
    const [nodeData, setNodeData] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [showNodes, setShowNodes] = useState(true);
    const [showEdges, setShowEdges] = useState(false);
    const [showHalls, setShowHalls] = useState(false);
    const [doAnimation, setDoAnimation] = useState(false);
    const [algorithm, setAlgorithm] = useState(0);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [nodeEnd, setNodeEnd] = useState("");
    const [nodeColor, setNodeColor] = useState(localStorage.getItem("nodeColor") !== null ? localStorage.getItem("nodeColor") : "#3388ff");
    const [edgeColor, setEdgeColor] = useState(localStorage.getItem("edgeColor") !== null ? localStorage.getItem("edgeColor") : "#008000");
    const [goku, setGoku] = useState(localStorage.getItem("goku") !== null ? localStorage.getItem("goku") === "true" : true);
    const openMenu = Boolean(menuAnchor);
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
        if(!user) {
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
                renderInput={(params) => <TextField {...params} label={<p className={"search-label"}>Find Your {<span
                    className={"action-text"}>Destination</span>}
                </p>} variant={"outlined"}/>}
                popupIcon={<SearchIcon/>}
                sx={{
                    [`& .${autocompleteClasses.popupIndicator}`]: {
                        transform: "none"
                    }
                }}
                ListboxProps={{style: {fontFamily: 'Lato'}}}
                value={{"label": nodeIDtoName(nodeEnd)}}
                onChange={(newValue) => {
                    const input = newValue.target as HTMLElement;
                    if (input.innerText !== undefined) {
                        const nId = nametoNodeID(input.innerText);
                        setNodeEnd(nId);
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

    const ChooseAlgo = (
        <TextField
            select
            value={numToSearchType(algorithm)}
            onChange={(event) => {
                setAlgorithm(searchTypeToNum(event.target.value));
            }}
            label="Pathfinding Algorithm"
            size="small"
            style={{backgroundColor: "white", color: "black", fontSize: '1.5vh', margin: '8%', minWidth: '84%'}}
            InputProps={{style: {fontFamily: 'Lato'}}}
        >
            {<MenuItem value={"A Star"} sx={{fontFamily: 'Lato'}}>A*</MenuItem>}
            {<MenuItem value={"BFS"} sx={{fontFamily: 'Lato'}}>BFS</MenuItem>}
            {<MenuItem value={"DFS"} sx={{fontFamily: 'Lato'}}>DFS</MenuItem>}
        </TextField>
    );
    const SettingsMenu = (
        <Menu
            open={openMenu}
            onClose={() => {
                setMenuAnchor(null);
            }}
            anchorEl={menuAnchor}>
            <FormGroup style={{minWidth: '10%', gap: 0, padding: 15}}>
                <FormControlLabel
                    control={<Checkbox checked={showNodes} onClick={() => setShowNodes(!showNodes)}/>}
                    label={<p className={"settings-text"}>Show Nodes</p>}/>
                <FormControlLabel
                    control={<Checkbox checked={showEdges} onClick={() => setShowEdges(!showEdges)}/>}
                    label={<p className={"settings-text"}>Show Edges</p>}/>
                <FormControlLabel control={<Checkbox checked={showNodes && showHalls}
                                                     onClick={() => setShowHalls(!showHalls)}/>}
                                  label={<p className={"settings-text"}>Show Halls</p>}/>
                <FormControlLabel control={<Checkbox checked={doAnimation}
                                                     onClick={() => setDoAnimation(!doAnimation)}/>}
                                  label={<p className={"settings-text"}>Animate Path</p>}/>
                {doAnimation && user ?
                    <FormControlLabel control={<Switch checked={goku} onClick={() => {
                        localStorage.setItem("goku", !goku + "");
                        setGoku(!goku);
                    }}/>}
                                      label={<p className={"settings-text"}>Goku?</p>}/> : <></>}
            </FormGroup>
            <Divider/>
            {ChooseAlgo}
            <Divider/>
            <div className={"color-settings"}>
                <p className={"settings-text"} style={{fontSize: "80%", paddingLeft: 15}}>Node Color</p>
                <input className="Settings-Color-Selector1" type="color"
                       value={(nodeColor === null ? "#3388ff" : nodeColor!)}
                       onChange={(e) => {
                           localStorage.setItem("nodeColor", e.target.value);
                           setNodeColor(e.target.value);
                       }}/>
            </div>
            <div className={"color-settings"}>
                <p className={"settings-text"} style={{fontSize: "80%", paddingLeft: 15}}>Edge Color</p>
                <input className="Settings-Color-Selector2" type="color"
                       value={(edgeColor === null ? "#008000" : edgeColor!)}
                       onChange={(e) => {
                           localStorage.setItem("edgeColor", e.target.value);
                           setEdgeColor(e.target.value);
                       }}/>
            </div>
        </Menu>
);
topbarElems.push(
    <Button
        sx={{color: 'black', width: '15%', textTransform: 'none', fontSize: '20px', fontFamily: 'Lato'}}
        endIcon={<SettingsIcon/>}
        onClick={(e) => {
            setMenuAnchor(e.currentTarget as unknown as SetStateAction<null>);
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
                                    goku={goku}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

