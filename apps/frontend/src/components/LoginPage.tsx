import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  { useState } from 'react';
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function homePage() {
        if (username === "admin" && password === "password") {
            navigate("/home");
        } else {
            setErrorMessage("Incorrect username or password. Please try again.");
        }
    }

    function createAcc() {
        navigate("/createacc");
    }

    function forgotPass() {
        navigate("/forgotpass");
    }

    return (
        <div className="App">
            <body className="body">
            <header className="App-header">Login</header>
            <br />
            <form>
                <label htmlFor="username">Username:</label>
                <br />
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <label htmlFor="password">Password:</label>
                <br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <label className="Small-label" htmlFor="remember">
                    Remember me:
                </label>
                <input type="checkbox" id="remember" name="remember" />
                <br />
                <input
                    type="button"
                    value="Log In"
                    name="login"
                    onClick={homePage}
                />
                <br />
                <p style={{ color: "red" }}>{errorMessage}</p>
                <input
                    type="button"
                    value="Forgot Password?"
                    onClick={forgotPass}
                />
                <br />
                <input
                    type="button"
                    value="Create Account"
                    onClick={createAcc}
                />
            </form>
            <Outlet />
            </body>
        </div>
    );
}
