import { useEffect, useState } from "react";
import axios from 'axios';
import { ServiceRequest } from "common/src/serviceRequestTypes.ts";
import { useAuth0 } from "@auth0/auth0-react";

export default function CountRequestToday () {
    const [srData, setsrData] = useState<ServiceRequest[]>([]);
    const [countOfRequestsToday, setCountOfRequestsToday] = useState<number>(0);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        let isMounted = true; // to handle async call memory leak
        async function fetchData() {
            try {
                const accessToken: string = await getAccessTokenSilently();
                const response = await axios.get<ServiceRequest[]>("/api/service-request", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (isMounted) setsrData(response.data);
            } catch (error) {
                console.error('Error fetching service request data', error);
                // You can handle errors by setting some state variable here
            }
        }

        fetchData();
        return () => {
            isMounted = false; // clean up the effect when the component unmounts
        };
    }, [getAccessTokenSilently]);

    useEffect(() => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Set to start of today (midnight)

        const count = srData.filter((request) => {
            const requestDate = new Date(request.timeCreated);
            return requestDate >= startOfToday;
        }).length;

        setCountOfRequestsToday(count);
    }, [srData]);

    return countOfRequestsToday;
};
