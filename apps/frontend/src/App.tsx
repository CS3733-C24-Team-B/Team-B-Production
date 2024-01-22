import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ExampleRoute from "./routes/ExampleRoute.tsx";
import "./App.css";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <Root />,
      children: [
        {
          path: "",
          element: <ExampleRoute />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
  function Root() {
    return (
      <div className="w-100 h-100 d-flex flex-column overflow-auto">
        <header className="App-header">Login</header>
        <form>
          <label htmlFor="email">Email:</label>
          <br />
          <input type="text" id="email" name="email" />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input type="text" id="password" name="password" />
          <br />
        </form>
        <Outlet />
      </div>
    );
  }
}

export default App;
