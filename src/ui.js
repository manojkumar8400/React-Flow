// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import ButtonEdge from './edges/buttonEdge';

import { InputNode } from './nodes-v2/inputNode';
import { LLMNode } from './nodes-v2/llmNode';
import { OutputNode } from './nodes-v2/outputNode';
import { TextNode } from './nodes-v2/textNode';
import { PipelineNode } from './nodes-v2/pipelineNode';
import { SearchNode } from './nodes-v2/searchNode';
import { FileNode } from './nodes-v2/fileNode';
import { CallNode } from './nodes-v2/callNode';
import { NoteNode } from './nodes-v2/noteNode';

import 'reactflow/dist/style.css';
import PlusButtonEdge from './edges/PlusButtonEdge';
import { PipelineToolbar } from './toolbar';

const gridSize = 10;
const proOptions = { hideAttribution: true };
const edgeTypes = {
  // PlusButtonEdge: ButtonEdge,
  plusbuttonedge: PlusButtonEdge,
};
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  pipeline: PipelineNode,
  search: SearchNode,
  file: FileNode,
  branch: CallNode,
  note: NoteNode,
}

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  removeEdges: state.removeEdges,
  updateNodePositions: state.updateNodePositions
});

const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [showDraggableNodes, setShowDraggableNodes] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [edgeInfo, setEdgeInfo] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      removeEdges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      updateNodePositions
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

  // Add default InputNode and NoteNode on page load
  useEffect(() => {
    const inputNodeID = getNodeID("customInput")
    const noteNodeID = getNodeID("note")

    const defaultInputNode = {
      id: inputNodeID,
      type: "customInput",
      position: { x: 400, y: 100 },
      data: getInitNodeData(inputNodeID, "customInput"),
    };

    const defaultNoteNode = {
      id: noteNodeID,
      type: "note",
      position: { x: 400, y: 400 },
      data: getInitNodeData(noteNodeID, "note"),
    };

    const defaultEdge = {
      id: `e${inputNodeID}-${noteNodeID}`,
      source: inputNodeID,
      target: noteNodeID,
      type: 'smoothstep',
    };

    addNode(defaultInputNode);
    addNode(defaultNoteNode);
    onConnect(defaultEdge);
  }, [])

    const onDrop = useCallback(
      
      (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handlePlusButtonClick = (sourceId, targetId, edge) => {
      setSelectedEdge(edge);
      setEdgeInfo({ sourceId, targetId });
      setShowDraggableNodes(prev => !prev);
    };

    const handleNodeTypeSelect = (nodeType) => {  
      console.log({nodeType});
      if (!edgeInfo) return;
  
      const { sourceId, targetId } = edgeInfo;
      const sourceNode = nodes.find(node => node.id === sourceId);
      const targetNode = nodes.find(node => node.id === targetId);
  
      if (!sourceNode || !targetNode) return;
  
      if (nodeType === 'branch') {
        const position = {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        };
    
        const newNodeID = getNodeID(nodeType);
        const noteNodeID1 = getNodeID("note");
        const noteNodeID2 = getNodeID("note");
    
        const newNode = {
          id: newNodeID,
          type: nodeType,
          position,
          data: getInitNodeData(newNodeID, nodeType),
        };
    
        // Adjust note node positions to prevent overlapping
        const noteNode1 = {
          id: noteNodeID1,
          type: "note",
          position: { x: position.x - 250, y: position.y + 200 }, // Increased x offset
          data: getInitNodeData(noteNodeID1, "note"),
        };
    
        const noteNode2 = {
          id: noteNodeID2,
          type: "note",
          position: { x: position.x + 250, y: position.y + 200 }, // Increased x offset
          data: getInitNodeData(noteNodeID2, "note"),
        };
    
        addNode(newNode);
        addNode(noteNode1);
        addNode(noteNode2);
    
        // Remove the old edge and add new edges
        removeEdges(selectedEdge.id);
    
        onConnect({
          id: `e${sourceId}-${newNodeID}`,
          source: sourceId,
          target: newNodeID,
          type: 'smoothstep',
        });
        onConnect({
          id: `e${newNodeID}-${noteNodeID1}`,
          source: newNodeID,
          target: noteNodeID1,
          type: 'smoothstep',
        });
        onConnect({
          id: `e${newNodeID}-${noteNodeID2}`,
          source: newNodeID,
          target: noteNodeID2,
          type: 'smoothstep',
        });
    
      } else {
        // Calculate midpoint with offset based on existing nodes
        const existingNodes = nodes.filter(node => 
          node.position.x === (sourceNode.position.x + targetNode.position.x) / 2
        );
        
        const xOffset = existingNodes.length * 200; // Offset x position by 200px for each existing node
        
        const position = {
          x: (sourceNode.position.x + targetNode.position.x) / 2 + xOffset,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        };
    
        const nodeID = getNodeID(nodeType);
        const newNode = {
          id: nodeID,
          type: nodeType,
          position,
          data: getInitNodeData(nodeID, nodeType),
        };
    
        addNode(newNode);
    
        // Wait for next render cycle to get updated node height
        setTimeout(() => {
          const newNodeElement = document.getElementById(nodeID);
          const newNodeHeight = newNodeElement ? newNodeElement.getBoundingClientRect().height : 100;
          const verticalSpacing = newNodeHeight / 2 + 300;
    
          // Update node positions with increased vertical spacing
          updateNodePositions({
            [sourceId]: { 
              x: sourceNode.position.x + xOffset,
              y: position.y - verticalSpacing 
            },
            [targetId]: { 
              x: targetNode.position.x + xOffset,
              y: position.y + verticalSpacing 
            },
          });
        }, 100);
    
        // Remove the old edge and add two new edges
        removeEdges(selectedEdge.id);
    
        onConnect({
          id: `e${sourceId}-${nodeID}`,
          source: sourceId,
          target: nodeID,
          type: 'smoothstep',
        });
        onConnect({
          id: `e${nodeID}-${targetId}`,
          source: nodeID,
          target: targetId,
          type: 'smoothstep',
        });
      }
    
      setShowDraggableNodes(false);
    };
    
    return (
      <>
        <div ref={reactFlowWrapper} className="grid" style={{ width: '100vw', height: '100vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodesDraggable={true}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType='smoothstep'
            onEdgeClick={(event, edge) => {
              handlePlusButtonClick(edge.source, edge.target, edge);
            }}
          >
            <Background color="black" gap={gridSize} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        {/* Nodes toolbar */}
        {showDraggableNodes && (
          <PipelineToolbar selectedNode={handleNodeTypeSelect} />
        )}
      </>
    )
}

export default PipelineUI;