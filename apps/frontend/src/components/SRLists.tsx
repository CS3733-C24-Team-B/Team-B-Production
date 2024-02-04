import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import SideButtons from "./SideButtons.tsx";
import {StatusType} from "common/src/serviceRequestTypes.ts";

export default function ServiceRequestLists() {
    const navigate = useNavigate();
    const [srData, setSRData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/service-request");

            setSRData(res.data);
        }
        fetch().then();
    }, [refresh]);

    const statuses = Object.keys(StatusType).filter((item) => {
        return isNaN(Number(item));
    });

    const arraySR = srData.map(({serviceID, name, status, infoText}) =>
        <tr>
            <td>
                <div className="dropdown">
                    <button className="dropbtn">Choose Employee</button>
                    <div className="dropdown-content">
                        <a>amy</a>
                        <a>bill</a>
                        <a>cindy</a>
                    </div>
                </div>
            </td>
            <td>{name}</td>
            <td><div className="dropdown">
                <button className="dropbtn">{status}</button>
                <div className="dropdown-content">
                    {statuses.map((st) =>
                        <a onClick={() => {
                            console.log("UPDATE STATUS " + serviceID + " " + st);
                            axios.post("/api/service-status", {
                                body: {
                                    serviceID: serviceID,
                                    status: StatusType.Completed
                                }
                            }).then();
                            setRefresh(!refresh);
                        }}>{st}</a>
                    )}
                </div>
            </div></td>
            <td>{infoText}</td>
            <button onClick={() => {
                console.log("DELETE REQUEST " + serviceID);
                axios.delete("/api/service-request", {
                    data: {
                        serviceID: serviceID
                    }
                }).then();
                setRefresh(!refresh);
            }}>Delete</button>
        </tr>
    );

    function handleClick() {
        navigate("/home");
    }

    return (
        <div className="App">
            <header className="App-header">Service Request Lists</header>
            <Navbar/>
            <br/>
            <h3 className={"csv table"}> Active Service Requests </h3>
            <table className={"tables"}>
                <tr>
                    <th>Assigned To</th>
                    <th>UserName</th>
                    <th>Status</th>
                    <th>Request Notes</th>
                </tr>
                {arraySR}
            </table>
            <br/>
            <br/>
            <input type="button" value="Return to Home" onClick={handleClick}/>
            <Outlet/>
            <SideButtons/>
        </div>
    );
}

