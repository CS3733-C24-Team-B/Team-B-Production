import React, {useState} from "react";
import {TextField} from "@mui/material";

const InternalTransportationRequest = ({change1, change2}) => {
    const [language1, setLanguage1] = useState("");
    const [language2, setLanguage2] = useState("");

    function handleChange1(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setLanguage1(value);
        change1(value);
    }

    function handleChange2(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) {
        let value = event.target.value;
        setLanguage2(value);
        change2(value);
    }

    return (
        <>

            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Language to Translate From"
                    variant="standard"
                    value={language1}
                    onChange={(e) => {
                        handleChange1(e);
                    }}
                    type="text"
                    required
                />
            </div>

            <div className="input-field">
                <TextField
                    id="standard-basic"
                    label="Language to Translate to"
                    variant="standard"
                    value={language2}
                    onChange={(e) => {
                        handleChange2(e);
                    }}
                    type="text"
                    required
                />
            </div>

        </>
    );
};

export default InternalTransportationRequest;
