import React from 'react';
import { getBezierPath, getSmoothStepPath } from 'reactflow';

const PlusButtonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {

  // const {setAddNewNode} = useEnrollmentContext();
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const onButtonClick = () => {
    // setEdges((edges) => edges.filter((edge) => edge.id !== "ecustomInput-1-note-1"));
    // alert(`Button on edge ${id} clicked ---`);
    // setAddNewNode(prev => !prev);
  };

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <foreignObject width={40} height={40} x={labelX - 20} y={labelY - 20} className="edgebutton-foreignobject">
        <div>
          <button className="edgebutton" onClick={onButtonClick}>+</button>
        </div>
      </foreignObject>
    </>
  );
};

export default PlusButtonEdge;
