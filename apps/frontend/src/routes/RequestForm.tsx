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
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RequestCarousel from '../components/RequestCarousel.tsx';

export default function RequestForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [infoText, setInfoText] = useState("");
    const [requestType, setRequestType] = useState("");

    const [sanPressed, setSanPressed] = useState(false);
    const [medPressed, setMedPressed] = useState(false);
    const [mainPressed, setMainPressed] = useState(false);

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
            // Add cases for other service request types
            default:
                return null;
        }
    };

    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="service-form-container">
                <div className="header-container">
                    <h1>Create Service Request</h1>
                </div>

                <div className="button-container">
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
                                }}
                                className={requestType === "sanitation" ? "selected" : ""}
                                sx={{left: '20%', width: '20vw', height: '50vh', boxShadow: '4'}}
                                style={{backgroundColor: sanPressed ? "lightcyan" : "white"}}
                                startIcon={<SanitizerIcon/>}
                            >
                                Sanitization Request
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
                                }}
                                className={requestType === "medicine" ? "selected" : ""}
                                sx={{left: '20%', width: '20vw', height: '50vh', boxShadow: '4'}}
                                style={{backgroundColor: medPressed ? "lightgreen" : "white"}}
                                startIcon={<MedicationIcon/>}
                            >
                                Medicine Delivery
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
                                }}
                                className={requestType === "maintenance" ? "selected" : ""}
                                sx={{left: '20%', width: '20vw', height: '50vh', boxShadow: '4'}}
                                style={{backgroundColor: mainPressed ? "lightcyan" : "white"}}
                                startIcon={<WarningAmberIcon/>}
                            >
                                Maintenance Request
                            </Button>
                        </div>
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
                                }}
                                className={requestType === "medicine" ? "selected" : ""}
                                sx={{left: '20%', width: '20vw', height: '50vh', boxShadow: '4'}}
                                style={{backgroundColor: medPressed ? "lightgreen" : "white"}}
                                startIcon={<MedicationIcon/>}
                            >
                                Medicine Delivery <br/>
                                (duplicate)
                            </Button>
                        </div>
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
                                }}
                                className={requestType === "sanitation" ? "selected" : ""}
                                sx={{left: '20%', width: '20vw', height: '50vh', boxShadow: '4'}}
                                style={{backgroundColor: sanPressed ? "lightcyan" : "white"}}
                                startIcon={<SanitizerIcon/>}
                            >
                                Sanitization Request (2nd duplicate)
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
