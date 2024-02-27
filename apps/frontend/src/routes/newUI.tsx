import React from "react";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";

export default function NewUITemplete() {
  return (
    <div className={"Container"}>
      {" "}
      {/* expands area across entire screen */}
      <Topbar /> {/* TopGreen css fixes this to the top */}
      <Navbar /> {/* NavBlue css fixes this to the left */}
      <div className={"service-list-BackBlue"}>
        {" "}
        {/* divides area below topbar into navbar and main space */}
        <div className={"service-list-TwoColumns"}>
          <div className={"SR-ThreeRows"}>
            <div className={"TestCard"}></div>
            <div className={"TestCard"}></div>
            <div className={"TwoColumnsThirdRow"}>
              <div className={"TestCard"}></div>
              <div className={"TestCard"}></div>
            </div>
          </div>
          <div className={"TwoRows"}>
            <div className={"TestCard"}></div>
            <div className={"TestCard"}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
