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
            <div className="top-space">
                <TextField
                    style={{width: window.innerWidth * 0.38}}
                    multiline
                    rows={3}
                    id="standard-basic"
                    label="Hazards"
                    value={additionalField1}
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

export default SanitationRequest;
