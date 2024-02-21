import React, {useEffect, useState } from "react";
import {Pie} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import axios from 'axios';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import {useAuth0} from "@auth0/auth0-react";
import "../css/dashboard.css";

export default function PieChartStats(){
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
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 24,
                        family: 'Arial',
                    },
                    color: 'black',
                    padding: 20,
                },
                position: 'right',
            },
            tooltip: {
                bodyFont: {
                    size: 16,
                    family: 'Arial',
                },
                bodyColor: 'white',
                titleFont: {
                    size: 18,
                    family: 'Arial',
                },
                titleColor: 'white',
            },
        },
        layout: {
            padding: {
                left: 20,
                bottom: 100,
                right: 50,
            },
        },
    };

    return (
        <div>
            <div className={"Piechart-title"}>
                Number of Requests in Types
            </div>
            <div className="chart-container" style={{
                width: '100%',
                height: '75vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                justifySelf: 'center'
            }}>
                <Pie data={chartData} options={options}/>
            </div>
        </div>

    );
}
