import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "../css/serviceform_page.css";
import axios from "axios";
import {request} from "common/src/requestType.ts";
// import Navbar from "../components/Navbar.tsx";
import SideButtons from "../components/SideButtons.tsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [infoText, setInfoText] = useState("");

    async function submit(){
        const requestSent:request = {
            name: name,
            roomNumber: parseInt(roomNumber),
            infoText: infoText
        };
        console.log(requestSent);
        const res = await axios.post("/api/service-request", requestSent,{
            headers: {
                "Content-Type":"application/json"
            }
        });
        if(res.status == 200) {
            console.log("success");
        }
        navigate("/servicerequestlist");
    }

    // function clear() {
    //     setName("");
    //     setRoomNumber("");
    //     setInfoText("");
    // };

    return (
        <div className="service-form-container">
            <div className="container">
                <h2>Service Request Form</h2>
                <div className="input-field">
                    <input value = {name} onChange={(e) => {setName(e.target.value);}} type="text" required/>
                    <label>Name</label>
                </div>
                <div className="input-field">
                    <input
                        type="number"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        required
                    />
                    <label>Room Number</label>
                </div>
                <div className="input-field">
                    <input type="text" value = {infoText} onChange={(e => {setInfoText(e.target.value);})} required/>
                    <label>Enter request</label>
                </div>
                <br/>
                <div>
                    <button onClick={submit}>Submit Request</button>
                </div>
            </div>
            <SideButtons/>
        </div>
    );
}
