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


export default function CSVNodeDataTable(){
    const {getAccessTokenSilently} = useAuth0();
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

    return (
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"}>
                <br/>
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
                        <VisuallyHiddenInput id="myFile" type="file" onChange={uploadToDB}/>
                    </Button>
                    <Button component="label" variant="contained" startIcon={<IosShareIcon/>}
                            onClick={downloadFromDB}
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
                            style={{
                                backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                marginLeft: "5%",
                                minWidth: "90%",
                                fontFamily: 'Calibri',
                                fontSize: '100%',
                                textTransform: 'none',
                            }}
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
                    </Button>
                </div>
                <div className={"AD-OneCard2"}>
                    <p className={"AD-head2"}>Last Updated</p>
                    {/*<p className={"AD-head3"}>21:02</p>*/}
                    {/*<p className={"AD-head4"}>May 23, 2023</p>*/}
                </div>
            </div>


        </div>


    )
        ;
}

