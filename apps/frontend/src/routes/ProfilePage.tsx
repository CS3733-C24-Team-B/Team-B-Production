import React from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/profile_page.css";

export default function ProfilePage() {
    return (
        <div className={"Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"Profile-page-TwoColumns"}>
                    <div className={"Profile-page-TwoRows"}>
                        <div className={"TestCard"}></div>
                        <div className={"TestCard"}></div>
                    </div>
                    <div className={"Profile-page-ThreeRows"}>
                        <div className={"TwoColumnsFirstRow"}>
                            <div className={"Profile-page-top-TestCard"}></div>
                            <div className={"Profile-page-top-TestCard"}></div>
                            <div className={"Profile-page-top-TestCard"}></div>
                        </div>
                        <div className={"Profile-page-TwoColumnsSecondRow"}>
                            <div className={"TestCard"}></div>
                            <div className={"Profile-page-TwoColumnsSecondRow-SecondColumns"}>
                                <div className={"SecondRow_SecondColumn-TestCard"}></div>
                                <div className={"SecondRow_SecondColumn-TestCard"}></div>
                            </div>
                        </div>
                        <div className={"Profile-page-TwoColumnsThirdRow"}>
                            <div className={"Profile-page-bottom-TestCard"}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
