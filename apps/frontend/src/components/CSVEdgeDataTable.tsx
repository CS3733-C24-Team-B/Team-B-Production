import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth0} from "@auth0/auth0-react";
import {styled} from "@mui/material/styles";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteIcon from "@mui/icons-material/Delete";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';

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


export default function CSVEdgeDataTable() {
    const {getAccessTokenSilently} = useAuth0();
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/nodes/read");
            const res3 = await axios.get("/api/edges/read");
            setNodeData(res.data);
            setEdgeData(res3.data);
        }

        fetch().then();
    }, [getAccessTokenSilently]);

    function nodeIDtoName(nId: string) {
        return nodeData.find(({nodeID}) =>
            nodeID === nId
        )!["longName"];
    }

    const arrayEdge = edgeData.map(({edgeID, startNodeID, endNodeID}, i) =>
        <tr key={i}>
            <td>{edgeID}</td>
            <td>{nodeIDtoName(startNodeID)}</td>
            <td>{nodeIDtoName(endNodeID)}</td>
        </tr>
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
            getAccessTokenSilently().then((accessToken: string) => {
                axios.post("/api/edges/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: "Bearer " + accessToken
                    }
                }).then();
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
            const res3 = await axios.get('/api/edges/download-template');
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
            await axios.delete("/api/edges", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"}>
                <br/>
                <table className={"tables"}>
                    <thead>
                    <tr>
                        <th>Edge ID</th>
                        <th>Start Room</th>
                        <th>End Room</th>
                    </tr>
                    </thead>
                    <tbody>
                    {arrayEdge}
                    </tbody>
                </table>
            </div>
            <div className={"AD-TwoRows2"}>
                <div className={"AD-Card3"}>
                    <p className={"AD-head"}>Actions</p>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon/>}
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                marginLeft: "5%",
                                minWidth: "90%",
                                fontFamily: 'Calibri',
                                fontSize: '100%',
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
                                fontFamily: 'Calibri',
                                fontSize: '100%',
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
                                fontFamily: 'Calibri',
                                fontSize: '100%',
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
                                fontFamily: 'Calibri',
                                fontSize: '100%',
                                textTransform: 'none',
                            }}>
                        Delete Data
                    </Button>
                </div>
                <div className={"AD-OneCard2"}>
                    <p className={"AD-head2"}>Last Updated</p>
                    {/*<p className={"AD-head3"}>21:02</p>*/}
                    {/*<p className={"AD-head4"}>May 23, 2023</p>*/}
                </div>
            </div>
        </div>
    );
}

