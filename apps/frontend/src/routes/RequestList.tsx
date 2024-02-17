import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/servicelist_page.css";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import {
    PriorityType,
    StatusType,
    RequestType,
    UpdateRequest,
    SanitationRequest,
    MedicineRequest,
    MaintenanceRequest,
    InternalTransportRequest,
    LanguageRequest
} from "common/src/serviceRequestTypes.ts";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import {
    Button, CircularProgress, Collapse,
    Dialog, DialogActions, DialogTitle,
    FormControl,
    Menu,
    MenuItem,
    Paper, Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import Divider from "@mui/material/Divider";
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import {useAuth0} from "@auth0/auth0-react";

type ServiceRequest = {
    serviceID: number,
    timeCreated: string,
    createdBy: UpdateEmployee,
    createdByID: string,
    locationID: string,
    priority: string,
    status: string,
    assignedTo: UpdateEmployee,
    assignedID: string,
    notes: string,
    sanitation: SanitationRequest,
    maintenance: MaintenanceRequest,
    internalTransport: InternalTransportRequest,
    medicine: MedicineRequest,
    language: LanguageRequest,
}

enum RequestSpecifics {
    hazards = "Hazards: ",
    medicineType = "Medicine Type: ",
    amount = "Amount: ",
    toLocation = "To Location: ",
    patientName = "Patient Name: ",
    mobilityAid = "Mobility Aid: ",
    language1 = "From Language: ",
    language2 = "To Language: ",
    when = "When: ",
    details = "Details: "
}

export default function RequestList() {
    const navigate = useNavigate();
    const {loginWithRedirect, user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const [srData, setSRData] = useState<ServiceRequest[]>([]);
    const [nodeData, setNodeData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("Choose Status");
    const [typeFilter, setTypeFilter] = useState<string>("Choose Type");
    const [priorityFilter, setPriorityFilter] = useState<string>("Choose Priority");
    const [employeeFilter, setEmployeeFilter] = useState<string>("Choose Employee");
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [filterType, setFilterType] = useState("Filter by...");
    const [filterFunction, setFilterFunction] = useState<(nsr: ServiceRequest) => boolean>(() => () => {
        return true;
    });
    const openMenu = Boolean(menuAnchor);
    const [receivedSR, setReceivedSR] = useState(false);

    console.log(isAuthenticated);

    useEffect(() => {
        async function fetch() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/service-request", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const res2 = await axios.get("/api/employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const res3 = await axios.get("/api/nodes/read");

            setSRData(res.data);
            setEmployeeData(res2.data);
            setNodeData(res3.data);
            setReceivedSR(true);
        }

        fetch().then();
    }, [refresh, getAccessTokenSilently]);

    const statuses = Object.keys(StatusType).filter((item) => {
        return isNaN(Number(item));
    });

    function getReqType(nsr: ServiceRequest) {
        if (nsr.sanitation) {
            return "sanitation";
        } else if (nsr.medicine) {
            return "medicine";
        } else if (nsr.maintenance) {
            return "maintenance";
        } else if (nsr.internalTransport) {
            return "internalTransport";
        } else if (nsr.language) {
            return "language";
        }
        return "";
    }

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
        const utc = new Date(sYear, sMonth, sDay, sHour, sMinute, sSecond, sMillisecond);
        const offset = utc.getTimezoneOffset() + 60;
        return new Date(utc.getTime() - offset * 60000);
    }

    srData.sort((srA: ServiceRequest, srB: ServiceRequest) => {
        // console.log("TIME: " + srA.timeCreated + " " + srB.timeCreated);
        // console.log(sqlToDate(srA.timeCreated).valueOf() - sqlToDate(srB.timeCreated).valueOf());
        return sqlToDate(srA.timeCreated).valueOf() - sqlToDate(srB.timeCreated).valueOf();
        //return timeCreatedA - timeCreatedB;
    });

    function getNameOrEmail(userEmail: string) {
        let outFirst = "";
        let outLast = "";
        let outEmail = "";
        employeeData.find(({email, firstName, lastName}) => {
            if (userEmail === email) {
                outFirst = firstName;
                outLast = lastName;
                outEmail = email;
                return true;
            }
        });
        return (outFirst === null || outLast === null) ? outEmail : outFirst + " " + outLast;
    }

    function nodeNameOrReturn(nId: string) {
        const node = nodeData.find(({nodeID}) =>
            nodeID === nId
        );
        if (node !== undefined) {
            return node!["longName"];
        } else {
            return nId;
        }
    }

    const filterSR = srData.filter(filterFunction);

    function Row(props: { nsr: ServiceRequest }) {
        const {nsr} = props;
        const [open, setOpen] = React.useState(false);
        const [dialogOpen, setDialogOpen] = React.useState(false);
        console.log(nsr);

        return (
            <>
                <TableRow>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{width: 150}} style={{
                        'Low': {color: "darkolivegreen"},
                        'Medium': {color: "midnightblue"},
                        'High': {color: "maroon"},
                        'Emergency': {color: "crimson"}
                    }[nsr.priority]}> {nsr.priority}
                        {{
                            'Low': <ErrorIcon/>,
                            'Medium': <WarningIcon/>,
                            'High': <ReportIcon/>,
                            'Emergency': <NewReleasesIcon/>
                        }[nsr.priority]}
                    </TableCell>
                    <TableCell>{sqlToDate(nsr.timeCreated.toString()).getMonth() + "/" + sqlToDate(nsr.timeCreated.toString()).getDate() + "/" + sqlToDate(nsr.timeCreated.toString()).getFullYear() +
                        "\n" + (sqlToDate(nsr.timeCreated.toString()).getHours()) + ":" + sqlToDate(nsr.timeCreated.toString()).getMinutes().toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        })}</TableCell>
                    <TableCell>{
                        RequestType[getReqType(nsr) as keyof typeof RequestType]
                    }</TableCell>
                    <TableCell>
                        <Select
                            value={(nsr.assignedID !== null) ? nsr.assignedID : "Choose Employee"}
                            onChange={async (event: SelectChangeEvent) => {

                                const serviceRequest: UpdateRequest = {
                                    serviceID: nsr.serviceID,
                                    assignedTo: event.target.value,
                                    status: StatusType[nsr.status as keyof typeof StatusType]
                                };

                                if (nsr.status === StatusType.Unassigned) {
                                    serviceRequest.status = StatusType.Assigned;
                                }

                                getAccessTokenSilently().then((accessToken: string) => {
                                    axios.put("/api/service-request", serviceRequest, {
                                        headers: {
                                            Authorization: "Bearer " + accessToken
                                        }
                                    }).then();
                                });

                                setRefresh(!refresh);
                            }}
                            sx={{fontSize: 15}}>
                            {employeeData.map(({email, firstName, lastName}) =>
                                <MenuItem
                                    value={email}>{(firstName === null || lastName === null) ? email : firstName + " " + lastName}</MenuItem>
                            )}
                        </Select>
                    </TableCell>
                    <TableCell>
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

                                getAccessTokenSilently().then((accessToken: string) => {
                                    axios.put("/api/service-request", serviceRequest, {
                                        headers: {
                                            Authorization: "Bearer " + accessToken
                                        }
                                    }).then();
                                });
                                setRefresh(!refresh);
                            }}
                            sx={{fontSize: 15}}>
                            {statuses.map((st) =>
                                <MenuItem value={st} style={{
                                    'Unassigned': {color: "lightcoral"},
                                    'Assigned': {color: "deepskyblue"},
                                    'InProgress': {color: "turquoise"},
                                    'Completed': {color: "limegreen"},
                                    'Paused': {color: "mediumpurple"}
                                }[st]}>{StatusType[st as keyof typeof StatusType]}</MenuItem>
                            )}
                        </Select>
                    </TableCell>
                    <TableCell>{nodeNameOrReturn(nsr.locationID)}</TableCell>
                    <TableCell>{getNameOrEmail(nsr.createdByID)}</TableCell>
                    <TableCell>
                        <Button
                            variant="outlined"
                            style={{color: "#012D5A"}}
                            onClick={() => {
                                setDialogOpen(true);
                            }}>
                            <DeleteIcon/>
                        </Button>
                    </TableCell>
                </TableRow>
                <Dialog
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to delete that request?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => {
                            getAccessTokenSilently().then((accessToken: string) => {
                                axios.delete("/api/service-request", {
                                    data: {
                                        serviceID: nsr.serviceID
                                    },
                                    headers: {
                                        Authorization: "Bearer " + accessToken
                                    }
                                }).then();
                            });
                            setRefresh(!refresh);
                            setDialogOpen(false);
                        }}>Yes</Button>
                        <Button onClick={() => {
                            setDialogOpen(false);
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
                {open ? <TableRow>
                    <TableCell/>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={8}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{margin: 1}}>
                                {Object.keys(nsr[getReqType(nsr)]).filter((key) => {
                                    console.log("KEY: " + key);
                                    return !key.includes("ID");
                                }).map((key) => (
                                    <p>{RequestSpecifics[key as keyof typeof RequestSpecifics] + nodeNameOrReturn(nsr[getReqType(nsr)][key])}</p>
                                ))}
                                <p>Notes: {nsr.notes}</p>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow> : <></>}
            </>
        );
    }

    const arraySR = filterSR.map((nsr: ServiceRequest) =>
        <Row nsr={nsr}/>
    );

    function handleClick() {
        navigate("/requestform");
    }

    const userEmployee = employeeData.find(({email}) => {
        return email === employeeFilter;
    });

    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    if (!isAuthenticated) {
        loginWithRedirect().then();
        return;
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
                                <MenuItem value={"Employee"}>Employee</MenuItem>
                            </Select>
                            {((filterType === "Filter by...") ? <></> :
                                {
                                    'Type': <>
                                        <Divider/>
                                        <Select
                                            value={typeFilter}
                                            label=""
                                            onChange={(e) => {
                                                setTypeFilter(e.target.value);
                                                setFilterFunction(() => (nsr: ServiceRequest) => {
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
                                    </>,
                                    'Status': <>
                                        <Divider/>
                                        <Select
                                            value={statusFilter}
                                            label=""
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setFilterFunction(() => (nsr: ServiceRequest) => {
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
                                    </>,
                                    'Priority': <>
                                        <Divider/>
                                        <Select
                                            value={priorityFilter}
                                            label=""
                                            onChange={(e) => {
                                                setPriorityFilter(e.target.value);
                                                setFilterFunction(() => (nsr: ServiceRequest) => {
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
                                    </>,
                                    'Employee': <>
                                        <Divider/>
                                        <Select
                                            value={employeeFilter}
                                            label=""
                                            onChange={(e) => {
                                                setEmployeeFilter(e.target.value);
                                                setFilterFunction(() => (nsr: ServiceRequest) => {
                                                    return e.target.value === "Choose Employee" || nsr.assignedID === e.target.value;
                                                });
                                            }}
                                        >
                                            <MenuItem value={"Choose Employee"}>None</MenuItem>
                                            <MenuItem value={user!.email}>Assigned to you</MenuItem>
                                            {employeeData.filter(({email}) => {
                                                return email !== user!.email;
                                            }).map(({email, firstName, lastName}) =>
                                                <MenuItem
                                                    value={email}>{(firstName === null || lastName === null) ? email : firstName + " " + lastName}</MenuItem>
                                            )}
                                        </Select>
                                    </>
                                }[filterType])}
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
                    {(!receivedSR) ? <CircularProgress className="center-text"/> :
                        (filterSR.length > 0) ?
                            <TableContainer component={Paper} className="service-tables"
                                            sx={{width: 1205, maxHeight: window.innerHeight * 0.7}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell/>
                                            <TableCell>Priority</TableCell>
                                            <TableCell>Time Created</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Assigned To</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Created by</TableCell>
                                            <TableCell/>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {arraySR}
                                    </TableBody>
                                </Table>
                            </TableContainer> :
                            (srData.length > 0) ? <p className="center-text">No {{
                                    'Status': "service requests that are " + statusFilter,
                                    'Type': typeFilter + "service requests",
                                    'Priority': priorityFilter + " priority service requests",
                                    'Employee': "service requests assigned to " + ((userEmployee && userEmployee["firstName"] && userEmployee["lastName"]) ?
                                        userEmployee["firstName"] + " " + userEmployee["lastName"] : userEmployee)
                                }[filterType]} .</p> :
                                <p className="center-text">No service requests.</p>}
                </div>
                <div className="home-button">
                    <Button variant="contained" onClick={handleClick} style={{backgroundColor: "#012D5A"}}>Create a
                        Request</Button>
                </div>
            </div>
        </div>
    );
}

