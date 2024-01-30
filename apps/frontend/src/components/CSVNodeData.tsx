import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/csvdata_page.css";
// import {MapNode} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";

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

    // GO TO apps/backend/src/utilities/readCSV.ts TO SEE WHAT DATA IS STORED IN nodeData AND edgeData ARRAYS
    return (
        <div className="App">
            <header className="App-header">CSV Data</header>
            <br/>
            <div>
                <input className={"file button"} type="file" id="myFile" name="filename"/>
                <input onClick={uploadToDB} type="button" value="Submit"/>
            </div>
            <br/>
            <table>
                <tr>
                    <th>Room Name</th>
                    <th>Floor</th>
                    <th>Building Name</th>
                </tr>
                {arrayNode}</table>
            <br/>
        </div>
    );
}
