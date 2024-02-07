import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import HomePage from "./routes/HomePage.tsx";
// import Settings from "./routes/Settings.tsx";
// import CreateAccount from "./routes/CreateAccount.tsx";
// import ForgotPassword from "./routes/ForgotPassword.tsx";
// import Profile from "./routes/Profile.tsx";
import CSVNodeData from "./routes/CSVNodeData.tsx";
import CSVEdgeData from "./routes/CSVEdgeData.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";
import LoginButton from "./components/LoginButton.tsx";
import ProfilePage from "./routes/ProfilePage.tsx";
import ChangeProfile from "./routes/ChangeProfile.tsx";

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
            path: "/login",
            errorElement: <div><p>An error has occurred</p></div>,
            element: <LoginButton/>
        },
        // {
        //     path: "/profile",
        //     errorElement: <div/>,
        //     element: <Profile/>,
        // },
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
        {
            path: "/profile-info",
            errorElement: <div/>,
            element: <ProfilePage/>,
        },
        {
            path: "/change-profile",
            errorElement: <div/>,
            element: <ChangeProfile/>,
        },

    ]);

    return <RouterProvider router={router}/>;
}

export default App;
