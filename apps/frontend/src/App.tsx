import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "./App.css";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <Root />,
      // children: [
      //   {
      //     path: "",
      //     element: <ExampleRoute />,
      //   },
      // ],
    },
  ]);

  return <RouterProvider router={router} />;
  function Root() {
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
          <input type="submit" value="Log In" />
          <br />
          <input type="button" value="Forgot Password?" />
          <br />
          <input type="button" value="Create Account" />
        </form>
        <Outlet />
      </div>
    );
  }
}

export default App;
