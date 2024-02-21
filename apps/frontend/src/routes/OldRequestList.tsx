import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import {PriorityType, StatusType, UpdateRequest, UpdateServiceRequest} from "common/src/serviceRequestTypes.ts";
import {Button, FormControl, Menu, MenuItem} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import Divider from "@mui/material/Divider";

export default function RequestList() {
    const navigate = useNavigate();
    const [srData, setSRData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [clickedRows, setClickedRows] = useState<Map<number, JSX.Element>>(new Map<number, JSX.Element>);
    const [statusFilter, setStatusFilter] = useState<string>("Choose Status");
    const [typeFilter, setTypeFilter] = useState<string>("Choose Type");
    const [priorityFilter, setPriorityFilter] = useState<string>("Choose Priority");
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [filterType, setFilterType] = useState("Filter by...");
    const [filterFunction, setFilterFunction] = useState<(nsr: UpdateServiceRequest) => boolean>(() => () => {
        return true;
    });
    const openMenu = Boolean(menuAnchor);

    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/service-request");
            const res2 = await axios.get(`/api/employee`);

            setSRData(res.data);
            setEmployeeData(res2.data);
            console.log(res.data);
        }

        fetch().then();
    }, [refresh]);

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

    const filterSR = srData.filter(filterFunction);

    const arraySR = filterSR.map((nsr: UpdateServiceRequest, index) =>
        <tr>
            <td><IconButton onClick={() => {
                if (clickedRows.has(index)) {
                    clickedRows.delete(index);
                } else {
                    clickedRows.set(index, <tr style={{height: "128px"}}>
                        <td></td>
                        <td className={"info-cell"} colSpan={7}>
                            <p>{"Notes: " + nsr.notes.split(",")[1]}</p>
                            {nsr.notes.split(",")[2].split("+").map((str) => (
                                <p>{str}</p>
                            ))} </td>
                    </tr>);
                }
                setClickedRows(clickedRows);
                setRefresh(!refresh);
            }}>
                {(clickedRows.has(index)) ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
            </IconButton></td>
            <td>{sqlToDate(nsr.timeCreated.toString()).toDateString()}</td>
            <td>{nsr.createdByID}</td>
            <td>{nsr.locationID}</td>
            <td style={{
                'Low': {color: "green"},
                'Medium': {color: "blue"},
                'High': {color: "orange"},
                'Emergency': {color: "red"}
            }[nsr.priority]}>{nsr.priority}</td>
            <td>
                <Select
                    value={(nsr.assignedID !== null) ? nsr.assignedID : "Choose Employee"}
                    onChange={async (event: SelectChangeEvent) => {

                        const serviceRequest: UpdateRequest = {
                            serviceID: nsr.serviceID,
                            assignedTo: event.target.value,
                            status: nsr.status
                        };

                        if (nsr.status === StatusType.Unassigned) {
                            serviceRequest.status = StatusType.Assigned;
                        }

                        const resSR = await axios.put("/api/service-request", serviceRequest).then();

                        console.log(resSR);
                        setRefresh(!refresh);
                    }}>
                    {employeeData.map(({email, firstName, lastName}) =>
                        <MenuItem
                            value={email}>{(firstName === null || lastName === null) ? email : firstName + " " + lastName}</MenuItem>
                    )}
                </Select>
            </td>
            <td>
                <Select
                    defaultValue={StatusType.Unassigned}
                    style={{
                        'Unassigned': {color: "crimson"},
                        'Assigned': {color: "deepskyblue"},
                        'In Progress': {color: "turquoise"},
                        'Completed': {color: "limegreen"},
                        'Paused': {color: "mediumpurple"}
                    }[nsr.status]}
                    value={StatusType[nsr.status as keyof typeof StatusType] ? StatusType[nsr.status as keyof typeof StatusType] : "InProgress"}
                    onChange={async (event: SelectChangeEvent) => {
                        console.log(nsr.status as keyof typeof StatusType);

                        const serviceRequest: UpdateRequest = {
                            serviceID: nsr.serviceID,
                            assignedTo: nsr.assignedID,
                            status: StatusType[event.target.value as keyof typeof StatusType]
                        };

                        await axios.put("/api/service-request", serviceRequest).then();
                        setRefresh(!refresh);
                    }}>
                    {statuses.map((st) =>
                        <MenuItem value={st} style={{
                            'Unassigned': {color: "crimson"},
                            'Assigned': {color: "deepskyblue"},
                            'InProgress': {color: "turquoise"},
                            'Completed': {color: "limegreen"},
                            'Paused': {color: "mediumpurple"}
                        }[st]}>{StatusType[st as keyof typeof StatusType]}</MenuItem>
                    )}
                </Select>
            </td>
            <td>{nsr.notes.split(",")[0]}</td>
            <td className="delete-button">
                <Button
                    variant="outlined"
                    onClick={() => {
                        if(clickedRows.has(index)) {
                            clickedRows.delete(index);
                        }
                        axios.delete("/api/service-request", {
                            data: {
                                serviceID: nsr.serviceID
                            }
                        }).then();
                        setRefresh(!refresh);
                    }}>Delete
                </Button>
            </td>
        </tr>
    );
    let prevMin = -1;
    let rowInc = 1;
    clickedRows.forEach(() => {
        let rowInd: number = arraySR.length;
        let rowElem = <></>;
        clickedRows.forEach((e, k) => {
            if (k < rowInd && k > prevMin) {
                rowInd = k;
                rowElem = e;
            }
        });
        prevMin = rowInd;
        arraySR.splice(rowInd + rowInc, 0, rowElem);
        rowInc++;
    });

    function handleClick() {
        navigate("/requestform");
    }

    return (
        <div className="req-list-container">
            <div className="node-data-container">
                <div className="nav-container">
                    <Navbar/>
                </div>

                <div className="request-container">
                    <Menu
                        open={openMenu}
                        onClose={() => {
                            setMenuAnchor(null);
                        }}
                        anchorEl={menuAnchor}>
                        <FormControl style={{minWidth: 180, gap: 10, padding: 10}}>
                            <Select
                                value={filterType}
                                label=""
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setFilterFunction(() => () => {
                                        return true;
                                    });
                                }}
                            >
                                <MenuItem value={"Filter by..."}>None</MenuItem>
                                <MenuItem value={"Status"}>Status</MenuItem>
                                <MenuItem value={"Type"}>Request Type</MenuItem>
                                <MenuItem value={"Priority"}>Priority</MenuItem>
                            </Select>
                            {((filterType === "Filter by...") ? <></> :
                                ((filterType === "Type") ?
                                    <>
                                        <Divider/>
                                        <Select
                                            value={typeFilter}
                                            label=""
                                            onChange={(e) => {
                                                setTypeFilter(e.target.value);
                                                setFilterFunction(() => (nsr: UpdateServiceRequest) => {
                                                    return e.target.value === "Choose Type" || nsr.notes.split(",")[0] === e.target.value;
                                                });
                                            }}
                                        >
                                            <MenuItem value={"Choose Type"}>None</MenuItem>
                                            <MenuItem value={"sanitation"}>Sanitation</MenuItem>
                                            <MenuItem value={"medicine"}>Medicine</MenuItem>
                                            <MenuItem value={"transport"}>Transport</MenuItem>
                                            <MenuItem value={"language"}>Language</MenuItem>
                                            <MenuItem value={"maintenance"}>Maintenance</MenuItem>
                                        </Select>
                                    </> :
                                    ((filterType === "Status") ?
                                        <>
                                            <Divider/>
                                            <Select
                                                value={statusFilter}
                                                label=""
                                                onChange={(e) => {
                                                    setStatusFilter(e.target.value);
                                                    setFilterFunction(() => (nsr: UpdateServiceRequest) => {
                                                        return e.target.value === "Choose Status" || nsr.status === e.target.value;
                                                    });
                                                }}
                                            >
                                                <MenuItem value={"Choose Status"}>None</MenuItem>
                                                <MenuItem value={StatusType.Unassigned}>Unassigned</MenuItem>
                                                <MenuItem value={StatusType.Assigned}>Assigned</MenuItem>
                                                <MenuItem value={StatusType.InProgress}>In Progress</MenuItem>
                                                <MenuItem value={StatusType.Completed}>Completed</MenuItem>
                                                <MenuItem value={StatusType.Paused}>Paused</MenuItem>
                                            </Select>
                                        </> :
                                        <>
                                            <Divider/>
                                            <Select
                                                value={priorityFilter}
                                                label=""
                                                onChange={(e) => {
                                                    setPriorityFilter(e.target.value);
                                                    setFilterFunction(() => (nsr: UpdateServiceRequest) => {
                                                        return e.target.value === "Choose Priority" || nsr.priority === e.target.value;
                                                    });
                                                }}
                                            >
                                                <MenuItem value={"Choose Priority"}>None</MenuItem>
                                                <MenuItem value={PriorityType.Low}>Low</MenuItem>
                                                <MenuItem value={PriorityType.Medium}>Medium</MenuItem>
                                                <MenuItem value={PriorityType.High}>High</MenuItem>
                                                <MenuItem value={PriorityType.Emergency}>Emergency</MenuItem>
                                            </Select>
                                        </>)))}
                        </FormControl>
                    </Menu>
                    <IconButton onClick={(e) => {
                        setMenuAnchor(e.currentTarget);
                    }} style={{borderRadius: 0, width: 72}}>
                        <FilterListIcon/>
                    </IconButton>
                    <br/>
                    <div className="req-list-header">
                        <header className={'headerblue'}>Service Request List</header>
                    </div>
                    <br/>
                    <table className={"service-tables"}>
                        <tr>
                            <th></th>
                            <th>Time Created</th>
                            <th>Created by</th>
                            <th>Location</th>
                            <th>Priority</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th className={"delete-button"}></th>
                        </tr>
                        {arraySR}
                    </table>
                    <br/>
                    <div className="home-button">
                        <Button variant="contained" onClick={handleClick} style={{backgroundColor: "#012D5A"}}>Create a
                            Request</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
