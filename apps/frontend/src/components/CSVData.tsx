import React, {useEffect, useState} from "react";
//import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";
//import {MapNode, createNodeList} from "../../../backend/src/utilities/algorithm.ts";
import axios from "axios";

export default function CSVData() {
  //const nodes : MapNode[] = createNodeList();
    const [data, setData] = useState("");
  useEffect(() => {
      async function fetch() {
          const res = await axios.get("/api/db-get-nodes");

          console.log(res.data);
          setData(res.data);
      }
      fetch().then();
  }, []);

  return (
    <div className="App">
      <header className="App-header">CSV Data</header>
      <br />
        <p>{data}</p>
    </div>
  );
}
