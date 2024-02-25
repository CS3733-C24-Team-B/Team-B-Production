import React from 'react';
import '../../css/StatsDisplay.css'; // Make sure to create a corresponding CSS file

interface StatsProps {
    number: number | string;
    label: string;
    percentage?: boolean; // Optional prop to indicate if the number is a percentage
}

const StatsDisplay: React.FC<StatsProps> = ({ number, label, percentage }) => {
    const formattedNumber = percentage ? `${number}%` : number.toLocaleString();

    return (
        <div className="stats-container">
            <div className="stats-number">{formattedNumber}</div>
            <div className="stats-label">{label}</div>
        </div>
    );
};

export default StatsDisplay;
