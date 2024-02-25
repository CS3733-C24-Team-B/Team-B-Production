import React, {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale, BarElement} from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import {useAuth0} from "@auth0/auth0-react";
import "../../css/dashboard.css";

ChartJS.register(BarElement, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale);

export default function BarChart() {
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
console.log(srData);
    const priorityCounts = {Low: 0, Medium: 0, High: 0, Emergency: 0};

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
            backgroundColor: ['#54C0CC', '#1F4F59', '#7EA00E', '#DCD964'],
        }]
    };

    const bar_options = {
        aspectRatio: 2,
        maintainAspectRatio: true,
        scales: {
            x: {
                ticks: {
                    color: 'black', // Ensures x-axis tick labels are black
                },
                title: {
                    display: true,
                    text: 'Priority',
                    color: 'black', // Ensures x-axis title is black
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y: {
                ticks: {
                    color: 'black',
                    // Explicitly type the parameter as a number to resolve TS7006
                    callback: function(value: number) {
                        if (value % 1 === 0) { // Check if the value is an integer
                            return value;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Number of Requests',
                    color: 'black', // Ensures y-axis title is black
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'black', // Sets legend labels (dataset labels) to black
                },
            },
        },
        layout: {
            padding: {
                left: 20,
            },
        },
    };

    return (
        <div>
            <div className={"bar-chart-title"}>
                Priority Data
            </div>
            <div style={{
                width: '90%',
                height: '40vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Bar data={barData} options={bar_options}/>
            </div>
        </div>


    );
};
