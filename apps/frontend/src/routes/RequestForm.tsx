import React, {useState, useEffect} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import TempNavbar from "../components/TempNavbar.tsx";
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
import {createSvgIcon} from '@mui/material/utils';
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

// Goku icon, probably should not be used in the actual build lmao //
const GokuIcon = createSvgIcon(
    // credit: Created by eric from the Noun Project - https://thenounproject.com/icon/goku-58041/
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
         viewBox="0 0 100 125" enable-background="new 0 0 100 100" xmlSpace="preserve">
        <path fill="#000000" d="M74.902,65.634l20.051-11.192l-14.17-0.853l8.146-7.297l-18.137,1.417c0,0-0.389-2.868-4.109-6.589
        c-2.267-2.267-7.367-3.755-7.367-3.755s0.726-9.244-4.446-17.463c-3.274-4.287-10.007-5.421-16.737-7.263
        c5.172,14.736,3.259,20.546,3.259,20.546s-7.439-8.29-15.799-9.565c-4.887-0.284-15.09,5.101-20.564,8.714
        c19.36,10.06,21.486,20.191,21.486,20.191c-7.156,0.637-19.696,8.076-19.696,8.076c15.444,2.976,20.617,6.659,20.617,6.659
         l-8.572,4.96l17.335,1.739c-1.01-0.729-3.214-3.383-3.66-4.894c-0.468-1.586-0.282-6.684,1.31-6.996
         c0.827-0.163,1.418,0.222,1.766,0.74c-0.035-0.367-0.05-0.729-0.05-1.088c0-7.582,7.298-12.98,14.864-12.98
         c7.922,0,17.327,2.781,16.588,10.932c0.348-0.52-0.838,2.232-0.01,2.396c1.59,0.313,1.776,5.41,1.309,6.996
         c-0.471,1.586-2.889,4.455-3.815,5.011c-0.44,0.26-0.763,0.313-0.981,0.297c-0.13,0.561-0.267,1.044-0.408,1.447l11.791-0.41
         l-5.454-2.621l15.303-4.535L74.902,65.634z"/>
        <path fill="#000000"
              d="M50.73,85.646c-0.146,0-0.251-0.004-0.304-0.006c-0.052,0.002-0.158,0.006-0.305,0.006
              c-0.876,0-2.528-0.104-3.751-0.781c-3.847-2.137-8.516-7.17-8.997-8.082c-0.214-0.406-0.416-0.986-0.615-1.764
              c-0.247-0.064-0.504-0.179-0.768-0.332c-1.075-0.642-3.618-3.677-4.134-5.418c-0.4-1.357-0.409-5.224,0.635-6.947
              c0.323-0.531,0.732-0.852,1.217-0.947c0.401-0.078,0.793-0.064,1.148,0.035c0.093-3.656,1.806-7.043,4.848-9.564
              c2.919-2.422,6.827-3.811,10.722-3.811c6.642,0,12.284,1.837,15.095,4.913c1.621,1.772,2.369,3.934,2.228,6.424
              c0.089,0.231,0.021,0.476-0.075,0.823c-0.168,0.604-0.255,1.025-0.263,1.259c0.368,0.146,0.687,0.438,0.948,0.869
              c1.043,1.721,1.035,5.59,0.637,6.944c-0.516,1.744-3.059,4.779-4.133,5.418c-0.266,0.156-0.522,0.271-0.771,0.334
              c-0.199,0.777-0.4,1.357-0.613,1.763c-0.479,0.911-5.146,5.944-8.998,8.084C53.259,85.542,51.607,85.646,50.73,85.646z
              M50.428,84.223l0.035,0.002c0.009,0,0.105,0.004,0.268,0.004c0.465,0,2.058-0.043,3.062-0.603c3.664-2.035,8.068-6.834,8.432-7.504
              c0.135-0.256,0.349-0.795,0.605-1.906l0.136-0.59l0.624,0.043c0.062,0,0.241-0.021,0.549-0.203c0.752-0.446,3.077-3.176,3.498-4.6
              c0.355-1.205,0.245-4.599-0.49-5.812c-0.117-0.197-0.224-0.281-0.275-0.289c-0.282-0.057-0.523-0.225-0.676-0.471
              c-0.014-0.021-0.025-0.043-0.037-0.066l-0.096,0.144l0.026-0.297c-0.204-0.568-0.03-1.353,0.196-2.177l0.025-0.289
              c0.203-2.233-0.414-4.153-1.834-5.707c-2.547-2.788-7.799-4.452-14.05-4.452c-3.57,0-7.148,1.271-9.817,3.483
              c-2.798,2.32-4.339,5.443-4.339,8.789c0,0.346,0.016,0.688,0.047,1.021l0.258,2.779l-1.552-2.318
              c-0.255-0.381-0.601-0.527-1.04-0.439c-0.054,0.01-0.158,0.092-0.278,0.289c-0.735,1.215-0.845,4.605-0.488,5.812
              c0.421,1.424,2.745,4.151,3.499,4.602c0.307,0.183,0.484,0.201,0.547,0.201h0.018l0.605-0.045l0.137,0.592
              c0.257,1.111,0.471,1.65,0.605,1.906c0.362,0.67,4.77,5.471,8.432,7.504c1.006,0.56,2.599,0.603,3.062,0.603
              c0.162,0,0.261-0.004,0.27-0.004L50.428,84.223z"/>
        <path fill="#000000"
              d="M33.033,61.948l4.038,4.604l-0.426-3.684l3.33,3.117c0,0-0.708-4.252,0.142-6.637
              c1.087-2.314,3.897-3.638,3.897-3.638s-0.328,8.358,0.354,11.902c2.221-4.275,8.998-12.398,12.683-13.816
              c1.062,4.369-0.425,11.24-1.062,14.522c3.261-3.493,7.511-10.247,7.723-11.688c0,0,0.491,0.252,0.708,0.779
               c0.372,0.903-0.991,5.881-1.698,7.864c0.99-0.592,2.905-2.055,2.905-2.055l-1.772,3.754c0,0,4.746-3.094,5.242-3.896
               c1.016-1.438,2.977-12.47,2.977-12.47l-30.039-6.73l-11.194,8.432L33.033,61.948z"/>
        {/*<text x="0" y="115" fill="#000000" font-size="5px" font-weight="bold"*/}
        {/*      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by eric*/}
        {/*    steltenpohl</text>*/}
        {/*<text x="0" y="120" fill="#000000" font-size="5px" font-weight="bold"*/}
        {/*      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun*/}
        {/*    Project</text>*/}
    </svg>,
    'Goku',
);

const RequestButton = styled(Button)(() => ({
    fontSize: '2.5vh',
    width: '48%',
    height: '28%',
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
    width: '43%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
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
                                    height: '5.5vh',
                                    color: currentTab === 'statistics' ? 'black' : 'black',
                                    borderBottom: currentTab === 'statistics' ? '5px solid #34AD84' : '',
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
                                    height: '5vh',
                                    color: currentTab === 'create-request' ? 'black' : 'black',
                                    borderBottom: currentTab === 'create-request' ? '5px solid #34AD84' : '',
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
                                    height: '5vh',
                                    color: currentTab === 'list-request' ? 'black' : 'black',
                                    borderBottom: currentTab === 'list-request' ? '5px solid #34AD84' : '',
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
                        >
                            <Box sx={modalStyle}>
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
                                <div className="top-space">
                                    <Button
                                        style={{
                                            backgroundColor: "#012D5A",
                                            width: 220
                                        }}
                                        variant="contained"
                                        onClick={submit}
                                    >
                                        Submit Request
                                    </Button>
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
