import React from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/serviceform_page.css";

// Material UI imports
import {Button} from "@mui/material";
import { styled } from '@mui/material/styles';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TranslateIcon from '@mui/icons-material/Translate';

const RequestButton = styled(Button)(() => ({
    fontSize: '2.5vh',
    width: '80%',
    height: '80%',
    border: '2px solid black',
    color: 'black',
    backgroundColor: '#CDCCD0',
    '&:hover': {
        color: 'white',
        backgroundColor: '#34AD84',
    },
}));

export default function RequestForm() {
    return (
        <div className={"Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"service-form-TwoColumns"}>
                    <div className={"ThreeRows"}>
                        <div className={"service-form-topcard"}>
                            <Button sx={{fontFamily: 'Calibri', fontSize: '2.5vh'}}>
                                Statistics
                            </Button>
                            <Button sx={{fontFamily: 'Calibri', fontSize: '2.5vh'}}>Create Service Request</Button>
                            <Button sx={{fontFamily: 'Calibri', fontSize: '2.5vh'}}>List Service Requests</Button>
                        </div>
                        <div className={"service-form-midcard"}>
                            <header>Create Service Request</header>

                            <RequestButton variant="contained" startIcon={<MedicationIcon sx={{fontSize: '40px'}}/>}
                                    sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                Medicine Request
                            </RequestButton>
                            <RequestButton variant="contained" startIcon={<WarningAmberIcon/>}
                                    sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                Maintenance Request
                            </RequestButton>
                            <RequestButton variant="contained" startIcon={<CompareArrowsIcon/>}
                                    sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                Internal Transport Request
                            </RequestButton>
                            <RequestButton variant="contained" startIcon={<TranslateIcon/>}
                                    sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                Language Request
                            </RequestButton>
                            <RequestButton variant="contained" startIcon={<SanitizerIcon/>}
                                    sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                Sanitation Request
                            </RequestButton>
                        </div>
                        <div className={"TwoColumnsThirdRow"}>
                            <div className={"service-form-TestCard"}></div>
                            <div className={"service-form-TestCard"}></div>
                        </div>
                    </div>
                    <div className={"TwoRows"}>
                        <div className={"service-form-TestCard"}></div>
                        <div className={"service-form-TestCard"}></div>
                    </div>
                </div>
            </div>
        </div>
    );

}
