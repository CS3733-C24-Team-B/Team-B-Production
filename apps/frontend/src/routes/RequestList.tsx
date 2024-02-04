import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import SideButtons from "../components/SideButtons.tsx";

export default function RequestList() {
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
            <SideButtons/>
        </div>
    );
}

