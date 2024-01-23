import React from "react";
import { Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";

export default function LoginPage() {
  return (
    <div className="App">
      <header className="App-header">Login</header>
      <br />
      <form>
        <label htmlFor="email">Email:</label>
        <br />
        <input type="email" id="email" name="email" />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input type="password" id="password" name="password" />
        <br />
        <label className="Small-label" htmlFor="remember">
          Remember me:
        </label>
        <input type="checkbox" id="remember" name="remember" />
        <br />
        <input type="submit" value="Log In" name="login" />
        <br />
        <input type="button" value="Forgot Password?" />
        <br />
        <input type="button" value="Create Account" />
      </form>
      <Outlet />
    </div>
  );
}
