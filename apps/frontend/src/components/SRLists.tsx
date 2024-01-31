import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/servicelist_page.css";

export default function ServiceRequestLists() {
    const navigate = useNavigate();

    function handleClick() {
        navigate("/home");
    }

    return (
        <div className="App">
            <header className="App-header">Service Request Lists</header>
            <br/>
            <h3 className={"csv table"}> Active Service Requests </h3>
            <table className={"tables"}>
                <tr>
                    <th>Request</th>
                    <th>UserName</th>
                    <th>Status</th>
                    <th>Request Notes</th>
                </tr>
            </table>
            <br/>
            <br/>
            <input type="button" value="Return to Home" onClick={handleClick}/>
            <Outlet/>
        </div>
    );
}

