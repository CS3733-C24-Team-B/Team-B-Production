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
          Welcome to Home Page
          <div className="logo">
            <img src={logo} alt="Hospital Logo" />
          </div>
        </header>
        <div className="navbar">
          <div className="navbar-butn">
            <a href="/home">Home</a>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Profile</button>
            <div className="dropdown-content">
              <a href="/home">View Profile</a>
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
              />
              <a href="/settings">
                <div className="fa fa-gear fa-spin"></div>
                Settings
              </a>
              <a href="/">Log Out</a>
            </div>
          </div>
        </div>
        <div id="map-container">
          <img src={firstfloor} alt="first floor" id="map-image" />
        </div>

        <Outlet />
      </div>
    </body>
  );
}
