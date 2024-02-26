import React, { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import NodeTable from "../components/AdminTables/NodeTable.tsx";
import EdgeTable from "../components/AdminTables/EdgeTable.tsx";
import ServiceRequestTable from "../components/AdminTables/ServiceRequestTable.tsx";
import EmployeeTable from "../components/AdminTables/EmployeeTable.tsx";
import UploadFiles from "../components/UploadFiles.tsx";
import { Button } from "@mui/material";

export default function AdminViewer() {
  const [ADPageShow, setADPageShow] = useState(<ServiceRequestTable />);
  const [currentComponent, setCurrentComponent] = useState(
    "ServiceRequestTable",
  );

  return (
    <div className={"AD-Container"}>
      {" "}
      {/* expands area across entire screen */}
      <Topbar /> {/* TopGreen css fixes this to the top */}
      <Navbar /> {/* NavBlue css fixes this to the left */}
      <div className={"BackBlue"}>
        {" "}
        {/* divides area below topbar into navbar and main space */}
        <div className={"AD-OneColumn"}>
          <div className={"AD-TwoRows"}>
            <div className={"AD-FiveColumns"}>
              <Button
                style={{
                  color:
                    currentComponent === "ServiceRequestTable"
                      ? "black"
                      : "black",
                  borderBottom:
                    currentComponent === "ServiceRequestTable"
                      ? "1.4vh solid #34AD84"
                      : "white",
                  fontFamily: "Lato",
                  fontSize: "100%",
                  textTransform: "none",
                }}
                variant="text"
                onClick={() => {
                  setADPageShow(<ServiceRequestTable />);
                  setCurrentComponent("ServiceRequestTable"); // Set the state to track the current component
                }}
              >
                Service Request Data
              </Button>
              <Button
                style={{
                  color: currentComponent === "NodeTable" ? "black" : "black",
                  borderBottom:
                    currentComponent === "NodeTable"
                      ? "1.4vh solid #34AD84"
                      : "white",
                  fontFamily: "Lato",
                  fontSize: "100%",
                  textTransform: "none",
                }}
                variant="text"
                onClick={() => {
                  setADPageShow(<NodeTable />);
                  setCurrentComponent("NodeTable"); // Set the state to track the current component
                }}
              >
                Node Data
              </Button>
              <Button
                style={{
                  color: currentComponent === "EdgeTable" ? "black" : "black",
                  borderBottom:
                    currentComponent === "EdgeTable"
                      ? "1.4vh solid #34AD84"
                      : "white",
                  fontFamily: "Lato",
                  fontSize: "100%",
                  textTransform: "none",
                }}
                variant="text"
                onClick={() => {
                  setADPageShow(<EdgeTable />);
                  setCurrentComponent("EdgeTable"); // Set the state to track the current component
                }}
              >
                Edge Data
              </Button>
              <Button
                style={{
                  color:
                    currentComponent === "EmployeeTable" ? "black" : "black",
                  borderBottom:
                    currentComponent === "EmployeeTable"
                      ? "1.4vh solid #34AD84"
                      : "white",
                  fontFamily: "Lato",
                  fontSize: "100%",
                  textTransform: "none",
                }}
                variant="text"
                onClick={() => {
                  setADPageShow(<EmployeeTable />);
                  setCurrentComponent("EmployeeTable"); // Set the state to track the current component
                }}
              >
                Employee Data
              </Button>
              <Button
                style={{
                  color: currentComponent === "UploadFiles" ? "black" : "black",
                  borderBottom:
                    currentComponent === "UploadFiles"
                      ? "1.4vh solid #34AD84"
                      : "white",
                  fontFamily: "Lato",
                  fontSize: "100%",
                  textTransform: "none",
                }}
                variant="text"
                onClick={() => {
                  setADPageShow(<UploadFiles />);
                  setCurrentComponent("UploadFiles"); // Set the state to track the current component
                }}
              >
                Upload Files
              </Button>
            </div>
            {ADPageShow}
          </div>
        </div>
      </div>
    </div>
  );
}
