import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../index.css";
import SideButtons from "./SideButtons.tsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const [reqName, setReqName] = useState("");
    const [room, setRoom] = useState("");
    const [addInfo, setAddInfo] = useState("");

    function homePage() {
        navigate("/home");
    }

    return (
        <div className="App">
            <body className="body">
            <header className="App-header">Service Request Form</header>
            <br />
            <form>
                <label htmlFor="reqName">Name of Requester:</label>
                <br/>
                <input
                    type="text"
                    id="reqName"
                    name="reqName"
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                />
                <br/>
                <label htmlFor="password">Room:</label>
                <br/>
                <input
                    type="text"
                    id="room"
                    name="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <br/>
                <label htmlFor="addInfo">Additional Info (optional):</label>
                <br/>
                <textarea
                    id="addInfo"
                    name="addInfo"
                    value={addInfo}
                    onChange={(e) => setAddInfo(e.target.value)}
                />
                <div className="login-butn">
                    <input
                        type="button"
                        value="Submit Form"
                        name="submit"
                        onClick={homePage}
                    />
                </div>
            </form>
            <Outlet/>
            </body>
            <SideButtons/>
        </div>
    );
}
