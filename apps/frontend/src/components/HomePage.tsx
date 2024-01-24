import React from "react";
import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";
import firstfloor from "../images/00_thegroundfloor.png";
import logo from "../images/bwh-logo.svg";
//import 01_thefirstfloor from ./01_thefirstfloor.png

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
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/">Login</a>
          </li>
          <li>
            <a href="/forgotpass">Settings</a>
          </li>
        </ul>
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
