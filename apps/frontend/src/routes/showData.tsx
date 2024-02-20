import React, {useEffect, useState} from "react";
import {Bar, Pie} from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale, BarElement} from 'chart.js';
import { ChartOptions } from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import "../css/chart.css";
import {useAuth0} from "@auth0/auth0-react";


ChartJS.register(BarElement, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale);

function ShowData() {
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
    console.log(srData);
    srData.forEach(item => {
        if (item.internalTransport !== null) categories.internalTransport++;
        if (item.language !== null) categories.language++;
        if (item.maintenance !== null) categories.maintenance++;
        if (item.medicine !== null) categories.medicine++;
        if (item.sanitation !== null) categories.sanitation++;
    });

    const chartData = {
        labels: Object.keys(categories),
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
                        size: 14,
                        family: 'Arial',
                    }
                },
                position: 'bottom',
            },
            tooltip: {
                bodyFont: {
                    size: 12,
                    family: 'Arial',
                },
                titleFont: {
                    size: 14,
                    family: 'Arial',
                }
            },
            title: {
                display: true,
                text: 'Number of Requests in Types',
                font: {
                    size: 16,
                    family: 'Arial',
                },
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
    const priorityCounts = { Low: 0, Medium: 0, High: 0, Emergency: 0 };

    srData.forEach(item => {
        const priority = item.priority as keyof typeof priorityCounts;
        if (Object.prototype.hasOwnProperty.call(priorityCounts, priority)) {
            priorityCounts[priority]++;
        }
    });
    const barData = {
        labels: Object.keys(priorityCounts),
        datasets: [{
            label: 'Number of Requests by Priority',
            data: Object.values(priorityCounts),
            backgroundColor: ['blue', 'yellow', 'orange', 'red'],
        }]
    };

    const bar_options = {
        aspectRatio: 2,
        maintainAspectRatio: true,
    };



    return (
        <div>
            <div style={{gridArea: 'main'}} className="header-container2">
            </div>

            <div className="chartbox">
                <Pie data={chartData} options={options}/>
                <Bar data={barData} options={bar_options}/>
            </div>
        </div>
    );

};


export default ShowData;
