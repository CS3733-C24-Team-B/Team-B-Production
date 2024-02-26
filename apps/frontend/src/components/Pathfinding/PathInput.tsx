import React, { useState } from "react";
import "../../css/pathhandler.css";

export const PathInput: React.FC<{
  onDataSubmit: (data: { input1: string; input2: string }) => void;
}> = ({ onDataSubmit }) => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDataSubmit({ input1, input2 });
  };
  /*function nodeIDtoName(nId : string) {
        return nodeData.find(({nodeID}) =>
            nodeID === nId
        )!["longName"];
    }*/
  //

  return (
    <div className="pathhandler">
      <h1>Find Path between Two Nodes</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input1">Starting Node ID: </label>
        <input
          type="text"
          id="input1"
          name="input1"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          required
        />
        <br />
        <label htmlFor="input2">Ending Node ID: </label>
        <input
          type="text"
          id="input2"
          name="input2"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PathInput;
