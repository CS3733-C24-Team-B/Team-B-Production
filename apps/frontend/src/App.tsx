import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import "./index.css";
import HomePage from "./components/HomePage.tsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      errorElement: <div />,
      element: <LoginPage />,
      // children: [
      //   {
      //     path: "",
      //     element: <LoginPage />,
      //   },
      // ],
    },
    {
      path: "/home",
      errorElement: <div />,
      element: <HomePage />,
      // children: [
      //   {
      //     path: "",
      //     element: <LoginPage />,
      //   },
      // ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
