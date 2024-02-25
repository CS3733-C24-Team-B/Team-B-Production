import {Button} from "@mui/material";
import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NavigationIcon from "@mui/icons-material/Navigation";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import InfoIcon from '@mui/icons-material/Info';
import CreditIcon from '@mui/icons-material/LibraryBooks';
export default function Navbar() {

    const {loginWithRedirect, user, isAuthenticated} = useAuth0();
    const isAdmin: boolean = isAuthenticated && user!.email! === "softengc24b@gmail.com";

    return (
        <div className="NavBlue">
            <div className="icon-spacing">

                {isAuthenticated ?
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (window.location.pathname === "/profile-info") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Lato'
                            }}
                            startIcon={<AccountCircleIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (window.location.pathname === "/profile-info") ? '#34AD84' : 'white'
                            }}/>}
                            href={"/profile-info"}>
                        Profile
                    </Button>
                    :
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (window.location.pathname === "/profile-info") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Lato'
                            }}
                            startIcon={<AccountCircleIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (window.location.pathname === "/profile-info") ? '#34AD84' : 'white'
                            }}/>}
                            onClick={() => loginWithRedirect()}>
                        Login
                    </Button>}

                <Button sx={{
                    color: 'white', width: '80%', textTransform: 'none',
                    borderBottom: (window.location.pathname === "/home") ? '0.7vh solid #34AD84' : ''
                }}
                        style={{
                            justifyContent: "flex-start",
                            marginLeft: '5%',
                            fontSize: '125%',
                            fontFamily: 'Lato'
                        }}
                        startIcon={<NavigationIcon style={{
                            fontSize: "150%",
                            minWidth: 40,
                            color: (window.location.pathname === "/home") ? '#34AD84' : 'white'
                        }}/>}
                        href={"/home"}>
                    Navigation {/*naviagtion icon*/}
                </Button>

                {isAuthenticated ?
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (window.location.pathname === "/requestform") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Lato'
                            }}
                            startIcon={<DesignServicesIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (window.location.pathname === "/requestform") ? '#34AD84' : 'white'
                            }}/>}
                            href={"/requestform"}>
                        Requests {/*service request icon*/}
                    </Button> : <></>}

                {isAdmin ?
                    <Button sx={{
                        color: 'white', width: '80%', textTransform: 'none',
                        borderBottom: (window.location.pathname === "/admin-viewer") ? '0.7vh solid #34AD84' : ''
                    }}
                            style={{
                                justifyContent: "flex-start",
                                marginLeft: '5%',
                                fontSize: '125%',
                                fontFamily: 'Lato'
                            }}
                            startIcon={<AdminPanelSettingsIcon style={{
                                fontSize: "150%",
                                minWidth: 40,
                                color: (window.location.pathname === "/admin-viewer") ? '#34AD84' : 'white'
                            }}/>}
                            href={"/admin-viewer"}>
                        Admin {/*admin icon*/}
                    </Button> : <></>}

                <Button sx={{
                    color: 'white', width: '80%', textTransform: 'none',
                    borderBottom: (window.location.pathname === "/about") ? '0.7vh solid #34AD84' : ''
                }}
                        style={{
                            justifyContent: "flex-start",
                            marginLeft: '5%',
                            fontSize: '125%',
                            fontFamily: 'Lato'
                        }}
                        startIcon={<InfoIcon style={{
                            fontSize: "150%",
                            minWidth: 40,
                            color: (window.location.pathname === "/about") ? '#34AD84' : 'white'
                        }}/>}
                        href={"/about"}>
                    About {/*about icon*/}
                </Button>

                <Button sx={{
                    color: 'white', width: '80%', textTransform: 'none',
                    borderBottom: (window.location.pathname === "/credits") ? '0.7vh solid #34AD84' : ''
                }}
                        style={{
                            justifyContent: "flex-start",
                            marginLeft: '5%',
                            fontSize: '125%',
                            fontFamily: 'Lato'
                        }}
                        startIcon={<CreditIcon style={{
                            fontSize: "150%",
                            minWidth: 40,
                            color: (window.location.pathname === "/credits") ? '#34AD84' : 'white'
                        }}/>}
                        href={"/credits"}>
                    Credits {/*about icon*/}
                </Button>
            </div>
        </div>
    );

}
