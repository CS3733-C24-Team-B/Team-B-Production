import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./routes/NavigationPage";
import RequestList from "./routes/RequestList";
import RequestForm from "./routes/RequestForm";
import ProfilePage from "./routes/ProfilePage";
import AdminViewer from "./routes/AdminViewer";
import Credits from "./routes/Credits";
import About from "./routes/About";
import ChatInterface from "./components/ChatInterface/ChatInterface"; // Import the ChatInterface component
import ChatIconSVG from "./assets/icons/chatbox-icon.svg";
import "../../flask-server/static/styles.css";

interface ChatIconProps {
    onClick: () => void; // Assuming onClick does not take any arguments and doesn't return anything
}
const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => (
    <div onClick={onClick} style={{ cursor: 'pointer', position: 'fixed', bottom: 20, right: 80, zIndex: 1000 }}>
        <img src={ChatIconSVG} style={{ width: 50, height: 50 }} alt="Chat Icon" />
    </div>
);

function App() {
    const [showChat, setShowChat] = useState(false); // State to control the visibility of the chat interface

    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <div/>,
            element: <HomePage/>,
        },
        // Include other routes as previously defined
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

    return (
        <>
            <RouterProvider router={router}/>
            <ChatIcon onClick={() => setShowChat(!showChat)} />
            {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
        </>
    );
}

export default App;
