import React, {useState, useEffect} from "react";
import axios from "axios";
import {Autocomplete, TextField} from "@mui/material";

// Cameron and Katy
const InternalTransportationRequest = ({change1, change2, change3}) => {
    const [nodeData, setNodeData] = useState([]);
    const [toLocation, setToLocation] = useState("");
    const [mobilityAid, setMobilityAid] = useState("");
    const [patientName, setPatientName] = useState("");
    console.log(toLocation);

    function handleChange1(input: string) {
        setToLocation(input);
        change1(input);
    }

    function handleChange2(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        const value = event.target.value;
        setPatientName(value);
        change2(value);
    }

    function handleChange3(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        const value = event.target.value;
        setMobilityAid(value);
        change3(value);
    }

    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/nodes/read");

            setNodeData(res.data);
        }

        fetch().then();
    }, []);

    const currNodes = nodeData.filter(({nodeType}) => {
        return nodeType !== "HALL";
    });

    interface NodeType {
        label: string,
        nid: string
    }

    return (
        <>
            <div className="input-field">
                <Autocomplete
                    style={{width: window.innerWidth * 0.38}}
                    disablePortal
                    options={currNodes.map(({nodeID, longName}): NodeType => (
                        {label: longName, nid: nodeID}
                    ))}
                    size={"small"}
                    renderInput={(params) =>
                        <TextField {...params} label="To Location" variant="standard"/>}
                    //value={{label: nodeIDtoName(location), nid: location}}
                    getOptionLabel={(nd : NodeType) =>
                        `${nd.label}`
                    }
                    getOptionKey={(nd : NodeType) =>
                        `${nd.nid}`
                    }
                    onChange={(newValue, val) => {
                        if (val !== null) {
                            handleChange1(val.nid);
                        }
                    }}
                />
            </div>

            <div className="input-field">
                <TextField
                    style={{width: window.innerWidth * 0.38}}
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

            <div className="top-space">
                <TextField
                    style={{width: window.innerWidth * 0.38}}
                    multiline
                    rows={3}
                    id="standard-basic"
                    label="Mobility Aid"
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
