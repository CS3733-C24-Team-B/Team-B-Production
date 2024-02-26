import React from "react";
import "../css/credits.css";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Box, Typography} from "@mui/material";

import MUI from "../images/creditsLogos/material UI.png";
import Exp from "../images/creditsLogos/expressLOGO.png";
import Fpik from "../images/creditsLogos/FreePik.png";
import AZero from "../images/creditsLogos/Auth0.png";
import Axs from "../images/creditsLogos/axios.png";
import Leaf from "../images/creditsLogos/leaflet.jpg";
import Pma from "../images/creditsLogos/prisma logo.png";
import Rct from "../images/creditsLogos/reacr logo.png";

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
                <div className="Credits-NoRows">
                    <div></div>
                    <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
                        <div className="Credits-TestCard1">
                            <Typography
                                sx={{marginTop: "1.5vh", marginLeft: "1.5vw", fontWeight: 550, fontSize: "2.35rem"}}>
                                Credits Page:
                            </Typography>
                            <Typography
                                sx={{marginTop: "2vh", marginBottom: "5vh", marginLeft: "2.5vw", fontWeight: 550, fontSize: "1.35rem"}}>
                                Frameworks and Softwares
                            </Typography>
                            <Box sx={{marginBottom: "2vh"}}>
                                <div className={"Credits-spacing"}>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem", marginBottom:"3vh"}}>
                                            Material UI
                                        </Typography>
                                        <a href="https://mui.com/material-ui/">
                                            <img className="C-MUI" src={MUI}></img>
                                        </a>
                                    </div>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem",marginBottom:"3.2vh"}}>
                                            Express.js
                                        </Typography>
                                        <a href="https://expressjs.com/">
                                            <img className="C-Express" src={Exp}></img>
                                        </a>
                                    </div>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem", marginBottom:"-1vh"}}>
                                            FreePik
                                        </Typography>
                                        <a href="https://www.freepik.com/">
                                            <img className="C-Fpik" src={Fpik}></img>
                                        </a>
                                    </div>
                                </div>

                                <div className={"Credits-spacing"}>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem"}}>
                                            Auth0
                                        </Typography>
                                        <a href="https://auth0.com/">
                                            <img className="C-AZero" src={AZero}></img>
                                        </a>
                                    </div>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem", marginTop: "1vh"}}>
                                            Axios
                                        </Typography>
                                        <a href="https://axios-http.com/">
                                            <img className="C-Axs" src={Axs}></img>
                                        </a>
                                    </div>
                                    <div className="Credits-TestCard2">
                                        <a className="Credits-Mini-Titles">
                                            <h2>Leaflet</h2>
                                        </a>
                                        <a href="https://leafletjs.com/">
                                            <img className="C-Leaf" src={Leaf}></img>
                                        </a>
                                    </div>
                                </div>
                                <div className={"Credits-spacing"}>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem", marginTop: "1vh"}}>
                                            Prisma
                                        </Typography>
                                        <a href="https://www.prisma.io/">
                                            <img className="C-Pma" src={Pma}></img>
                                        </a>
                                    </div>
                                    <div className="Credits-TestCard2">
                                        <Typography sx={{fontWeight: 600, fontSize: "2rem", marginTop: "-1vh"}}>
                                            React
                                        </Typography>

                                        <a href="https://react.dev/">
                                            <img className="C-Rct" src={Rct}></img>
                                        </a>
                                    </div>

                                </div>
                            </Box>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );
}
