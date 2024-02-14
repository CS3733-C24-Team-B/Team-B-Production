import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import HomePage from "./routes/HomePage.tsx";
import CSVNodeData from "./routes/CSVNodeData.tsx";
import CSVEdgeData from "./routes/CSVEdgeData.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";
import ProfilePage from "./routes/ProfilePage.tsx";
import AdminViewer from "./routes/AdminViewer.tsx";

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
            path: "/admin-viewer",
            errorElement: <div/>,
            element: <AdminViewer/>
        }

    ]);

    return <RouterProvider router={router}/>;
}

export default App;
