import React, {useEffect, useState} from "react";
import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth0} from "@auth0/auth0-react";
import {Node} from "database";
import {styled} from "@mui/material/styles";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteIcon from "@mui/icons-material/Delete";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import {
    Button, CircularProgress, FormControl, IconButton, Menu, MenuItem, Paper, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Divider from "@mui/material/Divider";
import FilterListIcon from "@mui/icons-material/FilterList";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const latoTheme = createTheme({
    components: {
        // Name of the component
        MuiTableCell: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontFamily: 'Lato',
                },
            },
        },
    },
});

enum nodeSortField {
    off, nodeID, xCoord, yCoord, floor,
    building, nodeType, longName, shortName
}

export default function CSVNodeDataTable() {
    const {getAccessTokenSilently} = useAuth0();
    const [nodeData, setNodeData] = useState<Node[]>([]);
    const [sortUp, setSortUp] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [typeSort, setTypeSort] = useState<keyof typeof nodeSortField>();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [filterType, setFilterType] = useState("none");
    const [filterFunction, setFilterFunction] = useState<(node: Node) => boolean>(() => () => {
        return true;
    });
    const filterOptions = new Set<string>();
    const [filterVal, setFilterVal] = useState("None");
    const openMenu = Boolean(menuAnchor);

    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/nodes/read");
            setNodeData(res.data);
        }

        fetch().then(() => {
            setLoading(false);
        });
    }, [refresh]);

    function sortNodes(sortField: nodeSortField): void {
        let nodesCopy: Node[] = [...nodeData];
        switch (sortField) {
            case nodeSortField.off:
                return;
            case nodeSortField.nodeID:
                nodesCopy.sort((a: Node, b: Node) => a.nodeID.localeCompare(b.nodeID));
                break;
            case nodeSortField.xCoord:
                nodesCopy.sort((a: Node, b: Node) => b.xcoord - a.xcoord);
                break;
            case nodeSortField.yCoord:
                nodesCopy.sort((a: Node, b: Node) => b.ycoord - a.ycoord);
                break;
            case nodeSortField.floor:
                nodesCopy.sort((a: Node, b: Node) => a.floor.localeCompare(b.floor));
                break;
            case nodeSortField.building:
                nodesCopy.sort((a: Node, b: Node) => a.building.localeCompare(b.building));
                break;
            case nodeSortField.nodeType:
                nodesCopy.sort((a: Node, b: Node) => a.nodeType.localeCompare(b.nodeType));
                break;
            case nodeSortField.longName:
                nodesCopy.sort((a: Node, b: Node) => a.longName.localeCompare(b.longName));
                break;
            case nodeSortField.shortName:
                nodesCopy.sort((a: Node, b: Node) => a.shortName.localeCompare(b.shortName));
                break;
        }
        if (!sortUp) {
            nodesCopy = nodesCopy.reverse();
        }
        setTypeSort(nodeSortField[sortField] as keyof typeof nodeSortField);
        setNodeData(nodesCopy);
    }

    const filterNode = nodeData.filter(filterFunction);

    const arrayNode = filterNode.map((node: Node) =>
        <TableRow>
            <TableCell>{node.nodeID}</TableCell>
            <TableCell>{node.xcoord}</TableCell>
            <TableCell>{node.ycoord}</TableCell>
            <TableCell>{node.floor}</TableCell>
            <TableCell>{node.building}</TableCell>
            <TableCell>{node.nodeType}</TableCell>
            <TableCell>{node.longName}</TableCell>
            <TableCell>{node.shortName}</TableCell>
        </TableRow>
    );

    function uploadFile() {
        console.log("Uploading node info to database");
        try {
            const formData = new FormData();
            const csvFile = document.querySelector('#myFile') as HTMLInputElement;
            if (csvFile == null) {
                console.log("csv file is null");
                return;
            }

            formData.append("csvFile", csvFile.files![0]); // Update based on backend

            getAccessTokenSilently().then((accessToken: string) => {
                axios.post('/api/nodes/upload', formData, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    setRefresh(!refresh);
                });
            });
        } catch (exception) {
            console.log("post error: " + exception);
        }
    }

    async function downloadFile() {
        console.log("Downloading node info from database");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res3 = await axios.get('/api/nodes/download', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob = new Blob([res3.data], {type: "text/csv"});
            const a = document.createElement("a");
            a.download = "NodeData.csv";
            a.href = window.URL.createObjectURL(blob);
            const clickEvt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            a.dispatchEvent(clickEvt);
            a.remove();
        } catch (exception) {
            console.log("post error: " + exception);
        }
    }

    async function downloadTemplate() {
        console.log("Downloading node CSV template");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res3 = await axios.get('/api/nodes/download-template', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob = new Blob([res3.data], {type: "text/csv"});
            const a = document.createElement("a");
            a.download = "NodeDataTemplate.csv";
            a.href = window.URL.createObjectURL(blob);
            const clickEvt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            a.dispatchEvent(clickEvt);
            a.remove();
        } catch (exception) {
            console.log("post error: " + exception);
        }
    }

    async function deleteTable() {
        console.log("Deleting all nodes");
        try {
            const accessToken: string = await getAccessTokenSilently();
            axios.delete("/api/nodes", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then(() => {
                setRefresh(!refresh);
            });
        } catch (error) {
            console.error(error);
        }
    }

    function fillOptions(nodeKey: keyof Node) {
        filterOptions.clear();
        nodeData.forEach((node) => {
            filterOptions.add(node[nodeKey] + "");
        });
    }

    function FilterSelect(props: { nodeKey: keyof Node }) {
        const {nodeKey} = props;
        fillOptions(nodeKey);
        const arr : string[] = [];
        const iter = filterOptions.values();
        for(const str of iter) {
            arr.push(str);
        }

        return (
            <>
                <Divider/>
                <Select
                    value={filterVal}
                    label=""
                    onChange={(e) => {
                        setFilterVal(e.target.value);
                        setFilterFunction(() => (node: Node) => {
                            return e.target.value === "None" || node[nodeKey] === e.target.value;
                        });
                    }}
                >
                    <MenuItem value={"None"}>{"None"}</MenuItem>
                    {arr.map((str) => (
                        <MenuItem value={str}>{str}</MenuItem>
                    ))}
                </Select>
            </>
        );
    }

    return (
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"}>
                <Menu
                    open={openMenu}
                    onClose={() => {
                        setMenuAnchor(null);
                    }}
                    anchorEl={menuAnchor}>
                    <FormControl style={{minWidth: 180, gap: 10, padding: 10}}>
                        <Select
                            value={filterType}
                            label=""
                            onChange={(e) => {
                                setFilterVal("None");
                                setFilterType(e.target.value);
                                setFilterFunction(() => () => {
                                    return true;
                                });
                            }}
                        >
                            <MenuItem value={"none"}>None</MenuItem>
                            <MenuItem value={"floor"}>Floor</MenuItem>
                            <MenuItem value={"building"}>Building</MenuItem>
                            <MenuItem value={"nodeType"}>Node Type</MenuItem>
                        </Select>
                        {({
                            'floor': <FilterSelect nodeKey={'floor'} />,
                            'building': <FilterSelect nodeKey={'building'} />,
                            'nodeType': <FilterSelect nodeKey={'nodeType'} />,
                            'none': <></>
                        }[filterType])}
                    </FormControl>
                </Menu>
                <IconButton onClick={(e) => {
                    setMenuAnchor(e.currentTarget);
                }} style={{borderRadius: 0, width: 72}}>
                    <FilterListIcon/>
                </IconButton>
                <br/>
                {loading ? <CircularProgress className="center-text"/> :
                    <ThemeProvider theme={latoTheme}>
                        <TableContainer component={Paper} className="service-tables"
                                        sx={{maxHeight: "70vh"}}>
                            <Table stickyHeader>
                                <colgroup>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                    <col width="12.5%"/>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Node ID
                                            <IconButton style={{color: (typeSort === "nodeID" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.nodeID);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            X-Coord
                                            <IconButton style={{color: (typeSort === "xCoord" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.xCoord);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Y-Coord
                                            <IconButton style={{color: (typeSort === "yCoord" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.yCoord);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Floor
                                            <IconButton style={{color: (typeSort === "floor" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.floor);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Building
                                            <IconButton style={{color: (typeSort === "building" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.building);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Node Type
                                            <IconButton style={{color: (typeSort === "nodeType" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.nodeType);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Long Name
                                            <IconButton style={{color: (typeSort === "longName" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.longName);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Short Name
                                            <IconButton style={{color: (typeSort === "shortName" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                            setSortUp(!sortUp);
                                                            sortNodes(nodeSortField.shortName);
                                                        }}>{sortUp ? <ArrowUpwardIcon/> :
                                                <ArrowDownwardIcon/>}</IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {arrayNode}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </ThemeProvider>}
            </div>
            <div className={"AD-TwoRows2"}>
                <div className={"AD-Card3"}>
                    <p className={"AD-head"}>Actions</p>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon/>}
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                marginLeft: "5%",
                                minWidth: "90%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}
                    >
                        Upload File
                        <VisuallyHiddenInput id="myFile" type="file" onChange={uploadFile}/>
                    </Button>
                    <Button component="label" variant="contained" startIcon={<IosShareIcon/>}
                            onClick={downloadFile}
                            className="export-button"
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                minWidth: "90%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}>
                        Export File
                    </Button>
                    <Button component="label" variant="contained" startIcon={<SimCardDownloadIcon/>}
                            onClick={downloadTemplate}
                            className="export-button"
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                minWidth: "90%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}>
                        Template
                    </Button>
                    <Button component="label" variant="contained" startIcon={<DeleteIcon/>}
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                marginLeft: "5%",
                                minWidth: "90%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}
                            onClick={deleteTable}>
                        Delete Data
                    </Button>
                </div>
                <div className={"AD-OneCard2"}>
                    <p className={"AD-head2"}>Last Updated:</p>
                    <br/>
                    <br/>
                    <p className={"AD-head2"}>12:02pm, 2/20/2024</p>
                    {/*<p className={"AD-head3"}>21:02</p>*/}
                    {/*<p className={"AD-head4"}>May 23, 2023</p>*/}
                </div>
            </div>
        </div>
    );
}

