import React from "react";
import { Outlet } from "react-router-dom";
import "../index.css";
import firstfloor from "../images/00_thegroundfloor.png";
import logo from "../images/bwh-logo.svg";

export default function HomePage() {
  return (
    <body>
      <div className="App">
        <header className="App-header">
          Welcome to Home Page :D
          <img
            src={logo}
            alt="Hospital Logo"
            width="400"
            height="100"
            style={{ position: "absolute", top: "0", left: "50px" }}
          />
        </header>
        <div className="navbar">
          <div className="navbar-butn">
            <a href="/home">Home</a>
          </div>
          <div className="navbar-butn">
            <a href="/">Login</a>
          </div>
          <div className="navbar-butn">
            <a href="/settings">Settings</a>
          </div>
        </div>
        <img
          src={firstfloor}
          alt="first floor"
          width={"1500"}
          height={"1020"}
        />

        <Outlet />
      </div>
    </body>
  );
}
