import React, {useState, useEffect} from "react";
import axios from "axios";
import {Autocomplete, Box, Button, Modal, TextField} from "@mui/material";
import MiniMap from "./LeafletMiniMap.tsx";

const mapStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

// Cameron and Katy
const InternalTransportationRequest = (props: {change1: (arg0: string) => void, change2: (arg0: string) => void, change3: (arg0: string) => void}) => {
    const {change1, change2, change3} = props;
    const [nodeData, setNodeData] = useState([]);
    const [toLocation, setToLocation] = useState("");
    const [mobilityAid, setMobilityAid] = useState("");
    const [patientName, setPatientName] = useState("");
    const [showMap, setShowMap] = useState(false);
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

    return (
        <div className="modal-div">
            <div style={{display: 'flex', flexDirection: 'row', width: window.innerWidth * 0.38, gap: '2%'}}>
                <Autocomplete
                    style={{width: '100%'}}
                    disablePortal
                    options={currNodes.map(({nodeID, longName}): NodeType => (
                        {label: longName, nid: nodeID}
                    ))}
                    size={"small"}
                    renderInput={(params) =>
                        <TextField {...params} label="To Location" variant="standard"/>}
                    value={{label: nodeIDtoName(toLocation), nid: toLocation}}
                    getOptionLabel={(nd : NodeType) =>
                        `${nd.label}`
                    }
                    getOptionKey={(nd : NodeType) =>
                        `${nd.nid}`
                    }
                    onChange={(newValue, val) => {
                        console.log(newValue);
                        if (val !== null) {
                            handleChange1(val.nid);
                        }
                    }}
                />
                <Button variant={"outlined"} style={{color: "#34AD84",
                    width: 220, fontSize: '0.7em'}} onClick={() => setShowMap(true)}>
                    Choose From Map
                </Button>
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
            <Modal
                open={showMap}
                onClose={() => {
                    setShowMap(false);
                }}
                style={{fontFamily: 'Lato'}}
            >
                <Box sx={mapStyle}>
                    <MiniMap change={handleChange1} setClose={setShowMap}/>
                </Box>
            </Modal>
        </div>
    );
};

export default InternalTransportationRequest;
