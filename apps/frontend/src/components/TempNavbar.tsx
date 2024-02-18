import {AppBar, Box, IconButton, Toolbar } from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NavigationIcon from "@mui/icons-material/Navigation";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SettingsIcon from "@mui/icons-material/Settings";
import CssBaseline from "@mui/material/CssBaseline";
const handleHomeClick = () => {
    window.location.href = "/home"; // Redirect to home page
};
export default function TempNavbar() {
    return (
        <div className={"NavBarLayout"}>
            <Box sx={{display: 'block', position: 'fixed', width: '10%', zIndex: '1002'}}>
                <CssBaseline/>
                <AppBar position="relative" sx={{boxShadow: 0,}}> {/*no shadow*/}
                <Toolbar style={{
                    backgroundColor: "#012d5a", //Background color
                    flexDirection: 'column', //makes it so icons are displayed vertically
                    minHeight: "100vh", //makes navbar go all the way down.
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '72px'}}
                    >
                        <AccountCircleIcon style={{ fontSize: '1.5rem' }}/>  {/*profile icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '125px'}}
                    >
                        <AdminPanelSettingsIcon style={{ fontSize: '1.9rem' }}/>  {/*admin icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '176px'}}
                    >
                        <NavigationIcon style={{ fontSize: '1.5rem' }}/>  {/*naviagtion icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '228px'}}
                    >
                        <DesignServicesIcon style={{ fontSize: '1.5rem' }}/>  {/*service request icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '279px'}}
                    >
                        <SettingsIcon style={{ fontSize: '1.5rem' }}/>{/*settings icon*/}
                    </IconButton>
                </Toolbar>
            </AppBar>
            </Box>
        </div>
    );

}
