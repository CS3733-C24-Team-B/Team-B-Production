import React from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/about_page.css";

export default function NewUITemplete() {
    return (
        <div className={"AboutContainer"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"FiveRows"}>
                    <div className={"about-header"}>About Us</div>
                    <div className={"AboutTwoColumns"}>
                        <div className={"LabelCard"}></div>
                        <div className={"TestCard"}> insert image here </div>
                    </div>
                    <div className={"MeetTheTeamCard"}>Meet The Team</div>
                    <div className={"AcknowledgementCard"}>Acknowledgements</div>
                    <div className={"CopyrightCard"}></div>
                </div>
            </div>
        </div>
    );

}
