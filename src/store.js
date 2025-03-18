// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  getNodeID: (type) => {

    const newIDs = { ...get().nodeIDs }
    if (newIDs[type] === undefined) {
      newIDs[type] = 0
    }
    newIDs[type] += 1
    set({ nodeIDs: newIDs })
    return `${type}-${newIDs[type]}`
  },
  addNode: (node) => {
    if (node !== null) {
      set({
        nodes: [...get().nodes, node],
      })
    }
    node = null
  },
  removeNode: (id) => {
    let nodesList = get().nodes
    let edgesList = get().edges

    // Find edges connected to the node to be removed
    const connectedEdges = edgesList.filter(edge => edge.source === id || edge.target === id);

    // Find source and target nodes for reconnection
    const sourceNode = connectedEdges.find(edge => edge.target === id)?.source;
    const targetNode = connectedEdges.find(edge => edge.source === id)?.target;

    // Remove the node and its edges
    set({
      nodes: [...nodesList.filter((node) => node.id != id)],
      edges: [...edgesList.filter((edge) => edge.source != id && edge.target != id)],
    });

    // Reconnect source and target nodes if they exist
    if (sourceNode && targetNode) {
      get().onConnect({
        id: `e${sourceNode}-${targetNode}`,
        source: sourceNode,
        target: targetNode,
        type: 'smoothstep',
      });

      // Reset the positions of the source and target nodes
      const sourceNodeObj = nodesList.find(node => node.id === sourceNode);
      const targetNodeObj = nodesList.find(node => node.id === targetNode);
      if (sourceNodeObj && targetNodeObj) {
        const midY = (sourceNodeObj.position.y + targetNodeObj.position.y) / 2;
        sourceNodeObj.position.y = midY - 60 - (sourceNodeObj.height || 0);
        targetNodeObj.position.y = midY + 60 + (targetNodeObj.height || 0);
      }
    }
  },

   // Function to update node positions dynamically
   updateNodePositions: (nodeUpdates) => {
    console.log({nodeUpdates});
    
    set((state) => ({
        nodes: state.nodes.map(node => 
            nodeUpdates[node.id] 
            ? { ...node, position: nodeUpdates[node.id] } 
            : node
        ),
    }));
},

  // Remove edge  when user create a new node
  removeEdges: (id) => {    
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    }))
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "plusbuttonedge",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed, 
            height: '20px', 
            width: '20px',
            color: '#8080ff',
          },
          // label: 'label',
          style: {
            strokeWidth: 2,
            stroke: "#8080ff",
          },
        },
        get().edges
      ),
    })
  },
  // Add a new function to handle the insertion of a node between two connected nodes
  // insertNodeBetween: (sourceId, targetId, newNode) => {
  //   const edges = get().edges.filter(
  //     (edge) => !(edge.source === sourceId && edge.target === targetId)
  //   )
  //   edges.push({
  //     id: `e${sourceId}-${newNode.id}`,
  //     source: sourceId,
  //     target: newNode.id,
  //     type: "smoothstep",
  //   })
  //   edges.push({
  //     id: `e${newNode.id}-${targetId}`,
  //     source: newNode.id,
  //     target: targetId,
  //     type: "smoothstep",
  //   })

  //   set({
  //     nodes: [...get().nodes, newNode],
  //     edges,
  //   })
  // },
  // Currently Unused
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));
