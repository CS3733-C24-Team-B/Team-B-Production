import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import "./index.css";
import HomePage from "./components/HomePage.tsx";
import CreateAccount from "./components/CreateAccount.tsx";
import ForgotPassword from "./components/ForgotPassword.tsx";
import Settings from "./components/Settings.tsx";
import CSVNodeData from "./components/CSVNodeData.tsx";
import CSVEdgeData from "./components/CSVEdgeData.tsx";
import SRList from "./components/SRLists.tsx";
import RequestForm from "./components/RequestForm.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <div/>,
            element: <LoginPage/>,
        },
        {
            path: "/home",
            errorElement: <div/>,
            element: <HomePage/>,
        },
        {
            path: "/createacc",
            errorElement: <div/>,
            element: <CreateAccount/>,
        },
        {
            path: "/forgotpass",
            errorElement: <div/>,
            element: <ForgotPassword/>,
        },
        {
            path: "/settings",
            errorElement: <div/>,
            element: <Settings/>,
        },
        {
            path: "/csvnodedata",
            errorElement: <div/>,
            element: <CSVNodeData/>,
        },
        {
            path: "/csvedgedata",
            errorElement: <div/>,
            element: <CSVEdgeData/>,
        },
        {
            path: "/requestForm",
            errorElement: <div />,
            element: <RequestForm />,
        },
        {
            path: "/servicerequestlist",
            errorElement: <div/>,
            element: <SRList/>,
        },
    ]);

    return <RouterProvider router={router}/>;
}

export default App;
