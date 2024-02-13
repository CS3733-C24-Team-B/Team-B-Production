import React, { useState } from "react";
import TextField from '@mui/material/TextField';

const SanitationRequest = () => {
    const [additionalField1, setAdditionalField1] = useState("");

    return (
        <>
            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Hazards"
                    variant="standard"
                    value={additionalField1}
                    onChange={(e) => setAdditionalField1(e.target.value)}
                    type="text"
                    required
                />
            </div>
        </>
    );
};

export default SanitationRequest;
