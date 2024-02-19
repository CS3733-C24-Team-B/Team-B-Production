import {Button} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NavigationIcon from "@mui/icons-material/Navigation";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from '@mui/icons-material/Info';

export default function TempNavbar() {
    return (
        <div className="NavBlue">
            <div className="icon-spacing">
                <Button sx={{color: 'white', width: '80%', textTransform: 'none'}} style={{justifyContent: "flex-start", marginLeft: '10%', fontSize: '25px', fontFamily: 'Calibri'}}
                        startIcon={<AccountCircleIcon style={{fontSize: 40, minWidth: 80}}/>}
                href={"/profile-info"}>
                    Profile
                </Button>
                <Button sx={{color: 'white', width: '80%', textTransform: 'none'}} style={{justifyContent: "flex-start", marginLeft: '10%', fontSize: '25px', fontFamily: 'Calibri'}}
                        startIcon={<AdminPanelSettingsIcon style={{fontSize: 40, minWidth: 80}}/>}
                href={"/admin-viewer"}>
                    Admin {/*admin icon*/}
                </Button>
                <Button sx={{color: 'white', width: '80%', textTransform: 'none'}} style={{justifyContent: "flex-start", marginLeft: '10%', fontSize: '25px', fontFamily: 'Calibri'}}
                        startIcon={<NavigationIcon style={{fontSize: 40, minWidth: 80}}/>}
                href={"/home"}>
                    Navigation {/*naviagtion icon*/}
                </Button>
                <Button sx={{color: 'white', width: '80%', textTransform: 'none'}} style={{justifyContent: "flex-start", marginLeft: '10%', fontSize: '25px', fontFamily: 'Calibri'}}
                        startIcon={<DesignServicesIcon style={{fontSize: 40, minWidth: 80}}/>}
                href={"/requestform"}>
                    Requests {/*service request icon*/}
                </Button>
                <Button sx={{color: 'white', width: '80%', textTransform: 'none'}} style={{justifyContent: "flex-start", marginLeft: '10%', fontSize: '25px', fontFamily: 'Calibri'}}
                        startIcon={<SettingsIcon style={{fontSize: 40, minWidth: 80}}/>}
                href={"/settings"}>
                    Settings {/*settings icon*/}
                </Button>
                <Button sx={{color: 'white', width: '80%', textTransform: 'none'}} style={{justifyContent: "flex-start", marginLeft: '10%', fontSize: '25px', fontFamily: 'Calibri'}}
                        startIcon={<InfoIcon style={{fontSize: 40, minWidth: 80}}/>}
                        href={"/about"}>
                    About {/*about icon*/}
                </Button>
            </div>
        </div>
    );

}
