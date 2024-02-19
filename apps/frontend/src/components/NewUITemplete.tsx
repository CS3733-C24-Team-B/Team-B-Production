import React from "react";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";

export default function NewUITemplete() {
    return (
        <div className={"Container"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"TwoColumns"}>
                    <div className={"Purple"}></div>
                    <div className={"Yellow"}></div>
                </div>
            </div>
        </div>
    );

}
