import React from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import RequestList from "../routes/OldRequestList.tsx";
import "../css/serviceform_page.css";

// Material UI imports
import {Button} from "@mui/material";
import {styled} from '@mui/material/styles';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TranslateIcon from '@mui/icons-material/Translate';
import {createSvgIcon} from '@mui/material/utils';

// Goku icon, probably should not be used in the actual build lmao //
const GokuIcon = createSvgIcon(
    // credit: Created by eric from the Noun Project - https://thenounproject.com/icon/goku-58041/
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
         viewBox="0 0 100 125" enable-background="new 0 0 100 100" xmlSpace="preserve">
        <path fill="#000000" d="M74.902,65.634l20.051-11.192l-14.17-0.853l8.146-7.297l-18.137,1.417c0,0-0.389-2.868-4.109-6.589
        c-2.267-2.267-7.367-3.755-7.367-3.755s0.726-9.244-4.446-17.463c-3.274-4.287-10.007-5.421-16.737-7.263
        c5.172,14.736,3.259,20.546,3.259,20.546s-7.439-8.29-15.799-9.565c-4.887-0.284-15.09,5.101-20.564,8.714
        c19.36,10.06,21.486,20.191,21.486,20.191c-7.156,0.637-19.696,8.076-19.696,8.076c15.444,2.976,20.617,6.659,20.617,6.659
         l-8.572,4.96l17.335,1.739c-1.01-0.729-3.214-3.383-3.66-4.894c-0.468-1.586-0.282-6.684,1.31-6.996
         c0.827-0.163,1.418,0.222,1.766,0.74c-0.035-0.367-0.05-0.729-0.05-1.088c0-7.582,7.298-12.98,14.864-12.98
         c7.922,0,17.327,2.781,16.588,10.932c0.348-0.52-0.838,2.232-0.01,2.396c1.59,0.313,1.776,5.41,1.309,6.996
         c-0.471,1.586-2.889,4.455-3.815,5.011c-0.44,0.26-0.763,0.313-0.981,0.297c-0.13,0.561-0.267,1.044-0.408,1.447l11.791-0.41
         l-5.454-2.621l15.303-4.535L74.902,65.634z"/>
        <path fill="#000000"
              d="M50.73,85.646c-0.146,0-0.251-0.004-0.304-0.006c-0.052,0.002-0.158,0.006-0.305,0.006
              c-0.876,0-2.528-0.104-3.751-0.781c-3.847-2.137-8.516-7.17-8.997-8.082c-0.214-0.406-0.416-0.986-0.615-1.764
              c-0.247-0.064-0.504-0.179-0.768-0.332c-1.075-0.642-3.618-3.677-4.134-5.418c-0.4-1.357-0.409-5.224,0.635-6.947
              c0.323-0.531,0.732-0.852,1.217-0.947c0.401-0.078,0.793-0.064,1.148,0.035c0.093-3.656,1.806-7.043,4.848-9.564
              c2.919-2.422,6.827-3.811,10.722-3.811c6.642,0,12.284,1.837,15.095,4.913c1.621,1.772,2.369,3.934,2.228,6.424
              c0.089,0.231,0.021,0.476-0.075,0.823c-0.168,0.604-0.255,1.025-0.263,1.259c0.368,0.146,0.687,0.438,0.948,0.869
              c1.043,1.721,1.035,5.59,0.637,6.944c-0.516,1.744-3.059,4.779-4.133,5.418c-0.266,0.156-0.522,0.271-0.771,0.334
              c-0.199,0.777-0.4,1.357-0.613,1.763c-0.479,0.911-5.146,5.944-8.998,8.084C53.259,85.542,51.607,85.646,50.73,85.646z
              M50.428,84.223l0.035,0.002c0.009,0,0.105,0.004,0.268,0.004c0.465,0,2.058-0.043,3.062-0.603c3.664-2.035,8.068-6.834,8.432-7.504
              c0.135-0.256,0.349-0.795,0.605-1.906l0.136-0.59l0.624,0.043c0.062,0,0.241-0.021,0.549-0.203c0.752-0.446,3.077-3.176,3.498-4.6
              c0.355-1.205,0.245-4.599-0.49-5.812c-0.117-0.197-0.224-0.281-0.275-0.289c-0.282-0.057-0.523-0.225-0.676-0.471
              c-0.014-0.021-0.025-0.043-0.037-0.066l-0.096,0.144l0.026-0.297c-0.204-0.568-0.03-1.353,0.196-2.177l0.025-0.289
              c0.203-2.233-0.414-4.153-1.834-5.707c-2.547-2.788-7.799-4.452-14.05-4.452c-3.57,0-7.148,1.271-9.817,3.483
              c-2.798,2.32-4.339,5.443-4.339,8.789c0,0.346,0.016,0.688,0.047,1.021l0.258,2.779l-1.552-2.318
              c-0.255-0.381-0.601-0.527-1.04-0.439c-0.054,0.01-0.158,0.092-0.278,0.289c-0.735,1.215-0.845,4.605-0.488,5.812
              c0.421,1.424,2.745,4.151,3.499,4.602c0.307,0.183,0.484,0.201,0.547,0.201h0.018l0.605-0.045l0.137,0.592
              c0.257,1.111,0.471,1.65,0.605,1.906c0.362,0.67,4.77,5.471,8.432,7.504c1.006,0.56,2.599,0.603,3.062,0.603
              c0.162,0,0.261-0.004,0.27-0.004L50.428,84.223z"/>
        <path fill="#000000"
              d="M33.033,61.948l4.038,4.604l-0.426-3.684l3.33,3.117c0,0-0.708-4.252,0.142-6.637
              c1.087-2.314,3.897-3.638,3.897-3.638s-0.328,8.358,0.354,11.902c2.221-4.275,8.998-12.398,12.683-13.816
              c1.062,4.369-0.425,11.24-1.062,14.522c3.261-3.493,7.511-10.247,7.723-11.688c0,0,0.491,0.252,0.708,0.779
               c0.372,0.903-0.991,5.881-1.698,7.864c0.99-0.592,2.905-2.055,2.905-2.055l-1.772,3.754c0,0,4.746-3.094,5.242-3.896
               c1.016-1.438,2.977-12.47,2.977-12.47l-30.039-6.73l-11.194,8.432L33.033,61.948z"/>
        {/*<text x="0" y="115" fill="#000000" font-size="5px" font-weight="bold"*/}
        {/*      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by eric*/}
        {/*    steltenpohl</text>*/}
        {/*<text x="0" y="120" fill="#000000" font-size="5px" font-weight="bold"*/}
        {/*      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun*/}
        {/*    Project</text>*/}
    </svg>,
    'Goku',
);
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
    const [currentTab, setCurrentTab] = React.useState("list-request");

    const handleTabClick = (tab: string) => {
        switch (tab) {
            case "list-request":
                setCurrentTab("list-request");
                return;
            case "create-request":
                setCurrentTab("create-request");
                return;
            case "statistics":
                setCurrentTab("statistics");
                return;
        }
    };

    return (
        <div className={"service-form-Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"service-form-BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"service-form-TwoColumns"}>
                    <div className={"service-form-ThreeRows"}>
                        <div className={"service-form-topcard"}>
                            <Button
                                onClick={() => {
                                    handleTabClick("statistics");
                                }}
                                sx={{
                                    alignSelf: 'center',
                                    height: '3vh',
                                    color: (currentTab === "statistics") ? '#34AD84' : 'black',
                                    fontFamily: 'Calibri',
                                    fontSize: '2.5vh',
                                    borderBottom: (currentTab === "statistics") ? '5px solid #34AD84' : ''
                                }}>
                                Statistics
                            </Button>
                            <Button
                                onClick={() => {
                                    handleTabClick("create-request");
                                }}
                                sx={{
                                    alignSelf: 'center',
                                    height: '3vh',
                                    color: (currentTab === "create-request") ? '#34AD84' : 'black',
                                    fontFamily: 'Calibri',
                                    fontSize: '2.5vh',
                                    borderBottom: (currentTab === "create-request") ? '5px solid #34AD84' : ''
                                }}>
                                Create Service Request
                            </Button>
                            <Button
                                onClick={() => {
                                    handleTabClick("list-request");
                                }}
                                sx={{
                                    alignSelf: 'center',
                                    height: '3vh',
                                    color: (currentTab === "list-request") ? '#34AD84' : 'black',
                                    fontFamily: 'Calibri',
                                    fontSize: '2.5vh',
                                    borderBottom: (currentTab === "list-request") ? '5px solid #34AD84' : ''
                                }}>
                                List Service Requests
                            </Button>
                        </div>

                        {/*If current tab is the statistics tab*/}
                        {currentTab === "statistics" && (
                            <div className={"service-form-midcard"}>
                                <header>Statistics</header>
                            </div>
                        )}

                        {/*If current tab is the create request tab*/}
                        {currentTab === "create-request" && (
                            <div className={"service-form-midcard"}>
                                <header className={"create-service-header"}>Create Service Request</header>
                                <RequestButton variant="contained"
                                               startIcon={<MedicationIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Medicine Request
                                </RequestButton>
                                <RequestButton variant="contained"
                                               startIcon={<WarningAmberIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Maintenance Request
                                </RequestButton>
                                <RequestButton variant="contained"
                                               startIcon={<CompareArrowsIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Internal Transport Request
                                </RequestButton>
                                <RequestButton variant="contained"
                                               startIcon={<TranslateIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Language Request
                                </RequestButton>
                                <RequestButton variant="contained"
                                               startIcon={<SanitizerIcon style={{fontSize: '4vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Sanitation Request
                                </RequestButton>
                                <RequestButton variant="contained"
                                               startIcon={<GokuIcon style={{fontSize: '6vh'}}/>}
                                               sx={{justifySelf: 'center', borderRadius: '15px'}}>
                                    Goku Request
                                </RequestButton>
                            </div>
                        )}

                        {/*If current tab is the List request tab*/}
                        {currentTab === "list-request" && (
                            <div>
                                <RequestList/>
                            </div>
                        )}

                        <div className={"TwoColumnsThirdRow"}>
                            <div className={"service-form-TestCard"}></div>
                            <div className={"service-form-TestCard"}></div>
                        </div>
                    </div>
                    <div className={"service-form-TwoRows"}>
                        <div className={"service-form-TestCard"}></div>
                        <div className={"service-form-TestCard"}></div>
                    </div>
                </div>
            </div>
        </div>
    );

}
