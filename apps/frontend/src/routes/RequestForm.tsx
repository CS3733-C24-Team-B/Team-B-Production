import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/serviceform_page.css";
import axios from "axios";
import {
    PriorityType,
    StatusType,
    SanitationRequest,
    MedicineRequest,
    InternalTransportRequest,
    LanguageRequest,
    MaintenanceRequest
} from "common/src/serviceRequestTypes.ts";
import Navbar from "../components/Navbar.tsx";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SanitationReq from "../components/SanitationRequest.tsx";
import MedicineReq from "../components/MedicineRequest.tsx";
import MaintenanceReq from "../components/MaintenanceRequest.tsx";
import InternalTransportationReq from "../components/InternalTransportRequest.tsx";
import LanguageReq from "../components/LanguageRequest.tsx";
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TranslateIcon from '@mui/icons-material/Translate';
import RequestCarousel from '../components/RequestCarousel.tsx';
import {Alert, Autocomplete, FormControl, InputLabel, MenuItem, Snackbar, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useAuth0} from "@auth0/auth0-react";

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
    const {user, isAuthenticated} = useAuth0();
    //const [name, setName] = useState("");
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
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            } catch {
                console.log("post error");
            }
            const res = await axios.get("/api/db-load-nodes");
            const res3 = await axios.get(`/api/employee`);

            setNodeData(res.data);
            setEmployeeData(res3.data);
        }

        fetch().then();
    }, []);

    console.log(isAuthenticated);

    async function submit() {
        if (typeReq === "sanitation") {
            const requestSent: SanitationRequest = {
                createdByID: user!.email!,
                locationID: location,
                notes: infoText,
                priority: PriorityType[prio as keyof typeof PriorityType],
                status: StatusType.Assigned,
                assignedID: assignTo,
                hazards: "Hazards: " + option1
            };
            const res = await axios.post("/api/service-request/sanitation", requestSent, {
                headers: {
                    "Content-Type": "application/json"
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
                medicineType: "Medicine Type: " + option1,
                amount: "Amount: " + option2
            };
            const res = await axios.post("/api/service-request/medicine", requestSent, {
                headers: {
                    "Content-Type": "application/json"
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
                toLocation: "To Location: " + option1,
                patientName: "Patient Name: " + option2,
                mobilityAid: "Mobility Aid: " + option3
            };
            const res = await axios.post("/api/service-request/internal-transport", requestSent, {
                headers: {
                    "Content-Type": "application/json"
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
                language1: "From Language: " + option1,
                language2: "To Language: " + option2,
                when: new Date()
            };
            const res = await axios.post("/api/service-request/language", requestSent, {
                headers: {
                    "Content-Type": "application/json"
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
                details: "Details: " + option1
            };
            const res = await axios.post("/api/service-request/maintenance", requestSent, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status == 200) {
                console.log("success");
                setSubmitAlert(true);
            }
        }
        navigate("/requestlist");
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

    return (
        <div className="home-container">
            <div className={"nav-container"}>
                <Navbar/>
            </div>
            <div className="service-form-container">
                <div className="header-container">
                    <h1>Create Service Request</h1>
                    <br/>
                </div>

                <div className="button-container">
                    <br/><br/>
                    <RequestCarousel>
                        {/*Sanitation Button*/}
                        <div className="carousel-button">
                            <Button
                                variant="outlined"
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
                                className={requestType === "sanitation" ? "selected" : ""}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start', // Ensure the icon is aligned at the top
                                    alignItems: 'center',
                                    height: '50vh',
                                    width: '15vw',
                                    boxShadow: 4,
                                    padding: 1, // Adjust padding as needed
                                    color: '#012d5a', // Sets the text color to dark blue
                                    position: 'relative', // To position the icon absolutely within the button
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Maintain transparency on hover
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {/* Place icon at the top */}
                                <SanitizerIcon sx={{
                                    fontSize: '10vw',
                                    color: 'white',
                                    position: 'absolute',
                                    top: '15%',
                                    left: '55%',
                                    transform: 'translateX(-50%)'
                                }}/>
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{mt: 'auto', pb: 2}}>
                                    Sanitization Request
                                </Box>
                            </Button>
                        </div>

                        {/*Medicine Button*/}
                        <div className="carousel-button">
                            <Button
                                variant="outlined"
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
                                className={requestType === "medicine" ? "selected" : ""}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start', // Ensure the icon is aligned at the top
                                    alignItems: 'center',
                                    height: '50vh',
                                    width: '15vw',
                                    boxShadow: 4,
                                    padding: 1, // Adjust padding as needed
                                    color: '#012d5a', // Sets the text color to dark blue
                                    position: 'relative', // To position the icon absolutely within the button
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Maintain transparency on hover
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {/* Place icon at the top */}
                                <MedicationIcon sx={{
                                    fontSize: '10vw', color: 'white', position: 'absolute',
                                    top: '15%', left: '50%', transform: 'translateX(-50%)'
                                }}/>
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{mt: 'auto', pb: 2}}>
                                    Medicine Delivery
                                </Box>
                            </Button>
                        </div>

                        {/*Maintenance Button*/}
                        <div className="carousel-button">
                            <Button
                                variant="outlined"
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
                                className={requestType === "maintenance" ? "selected" : ""}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start', // Ensure the icon is aligned at the top
                                    alignItems: 'center',
                                    height: '50vh',
                                    width: '15vw',
                                    boxShadow: 4,
                                    padding: 1, // Adjust padding as needed
                                    color: '#012d5a', // Sets the text color to dark blue
                                    position: 'relative', // To position the icon absolutely within the button
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Maintain transparency on hover
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {/* Place icon at the top */}
                                <WarningAmberIcon
                                    sx={{
                                        fontSize: '10vw', color: 'white', position: 'absolute',
                                        top: '15%', left: '50%', transform: 'translateX(-50%)'
                                    }}/>
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{mt: 'auto', pb: 2}}>
                                    Maintenance Request
                                </Box>
                            </Button>
                        </div>

                        {/*Internal Transportation Button*/}
                        <div className="carousel-button">
                            <Button
                                variant="outlined"
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
                                className={requestType === "transport" ? "selected" : ""}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start', // Ensure the icon is aligned at the top
                                    alignItems: 'center',
                                    height: '50vh',
                                    width: '15vw',
                                    boxShadow: 4,
                                    padding: 1, // Adjust padding as needed
                                    color: '#012d5a', // Sets the text color to dark blue
                                    position: 'relative', // To position the icon absolutely within the button
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Maintain transparency on hover
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {/* Place icon at the top */}
                                <CompareArrowsIcon sx={{
                                    fontSize: '10vw', color: 'white', position: 'absolute',
                                    top: '15%', left: '50%', transform: 'translateX(-50%)'
                                }}/>
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{mt: 'auto', pb: 2}}>
                                    Int. Tranportation
                                    Request
                                </Box>
                            </Button>
                        </div>

                        {/*Language Button*/}
                        <div className="carousel-button">
                            <Button
                                variant="outlined"
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
                                className={requestType === "language" ? "selected" : ""}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start', // Ensure the icon is aligned at the top
                                    alignItems: 'center',
                                    height: '50vh',
                                    width: '15vw',
                                    boxShadow: 4,
                                    padding: 1, // Adjust padding as needed
                                    color: '#012d5a', // Sets the text color to dark blue
                                    position: 'relative', // To position the icon absolutely within the button
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Maintain transparency on hover
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {/* Place icon at the top */}
                                <TranslateIcon
                                    sx={{
                                        fontSize: '10vw', color: 'white', position: 'absolute',
                                        top: '15%', left: '50%', transform: 'translateX(-50%)'
                                    }}/>
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{mt: 'auto', pb: 2}}>
                                    Language Request
                                </Box>
                            </Button>
                        </div>
                    </RequestCarousel>
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
                                        options={currNodes.map(({longName}): { label: string } => (
                                            {label: longName}
                                        ))}
                                        size={"small"}
                                        renderInput={(params) =>
                                            <TextField {...params} label="Location" variant="standard"/>}
                                        value={{label: location}}
                                        onChange={(newValue) => {
                                            if (newValue !== null && newValue.target.innerText !== undefined) {
                                                setLocation(newValue.target.innerText);
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
