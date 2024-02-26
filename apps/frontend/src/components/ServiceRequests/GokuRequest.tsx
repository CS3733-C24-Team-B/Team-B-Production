import React, {useState} from "react";
import TextField from '@mui/material/TextField';

const GokuRequest = () => {
    const [title, setTitle] = useState("");
    const [announcement, setAnnouncement] = useState("");

    return (
        <div className="modal-div">
            <div>
                <TextField
                    style={{width: window.innerWidth * 0.38}}
                    id="standard-basic"
                    label="Email Subject Line"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e)}
                    type="text"
                    required
                />
            </div>
            <div>
                <TextField
                    style={{width: window.innerWidth * 0.38}}
                    id="standard-basic"
                    label="Email Body"
                    variant="standard"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e)}
                    type="text"
                    required
                />
            </div>
        </div>
    );
};

export default GokuRequest;
