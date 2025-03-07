import React from "react";
import { Handle, Position } from "@xyflow/react";
 
const CustomActionNode = ({ data }) => {
  return (
    <div style={styles.nodeContainer}>
      <div style={styles.header}>Send a message</div>
      <div style={styles.options}>
        {["Message", "Image", "Video", "Audio", "Document"].map((action) => (
          <button key={action} style={styles.button} onClick={() => data.onAction(action)}>
            {action}
          </button>
        ))}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  nodeContainer: {
    background: "#F96D71",
    borderRadius: "8px",
    padding: "10px",
    width: "200px",
    textAlign: "center",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
  },
  header: {
    color: "white",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  options: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "5px",
  },
  button: {
    border: "1px solid green",
    padding: "6px",
    borderRadius: "5px",
    cursor: "pointer",
    background: "white",
  }
};

export default CustomActionNode;
