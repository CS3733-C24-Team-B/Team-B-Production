import React, {useState} from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import CSVNodeDataTable from "../components/CSVNodeDataTable.tsx";
import CSVEdgeDataTable from "../components/CSVEdgeDataTable.tsx";
import ServiceRequestTable from "../components/ServiceRequestTable.tsx";
import EmployeeTable from "../components/EmployeeTable.tsx";
import {Button} from "@mui/material";

export default function NewUITemplete() {
    const[ADPageShow,setADPageShow] = useState(<div className={"AD-TestCard"}></div>);
    return (
        <div className={"AD-Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"AD-OneColumn"}>
                    <div className={"AD-TwoRows"}>
                        <div className={"AD-FourColumns"}>
                            <Button
                                style={{
                                    color: "black"
                                }} variant="text" onClick={()=>{
                                    setADPageShow(<CSVNodeDataTable/>);
                            }}>
                                Node Data
                            </Button>
                            <Button
                                style={{
                                    color: "black",
                                }} variant="text" onClick={()=>{
                                setADPageShow(<CSVEdgeDataTable/>);
                            }}>
                               Edge Data
                            </Button>
                            <Button
                                style={{
                                    color: "black",
                                }} variant="text" onClick={()=>{
                                setADPageShow(<ServiceRequestTable/>);
                            }}>
                                Service Request Data
                            </Button>
                            <Button
                                style={{
                                    color: "black",
                                }} variant="text" onClick={()=>{
                                setADPageShow(<EmployeeTable/>);
                            }}>
                                Employee Data
                            </Button>

                        </div>
                        {ADPageShow}
                    </div>
                </div>
            </div>
        </div>
    );
}
