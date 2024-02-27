import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Snackbar,
    // styled,
    CircularProgress,
    ThemeProvider, createTheme, Typography, Dialog, DialogTitle, DialogActions
} from "@mui/material";
import {DropzoneAreaBase} from 'material-ui-dropzone';
import {useAuth0} from "@auth0/auth0-react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import axios from "axios";
import downloadImage from "../images/downloadImage.png";
// const VisuallyHiddenInput = styled('input')({
//     clip: 'rect(0 0 0 0)',
//     clipPath: 'inset(50%)',
//     height: 1,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     whiteSpace: 'nowrap',
//     width: 1,
// });

export default function UploadFiles() {
    const {getAccessTokenSilently} = useAuth0();
    const [nodeFile, setNodeFile] = useState<File>();
    const [edgeFile, setEdgeFile] = useState<File>();
    const [employeeFile, setEmployeeFile] = useState<File>();
    const [refresh, setRefresh] = useState(false);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [dialogDelete, setDialogDelete] = useState(() => deleteNodes);
    const [showDialog, setShowDialog] = useState(false);

    // function uploadNodeFile(e: React.ChangeEvent<HTMLInputElement>) {
    //     setNodeFile(undefined);
    //     const csvFile = e.target.files![0];
    //     if (csvFile == null) {
    //         console.log("csv file is null");
    //         return;
    //     }
    //     setNodeFile(csvFile);
    //     setNodeFileName(csvFile.name);
    // }

    // function uploadEdgeFile(e: React.ChangeEvent<HTMLInputElement>) {
    //     setEdgeFile(undefined);
    //     const csvFile = e.target.files![0];
    //     if (csvFile == null) {
    //         console.log("csv file is null");
    //         return;
    //     }
    //     setEdgeFile(csvFile);
    //     setEdgeFileName(csvFile.name);
    // }

    // function uploadEmployeeFile(e: React.ChangeEvent<HTMLInputElement>) {
    //     setEmployeeFile(undefined);
    //     const csvFile = e.target.files![0];
    //     if (csvFile == null) {
    //         console.log("csv file is null");
    //         return;
    //     }
    //     setEmployeeFile(csvFile);
    //     setEmployeeFileName(csvFile.name);
    // }

    function uploadFile() {
        console.log("Uploading node info to database");
        setIsLoading(true);
        try {
            if (nodeFile) {
                const formData = new FormData();
                formData.append("csvFile", nodeFile);
                getAccessTokenSilently().then(async (accessToken: string) => {
                    axios.post('/api/nodes/upload', formData, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(() => {
                            if (edgeFile) {
                                const formData = new FormData();
                                formData.append("csvFile", edgeFile);
                                getAccessTokenSilently().then(async (accessToken: string) => {
                                    axios.post('/api/edges/upload', formData, {
                                        headers: {
                                            Authorization: "Bearer " + accessToken,
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    }).then(() => {
                                            setIsLoading(false);
                                            setAlertText("Data uploaded successfully");
                                            setIsError(false);
                                            setSubmitAlert(true);
                                        },
                                        () => {
                                            setIsLoading(false);
                                            setAlertText("There was an error uploading the edge data");
                                            setIsError(true);
                                            setSubmitAlert(true);
                                        });
                                });
                            } else {
                                setIsLoading(false);
                                setAlertText("Data uploaded successfully");
                                setIsError(false);
                                setSubmitAlert(true);
                            }
                        },
                        () => {
                            setIsLoading(false);
                            setAlertText("There was an error uploading the node data");
                            setIsError(true);
                            setSubmitAlert(true);
                        });
                });
            }
        } catch (exception) {
            console.log("post error: " + exception);
        }
        try {
            if (edgeFile && !nodeFile) {
                const formData = new FormData();
                formData.append("csvFile", edgeFile);
                getAccessTokenSilently().then(async (accessToken: string) => {
                    axios.post('/api/edges/upload', formData, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(() => {
                            setRefresh(!refresh);
                            setIsLoading(false);
                            setAlertText("Data uploaded successfully");
                            setIsError(false);
                            setSubmitAlert(true);
                        },
                        () => {
                            setRefresh(!refresh);
                            setIsLoading(false);
                            setAlertText("There was an error uploading the edge data. You may need to upload the node data first.");
                            setIsError(true);
                            setSubmitAlert(true);
                        });
                });
            }
        } catch (exception) {
            console.log("post error: " + exception);
        }
        try {
            if (employeeFile) {
                const formData = new FormData();
                formData.append("csvFile", employeeFile);
                getAccessTokenSilently().then(async (accessToken: string) => {
                    axios.post('/api/employee/upload', formData, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(() => {
                            setRefresh(!refresh);
                            setIsLoading(false);
                            setAlertText("Data uploaded successfully");
                            setIsError(false);
                            setSubmitAlert(true);
                        },
                        () => {
                            setRefresh(!refresh);
                            setIsLoading(false);
                            setAlertText("There was an error uploading the employee data");
                            setIsError(true);
                            setSubmitAlert(true);
                        });
                });
            }
        } catch (exception) {
            console.log("post error: " + exception);
        }
        setRefresh(!refresh);
    }

    async function deleteNodes() {
        console.log("Deleting all nodes");
        try {
            const accessToken: string = await getAccessTokenSilently();
            axios.delete("/api/nodes", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then(() => {
                    setAlertText("Data deleted successfully");
                    setIsError(false);
                    setSubmitAlert(true);
                },
                () => {
                    setAlertText("There was an error deleting the data");
                    setIsError(true);
                    setSubmitAlert(true);
                });
        } catch (error) {
            console.error(error);
        }
        setShowDialog(false);
    }

    async function deleteEdges() {
        console.log("Deleting all edges");
        try {
            const accessToken: string = await getAccessTokenSilently();
            axios.delete("/api/edges", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then(() => {
                    setAlertText("Data deleted successfully");
                    setIsError(false);
                    setSubmitAlert(true);
                },
                () => {
                    setAlertText("There was an error deleting the data");
                    setIsError(true);
                    setSubmitAlert(true);
                });
        } catch (error) {
            console.error(error);
        }
        setShowDialog(false);
    }

    async function deleteEmployees() {
        console.log("Deleting all employees");
        try {
            const accessToken: string = await getAccessTokenSilently();
            axios.delete("/api/employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then(() => {
                    setAlertText("Data deleted successfully");
                    setIsError(false);
                    setSubmitAlert(true);
                },
                () => {
                    setAlertText("There was an error deleting the data");
                    setIsError(true);
                    setSubmitAlert(true);
                });
        } catch (error) {
            console.error(error);
        }
        setShowDialog(false);
    }

    async function downloadNodes() {
        const accessToken: string = await getAccessTokenSilently();
        const res = await axios.get('/api/nodes/download', {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
        const blob = new Blob([res.data], {type: "text/csv"});
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
    }

    async function downloadEdges() {
        const accessToken: string = await getAccessTokenSilently();
        const res = await axios.get('/api/edges/download', {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
        const blob = new Blob([res.data], {type: "text/csv"});
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
    }

    async function downloadEmployees() {
        const accessToken: string = await getAccessTokenSilently();
        const res = await axios.get('/api/employee/download', {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
        const blob = new Blob([res.data], {type: "text/csv"});
        const a = document.createElement("a");
        a.download = "EmployeeData.csv";
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    }

    async function downloadFiles() {
        console.log("Downloading node info from database");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get('/api/nodes/download', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob = new Blob([res.data], {type: "text/csv"});
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
            const res2 = await axios.get('/api/edges/download', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob2 = new Blob([res2.data], {type: "text/csv"});
            const b = document.createElement("a");
            b.download = "EdgeData.csv";
            b.href = window.URL.createObjectURL(blob2);
            const clickEvtB = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            b.dispatchEvent(clickEvtB);
            b.remove();
            const res3 = await axios.get("/api/employee/download", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob3: Blob = new Blob([res3.data], {type: "text/csv"});
            const c = document.createElement("a");
            c.download = "EmployeeData.csv";
            c.href = window.URL.createObjectURL(blob3);
            const clickEventC: MouseEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            c.dispatchEvent(clickEventC);
            c.remove();
        } catch (exception) {
            console.log("post error: " + exception);
        }
    }

    useEffect(() => {
        setNodeFile(undefined);
        setEdgeFile(undefined);
        setEmployeeFile(undefined);
    }, [refresh]);
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Lato',
                'sans-serif',
            ].join(','),
        },
    });

    return (
        <div className="AD-ThreeRows">
            <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
                {/*IMPORT FILES*/}
                <div className="AD-OneCard">
                    <Typography style={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.35em"}}>
                        Import Files
                    </Typography>

                    <div className={"file-buttons"}>
                        <Box sx={{display: "grid", justifyContent: "center"}}>
                            <div style={{minWidth: '15vw'}}>
                                {nodeFile ?
                                    <DropzoneAreaBase
                                        style={{minWidth: '100%'}}
                                        dropzoneText={<>
                                            <p style={{
                                                fontFamily: 'Lato',
                                                margin: '1%',
                                                fontSize: '0.8em'
                                            }}>{nodeFile.name}</p>
                                            <InsertDriveFileIcon/>
                                        </>}
                                        Icon={"none"}
                                        filesLimit={1}
                                        showAlerts={false}
                                        onAdd={(files) => {
                                            setNodeFile(files[0].file);
                                        }}/> :
                                    <DropzoneAreaBase
                                        style={{minWidth: '100%'}}
                                        dropzoneText={<>
                                            <p style={{fontFamily: 'Lato', margin: '1%', fontSize: '0.8em'}}>Upload
                                                Node File</p>
                                            <CloudUploadIcon/>
                                        </>}
                                        Icon={"none"}
                                        filesLimit={1}
                                        showAlerts={false}
                                        onAdd={(files) => {
                                            setNodeFile(files[0].file);
                                        }}/>}
                            </div>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #34AD84',
                                color: "#34AD84",
                                width: "65%",
                                marginLeft: "15%"
                            }} onClick={() => setNodeFile(undefined)}>
                                CLEAR FILE
                            </Button>
                        </Box>
                        <Box sx={{display: "grid", justifyContent: "center"}}>
                            <div style={{minWidth: '15vw'}}>
                                {edgeFile ?
                                    <DropzoneAreaBase
                                        style={{minWidth: '100%'}}
                                        dropzoneText={<>
                                            <p style={{
                                                fontFamily: 'Lato',
                                                margin: '1%',
                                                fontSize: '0.8em'
                                            }}>{edgeFile.name}</p>
                                            <InsertDriveFileIcon/>
                                        </>}
                                        Icon={"none"}
                                        filesLimit={1}
                                        showAlerts={false}
                                        onAdd={(files) => {
                                            setEdgeFile(files[0].file);
                                        }}/> :
                                    <DropzoneAreaBase
                                        style={{minWidth: '100%'}}
                                        dropzoneText={<>
                                            <p style={{fontFamily: 'Lato', margin: '1%', fontSize: '0.8em'}}>Upload
                                                Edge File</p>
                                            <CloudUploadIcon/>
                                        </>}
                                        Icon={"none"}
                                        filesLimit={1}
                                        showAlerts={false}
                                        onAdd={(files) => {
                                            setEdgeFile(files[0].file);
                                        }}/>}
                            </div>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #34AD84',
                                color: "#34AD84",
                                width: "65%",
                                marginLeft: "15%"
                            }} onClick={() => setEdgeFile(undefined)}>
                                CLEAR FILE
                            </Button>
                        </Box>
                        <Box sx={{display: "grid", justifyContent: "center"}}>
                            <div style={{minWidth: '15vw'}}>
                                {employeeFile ?
                                    <DropzoneAreaBase
                                        style={{minWidth: '100%'}}
                                        dropzoneText={<>
                                            <p style={{
                                                fontFamily: 'Lato',
                                                margin: '1%',
                                                fontSize: '0.8em'
                                            }}>{employeeFile.name}</p>
                                            <InsertDriveFileIcon/>
                                        </>}
                                        Icon={"none"}
                                        filesLimit={1}
                                        showAlerts={false}
                                        onAdd={(files) => {
                                            setEmployeeFile(files[0].file);
                                        }}/> :
                                    <DropzoneAreaBase
                                        style={{minWidth: '100%'}}
                                        dropzoneText={<>
                                            <p style={{fontFamily: 'Lato', margin: '1%', fontSize: '0.8em'}}>Upload
                                                Employee File</p>
                                            <CloudUploadIcon/>
                                        </>}
                                        Icon={"none"}
                                        filesLimit={1}
                                        showAlerts={false}
                                        onAdd={(files) => {
                                            setEmployeeFile(files[0].file);
                                        }}/>}
                            </div>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #34AD84',
                                color: "#34AD84",
                                width: "65%",
                                marginLeft: "15%"
                            }} onClick={() => setEmployeeFile(undefined)}>
                                CLEAR FILE
                            </Button>
                        </Box>
                    </div>

                    <Button disabled={isLoading || (!nodeFile && !edgeFile && !employeeFile)} sx={{
                        marginTop: "0vh",
                        backgroundColor: (isLoading || (!nodeFile && !edgeFile && !employeeFile)) ? "lightgray" : "#34AD84",
                        color: "white",
                        width: "50%",
                        marginLeft: "25%",
                        '&:hover': {
                            backgroundColor: "#34AD84", // Adjust hover background color
                        },
                    }} onClick={() => uploadFile()}>
                        {isLoading ? <CircularProgress/> : "UPLOAD ALL FILES"}
                    </Button>
                </div>

                {/*EXPORT FILES*/}
                <div className="AD-OneCard">
                    <Typography style={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.35em"}}>
                        Export Files
                    </Typography>
                    <Box sx={{display: "flex", marginTop: "6vh"}}>
                        <Box>
                            <div className={"upload-download-div"}>
                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                    <img src={downloadImage} className={"download-icon"} onClick={() => downloadNodes()}/>
                                    <Box sx={{display: "grid"}}>
                                        <Typography sx={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.20em"}}>
                                            Node Data File:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                marginLeft: "1.5vw",
                                                fontWeight: 550,
                                                color: "#34AD84",
                                                fontSize: "1.20em"
                                            }}>
                                            NodeDataName.Csv
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #34AD84',
                                color: "#34AD84",
                                width: "50%",
                                marginLeft: "30%"
                            }} onClick={() => {
                                setDialogDelete(() => () => deleteNodes());
                                setShowDialog(true);
                            }}>
                                DELETE ALL DATA
                            </Button>
                        </Box>
                        <Box>
                            <div className={"upload-download-div"}>
                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                    <img src={downloadImage} className={"download-icon"} onClick={() => downloadEdges()}/>
                                    <Box sx={{display: "grid"}}>
                                        <Typography sx={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.20em"}}>
                                            Edge Data File:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                marginLeft: "1.5vw",
                                                fontWeight: 550,
                                                color: "#34AD84",
                                                fontSize: "1.20em"
                                            }}>
                                            EdgeDataName.Csv
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #34AD84',
                                color: "#34AD84",
                                width: "50%",
                                marginLeft: "30%"
                            }} onClick={() => {
                                setDialogDelete(() => () => deleteEdges());
                                setShowDialog(true);
                            }}>
                                DELETE ALL DATA
                            </Button>
                        </Box>
                        <Box>
                            <div className={"upload-download-div"}>
                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                    <img src={downloadImage} className={"download-icon"} onClick={() => downloadEmployees()}/>
                                    <Box sx={{display: "grid"}}>
                                        <Typography sx={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.20em"}}>
                                            Employee Data File:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                marginLeft: "1.5vw",
                                                fontWeight: 550,
                                                color: "#34AD84",
                                                fontSize: "1.20em"
                                            }}>
                                            EmployeeDataName.Csv
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #34AD84',
                                color: "#34AD84",
                                width: "50%",
                                marginLeft: "26%"
                            }} onClick={() => {
                                setDialogDelete(() => () => deleteEmployees());
                                setShowDialog(true);
                            }}>
                                DELETE ALL DATA
                            </Button>
                        </Box>
                    </Box>
                    <Button sx={{
                        marginTop: "12vh",
                        backgroundColor: "#34AD84",
                        color: "white",
                        width: "30%",
                        marginLeft: "35%",
                        '&:hover': {
                            backgroundColor: '#34AD84', // Adjust hover background color
                        },
                    }} onClick={() => downloadFiles()}>
                        EXPORT CURRENT FILES
                    </Button>
                </div>
                <Snackbar
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    open={submitAlert}
                    autoHideDuration={3500}
                    onClose={() => {
                        setSubmitAlert(false);
                    }}>
                    <Alert
                        severity={isError ? "error" : "success"}
                        sx={{width: '100%'}}
                    >
                        {alertText}
                    </Alert>
                </Snackbar>
                <Dialog
                    open={showDialog}
                    onClose={() => {
                        setShowDialog(false);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to delete this data?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={dialogDelete} sx={{color: "#34AD84"}}>Yes</Button>
                        <Button onClick={() => {
                            setShowDialog(false);
                        }} autoFocus sx={{color: "#34AD84"}}>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>

            </ThemeProvider>
        </div>
    );
}

