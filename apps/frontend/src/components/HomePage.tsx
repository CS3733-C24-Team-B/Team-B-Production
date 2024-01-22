import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
//import ExampleRoute from "./routes/ExampleRoute.tsx";
import "../index.css";
function HomePage() {
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
        <header className="App-header">Welcome to Home Page :D</header>
        <Outlet />
      </div>
    );
  }
}

export default HomePage;
