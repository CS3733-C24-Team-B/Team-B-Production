import React, {useState} from "react";
//import axios from "axios";
import {
    Box,
    Button, styled
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
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [nodeFile, setNodeFile] = useState<HTMLInputElement>();
    const [nodeFileName, setNodeFileName] = useState<string>("");
    const [edgeFile, setEdgeFile] = useState<HTMLInputElement>();
    const [edgeFileName, setEdgeFileName] = useState<string>("");
    const [employeeFile, setEmployeeFile] = useState<HTMLInputElement>();
    const [employeeFileName, setEmployeeFileName] = useState<string>("");
    //const [refresh, setRefresh] = useState(false);
    console.log(user + " " + isAuthenticated);
    console.log(nodeFile + " " + edgeFile + " " + employeeFile);

    function uploadNodeFile(e) {
        setNodeFile(undefined);
        const csvFile = e.target.files[0];
        if (csvFile == null) {
            console.log("csv file is null");
            return;
        }
        console.log(csvFile);
        // setNodeFile(csvFile);
        // setNodeFileName(csvFile.files![0].name);
    }

    function uploadEdgeFile() {
        setEdgeFile(undefined);
        const csvFile = document.querySelector('#myFile') as HTMLInputElement;
        if (csvFile == null) {
            console.log("csv file is null");
            return;
        }
        setEdgeFile(csvFile);
        setEdgeFileName(csvFile.files![0].name);
    }

    function uploadEmployeeFile() {
        setEmployeeFile(undefined);
        const csvFile = document.querySelector('#myFile') as HTMLInputElement;
        if (csvFile == null) {
            console.log("csv file is null");
            return;
        }
        setEmployeeFile(csvFile);
        setEmployeeFileName(csvFile.files![0].name);
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
            const res3 = await axios.get("/api/admin-employee/download", {
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
                        <VisuallyHiddenInput id="myFile" type="file" multiple onChange={uploadEdgeFile}/>
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
                        <VisuallyHiddenInput id="myFile" type="file" multiple onChange={uploadEmployeeFile}/>
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
                >
                    Upload Files
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
        </div>
    );
}

