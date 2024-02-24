import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import HomePage from "./routes/NavigationPage.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";
import ProfilePage from "./routes/TempProfilePage.tsx";
import AdminViewer from "./routes/AdminViewer.tsx";
import SettingsPage from "./routes/SettingsPage.tsx";
import Credits from "./routes/Credits.tsx";
import AboutPage from "./routes/AboutPage.tsx";
import About from "./routes/About.tsx";

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
            path: "/requestform",
            errorElement: <div />,
            element: <RequestForm />,
        },
        {
            path: "/requestlist",
            errorElement: <div/>,
            element: <RequestList/>,
        },
        {
            path: "/profile-info",
            errorElement: <div/>,
            element: <ProfilePage/>,
        },
        {
            path: "/admin-viewer",
            errorElement: <div/>,
            element: <AdminViewer/>
        },
        {
            path: "/settings",
            errorElement: <div/>,
            element: <SettingsPage/>
        },
        {
            path: "/about-us",
            errorElement: <div/>,
            element: <AboutPage/>
        },
        {
            path: "/about",
            errorElement: <div/>,
            element: <About/>
        },
        {
            path: "/credits",
            errorElement: <div/>,
            element: <Credits/>
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;
