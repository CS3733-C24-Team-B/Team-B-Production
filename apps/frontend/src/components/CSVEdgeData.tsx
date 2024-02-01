import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/csvdata_page.css";
// import {MapNode} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import SideButtons from "./SideButtons.tsx";

export default function CSVEdgeData() {
  //const nodes : MapNode[] = createNodeList();
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
  useEffect(() => {
      async function fetch() {
          const res = await axios.get("/api/db-get-nodes");
          const res3 = await axios.get("/api/db-get-edges");

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
            const res3 = await axios.get('/api/db-get-edges');
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
        <div className="App">
            <header className="App-header">CSV Data</header>
            <Navbar/>
            <br/>
            <div>
                <input className={"file button"} type="file" id="myFile" name="filename" accept=".csv"/>
                <input onClick={uploadToDB} type="button" value="Submit"/>
            </div>
            <input onClick={downloadFromDB} type="button" value="Export"/>
            <br/>
            <table className={"tables"}>
                <tr>
                    <th>Edge ID</th>
                    <th>Start Room</th>
                    <th>End Room</th>
                </tr>
                {arrayEdge}</table>
            <SideButtons/>
        </div>
    );
}
