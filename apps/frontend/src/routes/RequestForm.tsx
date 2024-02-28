import React, {useState, useEffect} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import ServiceRequestTable from "../components/ServiceRequests/EmployeeServiceRequestTable.tsx";
import PieChartStats from "../components/Statistics/PieChartStats.tsx";
import MiniMap from "../components/ServiceRequests/LeafletMiniMap.tsx";
import "../css/serviceform_page.css";
import CountEmergency from "../components/Statistics/CountEmergency.tsx";
import CountOpenRequest from "../components/Statistics/CountOpenRequest.tsx";
import CountRequestToday from "../components/Statistics/CountRequestToday.tsx";
import PillImage from "../images/pills.png";
import LangIMG from "../images/lang.png";
import LoudImage from "../images/loud.png";
import TransportImage from "../images/transport.png";
import MaintainImage from "../images/maintain.png";
import CleanImage from "../images/clean.png";

// Material UI imports
import {
    Alert, Autocomplete,
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Snackbar
} from "@mui/material";
import {styled} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import BarChart from "../components/Statistics/BarChart.tsx";
import StackedBarChart from "../components/Statistics/StackedBarChart.tsx";
import {
    InternalTransportRequest, LanguageRequest, MaintenanceRequest,
    MedicineRequest,
    PriorityType,
    SanitationRequest,
    ServiceRequest,
    GokuRequest,
    StatusType
} from "common/src/serviceRequestTypes.ts";
import SanitationReq from "../components/ServiceRequests/SanitationRequest.tsx";
import MedicineReq from "../components/ServiceRequests/MedicineRequest.tsx";
import MaintenanceReq from "../components/ServiceRequests/MaintenanceRequest.tsx";
import InternalTransportationReq from "../components/ServiceRequests/InternalTransportRequest.tsx";
import LanguageReq from "../components/ServiceRequests/LanguageRequest.tsx";
import TextField from "@mui/material/TextField";
import {SelectChangeEvent} from "@mui/material/Select";
import GokuReq from "../components/ServiceRequests/GokuReq.tsx";

const RequestButton = styled(Button)(() => ({
    fontSize: '.8em',
    width: '30.5%',
    // height: '45vh',
    marginLeft: '2%',
    marginTop: '2%',
    marginBottom: '2%',
    border: '.1px solid black',
    color: 'black',
    backgroundColor: '#FAFAFA',
    '&:hover': {
        color: 'white',
        backgroundColor: '#34AD84',
    },
}));

const cardTitle = {
    fontSize: '4vh',
    fontFamily: 'Lato',
    alignSelf: "center",
    fontWeight: '100',
    marginBottom: '0'
};

const cardText = {
    fontSize: '80%',
    alignSelf: "center",
    justifySelf: "center",
};

const cardSX = {
    justifySelf: 'center',
    borderRadius: '15px',
    fontFamily: 'Lato',
    textTransform: "none"
};

