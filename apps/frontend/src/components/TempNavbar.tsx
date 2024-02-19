import {IconButton } from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NavigationIcon from "@mui/icons-material/Navigation";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SettingsIcon from "@mui/icons-material/Settings";

export default function TempNavbar() {
    return (
        <div className="NavBlue">
            <IconButton>
                <AccountCircleIcon/>  {/*profile icon*/}
            </IconButton>
            <IconButton>
                <AdminPanelSettingsIcon/>  {/*admin icon*/}
            </IconButton>
            <IconButton>
                <NavigationIcon/>  {/*naviagtion icon*/}
            </IconButton>
            <IconButton>
                <DesignServicesIcon/>  {/*service request icon*/}
            </IconButton>
            <IconButton>
                <SettingsIcon/>{/*settings icon*/}
            </IconButton>
        </div>
    );

}
