import React from "react";
import {Outlet} from "react-router-dom";
import "../index.css";
import Navbar from "./Navbar.tsx";

export default function Settings() {
    return (
        <div className="App">
            <header className="App-header">Settings</header>
            <Navbar/>
            <br/>
            <form>
                <label htmlFor="email">Change Email:</label>
                <br/>
                <input type="email" id="email" name="email"/>
                <br/>
                <label htmlFor="password">Change Password:</label>
                <br/>
                <input type="password" id="password" name="password"/>
                <br/>
                <label htmlFor="password">Retype Password:</label>
                <br/>
                <input type="password" id="password" name="password"/>
                <br/>
                <br/>
            </form>
            <Outlet/>
        </div>
    );
}