const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const mapStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function RequestForm() {
    const {loginWithRedirect, user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const [currentTab, setCurrentTab] = React.useState("create-request");
    const [location, setLocation] = useState("");
    const [prio, setPrio] = useState("");
    const [infoText, setInfoText] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [requestType, setRequestType] = useState("");
    const [typeReq, setTypeReq] = useState("");
    const [assignTo, setAssignTo] = useState("");
    const [nodeData, setNodeData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [sanPressed, setSanPressed] = useState(false);
    const [medPressed, setMedPressed] = useState(false);
    const [mainPressed, setMainPressed] = useState(false);
    const [transPressed, setTransPressed] = useState(false);
    const [langPressed, setLangPressed] = useState(false);
    const [gokuPressed, setGokuPressed] = useState(false);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [srData, setsrData] = useState<ServiceRequest[]>([]);

    useEffect(() => {
        async function fetchData() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/service-request", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            setsrData(res.data);
        }

        fetchData().then();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        async function fetch() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/nodes/read");
            const res3 = await axios.get("/api/employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            setNodeData(res.data);
            setEmployeeData(res3.data);
        }

        fetch().then();
    }, [getAccessTokenSilently]);

    console.log(isAuthenticated);

    function resetForm() {
        setRequestType("");
        setTypeReq("");
        setMedPressed(false);
        setSanPressed(false);
        setMainPressed(false);
        setTransPressed(false);
        setLangPressed(false);
        setLocation("");
        setPrio("");
        setInfoText("");
        setOption1("");
        setOption2("");
        setOption3("");
        setAssignTo("");
    }

    async function submit() {
        console.log("TEST: " + typeReq);
        const accessToken: string = await getAccessTokenSilently();
        if (typeReq === "sanitation") {
            const requestSent: SanitationRequest = {
                createdByID: user!.email!,
                locationID: location,
                notes: infoText,
                priority: PriorityType[prio as keyof typeof PriorityType],
                status: StatusType.Assigned,
                assignedID: assignTo,
                hazards: option1
            };
            const res = await axios.post("/api/service-request/sanitation", requestSent, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        } else if (typeReq === "medicine") {
            const requestSent: MedicineRequest = {
                createdByID: user!.email!,
                locationID: location,
                notes: infoText,
                priority: PriorityType[prio as keyof typeof PriorityType],
                status: StatusType.Assigned,
                assignedID: assignTo,
                medicineType: option1,
                amount: option2
            };
            const res = await axios.post("/api/service-request/medicine", requestSent, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        } else if (typeReq === "transport") {
            const requestSent: InternalTransportRequest = {
                createdByID: user!.email!,
                locationID: location,
                notes: infoText,
                priority: PriorityType[prio as keyof typeof PriorityType],
                status: StatusType.Assigned,
                assignedID: assignTo,
                toLocation: option1,
                patientName: option2,
                mobilityAid: option3
            };
            const res = await axios.post("/api/service-request/internal-transport", requestSent, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        } else if (typeReq === "language") {
            const requestSent: LanguageRequest = {
                createdByID: user!.email!,
                locationID: location,
                notes: infoText,
                priority: PriorityType[prio as keyof typeof PriorityType],
                status: StatusType.Assigned,
                assignedID: assignTo,
                language1: option1,
                language2: option2,
                when: new Date()
            };
            const res = await axios.post("/api/service-request/language", requestSent, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        } else if (typeReq === "maintenance") {
            const requestSent: MaintenanceRequest = {
                createdByID: user!.email!,
                locationID: location,
                notes: infoText,
                priority: PriorityType[prio as keyof typeof PriorityType],
                status: StatusType.Assigned,
                assignedID: assignTo,
                details: option1
            };
            const res = await axios.post("/api/service-request/maintenance", requestSent, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        } else if (typeReq === "goku") {
            const requestSent: GokuRequest = {
                title: option1,
                announcement: option2,
                sender: user!.email!
            };
            const res = await axios.post("/api/service-request/goku", requestSent, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        }

        resetForm();
        //setCurrentTab("list-request");
        //navigate("/requestlist");
    }

    function handleChange1(newVal: string) {
        setOption1(newVal);
    }

    function handleChange2(new2: string) {
        setOption2(new2);
    }

    function handleChange3(new3: string) {
        setOption3(new3);
    }

    // Function to render the appropriate service request component based on the selected request type
    const renderServiceRequestComponent = () => {
        switch (requestType) {
            case "sanitation":
                return <SanitationReq change={handleChange1}/>;
            case "medicine":
                return <MedicineReq change1={handleChange1} change2={handleChange2}/>;
            case "maintenance":
                return <MaintenanceReq change={handleChange1}/>;
            case "transport":
                return <InternalTransportationReq change1={handleChange1} change2={handleChange2}
                                                  change3={handleChange3}/>;
            case "language":
                return <LanguageReq change1={handleChange1} change2={handleChange2}/>;
            // Add cases for other service request types
            case "goku":
                return <GokuReq change1={handleChange1} change2={handleChange2}/>;
            default:
                return null;
        }
    };

    const currNodes = nodeData.filter(({nodeType}) => {
        return nodeType !== "HALL";
    });

    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    if (!isAuthenticated) {
        loginWithRedirect().then();
        return;
    }

    interface NodeType {
        label: string,
        nid: string
    }

    const handleTabClick = (tab: string) => {
        switch (tab) {
            case "list-request":
                setCurrentTab("list-request");
                return;
            case "create-request":
                setCurrentTab("create-request");
                return;
            case "statistics":
                setCurrentTab("statistics");
                return;
        }
    };

    function nodeIDtoName(nId: string) {
        const node = nodeData.find(({nodeID}) =>
            nodeID === nId
        );
        if (node !== undefined) {
            return node!["longName"];
        } else {
            return "";
        }
    }

    return (
        <div className={"service-form-Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <Navbar/> {/* NavBlue css fixes this to the left */}
            <div className={"service-form-BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"service-form-ThreeRows"}
                     style={{gridTemplateRows: (currentTab === "statistics" ? '5.5% 50% 40%' : (currentTab === "create-request" ? '8vh 85%' : '8vh 55vh'))}}
                >
                    <div className={"service-form-topcard"}>
                        <Button
                            onClick={() => {
                                handleTabClick("statistics");
                            }}
                            style={{
                                color: currentTab === 'statistics' ? 'black' : 'black',
                                borderBottom: currentTab === 'statistics' ? '1.4vh solid #34AD84' : 'white',
                                fontFamily: 'Lato',
                                fontSize: '100%',
                                textTransform: 'none',
                            }}>
                            Statistics
                        </Button>
                        <Button
                            onClick={() => {
                                handleTabClick("create-request");
                            }}
                            style={{
                                color: currentTab === 'create-request' ? 'black' : 'black',
                                borderBottom: currentTab === 'create-request' ? '1.4vh solid #34AD84' : 'white',
                                fontFamily: 'Lato',
                                fontSize: '100%',
                                textTransform: 'none',
                            }}>
                            Create Service Request
                        </Button>
                        <Button
                            onClick={() => {
                                handleTabClick("list-request");
                            }}
                            style={{
                                color: currentTab === 'list-request' ? 'black' : 'black',
                                borderBottom: currentTab === 'list-request' ? '1.4vh solid #34AD84' : 'white',
                                fontFamily: 'Lato',
                                fontSize: '100%',
                                textTransform: 'none',
                            }}>
                            List Service Requests
                        </Button>
                    </div>

                    {/*If current tab is the statistics tab*/}
                    {currentTab === "statistics" && (
                        <div className="statistics-layout">
                            <div className="statistics-cards-container">
                                <div className="stat-card-group left-column">
                                    <div className="stat-card small" id="emergencies">
                                        <span className="stat-title">Open Request #</span>
                                        <div className="stat-number-container">
                                            <CountOpenRequest/>
                                        </div>
                                    </div>
                                    <div className="stat-card x-small" id="employee-of-month">
                                        <span className="stat-title">Employee Of The Month</span>
                                        <span className="stat-number-container">Kenny Doan</span>
                                    </div>

                                </div>
                                <div className="stat-card-group right-column">
                                    <div className="stat-card medium" id="requests-today">
                                        <span className="stat-title">Requests Created Today</span>
                                        <div className="stat-number-container">
                                            <CountRequestToday/>
                                        </div>
                                    </div>
                                    <div className="stat-card large" id="open-requests">
                                        <span className="stat-title"># of Emergency</span>
                                        <div className="stat-number-container">
                                            <CountEmergency/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <div
                                    className={`service-form-midcard ${currentTab === "statistics" ? "service-form-midcard-right" : ""}`}>
                                    <div>
                                        <PieChartStats srlist={srData} title={"Number of Requests in Types"}/>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/*If current tab is the create request tab*/}
                    {currentTab === "create-request" && (
                        <div className={"service-form-midcard2"}>
                            <header className={"create-service-header"}
                                    style={{fontFamily: 'Lato', fontWeight: '550'}}>
                                Create Service Request
                            </header>
                            <RequestButton variant="contained"
                                           onClick={() => {
                                               if (requestType === "medicine") {
                                                   setRequestType("");
                                               } else {
                                                   setRequestType("medicine");
                                               }
                                               setTypeReq("medicine");
                                               setMedPressed(!medPressed);
                                               setSanPressed(false);
                                               setMainPressed(false);
                                               setTransPressed(false);
                                               setLangPressed(false);
                                               setGokuPressed(false);
                                           }}
                                           sx={cardSX}>
                                {/*Cameron Crane*/}
                                <div className={'requestCardGrid'}>
                                    <p style={cardTitle}>Medicine Request</p>

                                    <p style={cardText}>For ordering the medicine that patients need directly to their
                                        rooms</p>

                                    <img className={"pillimage"} src={PillImage} alt={"Image"}/>
                                </div>
                            </RequestButton>
                            <RequestButton variant="contained"
                                           onClick={() => {
                                               if (requestType === "maintenance") {
                                                   setRequestType("");
                                               } else {
                                                   setRequestType("maintenance");
                                               }
                                               setTypeReq("maintenance");
                                               setMainPressed(!mainPressed);
                                               setSanPressed(false);
                                               setMedPressed(false);
                                               setTransPressed(false);
                                               setLangPressed(false);
                                               setGokuPressed(false);
                                           }}
                                           sx={cardSX}>
                                <div className={'requestCardGrid'}>
                                    <p style={cardTitle}>Maintenance Request</p>

                                    <p style={cardText}>For ordering maintenance and general upkeep services to rooms.
                                        This request works for all room types</p>

                                    <img className={"pillimage"} src={MaintainImage} alt={"Image"}/>
                                </div>
                            </RequestButton>
                            <RequestButton variant="contained"
                                           onClick={() => {
                                               if (requestType === "transport") {
                                                   setRequestType("");
                                               } else {
                                                   setRequestType("transport");
                                               }
                                               setTypeReq("transport");
                                               setTransPressed(!transPressed);
                                               setMedPressed(false);
                                               setSanPressed(false);
                                               setMainPressed(false);
                                               setLangPressed(false);
                                               setGokuPressed(false);
                                           }}
                                           sx={cardSX}>
                                <div className={'requestCardGrid'}>
                                    <p style={cardTitle}>Transport Request</p>

                                    <p style={cardText}>For transporting patients who need assistance moving from one
                                        room to another</p>

                                    <img className={"pillimage"} src={TransportImage} alt={"Image"}/>
                                </div>
                            </RequestButton>
                            <RequestButton variant="contained"
                                           onClick={() => {
                                               if (requestType === "language") {
                                                   setRequestType("");
                                               } else {
                                                   setRequestType("language");
                                               }
                                               setTypeReq("language");
                                               setLangPressed(!langPressed);
                                               setSanPressed(false);
                                               setMedPressed(false);
                                               setMainPressed(false);
                                               setTransPressed(false);
                                               setGokuPressed(false);
                                           }}
                                           sx={cardSX}>
                                <div className={'requestCardGrid'}>
                                    <p style={cardTitle}>Language Request</p>

                                    <p style={cardText}>For ordering a translator to assist a patient who doesn't speak
                                        the same language as hospital staff</p>

                                    <img className={"pillimage"} src={LangIMG} alt={"Image"}
                                         style={{maxWidth: '100%'}}/>
                                </div>
                            </RequestButton>
                            <RequestButton variant="contained"
                                           onClick={() => {
                                               if (requestType === "sanitation") {
                                                   setRequestType("");
                                               } else {
                                                   setRequestType("sanitation");
                                               }
                                               setTypeReq("sanitation");
                                               setSanPressed(!sanPressed);
                                               setMedPressed(false);
                                               setMainPressed(false);
                                               setTransPressed(false);
                                               setLangPressed(false);
                                               setGokuPressed(false);
                                           }}
                                           sx={cardSX}>
                                <div className={'requestCardGrid'}>
                                    <p style={cardTitle}>Sanitation Request</p>

                                    <p style={cardText}>For requesting cleaning services to rooms for general cleaning
                                        or specific instances</p>

                                    <img className={"pillimage"} src={CleanImage} alt={"Image"}/>
                                </div>
                            </RequestButton>
                            <RequestButton variant="contained"
                                           onClick={() => {
                                               if (requestType === "goku") {
                                                   setRequestType("");
                                               } else {
                                                   setRequestType("goku");
                                               }
                                               setTypeReq("goku");
                                               setSanPressed(false);
                                               setMedPressed(false);
                                               setMainPressed(false);
                                               setTransPressed(false);
                                               setLangPressed(false);
                                               setGokuPressed(!gokuPressed);
                                           }}
                                           sx={cardSX}>
                                <div className={'requestCardGrid'}>
                                    <p style={cardTitle}>GOKU Request</p>

                                    <p style={cardText}>Give Ongoing Knowledge Urgently (GOKU) to all hospital staff</p>

                                    <img className={"pillimage"} src={LoudImage} alt={"Image"}/>
                                </div>
                            </RequestButton>
                        </div>
                    )}

                    {/*If current tab is the List request tab*/}
                    {currentTab === "list-request" && (
                        <div className={"service-form-ReqList"}>
                            <ServiceRequestTable/>
                        </div>
                    )}

                    {currentTab === "statistics" && (
                        <div className={"service-form-TwoColumnsThirdRow"}>
                            <div className={"service-form-ChartCard"}>
                                <BarChart/>
                            </div>
                            <div className={"service-form-ChartCard"}>
                                <StackedBarChart/>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="form-container">
                {/* Render the form contents only if a service request type is selected */}
                {requestType && (
                    <Modal
                        open={requestType !== ""}
                        onClose={() => {
                            setRequestType("");
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        style={{fontFamily: 'Lato'}}
                    >
                        <Box sx={modalStyle}>
                            <div className="form-top-bar">
                                <p style={{fontSize: '150%', fontWeight: 600}}>
                                    {{
                                        'sanitation': "Sanitation",
                                        'medicine': "Medicine",
                                        'maintenance': "Maintenance",
                                        'transport': "Internal Transport",
                                        'language': "Language",
                                        'goku': "GOKU"
                                    }[requestType] + " Request"}
                                </p>
                                <IconButton sx={{height: '20%'}} onClick={() => resetForm()}>
                                    <CloseIcon/>
                                </IconButton>
                            </div>
                            <div className={"modal-div"}>
                                {requestType !== "goku" &&
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            width: window.innerWidth * 0.38,
                                            gap: '2%'
                                        }}>
                                            <Autocomplete
                                                style={{width: '100%'}}
                                                disablePortal
                                                options={currNodes.map(({nodeID, longName}): NodeType => (
                                                    {label: longName, nid: nodeID}
                                                ))}
                                                value={{label: nodeIDtoName(location), nid: location}}
                                                size={"small"}
                                                renderInput={(params) =>
                                                    <TextField {...params} label="Location" variant="standard"/>}
                                                //value={{label: nodeIDtoName(location), nid: location}}
                                                getOptionLabel={(nd: NodeType) =>
                                                    `${nd.label}`
                                                }
                                                getOptionKey={(nd: NodeType) =>
                                                    `${nd.nid}`
                                                }
                                                onChange={(newValue, val) => {
                                                    if (val !== null) {
                                                        setLocation(val.nid);
                                                    }
                                                }}
                                            />
                                            <Button variant={"outlined"} style={{
                                                color: "#34AD84",
                                                width: 220, fontSize: '0.7em'
                                            }} onClick={() => setShowMap(true)}>
                                                Choose From Map
                                            </Button>
                                        </div>
                                        <div className="input-field">
                                            <FormControl className="input-field">
                                                <InputLabel id="prio-label"
                                                            variant="standard">Priority</InputLabel>
                                                <Select
                                                    style={{width: window.innerWidth * 0.38}}
                                                    labelId="prio-label"
                                                    id="standard-basic"
                                                    label="Priority"
                                                    variant="standard"
                                                    size={"small"}
                                                    value={prio}
                                                    onChange={(e) => setPrio(e.target.value)}
                                                    required
                                                >
                                                    <MenuItem value={PriorityType.Low}>Low</MenuItem>
                                                    <MenuItem value={PriorityType.Medium}>Medium</MenuItem>
                                                    <MenuItem value={PriorityType.High}>High</MenuItem>
                                                    <MenuItem value={PriorityType.Emergency}>Emergency</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="input-field">
                                            <FormControl>
                                                <InputLabel id="employee-label"
                                                            variant="standard">Choose Employee</InputLabel>
                                                <Select
                                                    labelId="employee-label"
                                                    value={assignTo}
                                                    onChange={async (event: SelectChangeEvent) => {
                                                        setAssignTo(event.target.value);
                                                    }}
                                                    variant="standard"
                                                    size={"small"}
                                                    style={{width: window.innerWidth * 0.38}}>
                                                    {employeeData.map(({email, firstName, lastName}) =>
                                                        <MenuItem
                                                            value={email}>{(firstName === null || lastName === null) ? email : firstName + " " + lastName}</MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </>}
                                <div>
                                    {renderServiceRequestComponent()}
                                </div>
                                {requestType !== "goku" &&
                                    <div className="top-space">
                                        <TextField
                                            style={{width: window.innerWidth * 0.38}}
                                            multiline
                                            rows={3}
                                            id="outlined-multiline-flexible"
                                            label="Special Notes"
                                            type="text"
                                            value={infoText}
                                            onChange={(e) => setInfoText(e.target.value)}
                                            required
                                        />
                                    </div>}
                            </div>
                            <div className={"form-bottom-bar"}>
                                <div className="form-submit">
                                    <Button
                                        style={{
                                            backgroundColor: "#34AD84",
                                            width: 220
                                        }}
                                        variant="contained"
                                        onClick={submit}
                                    >
                                        Submit Request
                                    </Button>
                                </div>
                                <p>
                                    Created by {" "}
                                    {{
                                        'sanitation': "Rodrick",
                                        'medicine': "Rodrick and Piotr",
                                        'maintenance': "Kenny",
                                        'transport': "Katy and Cameron",
                                        'language': "Katie and Hien",
                                        'goku': "Goku"
                                    }[requestType]}
                                </p>
                            </div>
                        </Box>
                    </Modal>
                )}

            </div>
            <Modal
                open={showMap}
                onClose={() => {
                    setShowMap(false);
                }}
                style={{fontFamily: 'Lato'}}
            >
                <Box sx={mapStyle}>
                    <MiniMap change={setLocation} setClose={setShowMap}/>
                </Box>
            </Modal>;
            <Snackbar
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                open={submitAlert}
                autoHideDuration={2000}
                onClose={() => {
                    setSubmitAlert(false);
                }}>
                <Alert
                    severity="success"
                    sx={{width: '100%'}}
                >
                    Request form submitted.
                </Alert>
            </Snackbar>;
        </div>
    );
}
