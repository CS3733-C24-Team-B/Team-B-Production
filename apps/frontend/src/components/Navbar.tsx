import React from 'react';
import "../css/navbar.css";

const Navbar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="navbar">
                <div className="navbar-butn">
                    <a href="/home">Home</a>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">CSV Data</button>
                    <div className="dropdown-content">
                        <a href="/csvnodedata">Node Data</a>
                        <a href="/csvedgedata">Edge Data</a>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Admin Options</button>
                    <div className="dropdown-content">
                        <a href="/requestForm">Service Request Form</a>
                        <a href="/servicerequestlist">List of Service Requests</a>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Profile</button>
                    <div className="dropdown-content">
                        <a href="/home">View Profile</a>
                        <link
                            rel="stylesheet"
                            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                        />
                        <a href="/settings">
                            <div className="fa fa-gear fa-spin"></div>
                            Settings
                        </a>
                        <a href="/">Log Out</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
