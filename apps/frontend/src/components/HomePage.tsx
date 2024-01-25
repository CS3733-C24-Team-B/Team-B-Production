import React from "react";
import { Outlet } from "react-router-dom";
import "../index.css";
import firstfloor from "../images/00_thegroundfloor.png";
import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";

export default function HomePage() {
  return (
    <body>
      <div className="App">
        <header className="App-header">
          <div className="title">Welcome to Home Page</div>
          <div className="logo">
            <img src={logo} alt="Hospital Logo" />
          </div>
        </header>
        <div className="navbar">
          <div className="navbar-butn">
            <a href="/home">Home</a>
          </div>
          <div className="navbar-butn">
            <a href="/settings">Settings</a>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Profile</button>
            <div className="dropdown-content">
              <a href="/home">View Profile</a>
              <a href="/settings">Settings</a>
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
