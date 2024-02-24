import React from "react";
import "../css/credits.css";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Box, Typography} from "@mui/material";

import MUI from "../images/creditsLogos/material UI.png";
import Fpik from "../images/creditsLogos/FreePik.jpg";
import AZero from "../images/creditsLogos/Auth0.png";
import Axs from "../images/creditsLogos/axios.png";
import Leaf from "../images/creditsLogos/leaflet.jpg";


export default function Credits() {

    const theme = createTheme({
        typography: {
            fontFamily: [
                'Lato',
                'sans-serif',
            ].join(','),
        },
    });

    return (
        <div className={"Settings-Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <Navbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className="Credits-ThreeRows">
                    <div className="Credits-spacing">
                        <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
                            {/*HEADER BOX*/}
                            <div className={"Credits-TestCard"}>
                                <Typography
                                    sx={{marginTop: "1vh", marginLeft: "1vw", fontWeight: 550, fontSize: "1.35rem"}}>
                                    Credits Page
                                </Typography>
                            </div>

                            {/*FRAMEWORKS BOX*/}
                            <div className={"Credits-TestCard1"}>
                                <div>
                                    <Typography sx={{
                                        marginTop: "3vh",
                                        marginLeft: "5vw",
                                        fontWeight: 500,
                                        fontSize: "1.15rem"
                                    }}>
                                        Frameworks
                                    </Typography>
                                    <Box sx={{marginTop: "1vh", marginLeft: "7vw",}}>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            <a href="https://mui.com/material-ui/">
                                                Material UI
                                            </a>
                                        </Typography>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            Express
                                        </Typography>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            <a href="https://www.freepik.com/">
                                                Fpik
                                            </a>
                                        </Typography>
                                    </Box>
                                </div>
                                <div className="credit-logos">
                                    <a href="https://mui.com/material-ui/">
                                        <img className="C-MUI" src={MUI}></img>
                                    </a>
                                    <a href="https://www.freepik.com/">
                                        <img className="C-Fpik" src={Fpik}></img>
                                    </a>
                                </div>
                            </div>


                            {/*LIBRARY BOX*/}
                            <div className={"Credits-TestCard2"}>
                                <div>
                                    <Typography
                                        sx={{
                                            marginTop: "3vh",
                                            marginLeft: "5vw",
                                            fontWeight: 500,
                                            fontSize: "1.15rem",
                                            width: "100%"
                                        }}>
                                        Software Libraries
                                    </Typography>
                                    <Box sx={{marginTop: "1vh", marginLeft: "7vw"}}>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            <a href="https://react.dev/">
                                                React
                                            </a>
                                        </Typography>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            <a href="https://www.prisma.io/">
                                                Prisma
                                            </a>
                                        </Typography>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            <a href="https://axios-http.com/docs/intro">
                                                Axios
                                            </a>
                                        </Typography>
                                        <Typography sx={{marginBottom: "1vh"}}>
                                            <a href="https://auth0.com/">
                                                Auth0
                                            </a>
                                        </Typography>
                                        <Typography>
                                            <a href="https://leafletjs.com/">
                                                Leaflet
                                            </a>
                                        </Typography>
                                    </Box>
                                </div>
                                <div className="credit-logos">
                                    <a href="https://mui.com/material-ui/">
                                        <img className="C-AZero" src={AZero}></img>
                                    </a>
                                    <a href="https://www.freepik.com/">
                                        <img className="C-Axs" src={Axs}></img>
                                    </a>
                                    <a href="https://mui.com/material-ui/">
                                        <img className="C-Leaf" src={Leaf}></img>
                                    </a>
                                </div>
                            </div>
                        </ThemeProvider>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
