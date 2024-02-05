import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import HomePage from "./routes/HomePage.tsx";
import Settings from "./routes/Settings.tsx";
import CSVNodeData from "./routes/CSVNodeData.tsx";
import CSVEdgeData from "./routes/CSVEdgeData.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";
import Profile from "./components/Profile.tsx";
import LoginButton from "./components/LoginButton.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <div/>,
            element: <HomePage/>,
        },
        {
            path: "/login",
            errorElement: <div><p>An error has occurred</p></div>,
            element: <LoginButton/>
        },
        {
            path: "/profile",
            errorElement: <div><p>An error has occurred</p></div>,
            element: <Profile/>
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
