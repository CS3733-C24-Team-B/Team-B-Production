import React from "react";
import AboutUsImage from "../images/AboutUsImage.png";
import AananImage from "../images/profiles/AananGoyal.png";
import CameronImage from "../images/profiles/CameronCrane.png";
import HienImage from "../images/profiles/HienPham.png";
import KatieImage from "../images/profiles/KatieKartsen.png";
import KatyImage from "../images/profiles/KatyStuparu.png";
import KennyImage from "../images/profiles/KennyDoan.png";
import LuisImage from "../images/profiles/LuisAlzamora.png";
import MichaelImage from "../images/profiles/MichaelSensat.png";
import PiotrImage from "../images/profiles/PiotrSkoczylas.png";
import RodrickImage from "../images/profiles/RodrickMoore.png";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/about_page.css";


export default function AboutPage() {

    return (
        <div className={"AboutContainer"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"FiveRows"}>
                    <div className={"about-header"}>About Us</div>
                    <div className={"AboutTwoColumns"}>
                        <div className={"LabelCard"}>
                            <p className={"break"}>.</p>
                            <p className={"welcome-text"}>WPI Computer</p> <p className={"welcome-text"}>Science
                            Department</p>
                            <p className={"break"}>.</p>
                            <p className={"course-info"}>CS3733-C24</p> <p className={"course-info"}>Software
                            Engineering</p>
                            <p className={"break"}>.</p>
                            <p className={"course-info"}>Professor</p> <p className={"name"}>Wilson Wong</p>
                            <p className={"break"}>.</p>
                            <p className={"course-info"}>Team Coach</p> <p className={"name"}>Ariel Schechter</p>
                            <p className={"break"}>.</p>
                        </div>
                        <div className={"ImageCard"}>
                            <img className={"AboutImage"} src={AboutUsImage} alt={"Image"}/>
                        </div>
                    </div>
                    <div className={"About-TwoColumns"}>
                        <div className={"About-NameColumns"}>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={KatyImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Katy Stuparu</h2>
                                    <h3>Lead Software Engineer & Backend Developer</h3>
                                    <p>WPI class of 2025 Computer Science and Robotics Engineering major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={MichaelImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Michael Sensat</h2>
                                    <h3>Assistant Lead Software Engineer & Algorithms Developer</h3>
                                    <p>WPI class of 2025 Computer Science major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={KatieImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Katie Kartsen</h2>
                                    <h3>Scrum Master & Backend Developer</h3>
                                    <p>WPI class of 2026 Computer Science major and Robotics Engineering and Spanish
                                        minor</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={HienImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Hien Pham</h2>
                                    <h3>Full-Time Software Engineer & Backend Developer</h3>
                                    <p>WPI class of 2026 Computer Science major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={AananImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Aanan Goyal</h2>
                                    <h3>Full-Time Software Engineer & Algorithms Developer</h3>
                                    <p>WPI class of 2026 Computer Science and Physics major.</p>
                                </div>
                            </div>
                        </div>
                        <div className={"About-NameColumns"}>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={CameronImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Cameron Crane</h2>
                                    <h3>Project Manager & Frontend Developer</h3>
                                    <p>WPI class of 2024 Robotics Engineering and Biomedical Engineering major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={KennyImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Kenny Doan</h2>
                                    <h3>Assistant Lead Software Engineer & Frontend Developer</h3>
                                    <p>WPI class of 2026 Computer Science major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={LuisImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Luis Alzamora</h2>
                                    <h3>Product Owner & Frontend Developer</h3>
                                    <p>WPI class of 2026 Robotics Engineering major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={RodrickImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Rodrick Moore</h2>
                                    <h3>Document Analyst & Frontend Developer</h3>
                                    <p>WPI class of 2026 IMGD major.</p>
                                </div>
                            </div>
                            <div className={"About-TestCard"}>
                                <img className={"ProfilePicture"} src={PiotrImage} alt="profile picture"/>
                                <div className={"TextBox"}>
                                    <h2>Piotr Skoczylas</h2>
                                    <h3>Full-Time Software Engineer & Frontend Developer</h3>
                                    <p>WPI class of 2026 Computer Science major.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"AcknowledgementCard"}>
                        <p className={"meet-text"}>Acknowledgements</p>
                        <p className={"info"}>Brigham and Women's Hospital, and representative <a className={"blue-info"}>Andrew Shinn.</a></p>
                        <p className={"info"}>Icon made by <a className={"blue-info"}>Freepik</a> from <a href="https://www.flaticon.com" target="_blank" className={"info"}>www.flaticon.com.</a></p>
                    </div>
                    <div className={"CopyrightCard"}>
                        <p className={"copyright-text"}>The Brigham & Women’s Hospital maps and data used in this
                            application are copyrighted and provided for the sole use of educational purposes.</p>
                        <p className={"date"}>Created in 2024</p>
                    </div>
                </div>
            </div>
        </div>
    );

}

