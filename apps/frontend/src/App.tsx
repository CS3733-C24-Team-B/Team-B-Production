import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import "./index.css";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
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
