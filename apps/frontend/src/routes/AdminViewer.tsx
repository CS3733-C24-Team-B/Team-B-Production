import React, {useState} from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import CSVNodeDataTable from "../components/CSVNodeDataTable.tsx";
import CSVEdgeDataTable from "../components/CSVEdgeDataTable.tsx";
import ServiceRequestTable from "../components/ServiceRequestTable.tsx";
import EmployeeTable from "../components/EmployeeTable.tsx";
import {Button} from "@mui/material";





export default function NewUITemplete() {
    const [ADPageShow, setADPageShow] = useState(<ServiceRequestTable />);
    const [currentComponent, setCurrentComponent] = useState('');
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
                                    color: currentComponent === 'ServiceRequestTable' ? 'black' : 'black',
                                    borderBottom: currentComponent === 'ServiceRequestTable' ? '1.4vh solid #34AD84' : 'white',
                                    fontFamily: 'Calibri',
                                    fontSize: '100%',
                                    textTransform: 'none',
                                }}
                                variant="text"
                                onClick={() => {
                                    setADPageShow(<ServiceRequestTable/>);
                                    setCurrentComponent('ServiceRequestTable'); // Set the state to track the current component
                                }}>
                                Service Request Data
                            </Button>
                            <Button
                                style={{
                                    color: currentComponent === 'CSVNodeDataTable' ? 'black' : 'black',
                                    borderBottom: currentComponent === 'CSVNodeDataTable' ? '1.4vh solid #34AD84' : 'white',
                                    fontFamily: 'Calibri',
                                    fontSize: '100%',
                                    textTransform: 'none',
                                }} variant="text" onClick={() => {
                                setADPageShow(<CSVNodeDataTable/>);
                                setCurrentComponent('CSVNodeDataTable'); // Set the state to track the current component
                            }}>
                                Node Data
                            </Button>
                            <Button
                                style={{
                                    color: currentComponent === 'CSVEdgeDataTable' ? 'black' : 'black',
                                    borderBottom: currentComponent === 'CSVEdgeDataTable' ? '1.4vh solid #34AD84' : 'white',
                                    fontFamily: 'Calibri',
                                    fontSize: '100%',
                                    textTransform: 'none',
                                }} variant="text" onClick={() => {
                                setADPageShow(<CSVEdgeDataTable/>);
                                setCurrentComponent('CSVEdgeDataTable'); // Set the state to track the current component
                            }}>
                               Edge Data
                            </Button>
                            <Button
                                style={{
                                    color: currentComponent === 'EmployeeTable' ? 'black' : 'black',
                                    borderBottom: currentComponent === 'EmployeeTable' ? '1.4vh solid #34AD84' : 'white',
                                    fontFamily: 'Calibri',
                                    fontSize: '100%',
                                    textTransform: 'none',
                                }} variant="text" onClick={() => {
                                setADPageShow(<EmployeeTable/>);
                                setCurrentComponent('EmployeeTable'); // Set the state to track the current component
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
