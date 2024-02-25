import React, {useEffect, useState} from "react";
import "../css/csvdata_page.css";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import Navbar from "../components/Navbar.tsx";
import {Button, CircularProgress} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {styled} from "@mui/material/styles";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteIcon from "@mui/icons-material/Delete";

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

export default function CSVEdgeData() {
    const {user, isLoading, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const isAdmin: boolean = isAuthenticated && user!.email! === "softengc24b@gmail.com";
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

    function uploadToDB() {
        console.log("Running Upload to DB");

        try {
            const formData = new FormData();
            const csvFile = document.querySelector('#myFile') as HTMLInputElement;
            if (csvFile == null) {
                console.log("imagefile should not be null...");
                return;
            }

            formData.append("csvFile", csvFile.files![0]); // Update based on backend
            getAccessTokenSilently().then((accessToken: string) => {
                axios.post("/api/edges", formData, {
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

    async function downloadFromDB() {
        console.log("Running Download to DB");

        try {
            const res3 = await axios.get('/api/edges/read');
            console.log(res3);
            const headers = ['edgeID, startNodeID, endNodeID'];
            const resCSV = res3.data.reduce((edges: string[], edgeData: {
                edgeID: string,
                startNodeID: string,
                endNodeID: string
            }) => {
                const {edgeID, startNodeID, endNodeID} = edgeData;
                edges.push([edgeID, startNodeID, endNodeID].join(','));
                return edges;
            }, []);
            const data = [...headers, ...resCSV].join('\n');
            const blob = new Blob([data], {type: "text/csv"});
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

    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    if (!isAdmin) {
        return window.location.href = "/";
    }

    // GO TO apps/backend/src/utilities/readCSV.ts TO SEE WHAT DATA IS STORED IN nodeData AND edgeData ARRAYS
    return (
        <div className="node-data-container2">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="data-container">
                <div className="topbar-container">
                    <div className="node-data-header">
                        <header className={'headerblue'}>CSV Edge Data</header>
                    </div>
                    <div className="top-buttons-container">
                        <div className="upload-buttons">
                            {/*<input className={"file button"} type="file" id="myFile" name="filename" accept=".csv"/>*/}
                            <Button component="label" variant="contained" startIcon={<UploadFileIcon/>}
                                    style={{backgroundColor: "#012D5A"}}>
                                Upload file
                                <VisuallyHiddenInput id="myFile" type="file" onChange={uploadToDB}/>
                            </Button>
                            {/*<input onClick={uploadToDB} type="button" value="Submit"/>*/}
                            {/*<Button onClick={uploadToDB} variant="text">Submit</Button>*/}
                        </div>

                        <div className={'upload-buttons'}>
                            <Button component="label" variant="contained" startIcon={<DeleteIcon/>}
                                    style={{backgroundColor: "#012D5A"}}
                                    onClick={() => {
                                        getAccessTokenSilently().then((accessToken: string) => {
                                            axios.delete("/api/edges", {
                                                headers: {
                                                    Authorization: "Bearer " + accessToken
                                                }
                                            }).then();
                                        });
                                    }}>
                                Delete Data
                                {/*<VisuallyHiddenInput id="myFile" type="file" onChange={uploadToDB}/>*/}
                            </Button>
                        </div>


                        {/*<input onClick={downloadFromDB} type="button" value="Export"/>*/}
                        <div className={'upload-buttons'}>
                            <Button onClick={downloadFromDB} component="label" variant="contained"
                                    startIcon={<IosShareIcon/>}
                                    className="export-button"
                                    style={{backgroundColor: "#012D5A"}}>
                                Export
                            </Button>
                        </div>

                    </div>
                </div>
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
                <br/>
            </div>
        </div>
    );
}