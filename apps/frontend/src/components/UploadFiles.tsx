import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button, Snackbar, styled,
    CircularProgress
} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from "axios";

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

export default function UploadFiles() {
    const {getAccessTokenSilently} = useAuth0();
    const [nodeFile, setNodeFile] = useState<File>();
    const [nodeFileName, setNodeFileName] = useState<string>("");
    const [edgeFile, setEdgeFile] = useState<File>();
    const [edgeFileName, setEdgeFileName] = useState<string>("");
    const [employeeFile, setEmployeeFile] = useState<File>();
    const [employeeFileName, setEmployeeFileName] = useState<string>("");
    const [refresh, setRefresh] = useState(false);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function uploadNodeFile(e: React.ChangeEvent<HTMLInputElement>) {
        setNodeFile(undefined);
        const csvFile = e.target.files![0];
        if (csvFile == null) {
            console.log("csv file is null");
            return;
        }
        setNodeFile(csvFile);
        setNodeFileName(csvFile.name);
    }

    function uploadEdgeFile(e: React.ChangeEvent<HTMLInputElement>) {
        setEdgeFile(undefined);
        const csvFile = e.target.files![0];
        if (csvFile == null) {
            console.log("csv file is null");
            return;
        }
        setEdgeFile(csvFile);
        setEdgeFileName(csvFile.name);
    }

    function uploadEmployeeFile(e: React.ChangeEvent<HTMLInputElement>) {
        setEmployeeFile(undefined);
        const csvFile = e.target.files![0];
        if (csvFile == null) {
            console.log("csv file is null");
            return;
        }
        setEmployeeFile(csvFile);
        setEmployeeFileName(csvFile.name);
    }

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
        // setNodeFile(undefined);
        // setEdgeFile(undefined);
        // setEmployeeFile(undefined);
        setNodeFileName("");
        setEdgeFileName("");
        setEmployeeFileName("");
    }, [refresh]);

    return (
        <div className="AD-OneCard">
            <div className={"file-buttons"}>
                <Box
                    maxHeight={'20%'}
                    width={'50%'}
                    sx={{border: '2px solid #34AD84'}}
                    className={"file-buttons-box"}
                >
                    <Button component="label" variant="contained"
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                minWidth: "20%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}
                    >
                        Upload Node File
                        <VisuallyHiddenInput id="myFile" type="file" multiple onChange={(e) => {
                            uploadNodeFile(e);
                        }}/>
                    </Button>
                    <p className={"uploaded-files-name"}> {nodeFileName !== "" ? nodeFileName : "No file uploaded"} </p>
                    <Button component="label" variant="contained"
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                minWidth: "20%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}
                    >
                        Upload Edge File
                        <VisuallyHiddenInput id="myFile" type="file" multiple onChange={(e) => {
                            uploadEdgeFile(e);
                        }}/>
                    </Button>
                    <p className={"uploaded-files-name"}> {edgeFileName !== "" ? edgeFileName : "No file uploaded"} </p>
                    <Button component="label" variant="contained"
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                minWidth: "20%",
                                fontFamily: 'Lato',
                                fontSize: '90%',
                                textTransform: 'none',
                            }}
                    >
                        Upload Employee File
                        <VisuallyHiddenInput id="myFile" type="file" multiple onChange={(e) => {
                            uploadEmployeeFile(e);
                        }}/>
                    </Button>
                    <p className={"uploaded-files-name"}> {employeeFileName !== "" ? employeeFileName : "No file uploaded"} </p>
                </Box>
            </div>
            <div className={"upload-download-div"}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon/>}
                        style={{
                            backgroundColor: "#34AD84", maxHeight: "10%",
                            minWidth: "20%",
                            fontFamily: 'Lato',
                            fontSize: '90%',
                            textTransform: 'none',
                            justifySelf: 'center'
                        }}
                        onClick={() => uploadFile()}
                        disabled={isLoading}
                >
                    {isLoading ? <CircularProgress/> : "Upload Files"}
                </Button>
                <Button component="label" variant="contained" startIcon={<CloudDownloadIcon/>}
                        style={{
                            backgroundColor: "#34AD84", maxHeight: "10%",
                            minWidth: "20%",
                            fontFamily: 'Lato',
                            fontSize: '90%',
                            textTransform: 'none',
                        }}
                        onClick={() => downloadFiles()}
                >
                    Download Files
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
    );
}

