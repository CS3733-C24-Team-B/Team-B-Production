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
          try {
              const res2 = await axios.post("/api/db-insert");
              console.log(res2.data);
          }
          catch{
              console.log("post error");
          }
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

    // GO TO apps/backend/src/utilities/readCSV.ts TO SEE WHAT DATA IS STORED IN nodeData AND edgeData ARRAYS
    return (
    <div className="App">
      <header className="App-header">CSV Data</header>
      <br />
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
