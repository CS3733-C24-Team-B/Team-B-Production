import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";

export default function ServiceRequestForm() {
    const navigate = useNavigate();

    function handleClick() {
        navigate("/home");
    }

    return (
        <div className="App">
            <header className="App-header">Service Request Form</header>
            <br />
            <form>
                <label htmlFor="email">Change Email:</label>
                <br />
                <input type="email" id="email" name="email" />
                <br />
                <label htmlFor="password">Change Password:</label>
                <br />
                <input type="password" id="password" name="password" />
                <br />
                <label htmlFor="password">Retype Password:</label>
                <br />
                <input type="password" id="password" name="password" />
                <br />
                <br />
                <input type="button" value="Return to Home" onClick={handleClick} />
            </form>
            <Outlet />
        </div>
    );
}
