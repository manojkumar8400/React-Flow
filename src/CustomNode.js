import React from "react"
import { Handle, Position } from "@xyflow/react"

const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: 5,
        borderRadius: 5,
        backgroundColor: data.bgColor || "#ffffff",
        border: `2px solid ${data.borderColor || "#000000"}`,
        textAlign: "center",
        fontSize: "15px",	
      }}
    >
      <p style={{margin: 0}}>{data.label}</p>
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export default CustomNode
