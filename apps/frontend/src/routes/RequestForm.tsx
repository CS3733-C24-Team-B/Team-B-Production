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
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';

export default function RequestForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [infoText, setInfoText] = useState("");
    const [requestType, setRequestType] = useState("");

    const [sanPressed, setSanPressed] = useState(false);
    const [medPressed, setMedPressed] = useState(false);

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
                    <h2>Create Service Request</h2>
                </div>
                <div className="button-container">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            if (requestType === "sanitation") {
                                setRequestType("");
                            } else {
                                setRequestType("sanitation");
                            }

                            setSanPressed(!sanPressed);
                            /*bruh*/
                            setMedPressed(false);
                        }}
                        className={requestType === "sanitation" ? "selected" : ""}
                        sx={{height: '15vh'}}
                        style={{backgroundColor: sanPressed ? "lightcyan" : "white"}}
                        startIcon={<SanitizerIcon/>}
                    >
                        Sanitization Request
                    </Button>
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
                        }}
                        className={requestType === "medicine" ? "selected" : ""}
                        sx={{height: '15vh'}}
                        style={{backgroundColor: medPressed ? "lightgreen" : "white"}}
                        startIcon={<MedicationIcon/>}
                    >
                        Medicine Delivery
                    </Button>
                    {/* Add more buttons for other service request types */}
                </div>
                <div className="form-container">
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
                </div>
            </div>
        </div>
    );
}
