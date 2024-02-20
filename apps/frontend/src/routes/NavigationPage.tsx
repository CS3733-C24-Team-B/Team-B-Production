import React, {useEffect, useState} from "react";
import "../css/home_page.css";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import LeafletMap from "../components/LeafletMap.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {
    Autocomplete, autocompleteClasses,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Menu,
    MenuItem
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
                sx={{[`& .${autocompleteClasses.popupIndicator}`]: {
                        transform: "none"
                    }}}
                value={nodeIDtoName(nodeEnd)}
                onChange={(newValue) => {
                    if (newValue !== null && newValue.target.innerText !== undefined) {
                        const nId = nametoNodeID(newValue.target.innerText);
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
        sx={{color: 'black', width: '10%', textTransform: 'none', fontSize: '20px', fontFamily: 'Calibri'}}
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
            size="small"
            style={{backgroundColor: "white", color: "black", fontSize: '1.5vh', margin: '8%', minWidth: '84%'}}
        >
            {<MenuItem value={"A Star"}>A*</MenuItem>}
            {<MenuItem value={"BFS"}>BFS</MenuItem>}
            {<MenuItem value={"DFS"}>DFS</MenuItem>}
        </TextField>
    );
    const SettingsMenu = (
        <Menu
            open={openMenu}
            onClose={() => {
                setMenuAnchor(null);
            }}
            anchorEl={menuAnchor}>
            <FormGroup style={{minWidth: '10%', gap: 5, padding: 15}}>
                <FormControlLabel
                    control={<Checkbox checked={showNodes} onClick={() => setShowNodes(!showNodes)}/>}
                    label="Show Nodes"/>
                <FormControlLabel
                    control={<Checkbox checked={showEdges} onClick={() => setShowEdges(!showEdges)}/>}
                    label="Show Edges"/>
                <FormControlLabel control={<Checkbox checked={showNodes && showHalls}
                                                     onClick={() => setShowHalls(!showHalls)}/>}
                                  label="Show Halls"/>
                <FormControlLabel control={<Checkbox checked={doAnimation}
                                                     onClick={() => setDoAnimation(!doAnimation)}/>}
                                  label="Animate Path"/>
            </FormGroup>
            <Divider/>
            {ChooseAlgo}
        </Menu>
    );
    topbarElems.push(<Button
        sx={{color: 'black', width: '10%', textTransform: 'none', fontSize: '20px', fontFamily: 'Calibri'}}
        endIcon={<SettingsIcon/>}
        onClick={(e) => {
            setMenuAnchor(e.currentTarget);
        }}>
        Settings
    </Button>);
    topbarElems.push(SettingsMenu);

    return (
        <div className={"NavigationContainer"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
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
                                    changeDrawer={setOpenDrawer}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

