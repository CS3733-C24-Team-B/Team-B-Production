import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/servicelist_page.css";
import axios from "axios";

export default function ServiceRequestLists() {
    const navigate = useNavigate();
    const [srData, setSRData] = useState([]);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/service-request");

            setSRData(res.data);
        }
        fetch().then();
    }, [srData]);

    const arraySR = srData.map(({serviceID, name, status, infoText}) =>
        <tr>
            <td>{serviceID}</td>
            <td>{name}</td>
            <td>{status}</td>
            <td>{infoText}</td>
            <button onClick={() => {
                console.log("DELETE REQUEST " + serviceID);
                axios.delete("/api/service-request", {
                    data: {
                        serviceID: serviceID
                    }
                }).then();
            }}>Delete</button>
        </tr>
    );

    function handleClick() {
        navigate("/home");
    }

    return (
        <div className="App">
            <header className="App-header">Service Request Lists</header>
            <br/>
            <h3 className={"csv table"}> Active Service Requests </h3>
            <table>
                <tr>
                    <th>Request</th>
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
        </div>
    );
}

