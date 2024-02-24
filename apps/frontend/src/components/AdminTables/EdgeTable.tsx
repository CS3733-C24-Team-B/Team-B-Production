import React, {useEffect, useState} from "react";
import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth0} from "@auth0/auth0-react";
import {Edge} from "database";
import {styled} from "@mui/material/styles";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteIcon from "@mui/icons-material/Delete";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import {
    Button, CircularProgress, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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

enum edgeSortField { off, edgeID, startNodeID, endNodeID }

export default function EdgeTable() {
    const {getAccessTokenSilently} = useAuth0();
    const [edgeData, setEdgeData] = useState<Edge[]>([]);
    const [sortUp, setSortUp] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [typeSort, setTypeSort] = useState<keyof typeof edgeSortField>();

    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/edges/read");
            setEdgeData(res.data);
        }

        fetch().then(() => {
            setLoading(false);
        });
    }, [getAccessTokenSilently, refresh]);

    function sortEdges(sortField: edgeSortField) {
        let edgesCopy: Edge[] = [...edgeData];
        switch (sortField) {
            case edgeSortField.off:
                return;
            case edgeSortField.edgeID:
                edgesCopy.sort((a: Edge, b: Edge) => a.edgeID.localeCompare(b.edgeID));
                break;
            case edgeSortField.startNodeID:
                edgesCopy.sort((a: Edge, b: Edge) => a.startNodeID.localeCompare(b.startNodeID));
                break;
            case edgeSortField.endNodeID:
                edgesCopy.sort((a: Edge, b: Edge) => a.endNodeID.localeCompare(b.endNodeID));
                break;
        }
        if (!sortUp) {
            edgesCopy = edgesCopy.reverse();
        }
        setTypeSort(edgeSortField[sortField] as keyof typeof edgeSortField);
        setEdgeData(edgesCopy);
    }

    const arrayEdge = edgeData.map((edge: Edge) =>
        <TableRow>
            <TableCell>{edge.edgeID}</TableCell>
            <TableCell>{edge.startNodeID}</TableCell>
            <TableCell>{edge.endNodeID}</TableCell>
        </TableRow>
    );

    function uploadFile() {
        console.log("Uploading edge info to database");

        try {
            const formData = new FormData();
            const csvFile = document.querySelector('#myFile') as HTMLInputElement;
            if (csvFile == null) {
                console.log("csv file is null");
                return;
            }

            formData.append("csvFile", csvFile.files![0]); // Update based on backend
            setLoading(true);
            getAccessTokenSilently().then((accessToken: string) => {
                axios.post("/api/edges/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: "Bearer " + accessToken
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
        console.log("Downloading edge info from database");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res3 = await axios.get('/api/edges/download', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            console.log(res3);
            const blob = new Blob([res3.data], {type: "text/csv"});
            const a = document.createElement("a");
            a.download = "EdgeData.csv";
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
        console.log("Downloading edge CSV template");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res3 = await axios.get('/api/edges/download-template', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob = new Blob([res3.data], {type: "text/csv"});
            const a = document.createElement("a");
            a.download = "EdgeDataTemplate.csv";
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
        console.log("Deleting all edges");
        try {
            const accessToken: string = await getAccessTokenSilently();
            axios.delete("/api/edges", {
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

    return (
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"}>
                <br/>
                {loading ? <CircularProgress className="center-text"/> :
                    <ThemeProvider theme={latoTheme}>
                        <TableContainer component={Paper} className="service-tables"
                                        sx={{maxHeight: "70vh"}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Edge ID
                                            <IconButton style={{color: (typeSort === "edgeID" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                setSortUp(!sortUp);
                                                sortEdges(edgeSortField.edgeID);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> : <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            Start Node
                                            <IconButton style={{color: (typeSort === "startNodeID" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                setSortUp(!sortUp);
                                                sortEdges(edgeSortField.startNodeID);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> : <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                        </TableCell>
                                        <TableCell>
                                            End Node
                                            <IconButton style={{color: (typeSort === "endNodeID" ? "#34AD84" : "")}}
                                                        onClick={() => {
                                                setSortUp(!sortUp);
                                                sortEdges(edgeSortField.endNodeID);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> : <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {arrayEdge}
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
                            onClick={deleteTable}
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                marginLeft: "5%",
                                minWidth: "90%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}>
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

