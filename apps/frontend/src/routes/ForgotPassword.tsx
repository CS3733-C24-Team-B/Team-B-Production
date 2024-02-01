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
      <header className="App-header">So you forgot your password</header>
      <br />
      <form>
        <label htmlFor="email">Email:</label>
        <br />
        <input type="email" id="email" name="email" />
        <br />
        <label className="Small-label">
          You will get an email with instructions on how to reset your password
        </label>
        <br />
        <br />
        <input type="button" value="Get Instructions" onClick={handleClick} />
      </form>
      <Outlet />
    </div>
  );
}
