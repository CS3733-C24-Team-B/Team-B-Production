import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import SideButtons from "../components/SideButtons.tsx";
import {StatusType} from "common/src/serviceRequestTypes.ts";

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

    const statuses = Object.keys(StatusType).filter((item) => {
        return isNaN(Number(item));
    });

    //2024-02-04T18:29:26.694Z 2024-02-04T19:48:46.023Z
    function sqlToDate(sqlDate:string){
        //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
        const sqlDateArrT = sqlDate.split("T");
        const sqlDateArrCal = sqlDateArrT[0].split("-");
        //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
        const sYear = parseInt(sqlDateArrCal[0]);
        const sMonth = parseInt(sqlDateArrCal[1]);
        // const sqlDateArr2 = sqlDateArr1[2].split(" ");
        // //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
        const sDay = parseInt(sqlDateArrCal[2]);
        const sqlDateArrTime = sqlDateArrT[1].split(":");
        // //format of sqlDateArr3[] = ['hh','mm','ss.ms']
        const sHour = parseInt(sqlDateArrTime[0]);
        const sMinute = parseInt(sqlDateArrTime[1]);
        const sqlDateArrSecs = sqlDateArrTime[2].split(".");
        // //format of sqlDateArr4[] = ['ss','ms']
        const sSecond = parseInt(sqlDateArrSecs[0]);
        const sMillisecond = parseInt(sqlDateArrSecs[1].substring(0, sqlDateArrSecs[1].length-1));
        //console.log(sYear + " " + sMonth + " " + sDay + " " + sHour + " " + sMinute + " " + sSecond + " " + sMillisecond);

        return new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond,sMillisecond);
    }

    srData.sort((srA : {timeCreated: string}, srB : {timeCreated: string}) => {
        // console.log("TIME: " + srA.timeCreated + " " + srB.timeCreated);
        // console.log(sqlToDate(srA.timeCreated).valueOf() - sqlToDate(srB.timeCreated).valueOf());
        return sqlToDate(srA.timeCreated).valueOf() - sqlToDate(srB.timeCreated).valueOf();
        //return timeCreatedA - timeCreatedB;
    });
    // srData.map(({name, timeCreated}) => {
    //     console.log("TIME: " + name + " " + timeCreated);
    // });
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
                        <a onClick={async () => {
                            console.log("UPDATE STATUS " + serviceID + " " + st);
                            await axios.post("/api/service-status", {
                                serviceID: serviceID,
                                status: StatusType[st as keyof typeof StatusType]
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

