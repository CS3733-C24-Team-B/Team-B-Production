import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";

export default function LoginPage() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/");
  }

  return (
    <div className="App">
      <header className="App-header">Create New Account</header>
      <br />
      <form>
        <label htmlFor="email">Email:</label>
        <br />
        <input type="email" id="email" name="email" />
        <br />
        <label htmlFor="password">Choose Password:</label>
        <br />
        <input type="password" id="password" name="password" />
        <br />
        <label htmlFor="password">Retype Password:</label>
        <br />
        <input type="password" id="password" name="password" />
        <br />
        <br />
        <input type="button" value="Create Account" onClick={handleClick} />
      </form>
      <Outlet />
    </div>
  );
}
