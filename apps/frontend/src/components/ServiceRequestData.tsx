import React, {useEffect, useState } from "react";
import axios from 'axios';
import {ServiceRequest, StatusType} from "common/src/serviceRequestTypes.ts";
import {useAuth0} from "@auth0/auth0-react";

export default function ServiceRequestData(dataType:"completed"|"available"|"assigned"|"requests"|"recents"){
    const [nodeData, setNodeData] = useState([]);
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
            if(isAuthenticated) {
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

            const res3 = await axios.get("/api/nodes/read");
            setNodeData(res3.data);
        }

        fetchData();
    }, [getAccessTokenSilently, isAuthenticated, user]);

    function getReqType(nsr: ServiceRequest) {
        if (nsr.sanitation) {
            return "Sanitation";
        } else if (nsr.medicine) {
            return "Medicine";
        } else if (nsr.maintenance) {
            return "Maintenance";
        } else if (nsr.internalTransport) {
            return "Internal Transport";
        } else if (nsr.language) {
            return "Language";
        }
        return "";
    }
    let completedCount = 0;
    let assignedCount = 0;
    let availableCount = 0;
    let myRequests:ServiceRequest[] = [];
    let recentRequests:ServiceRequest[] = [];
    srData.forEach(item => {
        if(item.status===StatusType.Completed){completedCount++;}
        if(item.assignedTo!==null&&item.assignedTo.email===email){
            assignedCount++;
            myRequests.push(item);
        }
        if(item.status!==StatusType.Completed){availableCount++;}
        recentRequests.push(item);
        recentRequests.sort((a,b) => new Date(a.timeCreated).getTime()-new Date(b.timeCreated).getTime());
    });


    if (!isLoading && !isAuthenticated) {
        loginWithRedirect().then();
        return;
    }

    function nodeIDtoName(nId: string) {
        const node = nodeData.find(({nodeID}) =>
            nodeID === nId
        );
        if (node !== undefined) {
            return node!["longName"];
        } else {
            return "";
        }
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

    if(dataType==="requests") {
        return (
            <div>
                <ul>{myRequests.map(obj =>
                    <div><div style={{color:"green",fontSize:20}}>{getReqType(obj)}</div>
                        <div style={{fontSize:20}}>Request</div>
                        <div style={{fontSize:14, marginBlockEnd:12}}>Priority: {obj.priority}<br/>
                        Location: {nodeIDtoName(obj.locationID)}<br/>
                        Notes: {obj.notes}</div></div>)}</ul>
            </div>
        );
    }
    if(dataType==="recents") {
        return (
            <div>
                <ul>{recentRequests.slice(0,5).map(obj =>
                      <div>
                          <div style={{fontSize:18}}>{getReqType(obj)} Request</div>
                        <div style={{fontSize:12, marginBlockEnd:20}}>{nodeIDtoName(obj.locationID)}</div></div>)}</ul>
            </div>
        );
    }
}
