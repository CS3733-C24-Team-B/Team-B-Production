import React, { useState } from "react";
import TextField from '@mui/material/TextField';

const MedicineRequest = ({ change1, change2 }) => {
    const [additionalField1, setAdditionalField1] = useState("");
    const [additionalField2, setAdditionalField2] = useState("");
    function handleChange1(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setAdditionalField1(value);
        change1(value);
    }

    function handleChange2(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setAdditionalField2(value);
        change2(value);
    }

    return (
        <>
            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Medicine Type"
                    variant="standard"
                    value={additionalField1}
                    onChange={(e) => handleChange1(e)}
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
                    onChange={(e) => handleChange2(e)}
                    type="text"
                    required
                />
            </div>
        </>
    );
};

export default MedicineRequest;
