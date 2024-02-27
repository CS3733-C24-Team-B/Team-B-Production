import React from "react";
import {Pie} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import {ServiceRequest} from "common/src/serviceRequestTypes.ts";
import "../../css/dashboard.css";

export default function PieChartStats(props:{srlist:ServiceRequest[], title:string}){
    const {srlist, title} = props;
    // const [srData, setsrData] = useState<ServiceRequest[]>([]);
    // const {getAccessTokenSilently} = useAuth0();
    // useEffect(() => {
    //     async function fetchData() {
    //         const accessToken: string = await getAccessTokenSilently();
    //         const res = await axios.get("/api/service-request", {
    //             headers: {
    //                 Authorization: "Bearer " + accessToken
    //             }
    //         });
    //         setsrData(res.data);
    //     }
    //
    //     fetchData();
    // }, [getAccessTokenSilently]);

    const categories = {
        internalTransport: 0,
        medicine: 0,
        sanitation: 0,
        maintenance: 0,
        language: 0
    };

    srlist.forEach(item => {
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
                        size: 15,
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
            title: {
                display: true,
                text: title,
                font: {
                    size: 25,
                    family: 'Lato', // Set the font family to Lato
                },
                color: 'black',
                align: 'start',
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },
        layout: {
            padding: {
                left: 20,
                bottom: 100,
            },
        },
    };

    if(title === "My Requests"){
        return (
            <div>
                <div className="chart-container" style={{
                    width: '100%',
                    height: '50vh',
                    maxWidth: '100%',
                    maxHeight: '200%',
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'end',
                    justifySelf: 'end'
                }}>
                    <Pie data={chartData} options={options}/>
                </div>
            </div>

        );
    }
    return (
        <div>
            <div className="chart-container" style={{
                width: '100%',
                height: '75vh',
                maxWidth: '100%',
                maxHeight: '200%',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'end',
                justifySelf: 'end'
            }}>
                <Pie data={chartData} options={options}/>
            </div>
        </div>

    );
}
