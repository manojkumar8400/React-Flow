import React from "react";
import { Handle, Position } from "@xyflow/react";

const ImageNode = ({ data }) => {
  return (
    <div style={{ textAlign: "center", border: "1px solid #ccc", padding: 10, borderRadius: 5 }}>
      <img src={data.src} alt="Node" width={100} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ImageNode;
