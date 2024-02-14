import React, {useState, useEffect} from "react";
import axios from "axios";
import {Autocomplete, TextField} from "@mui/material";

const InternalTransportationRequest = ({change1, change2, change3}) => {
    const [nodeData, setNodeData] = useState([]);
    const [toLocation, setToLocation] = useState("");
    const [mobilityAid, setMobilityAid] = useState("");
    const [patientName, setPatientName] = useState("");

    function handleChange1(input: string) {
        setToLocation(input);
        change1(input);
    }

    function handleChange2(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setPatientName(value);
        change2(value);
    }

    function handleChange3(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setMobilityAid(value);
        change3(value);
    }

    useEffect(() => {
        async function fetch() {
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            } catch {
                console.log("post error");
            }
            const res = await axios.get("/api/db-load-nodes");

            setNodeData(res.data);
        }

        fetch().then();
    }, []);

    return (
        <>
            <div className="input-field">
                <Autocomplete
                    disablePortal
                    options={nodeData.map(({longName}): { label: string } => (
                        {label: longName}
                    ))}
                    size={"small"}
                    renderInput={(params) =>
                        <TextField {...params} label="Location to Move Patient" variant="standard"/>}
                    value={{label: toLocation}}
                    onChange={(newValue) => {
                        if (newValue !== null && newValue.target.innerText !== undefined) {
                            handleChange1(newValue.target.innerText);
                        }
                    }}
                />
            </div>

            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Patient Name"
                    variant="standard"
                    value={patientName}
                    onChange={(e) => {
                        handleChange2(e);
                    }}
                    type="text"
                    required
                />
            </div>

            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Mobility Aid"
                    variant="standard"
                    value={mobilityAid}
                    onChange={(e) => {
                        handleChange3(e);
                    }}
                    type="text"
                    required
                />
            </div>

        </>
    );
};

export default InternalTransportationRequest;
