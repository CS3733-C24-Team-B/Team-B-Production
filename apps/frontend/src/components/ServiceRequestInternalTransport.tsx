import React, {useState} from "react";
import axios from "axios";
import {InternalTransportationRequestType, PriorityType, StatusType} from "common/src/serviceRequestTypes.ts";

export function InternalTransportationRequestForm() {
    const [employee, setEmployee] = useState("");
    const [location, setLocation] = useState("");
    const [priority, setPriority] = useState(PriorityType.Low);
    const [status, setStatus] = useState(StatusType.Unassigned);
    const [toLocation, setToLocation] = useState("");
    const [mobilityAid, setMobilityAid] = useState("");
    const [patientName, setPatientName] = useState("");

    async function submit() {
        const requestInfo: InternalTransportationRequestType = {
            employee: employee,
            location: location,
            priority: priority,
            status: status,
            toLocation: toLocation,
            mobilityAid: mobilityAid,
            patientName: patientName
        };

        // TODO: change to correct POST request URL later
        const res = await axios.post("/api/internalTransportationRequest", requestInfo, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.status == 200) {
            console.log("successfully sent POST request");
            window.location.reload();
        } else {
            console.error("failed to send POST request");
        }
    }

    return (
        <div>

            <div>
                <h1>Internal Patient Transportation Service Request</h1>
            </div>

            <div>
                <p>Employee Making Request</p>
                <input value={employee} onChange={(e) => {
                    setEmployee(e.target.value);
                }} type="text"/>
            </div>

            <div>
                <p>Priority of Request</p>
                <select value={priority} onChange={(e) => {
                    setPriority(PriorityType[e.target.value as keyof typeof PriorityType]);
                }}>
                    {Object.keys(PriorityType).map(key => (
                        <option key={key} value={key}>
                            {PriorityType[key as keyof typeof PriorityType]}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                {/* just a string for now, will be searchable dropdown in our app*/}
                <p>Location of Request</p>
                <input value={location} onChange={(e) => {
                    setLocation(e.target.value);
                }} type="text"/>
            </div>

            <div>
                {/* just a string for now, will be searchable dropdown in our app*/}
                <p>Location to Move Patient</p>
                <input value={toLocation} onChange={(e) => {
                    setToLocation(e.target.value);
                }} type="text"/>
            </div>

            <div>
                <p>Patient Name</p>
                <input value={patientName} onChange={(e) => {
                    setPatientName(e.target.value);
                }} type="text"/>
            </div>

            <div>
                <p>Mobility Aid</p>
                <input value={mobilityAid} onChange={(e) => {
                    setMobilityAid(e.target.value);
                }}/>
            </div>

            <div>
                <p>Status of Request</p>
                <select value={status} onChange={(e) => {
                    setStatus(StatusType[e.target.value as keyof typeof StatusType]);
                }}>
                    {Object.keys(StatusType).map(key => (
                        <option key={key} value={key}>
                            {StatusType[key as keyof typeof StatusType]}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <button onClick={submit}>Submit</button>
            </div>

        </div>
    );
}
