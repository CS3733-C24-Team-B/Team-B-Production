import React from 'react';
import "../css/sidebuttons.css";

const SideButtons: React.FC = () => {
    return (
        <div className="sidebuttons">
            <a href="/home">Home</a>
            <a href="/csvnodedata">CSV Node Data</a>
            <a href="/csvedgedata">CSV Edge Data</a>
            <a href="/requestform">Service Request Form</a>
            <a href="/servicerequestlist">Service Request List</a>
            <a href="/Settings">Settings</a>
        </div>
    );
};

export default SideButtons;