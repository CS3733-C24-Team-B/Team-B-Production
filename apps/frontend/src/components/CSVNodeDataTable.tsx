import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, CircularProgress} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth0} from "@auth0/auth0-react";
import {Node} from "database";
import {styled} from "@mui/material/styles";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteIcon from "@mui/icons-material/Delete";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import SwapVertIcon from '@mui/icons-material/SwapVert';

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

enum nodeSortField {
    off, nodeID, xCoord, yCoord, floor,
    building, nodeType, longName, shortName
}

export default function CSVNodeDataTable(){
    const {getAccessTokenSilently} = useAuth0();
    const [nodeData, setNodeData] = useState<Node[]>([]);
    const [sortUp, setSortUp] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

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
        setNodeData(nodesCopy);
    }

    const arrayNode = nodeData.map((node: Node, i: number) =>
        <tr key={i}>
            <td>{node.nodeID}</td>
            <td>{node.xcoord}</td>
            <td>{node.ycoord}</td>
            <td>{node.floor}</td>
            <td>{node.building}</td>
            <td>{node.nodeType}</td>
            <td>{node.longName}</td>
            <td>{node.shortName}</td>
        </tr>
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

    return (
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"}>
                <br/>
                {loading ? <CircularProgress/> : <table className={"tables"}>
                    <thead>
                    <tr>
                        <th>
                            Node ID
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.nodeID);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            X-Coordinate
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.xCoord);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            Y-Coordinate
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.yCoord);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            Floor
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.floor);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            Building
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.building);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            Node Type
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.nodeType);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            Long Name
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.longName);
                            }}><SwapVertIcon/></button>
                        </th>
                        <th>
                            Short Name
                            <button onClick={() => {
                                setSortUp(!sortUp);
                                sortNodes(nodeSortField.shortName);
                            }}><SwapVertIcon/></button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {arrayNode}
                    </tbody>
                </table>}
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

