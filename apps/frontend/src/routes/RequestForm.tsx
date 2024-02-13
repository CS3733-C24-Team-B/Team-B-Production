import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/serviceform_page.css";
import axios from "axios";
import {NewRequest} from "common/src/serviceRequestTypes.ts";
import Navbar from "../components/Navbar.tsx";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


export default function LoginPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [infoText, setInfoText] = useState("");

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

    return (
        <div className={"home-container"}>
            <div>
                <Navbar/>
            </div>
            <div className="service-form-container">
                <div className="container">
                    <h2>Create Service Request</h2>


                    {/*THis labels the Name of the emplyee to do the work*/}
                    <div className="input-field">
                        <TextField id="standard-basic" label="Name" variant="standard"
                                   value={name} onChange={(e) => {
                            setName(e.target.value);
                        }} type="text" required
                        />
                    </div>

                    {/*This lables the room number*/}
                    <div className="input-field">
                        <TextField id="standard-basic" label="Room Number" variant="standard"
                                   type="number"
                                   value={roomNumber}
                                   onChange={(e) => setRoomNumber(e.target.value)}
                                   required
                        />
                    </div>

                    {/*This lables the room number*/}
                    <div className="input-field">
                        <TextField id="standard-basic" label="Request Details" variant="standard"
                                   type="text" value={infoText} onChange={(e => {
                            setInfoText(e.target.value);
                        })} required
                        />
                    </div>
                    <br/>

                    <div>
                        <Button
                            style={{
                                backgroundColor: "#012D5A",
                            }}
                            variant="contained" onClick={submit}> Submit Request </Button>
                        {/*<button onClick={submit}>Submit Request</button>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}
