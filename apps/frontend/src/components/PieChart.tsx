import React, {useEffect, useState } from "react";
import {Pie} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import "../css/chart.css";
import {useAuth0} from "@auth0/auth0-react";
import "../css/dashboard.css";

export default function PieChart(){
    const [srData, setsrData] = useState<ServiceRequest[]>([]);
    const {getAccessTokenSilently} = useAuth0();
    useEffect(() => {
        async function fetchData() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/service-request", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            setsrData(res.data);
        }

        fetchData();
    }, [getAccessTokenSilently]);

    const categories = {
        internalTransport: 0,
        medicine: 0,
        sanitation: 0,
        maintenance: 0,
        language: 0
    };

    srData.forEach(item => {
        if (item.internalTransport !== null) categories.internalTransport++;
        if (item.language !== null) categories.language++;
        if (item.maintenance !== null) categories.maintenance++;
        if (item.medicine !== null) categories.medicine++;
        if (item.sanitation !== null) categories.sanitation++;
    });

    function formatLabel(label: string): string {
        const withSpaces = label.replace(/([A-Z])/g, ' $1');
        const capitalizedWords = withSpaces.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');

        return capitalizedWords;
    }


    const chartData = {
        labels: Object.keys(categories).map(key => formatLabel(key)),
        datasets: [
            {
                label: "Number of Requests",
                data: Object.values(categories),
                backgroundColor: [
                    "#FF6B6B",
                    "#4ECDC4",
                    "#FFD166",
                    "#5E548E",
                    "#D6A2E8"
                ],
                borderRadius: 5,
            },
        ]
    };

    const options: ChartOptions<'pie'> = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 18,
                        family: 'Arial',
                        // The color property should not be inside font for legend labels
                    },
                    color: 'black', // Set legend text color to black here
                },
                position: 'bottom',
            },
            tooltip: {
                bodyFont: {
                    size: 16,
                    family: 'Arial',
                    // The color property should not be inside font for tooltip body
                },
                bodyColor: 'white', // Set tooltip body text color to black here
                titleFont: {
                    size: 18,
                    family: 'Arial',
                    // The color property should not be inside font for tooltip title
                },
                titleColor: 'white', // Set tooltip title text color to black here
            },
            title: {
                display: true,
                text: 'Number of Requests in Types',
                font: {
                    size: 20,
                    family: 'Arial',
                },
                color: 'black', // This is correctly placed for title
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },
        layout: {
            padding: {
                bottom: 100,
            },
        },
    };

    return (
        <Pie data={chartData} options={options}/>
    );
}
