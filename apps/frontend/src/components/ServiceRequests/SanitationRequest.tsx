import React, { useState } from "react";
import TextField from '@mui/material/TextField';

// Michael
const SanitationRequest = (props: { change: (arg0: string) => void}) => {
    const {change} = props;
    const [additionalField1, setAdditionalField1] = useState("");
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        const value = event.target.value;
        setAdditionalField1(value);
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
                    label="Hazards"
                    value={additionalField1}
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

export default SanitationRequest;
