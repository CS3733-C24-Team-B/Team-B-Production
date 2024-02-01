/* eslint-disable */
import React, {useState} from "react";
import {Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "../css/serviceform_page.css";


export default function LoginPage() {
    const navigate = useNavigate();
    const [roomNumber, setRoomNumber] = useState("");

    function homePage() {
        navigate("/home");
    }

    return (
        <div className="service-form-container">
            <div className="container">
                <form action="/api/service-request" method="POST">
                    <h2>Service Request Form</h2>
                    <div className="input-field">
                        <input type="text" required/>
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
                        <input type="text" required/>
                        <label>Enter request</label>
                    </div>
                    <br/>
                    <button type="submit">Submit Request</button>
                </form>
            </div>
        </div>
    );
}


