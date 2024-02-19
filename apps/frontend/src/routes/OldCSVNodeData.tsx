import React, {useEffect, useState} from "react";
import "../css/csvdata_page.css";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import Navbar from "../components/Navbar.tsx";
import {Button, CircularProgress} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {styled} from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import IosShareIcon from '@mui/icons-material/IosShare';

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

export default function CSVData() {
    const {user, isLoading, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const isAdmin: boolean = isAuthenticated && user!.email! === "softengc24b@gmail.com";
    const [nodeData, setNodeData] = useState([]);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/nodes/read");
            console.log(res.data);
            setNodeData(res.data);
        }

        fetch().then();
    }, []);

    const arrayNode = nodeData.map(({floor, building, longName}, i) =>
        <tr key={i}>
            <td>{longName}</td>
            <td>{floor}</td>
            <td>{building}</td>
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
                axios.post('/api/nodes', formData, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        'Content-Type': 'multipart/form-data'
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
            const res3 = await axios.get('/api/nodes/read');
            console.log(res3);
            const headers = ['nodeID, xcoord, ycoord, floor, building, nodeType, longName, shortName'];
            const resCSV = res3.data.reduce((roomNode: string[], roomData: {
                nodeID: string;
                xcoord: number;
                ycoord: number;
                floor: string;
                building: string;
                nodeType: string;
                longName: string;
                shortName: string;
            }) => {
                const {nodeID, xcoord, ycoord, floor, building, nodeType, longName, shortName} = roomData;
                roomNode.push([nodeID, xcoord + "", ycoord + "", floor, building, nodeType, longName, shortName].join(','));
                return roomNode;
            }, []);
            const data = [...headers, ...resCSV].join('\n');
            const blob = new Blob([data], {type: "text/csv"});
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

    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    if (!isAdmin) {
        return window.location.href = "/";
    }

    // GO TO apps/backend/src/utilities/readCSV.ts TO SEE WHAT DATA IS STORED IN nodeData AND edgeData ARRAYS
    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="data-container">
                <div className="topbar-container">
                    <div className="node-data-header">
                        <header className={'headerblue'}>CSV Node Data</header>
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
                                            axios.delete("/api/nodes", {
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
                            <Button component="label" variant="contained" startIcon={<IosShareIcon/>}
                                    onClick={downloadFromDB}
                                    className="export-button"
                                    style={{backgroundColor: "#012D5A"}}>
                                Export File
                            </Button>
                        </div>
                    </div>
                </div>
                <table className={"tables"}>
                    <thead>
                    <tr>
                        <th>Room Name</th>
                        <th>Floor</th>
                        <th>Building Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {arrayNode}
                    </tbody>
                </table>
                <br/>
            </div>
        </div>
    );
}
