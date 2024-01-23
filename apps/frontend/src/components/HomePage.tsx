import React from "react";
import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";

export default function HomePage() {
  return (
    <div className="App">
      <header className="App-header">Welcome to Home Page :D</header>
      <Outlet />
    </div>
  );
}
