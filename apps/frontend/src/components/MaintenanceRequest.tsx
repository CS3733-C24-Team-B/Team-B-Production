import React, {useState} from 'react';
import {TextField} from "@mui/material";

const MaintenanceRequest = ({change}) => {
    const [details, setDetails] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setDetails(value);
        change(value);
    }

    return (
        <>
            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Details"
                    variant="standard"
                    value={details}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    type="text"
                    required
                />
            </div>
        </>
    );
};

export default MaintenanceRequest;
