import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";
//import {MapNode, createNodeList} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";

export default function CSVData() {
  //const nodes : MapNode[] = createNodeList();
    const [nodeData, setNodeData] = useState("");
    const [edgeData, setEdgeData] = useState("");
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
          const res3 = await axios.get("/api/db-get-edges");

          console.log(res.data);
          setNodeData(JSON.stringify(res.data));
          setEdgeData(JSON.stringify(res3.data));
      }
      fetch().then();
  }, []);

  return (
    <div className="App">
      <header className="App-header">CSV Data</header>
      <br />
        <p>{nodeData.toString()}</p>
        <br/>
        <p>{edgeData.toString()}</p>
    </div>
  );
}
