import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import "./index.css";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <LoginPage />,
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
