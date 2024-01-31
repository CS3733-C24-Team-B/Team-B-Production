import React, { useState } from 'react';
import PathInput from "./PathInput.tsx";
import {PathPrinter} from "./PathPrinter.tsx";

export const PathHandler: React.FC = () => {
  const [formData, setFormData] = useState<{ input1: string; input2: string } | null>(null);

  const handleDataSubmit = (data: { input1: string; input2: string }) => {
    setFormData(data);
  };

  return (
    <div>
      <PathInput onDataSubmit={handleDataSubmit} />
      {formData && <PathPrinter startNode={formData.input1} endNode={formData.input2} />}
    </div>
  );
};

export default PathHandler;
