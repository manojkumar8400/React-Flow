import React from "react";

const GroupNode = ({ data }) => {
  return (
    <div style={{ padding: 20, background: "#F0F0F0", border: "2px solid black", borderRadius: 5 }}>
      <strong>{data.label}</strong>
      <div>{data.description}</div>
    </div>
  );
};

export default GroupNode;
