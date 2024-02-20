import React from "react";
import AboutUsImage from "../images/AboutUsImage.png";
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
                        <div className={"TestCard"}>
                            <img className={"AboutImage"} src={AboutUsImage} alt={"Image"} />
                        </div>
                    </div>
                    <div className={"MeetTheTeam"}>
                        <p className={"meet-text"}>Meet the Team</p>
                        <div className={"Slideshow"}>
                            <div className={"TeamMember"}>
                                <div className={"Picture1"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture2"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture3"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture4"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture5"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture6"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture7"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture8"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture9"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                            <div className={"TeamMember"}>
                                <div className={"Picture10"}> insert person image</div>
                                <div className={"TeamText"}>
                                    <p className={"name"}> insert name here </p>
                                    <p className={"position"}> insert position(s) here </p>
                                    <p className={"info"}> insert info here </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"AcknowledgementCard"}>
                        <p className={"meet-text"}>Acknowledgements</p>
                        <p className={"info"}>help{/*Brigham and Women's Hospital, and representative </p> <p className={"blue-info"}>Andrew Shinn</p>
                        <p className={"info"}>Icon made by </p> <p className={"blue-info"}>Freepik</p> <p className={"info"}> from www.flaticon.com*/}</p>
                    </div>
                    <div className={"CopyrightCard"}>
                        <p className={"copyright-text"}>The Brigham & Women’s Hospital maps and data used in this
                            application are copyrighted and provided for the sole use of educational purposes.</p>
                        <p className={"date"}>Created in 2023</p>
                    </div>
                </div>
            </div>
        </div>
    );

}

