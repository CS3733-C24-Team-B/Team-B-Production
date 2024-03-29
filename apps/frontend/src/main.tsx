import React from "react";
import ReactDOM from "react-dom/client";
import {Auth0Provider} from '@auth0/auth0-react';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Auth0Provider
            useRefreshTokens
            cacheLocation="localstorage"
            domain="dev-emppp88ojksbdj0d.us.auth0.com"
            clientId="CAaC9HTn4AmrRQiSCVxYQJm9MSvHyJiQ"
            authorizationParams={{
                redirect_uri: window.location.href,
                audience: "/api",
                scope: "openid profile email offline_access"
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <App/>
            </LocalizationProvider>
        </Auth0Provider>
    </React.StrictMode>,
);
