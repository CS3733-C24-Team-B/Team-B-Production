import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/csvdata_page.css";
// import {MapNode} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
//import SideButtons from "../components/SideButtons.tsx";
import {Button} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {styled} from "@mui/material/styles";

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
  //const nodes : MapNode[] = createNodeList();
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
  useEffect(() => {
      async function fetch() {
          const res = await axios.get("/api/db-load-nodes");
          const res3 = await axios.get("/api/db-load-edges");

          console.log(res.data);
          setNodeData(res.data);
          setEdgeData(res3.data);
      }
      fetch().then();
  }, []);

    function nodeIDtoName(nId : string) {
        return nodeData.find(({nodeID}) =>
            nodeID === nId
        )!["longName"];
    }

    const arrayEdge = edgeData.map(({edgeID, startNodeID, endNodeID}, i) =>
        <tr key={i} >
            <td>{edgeID}</td>
            <td>{nodeIDtoName(startNodeID)}</td>
            <td>{nodeIDtoName(endNodeID)}</td>
        </tr>
    );

    function uploadToDB() {
        console.log("Running Upload to DB");

        try {
            const formData = new FormData();
            const csvFile = document.querySelector('#myFile');
            if (csvFile == null) {
                console.log("imagefile should not be null...");
                return;
            }

            formData.append("csvFile", csvFile.files[0]); // Update based on backend
            axios.post("/api/db-load-edges", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        catch (exception) {
            console.log("post error: " + exception);
        }
    }

    async function downloadFromDB() {
        console.log("Running Download to DB");

        try {
            const res3 = await axios.get('/api/db-load-edges');
            console.log(res3);
            let headers = ['edgeID, startNodeID, endNodeID'];
            let resCSV = res3.data.reduce((edges: string[], edgeData: { edgeID: string, startNodeID: string, endNodeID: string}) => {
                const { edgeID, startNodeID, endNodeID } = edgeData;
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


    // GO TO apps/backend/src/utilities/readCSV.ts TO SEE WHAT DATA IS STORED IN nodeData AND edgeData ARRAYS
    return (
        <div className="node-data-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="data-container">
                <div className="topbar-container">
                    <div  className="node-data-header">
                        <header>CSV Edge Data</header>
                    </div>
                    <br/>
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
                        {/*<input onClick={downloadFromDB} type="button" value="Export"/>*/}
                        <Button onClick={downloadFromDB} variant="text" className="export-button">Export</Button>
                    </div>
                </div>
                <br/>
                <table className={"tables"}>
                    <tr>
                        <th>Edge ID</th>
                        <th>Start Room</th>
                        <th>End Room</th>
                    </tr>
                    {arrayEdge}</table>
                <br/>
            </div>
        </div>
    );
}
