import React from "react";
import { Handle, Position } from "@xyflow/react";

const ResizableNode = ({ data }) => {
  return (
    <div
      style={{
        width: data.width || 100,
        height: data.height || 60,
        background: "#FFC0CB",
        border: "1px solid black",
        resize: "both",
        overflow: "auto"
      }}
    >
      <strong>{data.label}</strong>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ResizableNode;
