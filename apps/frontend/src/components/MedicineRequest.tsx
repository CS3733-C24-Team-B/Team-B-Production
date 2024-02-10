import React, { useState } from "react";
import TextField from '@mui/material/TextField';

const MedicineRequest = () => {
    const [additionalField1, setAdditionalField1] = useState("");
    const [additionalField2, setAdditionalField2] = useState("");

    return (
        <>
            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Medicine Type"
                    variant="standard"
                    value={additionalField1}
                    onChange={(e) => setAdditionalField1(e.target.value)}
                    type="text"
                    required
                />
            </div>
            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Medication Dose"
                    variant="standard"
                    value={additionalField2}
                    onChange={(e) => setAdditionalField2(e.target.value)}
                    type="text"
                    required
                />
            </div>
        </>
    );
};

export default MedicineRequest;
