import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";

export default function LoginPage() {
  const navigate = useNavigate();

  function homePage() {
    navigate("/home");
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
          <div className={"login-butn"}>
            <input
              type="submit"
              value="Log In"
              name="login"
              onClick={homePage}
            />
            <br />
          </div>
          <div className={"create-butn"}>
            <input
              type="button"
              value="Forgot Password?"
              onClick={forgotPass}
            />
            <br />
            <input type="button" value="Create Account" onClick={createAcc} />
          </div>
        </form>
        <Outlet />
      </body>
    </div>
  );
}
/*end*/
