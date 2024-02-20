import {Button} from "@mui/material";
import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NavigationIcon from "@mui/icons-material/Navigation";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from '@mui/icons-material/Info';

export default function TempNavbar() {

    const {loginWithRedirect, user, isAuthenticated} = useAuth0();
    const isAdmin: boolean = isAuthenticated && user!.email! === "softengc24b@gmail.com";

    function currentRoute() {
        console.log(window.location.href);
        switch (window.location.href) {
            case "http://localhost:3000/":
            case "http://localhost:3000/home":
                return "/home";
            case "http://localhost:3000/profile-info":
                return "/profile-info";
            case "http://localhost:3000/admin-viewer":
                return "/admin-viewer";
            case "http://localhost:3000/requestform":
                return "/requestform";
            case "http://localhost:3000/requestlist":
                return "/requestlist";
            case "http://localhost:3000/settings":
                return "/settings";
            case "http://localhost:3000/about":
                return "/about";
        }

        return "null";
    }

    return (
        <div className="NavBlue">
            <div className="icon-spacing">

                {isAuthenticated ?
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (currentRoute() === "/profile-info") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Calibri'
                            }}
                            startIcon={<AccountCircleIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (currentRoute() === "/profile-info") ? '#34AD84' : 'white'
                            }}/>}
                            href={"/profile-info"}>
                        Profile
                    </Button>
                    :
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (currentRoute() === "/profile-info") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Calibri'
                            }}
                            startIcon={<AccountCircleIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (currentRoute() === "/profile-info") ? '#34AD84' : 'white'
                            }}/>}
                            onClick={() => loginWithRedirect()}>
                        Login
                    </Button>}

                <Button sx={{
                    color: 'white', width: '80%', textTransform: 'none',
                    borderBottom: (currentRoute() === "/home") ? '0.7vh solid #34AD84' : ''
                }}
                        style={{
                            justifyContent: "flex-start",
                            marginLeft: '5%',
                            fontSize: '125%',
                            fontFamily: 'Calibri'
                        }}
                        startIcon={<NavigationIcon style={{
                            fontSize: "150%",
                            minWidth: 40,
                            color: (currentRoute() === "/home") ? '#34AD84' : 'white'
                        }}/>}
                        href={"/home"}>
                    Navigation {/*naviagtion icon*/}
                </Button>

                {isAuthenticated ?
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (currentRoute() === "/requestform") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Calibri'
                            }}
                            startIcon={<DesignServicesIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (currentRoute() === "/requestform") ? '#34AD84' : 'white'
                            }}/>}
                            href={"/requestform"}>
                        Requests {/*service request icon*/}
                    </Button> : <></>}

                {isAdmin ?
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (currentRoute() === "/admin-viewer") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Calibri'
                            }}
                            startIcon={<AdminPanelSettingsIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (currentRoute() === "/admin-viewer") ? '#34AD84' : 'white'
                            }}/>}
                            href={"/admin-viewer"}>
                        Admin {/*admin icon*/}
                    </Button> : <></>}

                <Button sx={{
                    color: 'white', width: '80%', textTransform: 'none',
                    borderBottom: (currentRoute() === "/settings") ? '0.7vh solid #34AD84' : ''
                }}
                        style={{
                            justifyContent: "flex-start",
                            marginLeft: '5%',
                            fontSize: '125%',
                            fontFamily: 'Calibri'
                        }}
                        startIcon={<SettingsIcon style={{
                            fontSize: "150%",
                            minWidth: 40,
                            color: (currentRoute() === "/settings") ? '#34AD84' : 'white'
                        }}/>}
                        href={"/settings"}>
                    Settings {/*settings icon*/}
                </Button>

                <Button sx={{
                    color: 'white', width: '80%', textTransform: 'none',
                    borderBottom: (currentRoute() === "/about") ? '0.7vh solid #34AD84' : ''
                }}
                        style={{
                            justifyContent: "flex-start",
                            marginLeft: '5%',
                            fontSize: '25px',
                            fontFamily: 'Calibri'
                        }}
                        startIcon={<InfoIcon style={{
                            fontSize: "150%",
                            minWidth: 40,
                            color: (currentRoute() === "/about") ? '#34AD84' : 'white'
                        }}/>}
                        href={"/about"}>
                    About {/*about icon*/}
                </Button>
            </div>
        </div>
    );

}
