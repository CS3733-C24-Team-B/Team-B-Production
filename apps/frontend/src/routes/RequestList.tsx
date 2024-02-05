import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import SideButtons from "../components/SideButtons.tsx";
import {StatusType} from "common/src/serviceRequestTypes.ts";
//import {employee} from "common/src/employee.ts";

export default function RequestList() {
    const navigate = useNavigate();
    const [srData, setSRData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/service-request");
            const res2 = await axios.get("/api/employee");

            setSRData(res.data);
            setEmployeeData(res2.data);
            if (employeeData.length == 0) {
                axios.post("/api/employee", {
                    email: "johndoe@gmail.com",
                    username: "John Doe",
                    password: "123"
                }).then();
                axios.post("/api/employee", {
                    email: "ccrane@yahoo.mail",
                    username: "Cameron Crane",
                    password: "abc"
                }).then();
                axios.post("/api/employee", {
                    email: "wwong2@wpi.edu",
                    username: "Professor Wong",
                    password: "softeng"
                }).then();
            }
        }

        fetch().then();
    }, [employeeData.length, refresh]);

    const statuses = Object.keys(StatusType).filter((item) => {
        return isNaN(Number(item));
    });

    //2024-02-04T18:29:26.694Z 2024-02-04T19:48:46.023Z
    function sqlToDate(sqlDate: string) {
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
        const sMillisecond = parseInt(sqlDateArrSecs[1].substring(0, sqlDateArrSecs[1].length - 1));
        //console.log(sYear + " " + sMonth + " " + sDay + " " + sHour + " " + sMinute + " " + sSecond + " " + sMillisecond);

        return new Date(sYear, sMonth, sDay, sHour, sMinute, sSecond, sMillisecond);
    }

    srData.sort((srA: { timeCreated: string }, srB: { timeCreated: string }) => {
        // console.log("TIME: " + srA.timeCreated + " " + srB.timeCreated);
        // console.log(sqlToDate(srA.timeCreated).valueOf() - sqlToDate(srB.timeCreated).valueOf());
        return sqlToDate(srA.timeCreated).valueOf() - sqlToDate(srB.timeCreated).valueOf();
        //return timeCreatedA - timeCreatedB;
    });
    // srData.map(({name, timeCreated}) => {
    //     console.log("TIME: " + name + " " + timeCreated);
    // });
    const idToUser = (id: string) => {
        return employeeData.find(({email}) =>
            email === id
        )!["username"];
    };
    const arraySR = srData.map(({serviceID, name, status, infoText, assignedID}) =>
        <tr>
            <td>
                <div className="dropdown">
                    <button className="dropbtn">{(assignedID !== null) ? idToUser(assignedID) : "Choose Employee"}</button>
                    <div className="dropdown-content">
                        {employeeData.map(({email, username}) =>
                            <a onClick={async () => {
                                console.log("CHANGE ASSIGNMENT: " + serviceID + " " + email);
                                const resSR = await axios.post("/api/service-assignment", {
                                    serviceID: serviceID,
                                    assignedTo: email
                                }).then();
                                if(status === StatusType.Unassigned) {
                                    await axios.post("/api/service-status", {
                                        serviceID: serviceID,
                                        status: StatusType.Assigned
                                    }).then();
                                }
                                console.log(resSR);
                                setRefresh(!refresh);
                            }}>
                                {username}
                            </a>
                        )}
                    </div>
                </div>
            </td>
            <td>{name}</td>
            <td>
                <div className="dropdown">
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
                            }}>{StatusType[st as keyof typeof StatusType]}</a>
                        )}
                    </div>
                </div>
            </td>
            <td>{infoText}</td>
            <button onClick={() => {
                console.log("DELETE REQUEST " + serviceID);
                axios.delete("/api/service-request", {
                    data: {
                        serviceID: serviceID
                    }
                }).then();
                setRefresh(!refresh);
            }}>Delete
            </button>
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

