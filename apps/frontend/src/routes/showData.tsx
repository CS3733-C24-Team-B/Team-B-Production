import React, {useEffect, useState} from "react";
import { Pie } from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale} from 'chart.js';
import { ChartOptions } from 'chart.js';
import axios from 'axios';
import {CategoryKey, ServiceRequest} from "common/src/serviceRequestTypes.ts";
import Navbar from "../components/Navbar.tsx";


ChartJS.register(Tooltip, Legend, ArcElement, Title, CategoryScale);

function ShowData() {
    const [srData, setSRData] = useState<ServiceRequest[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/api/service-request");
                setSRData(res.data);
            } catch (error) {
                console.error("There was an error fetching the service request data:", error);
            }
        }
        fetchData();
    }, []);

    const categories = {
        transport: 0,
        medicine: 0,
        sanitation: 0,
        maintenance: 0,
        language: 0
    };

    srData.forEach(item => {
        const noteCategoryParts = item.notes.split(",");
        if (noteCategoryParts.length === 0) return;
        const noteCategory = noteCategoryParts[0].trim();
        if (noteCategory in categories) {
            const key = noteCategory as CategoryKey;
            categories[key]++;
        }
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
            }
        },
        layout: {
            padding: {
                bottom: 100,
            },
        },
    };

    return (
        <div className="home-container">
            <div className="header-container2">
                <h1>Create Service Request</h1>
                <br/>
            </div>
            <div>
                <Navbar/>
            </div>
            <div className="chartbox" style={{
                padding: '20px',
                width: '100%',
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Pie data={chartData} options={options}/>
            </div>
        </div>
    );

};

export default ShowData;
