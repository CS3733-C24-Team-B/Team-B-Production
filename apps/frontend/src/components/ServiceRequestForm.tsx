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
                <input type="button" value="Return to Home" onClick={handleClick} />
            </form>
            <Outlet />
        </div>
    );
}
