import React from "react";
import "../css/credits.css";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

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
      fontFamily: ["Lato", "sans-serif"].join(","),
    },
  });

  return (
    <div className={"Settings-Container"}>
      {" "}
      {/* expands area across entire screen */}
      <Topbar /> {/* TopGreen css fixes this to the top */}
      <Navbar /> {/* NavBlue css fixes this to the left */}
      <div className={"BackBlue"}>
        {" "}
        {/* divides area below topbar into navbar and main space */}
        <div className="Credits-NoRows">
          <div></div>
          <ThemeProvider theme={theme}>
            {" "}
            {/* Apply the Lato font theme */}
            <div className="Credits-TestCard1">
              <Typography
                sx={{
                  marginTop: "1.5vh",
                  marginLeft: "1.5vw",
                  fontWeight: 550,
                  fontSize: "2.35rem",
                }}
              >
                Credits Page:
              </Typography>
              <Typography
                sx={{
                  marginTop: "2vh",
                  marginBottom: "5vh",
                  marginLeft: "2.5vw",
                  fontWeight: 550,
                  fontSize: "1.35rem",
                }}
              >
                Frameworks and Softwares
              </Typography>
              <Box sx={{ marginBottom: "2vh" }}>
                <div className={"Credits-spacing"}>
                  <a
                    className="No-Link"
                    href="https://mui.com/material-ui/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          marginBottom: "3vh",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover>
                          },
                        }}
                      >
                        Material UI
                      </Typography>
                      <img className="C-MUI" src={MUI} alt={"something"}></img>
                    </div>
                  </a>
                  <a
                    className="No-Link"
                    href="https://expressjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          marginBottom: "3.2vh",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover
                          },
                        }}
                      >
                        Express.js
                      </Typography>
                      <img
                        className="C-Express"
                        src={Exp}
                        alt={"something"}
                      ></img>
                    </div>
                  </a>
                  <a
                    className="No-Link"
                    href="https://www.freepik.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          marginBottom: "-1vh",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover
                          },
                        }}
                      >
                        FreePik
                      </Typography>
                      <img
                        className="C-Fpik"
                        src={Fpik}
                        alt={"something"}
                      ></img>
                    </div>
                  </a>
                </div>

                <div className="Credits-spacing">
                  <a
                    className="No-Link"
                    href="https://auth0.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover>
                          },
                        }}
                      >
                        Auth0
                      </Typography>
                      <img
                        className="C-AZero"
                        src={AZero}
                        alt={"something"}
                      ></img>
                    </div>
                  </a>
                  <a
                    className="No-Link"
                    href="https://axios-http.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          marginTop: "1vh",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover>
                          },
                        }}
                      >
                        Axios
                      </Typography>
                      <img className="C-Axs" src={Axs} alt={"something"}></img>
                    </div>
                  </a>
                  <a
                    className="No-Link"
                    href="https://leafletjs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <a className="Credits-Mini-Titles">
                        <h2>Leaflet</h2>
                      </a>
                      <img
                        className="C-Leaf"
                        src={Leaf}
                        alt={"something"}
                      ></img>
                    </div>
                  </a>
                </div>
                <div className={"Credits-spacing"}>
                  <a
                    className="No-Link"
                    href="https://www.prisma.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          marginTop: "1vh",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover
                          },
                        }}
                      >
                        Prisma
                      </Typography>
                      <img className="C-Pma" src={Pma} alt={"something"}></img>
                    </div>
                  </a>
                  <a
                    className="No-Link"
                    href="https://react.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="Credits-TestCard2">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "2rem",
                          marginTop: "-1vh",
                          color: "black",
                          "&:hover": {
                            color: "black", // Use the default text color on hover
                          },
                        }}
                      >
                        React
                      </Typography>
                      <img className="C-Rct" src={Rct} alt={"something"}></img>
                    </div>
                  </a>
                </div>
              </Box>
            </div>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
