import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import {StatusType, UpdateRequest} from "common/src/serviceRequestTypes.ts";
import {Button, MenuItem} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';

export default function RequestList() {
    const navigate = useNavigate();
    const [srData, setSRData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/service-request");
            const res2 = await axios.get(`/api/employee`);

            setSRData(res.data);
            setEmployeeData(res2.data);
            console.log(res2.data);
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
    // const idToUser = (id: string) => {
    //     return employeeData.find(({email}) =>
    //         email === id
    //     )!["username"];
    // };
    const arraySR = srData.map(({serviceID, name, status, infoText, assignedID}) =>
        <tr>
            <td>
                <Select
                    value={(assignedID !== null) ? assignedID : "Choose Employee"}
                    onChange={async (event: SelectChangeEvent) => {
                        console.log("CHANGE ASSIGNMENT: " + serviceID + " " + event.target.value);

                        const serviceRequest: UpdateRequest = {
                            serviceID: serviceID,
                            assignedTo: event.target.value,
                            status: status
                        };

                        if (status === StatusType.Unassigned) {
                            serviceRequest.status = StatusType.Assigned;
                        }

                        const resSR = await axios.put("/api/service-request", serviceRequest).then();

                        console.log(resSR);
                        setRefresh(!refresh);
                    }}>
                    {employeeData.map(({email, firstName, lastName}) =>
                        <MenuItem value={email}>{(firstName === null || lastName === null) ? email : firstName + " " + lastName}</MenuItem>
                    )}
                </Select>
            </td>
            <td>{name}</td>
            <td>
                <Select
                    defaultValue={StatusType.Unassigned}
                    value={StatusType[status as keyof typeof StatusType] ? StatusType[status as keyof typeof StatusType] : "InProgress"}
                    onChange={async (event: SelectChangeEvent) => {
                        console.log(status as keyof typeof StatusType);
                        console.log("UPDATE STATUS " + serviceID + " " + event.target.value);

                        const serviceRequest: UpdateRequest = {
                            serviceID: serviceID,
                            assignedTo: assignedID,
                            status: StatusType[event.target.value as keyof typeof StatusType]
                        };

                        await axios.put("/api/service-request", serviceRequest).then();
                        setRefresh(!refresh);
                    }}>
                    {statuses.map((st) =>
                        <MenuItem value={st}>{StatusType[st as keyof typeof StatusType]}</MenuItem>
                    )}
                </Select>
            </td>
            <td>{infoText}</td>
            <td className="delete-button">
                <Button
                    variant="outlined"
                    onClick={() => {
                        console.log("DELETE REQUEST " + serviceID);
                        axios.delete("/api/service-request", {
                            data: {
                                serviceID: serviceID
                            }
                        }).then();
                        setRefresh(!refresh);
                    }}>Delete
                </Button>
            </td>
        </tr>
    );

    function handleClick() {
        navigate("/requestform");
    }

    return (
        <div className="node-data-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="request-container">
                <div className="req-list-header">
                    <header>Service Request List</header>
                </div>
                <br/>
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
                <div className="home-button">
                    <Button variant="contained" onClick={handleClick} style={{backgroundColor: "#012D5A"}}>Create a Request</Button>
                </div>
            </div>
        </div>
    );
}

