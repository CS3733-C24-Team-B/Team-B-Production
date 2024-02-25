import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Snackbar,
    // styled,
    // CircularProgress,
    ThemeProvider, createTheme, Typography
} from "@mui/material";
// import {useAuth0} from "@auth0/auth0-react";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// import axios from "axios";
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
    // const {} = useAuth0();
    const [,] = useState<File>();
    const [, setNodeFileName] = useState<string>("");
    const [,] = useState<File>();
    const [, setEdgeFileName] = useState<string>("");
    const [,] = useState<File>();
    const [, setEmployeeFileName] = useState<string>("");
    const [refresh,] = useState(false);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [isError,] = useState(false);
    const [alertText] = useState("");
    // const [isLoading, setIsLoading] = useState(false);

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

    // function uploadFile() {
    //     console.log("Uploading node info to database");
    //     setIsLoading(true);
    //     try {
    //         if (nodeFile) {
    //             const formData = new FormData();
    //             formData.append("csvFile", nodeFile);
    //             getAccessTokenSilently().then(async (accessToken: string) => {
    //                 axios.post('/api/nodes/upload', formData, {
    //                     headers: {
    //                         Authorization: "Bearer " + accessToken,
    //                         'Content-Type': 'multipart/form-data'
    //                     }
    //                 }).then(() => {
    //                         if (edgeFile) {
    //                             const formData = new FormData();
    //                             formData.append("csvFile", edgeFile);
    //                             getAccessTokenSilently().then(async (accessToken: string) => {
    //                                 axios.post('/api/edges/upload', formData, {
    //                                     headers: {
    //                                         Authorization: "Bearer " + accessToken,
    //                                         'Content-Type': 'multipart/form-data'
    //                                     }
    //                                 }).then(() => {
    //                                         setIsLoading(false);
    //                                         setAlertText("Data uploaded successfully");
    //                                         setIsError(false);
    //                                         setSubmitAlert(true);
    //                                     },
    //                                     () => {
    //                                         setIsLoading(false);
    //                                         setAlertText("There was an error uploading the edge data");
    //                                         setIsError(true);
    //                                         setSubmitAlert(true);
    //                                     });
    //                             });
    //                         } else {
    //                             setIsLoading(false);
    //                             setAlertText("Data uploaded successfully");
    //                             setIsError(false);
    //                             setSubmitAlert(true);
    //                         }
    //                     },
    //                     () => {
    //                         setIsLoading(false);
    //                         setAlertText("There was an error uploading the node data");
    //                         setIsError(true);
    //                         setSubmitAlert(true);
    //                     });
    //             });
    //         }
    //     } catch (exception) {
    //         console.log("post error: " + exception);
    //     }
    //     try {
    //         if (edgeFile && !nodeFile) {
    //             const formData = new FormData();
    //             formData.append("csvFile", edgeFile);
    //             getAccessTokenSilently().then(async (accessToken: string) => {
    //                 axios.post('/api/edges/upload', formData, {
    //                     headers: {
    //                         Authorization: "Bearer " + accessToken,
    //                         'Content-Type': 'multipart/form-data'
    //                     }
    //                 }).then(() => {
    //                         setRefresh(!refresh);
    //                         setIsLoading(false);
    //                         setAlertText("Data uploaded successfully");
    //                         setIsError(false);
    //                         setSubmitAlert(true);
    //                     },
    //                     () => {
    //                         setRefresh(!refresh);
    //                         setIsLoading(false);
    //                         setAlertText("There was an error uploading the edge data. You may need to upload the node data first.");
    //                         setIsError(true);
    //                         setSubmitAlert(true);
    //                     });
    //             });
    //         }
    //     } catch (exception) {
    //         console.log("post error: " + exception);
    //     }
    //     try {
    //         if (employeeFile) {
    //             const formData = new FormData();
    //             formData.append("csvFile", employeeFile);
    //             getAccessTokenSilently().then(async (accessToken: string) => {
    //                 axios.post('/api/employee/upload', formData, {
    //                     headers: {
    //                         Authorization: "Bearer " + accessToken,
    //                         'Content-Type': 'multipart/form-data'
    //                     }
    //                 }).then(() => {
    //                         setRefresh(!refresh);
    //                         setIsLoading(false);
    //                         setAlertText("Data uploaded successfully");
    //                         setIsError(false);
    //                         setSubmitAlert(true);
    //                     },
    //                     () => {
    //                         setRefresh(!refresh);
    //                         setIsLoading(false);
    //                         setAlertText("There was an error uploading the employee data");
    //                         setIsError(true);
    //                         setSubmitAlert(true);
    //                     });
    //             });
    //         }
    //     } catch (exception) {
    //         console.log("post error: " + exception);
    //     }
    //     setRefresh(!refresh);
    // }

    // async function downloadFiles() {
    //     console.log("Downloading node info from database");
    //
    //     try {
    //         const accessToken: string = await getAccessTokenSilently();
    //         const res = await axios.get('/api/nodes/download', {
    //             headers: {
    //                 Authorization: "Bearer " + accessToken
    //             }
    //         });
    //         const blob = new Blob([res.data], {type: "text/csv"});
    //         const a = document.createElement("a");
    //         a.download = "NodeData.csv";
    //         a.href = window.URL.createObjectURL(blob);
    //         const clickEvt = new MouseEvent("click", {
    //             view: window,
    //             bubbles: true,
    //             cancelable: true,
    //         });
    //         a.dispatchEvent(clickEvt);
    //         a.remove();
    //         const res2 = await axios.get('/api/edges/download', {
    //             headers: {
    //                 Authorization: "Bearer " + accessToken
    //             }
    //         });
    //         const blob2 = new Blob([res2.data], {type: "text/csv"});
    //         const b = document.createElement("a");
    //         b.download = "EdgeData.csv";
    //         b.href = window.URL.createObjectURL(blob2);
    //         const clickEvtB = new MouseEvent("click", {
    //             view: window,
    //             bubbles: true,
    //             cancelable: true,
    //         });
    //         b.dispatchEvent(clickEvtB);
    //         b.remove();
    //         const res3 = await axios.get("/api/employee/download", {
    //             headers: {
    //                 Authorization: "Bearer " + accessToken
    //             }
    //         });
    //         const blob3: Blob = new Blob([res3.data], {type: "text/csv"});
    //         const c = document.createElement("a");
    //         c.download = "EmployeeData.csv";
    //         c.href = window.URL.createObjectURL(blob3);
    //         const clickEventC: MouseEvent = new MouseEvent("click", {
    //             view: window,
    //             bubbles: true,
    //             cancelable: true
    //         });
    //         c.dispatchEvent(clickEventC);
    //         c.remove();
    //     } catch (exception) {
    //         console.log("post error: " + exception);
    //     }
    // }

    useEffect(() => {
        // setNodeFile(undefined);
        // setEdgeFile(undefined);
        // setEmployeeFile(undefined);
        setNodeFileName("");
        setEdgeFileName("");
        setEmployeeFileName("");
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
        <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
            <div className="AD-TwoRows3">
                {/*IMPORT FILES*/}
                <div className="AD-OneCard">
                    <Typography sx={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.35em"}}>
                        Import Files
                    </Typography>

                    <div className={"file-buttons"}>
                        <Box sx={{display: "grid", justifyContent: "center"}}>
                            <div className="DragDropSubstitute"/>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #2196F3',
                                color: "#2196F3",
                                width: "50%",
                                marginLeft: "25%"
                            }}>
                                CLEAR FILE
                            </Button>
                        </Box>
                        <Box sx={{display: "grid", justifyContent: "center"}}>
                            <div className="DragDropSubstitute"/>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #2196F3',
                                color: "#2196F3",
                                width: "50%",
                                marginLeft: "25%"
                            }}>
                                CLEAR FILE
                            </Button>
                        </Box>
                        <Box sx={{display: "grid", justifyContent: "center"}}>
                            <div className="DragDropSubstitute"/>
                            <Button sx={{
                                marginTop: "3vh",
                                border: '1px solid #2196F3',
                                color: "#2196F3",
                                width: "50%",
                                marginLeft: "25%"
                            }}>
                                CLEAR FILE
                            </Button>
                        </Box>
                    </div>

                    <Button sx={{
                        marginTop: "3vh",
                        backgroundColor: "#2196F3",
                        color: "white",
                        width: "50%",
                        marginLeft: "25%",
                        '&:hover': {
                            backgroundColor: 'rgba(33,150,243,0.78)', // Adjust hover background color
                        },
                    }}>
                        UPLOAD ALL FILES
                    </Button>
                </div>

                {/*EXPORT FILES*/}
                <div className="AD-OneCard">
                    <Typography sx={{marginLeft: "1.5vw", fontWeight: 550, fontSize: "1.35em"}}>
                        Export Files
                    </Typography>
                    <Box sx={{display: "flex", marginTop:"6vh"}}>
                        <Box>
                            <div className={"upload-download-div"}>
                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                    <img src={downloadImage} width="9%" height="65%"/>
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
                                border: '1px solid #2196F3',
                                color: "#2196F3",
                                width: "37%",
                                marginLeft: "39%"
                            }}>
                                DELETE ALL DATA
                            </Button>
                        </Box>
                        <Box>
                            <div className={"upload-download-div"}>
                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                    <img src={downloadImage} width="9%" height="65%"/>
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
                                border: '1px solid #2196F3',
                                color: "#2196F3",
                                width: "37%",
                                marginLeft: "39%"
                            }}>
                                DELETE ALL DATA
                            </Button>
                        </Box>
                        <Box>
                            <div className={"upload-download-div"}>
                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                    <img src={downloadImage} width="9%" height="65%"/>
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
                                border: '1px solid #2196F3',
                                color: "#2196F3",
                                width: "37%",
                                marginLeft: "39%"
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
                    }}>
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
            </div>
        </ThemeProvider>
    );
}

