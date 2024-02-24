import React, {SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import {
    Box, Button,
    CircularProgress,
    Collapse, Dialog, DialogActions, DialogTitle, FormControl, IconButton,
    Menu, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import Divider from "@mui/material/Divider";
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    PriorityType,
    RequestType,
    StatusType, UpdateServiceRequest
} from "common/src/serviceRequestTypes.ts";
import {ServiceRequestWithTypes} from "database";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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

const latoTheme = createTheme({
    components: {
        // Name of the component
        MuiTableCell: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontFamily: 'Lato',
                },
            },
        },
    },
});

enum prioSort {
    'Low' = 1,
    'Medium' = 2,
    'High' = 3,
    'Emergency' = 4
}

enum statusSort {
    'Unassigned' = 1,
    'Assigned' = 2,
    'In Progress' = 3,
    'Completed' = 4,
    'Paused' = 5
}

enum requestSortField { priority, timeCreated, type, assignedTo, status, location, createdBy}

export default function ServiceRequestTable() {
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [srData, setSRData] = useState<ServiceRequestWithTypes[]>([]);
    const [nodeData, setNodeData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("Choose Status");
    const [typeFilter, setTypeFilter] = useState<string>("Choose Type");
    const [priorityFilter, setPriorityFilter] = useState<string>("Choose Priority");
    const [employeeFilter, setEmployeeFilter] = useState<string>("Choose Employee");
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [filterType, setFilterType] = useState("Filter by...");
    const [filterFunction, setFilterFunction] = useState<(nsr: ServiceRequestWithTypes) => boolean>(() => () => {
        return true;
    });
    const openMenu = Boolean(menuAnchor);
    const [receivedSR, setReceivedSR] = useState(false);
    const [sortUp, setSortUp] = useState(true);
    const [beingSorted, setBeingSorted] = useState(false);
    const [sortFunction, setSortFunction] = useState<(srA: ServiceRequestWithTypes, srB: ServiceRequestWithTypes) => number>(() => () => {
        return 0;
    });
    const [typeSort, setTypeSort] = useState<keyof typeof requestSortField>("timeCreated");

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

    function getReqType(nsr: ServiceRequestWithTypes) {
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

    if (!beingSorted) {
        srData.sort((srA: ServiceRequestWithTypes, srB: ServiceRequestWithTypes) => {
            return sqlToDate(srA.timeCreated.toString()).getTime() - sqlToDate(srB.timeCreated.toString()).getTime();
        });
    } else {
        srData.sort(sortFunction);
        if(!sortUp) {
            srData.reverse();
        }
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

    function sortByPrio(srA: ServiceRequestWithTypes, srB: ServiceRequestWithTypes) {
        return prioSort[srA.priority as keyof typeof prioSort] - prioSort[srB.priority as keyof typeof prioSort];
    }

    function sortByStatus(srA: ServiceRequestWithTypes, srB: ServiceRequestWithTypes) {
        console.log(srA.status);
        return statusSort[srA.status as keyof typeof statusSort] - statusSort[srB.status as keyof typeof statusSort];
    }

    function sortRequests(sortField: requestSortField) {
        switch (sortField) {
            case requestSortField.priority:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) => sortByPrio(a, b));
                break;
            case requestSortField.timeCreated:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) => sqlToDate(a.timeCreated.toString()).getTime() - sqlToDate(b.timeCreated.toString()).getTime());
                break;
            case requestSortField.type:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) => getReqType(a).localeCompare(getReqType(b)));
                break;
            case requestSortField.assignedTo:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) => {
                    if (!a.assignedTo) {
                        return -1;
                    } else if (!b.assignedTo) {
                        return 1;
                    }
                    return a.assignedTo.firstName!.localeCompare(b.assignedTo.firstName!);
                });
                break;
            case requestSortField.status:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) => sortByStatus(a, b));
                break;
            case requestSortField.location:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) => nodeNameOrReturn(a.locationID).localeCompare(nodeNameOrReturn(b.locationID)));
                break;
            case requestSortField.createdBy:
                setSortFunction(() => (a: ServiceRequestWithTypes, b: ServiceRequestWithTypes) =>  {
                    if (!a.createdBy) {
                        return -1;
                    } else if (!b.createdBy) {
                        return 1;
                    }
                    return a.createdBy.firstName!.localeCompare(b.createdBy.firstName!);
                });
                break;
        }
        setTypeSort(requestSortField[sortField] as keyof typeof requestSortField);
        setBeingSorted(true);
    }

    const filterSR = srData.filter(filterFunction);

    function Row(props: { nsr: ServiceRequestWithTypes }) {
        const {nsr} = props;
        const [open, setOpen] = React.useState(false);
        const [dialogOpen, setDialogOpen] = React.useState(false);

        return (
            <>
                <TableRow>
                    <TableCell align={"center"}>
                        <IconButton
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
                    }[nsr.priority]}>
                        <div className={"priority-display"}>
                            {nsr.priority}
                            {{
                                'Low': <ErrorIcon/>,
                                'Medium': <WarningIcon/>,
                                'High': <ReportIcon/>,
                                'Emergency': <NewReleasesIcon/>
                            }[nsr.priority]}
                        </div>
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

                                const serviceRequest: UpdateServiceRequest = {
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
                                    }).then(() => {
                                        setRefresh(!refresh);
                                    });
                                });

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
                                'Unassigned': {color: "maroon"},
                                'Assigned': {color: "teal"},
                                'In Progress': {color: "navy"},
                                'Completed': {color: "olivedrab"},
                                'Paused': {color: "mediumvioletred"}
                            }[nsr.status]}
                            value={StatusType[nsr.status as keyof typeof StatusType] ? StatusType[nsr.status as keyof typeof StatusType] : "InProgress"}
                            onChange={async (event: SelectChangeEvent) => {
                                const serviceRequest: UpdateServiceRequest = {
                                    serviceID: nsr.serviceID,
                                    assignedTo: nsr.assignedID,
                                    status: StatusType[event.target.value as keyof typeof StatusType]
                                };

                                getAccessTokenSilently().then((accessToken: string) => {
                                    axios.put("/api/service-request", serviceRequest, {
                                        headers: {
                                            Authorization: "Bearer " + accessToken
                                        }
                                    }).then(() => {
                                        setRefresh(!refresh);
                                    });
                                });
                            }}
                            sx={{fontSize: 15}}>
                            {statuses.map((st) =>
                                <MenuItem value={st} style={{
                                    'Unassigned': {color: "maroon"},
                                    'Assigned': {color: "teal"},
                                    'InProgress': {color: "navy"},
                                    'Completed': {color: "olivedrab"},
                                    'Paused': {color: "mediumvioletred"}
                                }[st]}>{StatusType[st as keyof typeof StatusType]}</MenuItem>
                            )}
                        </Select>
                    </TableCell>
                    <TableCell>{nodeNameOrReturn(nsr.locationID)}</TableCell>
                    <TableCell>{nsr.createdBy ? nsr.createdBy.firstName + " " + nsr.createdBy.lastName : ""}</TableCell>
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
                                }).then(() => setRefresh(!refresh));
                            });
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
                                {Object.keys(nsr[getReqType(nsr) as keyof typeof getReqType]).filter((key) => {
                                    console.log("KEY: " + key);
                                    return !key.includes("ID");
                                }).map((key) => (
                                    <p>{RequestSpecifics[key as keyof typeof RequestSpecifics] + nodeNameOrReturn(nsr[getReqType(nsr) as keyof typeof getReqType][key])}</p>
                                ))}
                                <p>Notes: {nsr.notes}</p>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow> : <></>}
            </>
        );
    }

    const arraySR = filterSR.map((nsr: ServiceRequestWithTypes) =>
        <Row nsr={nsr}/>
    );

    const userEmployee = employeeData.find(({email}) => {
        return email === employeeFilter;
    });

    return (
        <div className="AD-OneCard">
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
                                        setFilterFunction(() => (nsr: ServiceRequestWithTypes) => {
                                            return e.target.value === "Choose Type" || getReqType(nsr) === e.target.value;
                                        });
                                    }}
                                >
                                    <MenuItem value={"Choose Type"}>None</MenuItem>
                                    <MenuItem value={"sanitation"}>Sanitation</MenuItem>
                                    <MenuItem value={"medicine"}>Medicine</MenuItem>
                                    <MenuItem value={"internalTransport"}>Internal Transport</MenuItem>
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
                                        setFilterFunction(() => (nsr: ServiceRequestWithTypes) => {
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
                                        setFilterFunction(() => (nsr: ServiceRequestWithTypes) => {
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
                                        setFilterFunction(() => (nsr: ServiceRequestWithTypes) => {
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
            {(!receivedSR) ? <CircularProgress className="center-text"/> :
                <ThemeProvider theme={latoTheme}>
                    <TableContainer component={Paper} className="service-tables"
                                    sx={{maxHeight: "70vh"}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <IconButton onClick={(e) => {
                                            setMenuAnchor(e.currentTarget as unknown as SetStateAction<null>);
                                        }} style={{borderRadius: 0, width: 72}}>
                                            <FilterListIcon/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Priority
                                        <IconButton
                                            style={{color: (typeSort === "priority" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.priority);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Time Created
                                        <IconButton
                                            style={{color: (typeSort === "timeCreated" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.timeCreated);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Type
                                        <IconButton
                                            style={{color: (typeSort === "type" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.type);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Assigned To
                                        <IconButton
                                            style={{color: (typeSort === "assignedTo" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.assignedTo);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Status
                                        <IconButton
                                            style={{color: (typeSort === "status" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.status);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Location
                                        <IconButton
                                            style={{color: (typeSort === "location" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.location);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell>
                                        Created by
                                        <IconButton
                                            style={{color: (typeSort === "createdBy" ? "#34AD84" : ""), width: '2vw'}}
                                            onClick={() => {
                                                setSortUp(!sortUp);
                                                sortRequests(requestSortField.createdBy);
                                            }}>{sortUp ? <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                            <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filterSR.length > 0 ? arraySR :
                                    (srData.length > 0 ? <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell colSpan={6}>
                                            <p>No {{
                                                'Status': "service requests that are " + statusFilter,
                                                'Type': typeFilter + " service requests",
                                                'Priority': priorityFilter + " priority service requests",
                                                'Employee': "service requests assigned to " + ((userEmployee && userEmployee["firstName"] && userEmployee["lastName"]) ?
                                                    userEmployee["firstName"] + " " + userEmployee["lastName"] : userEmployee)
                                            }[filterType]} .</p>
                                        </TableCell>
                                    </TableRow> : <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell colSpan={6}>
                                            <p>No service requests.</p>
                                        </TableCell>
                                    </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ThemeProvider>}
        </div>
    );
}

