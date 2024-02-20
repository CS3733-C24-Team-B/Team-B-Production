import React from "react";
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
                            <p className={"welcome-text"}>WPI Computer Science Department</p>
                        </div>
                        <div className={"TestCard"}> insert image here </div>
                    </div>
                    <div className={"MeetTheTeamCard"}>
                        <p className={"meet-text"}>Meet the Team</p>
                    </div>
                    <div className={"AcknowledgementCard"}>
                        <p className={"meet-text"}>Acknowledgements</p>
                    </div>
                    <div className={"CopyrightCard"}>
                        <p className={"copyright-text"}>The Brigham & Women’s Hospital maps and data used in this
                            application are copyrighted and provided for the sole use of educational purposes.</p>
                    </div>
                </div>
            </div>
        </div>
    );

}
