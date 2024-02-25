import { useEffect, useState } from "react";
import axios from 'axios';
import { ServiceRequest } from "common/src/serviceRequestTypes.ts";
import { useAuth0 } from "@auth0/auth0-react";

export default function CountOpenRequest() {
    const [srData, setsrData] = useState<ServiceRequest[]>([]);
    const [countOfOpenRequests, setCountOfOpenRequests] = useState<number>(0);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        let isMounted = true;
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
            isMounted = false;
        };
    }, [getAccessTokenSilently]);

    useEffect(() => {
        const count = srData.filter((request) => request.status !== "Completed").length;
        setCountOfOpenRequests(count);
    }, [srData]);

    return countOfOpenRequests;


};
