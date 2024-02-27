import React, {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale, BarElement} from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import {useAuth0} from "@auth0/auth0-react";
import "../../css/dashboard.css";
import {ChartOptions} from 'chart.js';

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
            try {
                const accessToken: string = await getAccessTokenSilently();
                const res = await axios.get("/api/service-request", {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });
                setsrData(res.data);
            } catch (error) {
                console.error('Error fetching service request data', error);
            }
        }

        fetchData().then();
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
        Low: 'rgba(44,208,158,255)',
        Medium: 'rgba(71,136,254,255)',
        High: 'rgba(255,208,119,255)',
        Emergency: 'rgba(252,74,122,255)',
    };

    const datasets = Object.entries(priorityStatusCounts).map(([priority, statuses]) => ({
        label: priority,
        data: Object.values(statuses),
        backgroundColor: priorityColors[priority as Priority]
    }));

    const stackBarData = {
        labels: ["Paused", "Completed", "In Progress", "Assigned", "Unassigned"],
        datasets,
    };

    const stackBarOptions: ChartOptions<'bar'> = {
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
                        weight: 'bold' as const, // Correctly specifying the font weight
                    }
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    color: 'black',
                    // Explicitly type the parameter as a number to resolve TS7006
                    callback: function(tickValue: string | number): string | number | null | undefined {
                        const value = Number(tickValue);
                        if (value % 1 === 0) {
                            return value;
                        }
                        return undefined; // Explicitly return undefined for non-integer values
                    }
                },
                title: {
                    display: true,
                    text: 'Number of Requests',
                    color: 'black',
                    font: {
                        weight: 'bold' as const, // Correctly specifying the font weight
                    }
                }
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'black',
                    font: {
                        size: 12,
                        // If necessary, specify weight here as well, e.g., weight: 'bold' as const
                    }
                },
            },
        }
    };

    return (
        <div>
            <div className={"stacked-bar-title"}>
                Request Status Data
            </div>
            <div style={{
                width: '90%',
                height: '40vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Bar data={stackBarData} options={stackBarOptions}/>
            </div>

        </div>

    );
};
