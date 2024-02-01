import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/csvdata_page.css";
// import {MapNode} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import SideButtons from "../components/SideButtons.tsx";

export default function CSVData() {
  //const nodes : MapNode[] = createNodeList();
    const [nodeData, setNodeData] = useState([]);
  useEffect(() => {
      async function fetch() {
          const res = await axios.get("/api/db-get-nodes");
          console.log(res.data);
          setNodeData(res.data);
      }
      fetch().then();
  }, []);

    const arrayNode = nodeData.map(({floor, building, longName}, i) =>
        <tr key={i} >
            <td>{longName}</td>
            <td>{floor}</td>
            <td>{building}</td>
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
            axios.post('/api/db-load-nodes', formData, {
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
            const res3 = await axios.get('/api/db-get-nodes');
            console.log(res3);
            let headers = ['nodeID, xcoord, ycoord, floor, building, nodeType, longName, shortName'];
            let resCSV = res3.data.reduce((roomNode: string[], roomData: { nodeID: string; xcoord: number; ycoord: number; floor: string; building: string; nodeType: string; longName: string; shortName: string; }) => {
                const { nodeID, xcoord, ycoord, floor, building, nodeType, longName, shortName } = roomData;
                roomNode.push([nodeID, xcoord+"", ycoord+"", floor, building, nodeType, longName, shortName].join(','));
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
                    <th>Room Name</th>
                    <th>Floor</th>
                    <th>Building Name</th>
                </tr>
                {arrayNode}</table>
            <br/>
            <SideButtons/>
        </div>
    );
}
