import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Auth0Provider
        domain="dev-emppp88ojksbdj0d.us.auth0.com"
        clientId="JCmsuDS8FCoXaO0L5NoPQRKZ3iOlRMrz"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    </Auth0Provider>

);
