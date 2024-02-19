import React, {useState} from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import CSVNodeDataTable from "../components/CSVNodeDataTable.tsx";
import {Button} from "@mui/material";

export default function NewUITemplete() {
    const[ADPageShow,setADPageShow] = useState(<></>);
    return (
        <div className={"Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"AD-OneColumn"}>
                    <div className={"AD-ThreeRows"}>
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
                                }} variant="text">

                               Edge Data
                            </Button>
                            <Button
                                style={{
                                    color: "black",
                                }} variant="text">

                                Service Request Data
                            </Button>
                            <Button
                                style={{
                                    color: "black",
                                }} variant="text">

                                Employee Data
                            </Button>

                        </div>
                            {ADPageShow}
                        <div className={"TestCard"}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
