import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/serviceform_page.css";
import axios from "axios";
import {NewRequest} from "common/src/serviceRequestTypes.ts";
import Navbar from "../components/Navbar.tsx";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SanitationRequest from "../components/SanitationRequest.tsx";
import MedicineRequest from "../components/MedicineRequest.tsx";
import MaintenanceRequest from "../components/MaintenanceRequest.tsx";
import InternalTransportationRequest from "../components/InternalTransportRequest.tsx";
import LanguageRequest from "../components/LanguageRequest.tsx";
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TranslateIcon from '@mui/icons-material/Translate';
import RequestCarousel from '../components/RequestCarousel.tsx';
import Box from "@mui/material/Box";

export default function RequestForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [infoText, setInfoText] = useState("");
    const [requestType, setRequestType] = useState("");

    const [sanPressed, setSanPressed] = useState(false);
    const [medPressed, setMedPressed] = useState(false);
    const [mainPressed, setMainPressed] = useState(false);
    const [transPressed, setTransPressed] = useState(false);
    const [langPressed, setLangPressed] = useState(false);


    async function submit() {
        const requestSent: NewRequest = {
            name: name,
            roomNumber: parseInt(roomNumber),
            infoText: infoText
        };
        const res = await axios.post("/api/service-request", requestSent, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status == 200) {
            console.log("success");
        }
        navigate("/requestlist");
    }

    // Function to render the appropriate service request component based on the selected request type
    const renderServiceRequestComponent = () => {
        switch (requestType) {
            case "sanitation":
                return <SanitationRequest/>;
            case "medicine":
                return <MedicineRequest/>;
            case "maintenance":
                return <MaintenanceRequest/>;
            case "transport":
                return <InternalTransportationRequest/>;
            case "language":
                return <LanguageRequest/>;
            // Add cases for other service request types
            default:
                return null;
        }
    };

    return (
        <div className={"home-container"}>
            <div>
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
                                <SanitizerIcon sx={{ fontSize: '10vw', color: 'white', position: 'absolute', top: '15%', left: '55%', transform: 'translateX(-50%)' }} />
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{ mt: 'auto', pb: 2 }}>
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
                                <MedicationIcon sx={{ fontSize: '10vw', color: 'white', position: 'absolute',
                                    top: '15%', left: '50%', transform: 'translateX(-50%)' }} />
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{ mt: 'auto', pb: 2 }}>
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
                                    sx={{ fontSize: '10vw', color: 'white', position: 'absolute',
                                    top: '15%', left: '50%', transform: 'translateX(-50%)' }} />
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{ mt: 'auto', pb: 2 }}>
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
                                <CompareArrowsIcon sx={{ fontSize: '10vw', color: 'white', position: 'absolute',
                                    top: '15%', left: '50%', transform: 'translateX(-50%)' }} />
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{ mt: 'auto', pb: 2 }}>
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
                                    sx={{ fontSize: '10vw', color: 'white', position: 'absolute',
                                    top: '15%', left: '50%', transform: 'translateX(-50%)' }} />
                                {/* Text positioned at the bottom within the button */}
                                <Box sx={{ mt: 'auto', pb: 2 }}>
                                    Language Request
                                </Box>
                            </Button>
                        </div>
                    </RequestCarousel>
                </div>

                <div className="form-container">
                    {/* Render the form contents only if a service request type is selected */}
                    {requestType && (
                        <>
                            <div className="input-field">
                                <TextField
                                    id="standard-basic"
                                    label="Name"
                                    variant="standard"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <TextField
                                    id="standard-basic"
                                    label="Room Number"
                                    variant="standard"
                                    type="number"
                                    value={roomNumber}
                                    onChange={(e) => setRoomNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <TextField
                                    id="standard-basic"
                                    label="Request Details"
                                    variant="standard"
                                    type="text"
                                    value={infoText}
                                    onChange={(e) => setInfoText(e.target.value)}
                                    required
                                />
                            </div>
                            {/* Render the appropriate service request component */}
                            {renderServiceRequestComponent()}
                            <br/>
                            <div>
                                <Button
                                    style={{
                                        backgroundColor: "#012D5A",
                                    }}
                                    variant="contained"
                                    onClick={submit}
                                >
                                    Submit Request
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
