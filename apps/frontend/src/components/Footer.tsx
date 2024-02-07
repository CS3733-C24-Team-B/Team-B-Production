import React from 'react';
import "../css/footer.css";

const Footer: React.FC = () => {
    return (
        <div className="footer-container">
            <a href="/home">Home</a>
            <a href="/csvnodedata">CSV Node Data</a>
            <a href="/csvedgedata">CSV Edge Data</a>
            <a href="/requestform">Service Request Form</a>
            <a href="/servicerequestlist">Service Request List</a>
            <a href="/apps/frontend/src/routes/Profile">Settings</a>
        </div>
    );
};

export default Footer;
