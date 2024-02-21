import React, {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale, BarElement} from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import {useAuth0} from "@auth0/auth0-react";
import "../css/dashboard.css";

ChartJS.register(BarElement, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale);


export default function StackedBarChart() {
    const [srData, setsrData] = useState<ServiceRequest[]>([]);
    const {getAccessTokenSilently} = useAuth0();

    type Status = 'Paused' | 'Completed' | 'InProgress' | 'Assigned' | 'Unassigned';
    type Priority = 'Low' | 'Medium' | 'High' | 'Emergency';
    const statusMapping: Record<string, Status> = {
        'In Progress': 'InProgress',
        'Paused': 'Paused',
        'Completed': 'Completed',
        'Assigned': 'Assigned',
        'Unassigned': 'Unassigned',
    };

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

    const priorityStatusCounts: Record<Priority, Record<Status, number>> = {
        Low: {Paused: 0, Completed: 0, InProgress: 0, Assigned: 0, Unassigned: 0},
        Medium: {Paused: 0, Completed: 0, InProgress: 0, Assigned: 0, Unassigned: 0},
        High: {Paused: 0, Completed: 0, InProgress: 0, Assigned: 0, Unassigned: 0},
        Emergency: {Paused: 0, Completed: 0, InProgress: 0, Assigned: 0, Unassigned: 0},
    };

    srData.forEach(item => {
        const normalizedStatus = statusMapping[item.status];
        const priority = item.priority as Priority;
        if (priorityStatusCounts[priority] && normalizedStatus && priorityStatusCounts[priority][normalizedStatus] !== undefined) {
            priorityStatusCounts[priority][normalizedStatus]++;
        }
    });
    const priorityColors: Record<Priority, string> = {
        Low: 'blue',
        Medium: 'yellow',
        High: 'orange',
        Emergency: 'red', // Set Emergency to red
    };

    const datasets = Object.entries(priorityStatusCounts).map(([priority, statuses]) => ({
        label: priority,
        data: Object.values(statuses),
        backgroundColor: priorityColors[priority as Priority]
    }));

    const stackBarData = {
        labels: ["Paused", "Completed", "InProgress", "Assigned", "Unassigned"],
        datasets,
    };

    const stackBarOptions = {
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: 'black'
                },
                title: {
                    display: true,
                    text: 'Priority',
                    color: 'black',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: 'black'
                },
                title: {
                    display: true,
                    text: 'Number of Requests',
                    color: 'black',
                    font: {
                        weight: 'bold'
                    }
                }
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'black',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Priority and Status of Requests',
                font: {
                    size: 16
                },
                color: 'black'
            }
        }
    };

    return (
        <Bar data={stackBarData} options={stackBarOptions}/>
    );
};
