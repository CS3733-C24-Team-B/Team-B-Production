import React from "react";
import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";
import firstfloor from "../images/00_thegroundfloor.png";
//import 01_thefirstfloor from ./01_thefirstfloor.png

export default function HomePage() {
  return (
    <body>
      <div className="App">
        <header className="App-header">Welcome to Home Page :D</header>
        <img src={firstfloor} alt="first floor" width="400" height="300" />

        <Outlet />
      </div>
    </body>
  );
}
