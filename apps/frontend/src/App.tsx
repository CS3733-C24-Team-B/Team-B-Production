import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import "./index.css";
import HomePage from "./components/HomePage.tsx";
import CreateAccount from "./components/CreateAccount.tsx";
import ForgotPassword from "./components/ForgotPassword.tsx";
import Settings from "./components/Settings.tsx";
import CSVData from "./components/CSVData.tsx";
import RequestForm from "./components/RequestForm.tsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <LoginPage />,
    },
    {
      path: "/home",
      errorElement: <div />,
      element: <HomePage />,
    },
    {
      path: "/createacc",
      errorElement: <div />,
      element: <CreateAccount />,
    },
    {
      path: "/forgotpass",
      errorElement: <div />,
      element: <ForgotPassword />,
    },
    {
      path: "/settings",
      errorElement: <div />,
      element: <Settings />,
    },
      {
          path: "/csvdata",
          errorElement: <div />,
          element: <CSVData />,
      },
      {
          path: "/requestForm",
          errorElement: <div />,
          element: <RequestForm />,
      },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
