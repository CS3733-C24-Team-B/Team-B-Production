import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import HomePage from "./routes/NavigationPage.tsx";
import CSVNodeData from "./routes/CSVNodeData.tsx";
import CSVEdgeData from "./routes/CSVEdgeData.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";
import ProfilePage from "./routes/ProfilePage.tsx";
import AdminViewer from "./routes/AdminViewer.tsx";
import SettingsPage from "./routes/SettingsPage.tsx";

import OldHomePage from "./routes/OldHomePage.tsx";
import OldCSVNodeData from "./routes/OldCSVNodeData.tsx";
import OldCSVEdgeData from "./routes/OldCSVEdgeData.tsx";
import OldRequestList from "./routes/OldRequestList.tsx";
import OldRequestForm from "./routes/OldRequestForm.tsx";
import OldProfilePage from "./routes/OldProfilePage.tsx";
import OldAdminViewer from "./routes/OldAdminViewer.tsx";
import OldSettingsPage from "./routes/OldSettingsPage.tsx";

import NewUITemplete from "./components/NewUITemplete.tsx";
import AboutPage from "./routes/AboutPage.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <div/>,
            element: <HomePage/>,
        },
        {
            path: "/home",
            errorElement: <div/>,
            element: <HomePage/>,
        },
        {
            path: "/old-home",
            errorElement: <div/>,
            element: <OldHomePage/>,
        },
        {
            path: "/csvnodedata",
            errorElement: <div/>,
            element: <CSVNodeData/>,
        },
        {
            path: "/old-csvnodedata",
            errorElement: <div/>,
            element: <OldCSVNodeData/>,
        },
        {
            path: "/csvedgedata",
            errorElement: <div/>,
            element: <CSVEdgeData/>,
        },
        {
            path: "/old-csvedgedata",
            errorElement: <div/>,
            element: <OldCSVEdgeData/>,
        },
        {
            path: "/requestform",
            errorElement: <div />,
            element: <RequestForm />,
        },
        {
            path: "/old-requestform",
            errorElement: <div />,
            element: <OldRequestForm />,
        },
        {
            path: "/requestlist",
            errorElement: <div/>,
            element: <RequestList/>,
        },
        {
            path: "/old-requestlist",
            errorElement: <div/>,
            element: <OldRequestList/>,
        },
        {
            path: "/profile-info",
            errorElement: <div/>,
            element: <ProfilePage/>,
        },
        {
            path: "/old-profile-info",
            errorElement: <div/>,
            element: <OldProfilePage/>,
        },
        {
            path: "/admin-viewer",
            errorElement: <div/>,
            element: <AdminViewer/>
        },
        {
            path: "/old-admin-viewer",
            errorElement: <div/>,
            element: <OldAdminViewer/>
        },
        {
            path: "/settings",
            errorElement: <div/>,
            element: <SettingsPage/>
        },

        {
            path: "/old-settings",
            errorElement: <div/>,
            element: <OldSettingsPage/>
        },
        {
            path: "/newUI",
            errorElement: <div/>,
            element: <NewUITemplete/>
        },
        {
            path: "/about-us",
            errorElement: <div/>,
            element: <AboutPage/>
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;
