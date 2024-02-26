import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const GokuReq = ({ change1, change2 }) => {
  const [title, setTitle] = useState("");
  const [announcement, setAnnouncement] = useState("");

  function handleChange1(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const value = event.target.value;
    setTitle(value);
    change1(value);
  }

  function handleChange2(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const value = event.target.value;
    setAnnouncement(value);
    change2(value);
  }

  return (
    <div className="modal-div">
      <div>
        <TextField
          style={{ width: window.innerWidth * 0.38 }}
          id="standard-basic"
          label="Email Subject Line"
          variant="standard"
          value={title}
          onChange={(e) => {
            handleChange1(e);
          }}
          type="text"
          required
        />
      </div>
      <div>
        <TextField
          style={{ width: window.innerWidth * 0.38 }}
          multiline
          rows={3}
          id="standard-basic"
          label="Email Body"
          value={announcement}
          onChange={(e) => {
            handleChange2(e);
          }}
          type="text"
          required
        />
      </div>
    </div>
  );
};

export default GokuReq;
