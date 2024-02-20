import React, {useEffect, useState} from "react";
import {Bar, Pie} from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale, BarElement} from 'chart.js';
import {ChartOptions} from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
// import Navbar from "../components/Navbar.tsx";
import "../css/chart.css";
import {useAuth0} from "@auth0/auth0-react";
import "../css/dashboard.css";


ChartJS.register(BarElement, Tooltip, Legend, ArcElement, Title, CategoryScale, LinearScale);

function ShowData() {
    type Status = 'Paused' | 'Completed' | 'InProgress' | 'Assigned' | 'Unassigned';
    type Priority = 'Low' | 'Medium' | 'High' | 'Emergency';
    const statusMapping: Record<string, Status> = {
        'In Progress': 'InProgress',
        'Paused': 'Paused',
        'Completed': 'Completed',
        'Assigned': 'Assigned',
        'Unassigned': 'Unassigned',
    };
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
                    color: 'black', // Ensures y-axis tick labels are black
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
            title: {
                display: true,
                text: 'Number of Requests by Priority',
                color: 'black', // Ensures chart title is black
                font: {
                    size: 16,
                },
            },
        },
    };


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
        <div className="home">
            <div className="box box1">
                <Pie data={chartData} options={options}/>
            </div>
            <div className="box box2"><Bar data={barData} options={bar_options}/></div>
            <div className="box box7"><Bar data={stackBarData} options={stackBarOptions}/></div>
            {/*<div className="box box8">Hello</div>*/}
            {/*<div className="box box9">Hello</div>*/}
        </div>
    );

};


export default ShowData;
