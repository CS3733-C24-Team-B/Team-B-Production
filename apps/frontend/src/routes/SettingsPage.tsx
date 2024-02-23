import React, {useState} from "react";
import "../css/settings.css";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import settingsImage
    from "../images/pngtree-printing-service-illustration-concept-isometric-design-concept-of-web-page-png-image_4853463_1-removebg-preview.png";
import {Box, Typography} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Button from "@mui/material/Button";
// import Button from "@mui/material/Button";

export default function SettingsPage() {
    const [nodeColor, setNodeColor] = useState(localStorage.getItem("nodeColor"));
    const [edgeColor, setEdgeColor] = useState(localStorage.getItem("edgeColor"));


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
                <div className="Settings-TwoRows">
                    <div className="Settings-TwoColumns">
                        <div className="Settings-TestCard1">
                            <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
                                <Typography sx={{margin: "30px", fontWeight: 550, fontSize: "1.35rem"}}>
                                    Settings
                                </Typography>
                                {/*START LOCATION*/}<Box style={{display: "flex", marginLeft: "5vw"}}>
                                    <Typography sx={{fontWeight: 500, fontSize: "0.9rem"}}>
                                        Default Starting Location
                                    </Typography>
                                    <input className="Settings-Input-Fields"></input>
                                </Box>
                                {/*EVERYTHING BELOW*/}
                                <Box sx={{backgroundColor: "white", display: "flex"}}>
                                    <Box sx={{display: "flex"}}> {/*flex downwards*/}
                                        {/*FIRST 3 CHECKBOXES*/}
                                        <Box sx={{marginLeft: "7vw", marginTop: "11vh", display: "grid"}}>
                                            <Box sx={{display: "flex"}}>
                                                <input className="Settings-Checkbox-Fields" type="checkbox"
                                                       id="custom-checkbox"/>
                                                <Typography sx={{
                                                    marginBottom: "3.9vh",
                                                    marginLeft: "1vw",
                                                    fontWeight: 550,
                                                    fontSize: "0.8rem"
                                                }}>
                                                    Animate Path
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: "flex"}}>
                                                <input className="Settings-Checkbox-Fields" type="checkbox"
                                                       id="custom-checkbox"/>
                                                <Typography sx={{
                                                    marginBottom: "3.5vh",
                                                    marginLeft: "1vw",
                                                    fontWeight: 550,
                                                    fontSize: "0.8rem"
                                                }}>
                                                    Show Path
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: "flex"}}>
                                                <input className="Settings-Checkbox-Fields" type="checkbox"
                                                       id="custom-checkbox"/>
                                                <Typography sx={{
                                                    marginBottom: "3.5vh",
                                                    marginLeft: "1vw",
                                                    fontWeight: 550,
                                                    fontSize: "0.8rem"
                                                }}>
                                                    Show Edges
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <div className="Settings-Vertical-Line"/>
                                        {/*CHANGE COLOR*/}
                                        <Box sx={{marginLeft: "4vw", marginTop: "10.7vh", display: "grid"}}>
                                            {/*SELECTOR 1*/}
                                            <Box sx={{display: "flex", height: "100%"}}>
                                                <Typography sx={{
                                                    marginTop: "0vh",
                                                    marginLeft: "-0.5vw",
                                                    fontWeight: 550,
                                                    fontSize: "0.8rem"
                                                }}>
                                                    Change Node Color
                                                </Typography>

                                                <input className="Settings-Color-Selector1" type="color"
                                                       value={(nodeColor === null ? "#3388ff" : nodeColor!)}
                                                       onChange={(e) => {
                                                           localStorage.setItem("nodeColor", e.target.value);
                                                           setNodeColor(e.target.value);
                                                       }}/>
                                                <Button sx={{marginLeft: "1vw", marginTop: "-2vh", height: "100%"}}
                                                        onClick={() => {
                                                            localStorage.removeItem("nodeColor");
                                                            setNodeColor(null);
                                                        }}>
                                                    Reset
                                                </Button>
                                            </Box>
                                            {/*SELECTOR 2*/}
                                            <Box sx={{display: "flex", height: "100%"}}>
                                                <Typography sx={{
                                                    marginTop: "0.0vh",
                                                    marginLeft: "-0.5vw",
                                                    fontWeight: 550,
                                                    fontSize: "0.8rem"
                                                }}>
                                                    Change Edge Color
                                                </Typography>
                                                <input className="Settings-Color-Selector2" type="color"
                                                       value={(edgeColor === null ? "#008000" : edgeColor!)}
                                                       onChange={(e) => {
                                                           localStorage.setItem("edgeColor", e.target.value);
                                                           setEdgeColor(e.target.value);
                                                       }}/>
                                                <Button sx={{marginLeft: "1vw", marginTop: "-2.0vh", height: "100%"}}
                                                        onClick={() => {
                                                            localStorage.removeItem("edgeColor");
                                                            setEdgeColor(null);
                                                        }}>
                                                    Reset
                                                </Button>
                                            </Box>
                                            <Box sx={{height: "100%"}}>
                                                <Typography sx={{
                                                    marginTop: "0.0vh",
                                                    marginLeft: "-0.5vw",
                                                    fontWeight: 550,
                                                    fontSize: "0.8rem",
                                                    color: "white"
                                                }}>
                                                    s
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </ThemeProvider>
                        </div>
                        <img className="Settings-TestCard2" src={settingsImage} alt=""></img>

                    </div>
                    {/*<div className="Settings-TestCard3">*/}
                    {/*    <ThemeProvider theme={theme}> /!* Apply the Lato font theme *!/*/}
                    {/*        <Typography sx={{margin: "30px", fontWeight: 550, fontSize: "1.35rem"}}>*/}
                    {/*            General Settings*/}
                    {/*        </Typography>*/}
                    {/*    </ThemeProvider>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
        ;
}
