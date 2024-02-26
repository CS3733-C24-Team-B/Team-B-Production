import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./routes/NavigationPage.tsx";
import RequestList from "./routes/RequestList.tsx";
import RequestForm from "./routes/RequestForm.tsx";
import ProfilePage from "./routes/ProfilePage.tsx";
import AdminViewer from "./routes/AdminViewer.tsx";
import Credits from "./routes/Credits.tsx";
import About from "./routes/About.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <HomePage />,
    },
    {
      path: "/home",
      errorElement: <div />,
      element: <HomePage />,
    },
    {
      path: "/requestform",
      errorElement: <div />,
      element: <RequestForm />,
    },
    {
      path: "/requestlist",
      errorElement: <div />,
      element: <RequestList />,
    },
    {
      path: "/profile-info",
      errorElement: <div />,
      element: <ProfilePage />,
    },
    {
      path: "/admin-viewer",
      errorElement: <div />,
      element: <AdminViewer />,
    },
    {
      path: "/about",
      errorElement: <div />,
      element: <About />,
    },
    {
      path: "/credits",
      errorElement: <div />,
      element: <Credits />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
