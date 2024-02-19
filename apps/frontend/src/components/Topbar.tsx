import React from "react";
import logo from "../images/BandW-Logo-White.png";
import "../css/topbar.css";

interface TopbarProps {
    elems: React.ReactNode[];
}

export default function Topbar({elems} : TopbarProps) {
    return (
        <div className={"TopGreen"}>
            <img src={logo} className={"logo-style"}/>
            <div className={"topbar-elems"}>
                {elems.map((elem) => elem)}
            </div>
        </div>
    );
}

Topbar.defaultProps = {
    elems: []
};
