import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/csvdata_page.css";
// import {MapNode} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";

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

    // GO TO apps/backend/src/utilities/readCSV.ts TO SEE WHAT DATA IS STORED IN nodeData AND edgeData ARRAYS
    return (
    <div className="App">
      <header className="App-header">CSV Data</header>
      <br />
        <table>
            <tr>
                <th>Edge ID</th>
                <th>Start Room</th>
                <th>End Room</th>
            </tr>
            {arrayEdge}</table>
    </div>
    );
}
