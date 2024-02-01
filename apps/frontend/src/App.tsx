import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "./routes/LoginPage.tsx";
import "./index.css";
import HomePage from "./routes/HomePage.tsx";
import CreateAccount from "./routes/CreateAccount.tsx";
import ForgotPassword from "./routes/ForgotPassword.tsx";
import Settings from "./routes/Settings.tsx";
import CSVNodeData from "./routes/CSVNodeData.tsx";
import CSVEdgeData from "./routes/CSVEdgeData.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";

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
            path: "/requestform",
            errorElement: <div />,
            element: <RequestForm />,
        },
        {
            path: "/requestlist",
            errorElement: <div/>,
            element: <RequestList/>,
        },
    ]);

    return <RouterProvider router={router}/>;
}

export default App;
