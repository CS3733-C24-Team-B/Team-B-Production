import React, { useState } from "react";
import TextField from '@mui/material/TextField';

// Michael
const SanitationRequest = ({ change }) => {
    const [additionalField1, setAdditionalField1] = useState("");
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setAdditionalField1(value);
        change(value);
    }

    return (
        <>
            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Hazards"
                    variant="standard"
                    value={additionalField1}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    type="text"
                    required
                />
            </div>
            <br/>
            <p> Created by Michael </p>
        </>
    );
};

export default SanitationRequest;
