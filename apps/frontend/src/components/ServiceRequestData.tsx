import React, {useEffect, useState } from "react";
import axios from 'axios';
import {ServiceRequest, StatusType} from "common/src/serviceRequestTypes.ts";
import {useAuth0} from "@auth0/auth0-react";

export default function ServiceRequestData(dataType:"completed"|"available"|"assigned"){
    const {loginWithRedirect, user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const [srData, setsrData] = useState<ServiceRequest[]>([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function fetchData() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/service-request", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            setsrData(res.data);
            const res2 = await axios.get(`/api/employee/${user!.email!}`, {
                params: {
                    email: user!.email!
                },
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            setEmail(res2.data.email);
        }

        fetchData();
    }, [getAccessTokenSilently,user]);
    let completedCount = 0;
    let assignedCount = 0;
    let availableCount = 0;
    srData.forEach(item => {
        if(item.status===StatusType.Completed){completedCount++;}
        if(item.assignedTo.email===email){assignedCount++;}
        if(item.status!==StatusType.Completed){availableCount++;}
    });


    if (!isLoading && !isAuthenticated) {
        loginWithRedirect().then();
        return;
    }
if(dataType==="completed") {
    return (
        <div>
            {completedCount}

        </div>
    );
}
    if(dataType==="available") {
        return (
            <div>
                {availableCount}

            </div>
        );
    }
    if(dataType==="assigned") {
        return (
            <div>
                {assignedCount}

            </div>
        );
    }
}
