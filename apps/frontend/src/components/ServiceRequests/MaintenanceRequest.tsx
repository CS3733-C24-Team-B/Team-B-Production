import React, {useState} from 'react';
import {TextField} from "@mui/material";

// Kenny
const MaintenanceRequest = (props: {change: (arg0: string) => void}) => {
    const {change} = props;
    const [details, setDetails] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        const value = event.target.value;
        setDetails(value);
        change(value);
    }

    return (
        <div className="modal-div">
            <div className="top-space">
                <TextField
                    style={{width: window.innerWidth * 0.38}}
                    multiline
                    rows={3}
                    id="standard-basic"
                    label="Details"
                    value={details}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    type="text"
                    required
                />
            </div>
        </div>
    );
};

export default MaintenanceRequest;
