import React, {useState, useEffect} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import ServiceRequestTable from "../components/ServiceRequestTable.tsx";
import PieChartStats from "../components/PieChartStats.tsx";
import "../css/serviceform_page.css";

// Material UI imports
import {
    Alert, Autocomplete,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Snackbar
} from "@mui/material";
import {styled} from '@mui/material/styles';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TranslateIcon from '@mui/icons-material/Translate';
import GokuIcon from "../components/GokuIcon.tsx";
import BarChart from "../components/BarChart.tsx";
import StackedBarChart from "../components/StackedBarChart.tsx";
import {
    InternalTransportRequest, LanguageRequest, MaintenanceRequest,
    MedicineRequest,
    PriorityType,
    SanitationRequest,
    StatusType
} from "common/src/serviceRequestTypes.ts";
import SanitationReq from "../components/SanitationRequest.tsx";
import MedicineReq from "../components/MedicineRequest.tsx";
import MaintenanceReq from "../components/MaintenanceRequest.tsx";
import InternalTransportationReq from "../components/InternalTransportRequest.tsx";
import LanguageReq from "../components/LanguageRequest.tsx";
import TextField from "@mui/material/TextField";
import {SelectChangeEvent} from "@mui/material/Select";
import {useNavigate} from "react-router-dom";

const RequestButton = styled(Button)(() => ({
    fontSize: '2.5vh',
    width: '48%',
    height: '26%',
    marginLeft: '1%',
    marginTop: '1%',
    border: '2px solid black',
    color: 'black',
    backgroundColor: '#CDCCD0',
    '&:hover': {
        color: 'white',
        backgroundColor: '#34AD84',
    },
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '38vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function RequestForm() {
    const navigate = useNavigate();
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
    const [submitAlert, setSubmitAlert] = useState(false);

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

    async function submit() {
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
        }

        setCurrentTab("list-request");
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
                //setCurrentTab("list-request");
                navigate("/admin-viewer");
                return;
            case "create-request":
                setCurrentTab("create-request");
                return;
            case "statistics":
                setCurrentTab("statistics");
                return;
        }
    };

    return (
        <div className={"service-form-Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <Navbar/> {/* NavBlue css fixes this to the left */}
            <div className={"service-form-BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"service-form-TwoColumns"}>
                    <div className={"service-form-ThreeRows"}
                         style={{gridTemplateRows: (currentTab === "list-request" ? '6% 92% 30%' : '6% 50% 40%')}}>
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
                            <div className={"service-form-midcard"}>
                                <div className={"pie-chart-stats"}>
                                    <PieChartStats/>
                                </div>
                            </div>
                        )}

                        {/*If current tab is the create request tab*/}
                        {currentTab === "create-request" && (
                            <div className={"service-form-midcard"}>
                                <header className={"create-service-header"}
                                        style={{fontFamily: 'Lato'}}>
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
                                               }}
                                               startIcon={<MedicationIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px', fontFamily: 'Lato'}}>
                                    Medicine Request
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
                                               }}
                                               startIcon={<WarningAmberIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px', fontFamily: 'Lato'}}>
                                    Maintenance Request
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
                                               }}
                                               startIcon={<CompareArrowsIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px', fontFamily: 'Lato'}}>
                                    Internal Transport Request
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
                                               }}
                                               startIcon={<TranslateIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px', fontFamily: 'Lato'}}>
                                    Language Request
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
                                               }}
                                               startIcon={<SanitizerIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Sanitation Request
                                </RequestButton>
                                <RequestButton variant="contained"
                                               startIcon={<GokuIcon style={{fontSize: '6vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Goku Request
                                </RequestButton>
                            </div>
                        )}

                        {/*If current tab is the List request tab*/}
                        {currentTab === "list-request" && (
                            <div className={"service-form-ReqList"}>
                                <ServiceRequestTable/>
                            </div>
                        )}

                        <div className={"service-form-TwoColumnsThirdRow"}>
                            <div className={"service-form-ChartCard"}>
                                <BarChart/>
                            </div>
                            <div className={"service-form-ChartCard"}>
                                <StackedBarChart/>
                            </div>
                        </div>
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
                                <p style={{fontSize: '150%', fontWeight: 600}}>
                                    {{
                                        'sanitation': "Sanitation",
                                        'medicine': "Medicine",
                                        'maintenance': "Maintenance",
                                        'transport': "Internal Transport",
                                        'language': "Language"
                                    }[requestType]  + " Request"}
                                </p>
                                <div className={"modal-div"}>
                                    <div>
                                        <Autocomplete
                                            style={{width: window.innerWidth * 0.38}}
                                            disablePortal
                                            options={currNodes.map(({nodeID, longName}): NodeType => (
                                                {label: longName, nid: nodeID}
                                            ))}
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
                                    <div>
                                        {renderServiceRequestComponent()}
                                    </div>
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
                                    </div>
                                    <p>
                                        Created by {" "}
                                        {{
                                            'sanitation': "Rodrick",
                                            'medicine': "Rodrick and Piotr",
                                            'maintenance': "Kenny",
                                            'transport': "Katy and Cameron",
                                            'language': "Katie and Hien"
                                        }[requestType]}
                                    </p>
                                    <div className="top-space">
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
                                </div>
                            </Box>
                        </Modal>
                    )}
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
                    </Snackbar>
                </div>
            </div>
        </div>
    );

}
