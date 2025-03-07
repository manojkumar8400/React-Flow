import React from "react"
import { Handle, Position } from "@xyflow/react"
import dummyImg from "./assets/image1.png"

const CustomNode = ({ data, onEdit }) => {
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
      <div
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // gap: "1rem",
        }}
      >
        <span style={{ fontSize: "16px" }}>{data.label}</span>
        <div style={{ fontSize: "12px" }}>
          {data.image && (
            <img className='dummy-img' src={data.image} alt='uploaded' />
          )}
          {data.url && <span>{data.url}</span>}
          {data.method && <span>{data.method}</span>}
        </div>
        <button
          style={{ margin: 0, padding: "5px 1rem", fontSize: "10px" }}
          onClick={() => onEdit({ ...data, id: data.id })}
        >
          Edit
        </button>
      </div>
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export default CustomNode
