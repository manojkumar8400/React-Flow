// import { useState, useCallback } from "react"
// import {
//   ReactFlow,
//   Background,
//   Controls,
//   applyNodeChanges,
//   applyEdgeChanges,
//   addEdge
// } from "@xyflow/react"
// import "@xyflow/react/dist/style.css"
// import "./App.css"
// import CustomNode from "./CustomNode";
// import nodeTypes from "./nodeTypes";

// function App() {
//   // const initialNodes = [
//   //   {
//   //     id: "1",
//   //     data: { label: "Hello" },
//   //     position: { x: 0, y: 0 },
//   //     type: "input",
//   //   },
//   //   {
//   //     id: "2",
//   //     data: { label: "World" },
//   //     position: { x: 100, y: 100 },
//   //   },
//   // ]

//   // const initialNodes = [
//   //   { id: "1", type: "input", data: { label: "Input Node" }, position: { x: 100, y: 100 } },
//   //   { id: "2", type: "default", data: { label: "Default Node" }, position: { x: 200, y: 200 } },
//   //   { id: "3", type: "output", data: { label: "Output Node" }, position: { x: 300, y: 300 } },
//   //   { id: "4", type: "custom", data: { label: "Custom Node" }, position: { x: 400, y: 400 } }
//   // ];

//   const initialNodes = [
//     { id: "1", type: "input", data: { label: "Input Node" }, position: { x: 100, y: 100 } },
//     { id: "2", type: "group", data: { label: "Group Node", description: "This is a group" }, position: { x: 200, y: 200 } },
//     { id: "3", type: "resizable", data: { label: "Resizable Node", width: 150, height: 80 }, position: { x: 300, y: 300 } },
//     { id: "4", type: "image", data: { src: "https://picsum.photos/536/354" }, position: { x: 400, y: 400 } },
//     { id: "5", type: "custom", data: { label: "Custom Node" }, position: { x: 500, y: 500 } }
//   ];

//   const initialEdges = [
//     // { id: "1-2", source: "1", target: "2", label: "to the", type: "step" },
//   ]

//   const [nodes, setNodes] = useState(initialNodes)
//   const [edges, setEdges] = useState(initialEdges)
//   console.log(edges, 'edges----');

//   const onNodesChange = useCallback(
//     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     []
//   )
//   const onEdgesChange = useCallback(
//     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     []
//   )

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [],
//   );

//   const addNewNode = () => {
//     const newNode = {
//       id: (nodes.length + 1).toString(),
//       data: { label: `Hello ${Math.random()}` },
//       position: { x: Math.random() * 400, y: Math.random() * 400 },
//       type: "output",
//     }
//     setNodes((nds) => [...nds, newNode])
//   }

//   return (
//     <div className='App'>
//     <button onClick={addNewNode}>Push new node</button>
//       <ReactFlow
//         nodes={nodes}
//         onNodesChange={onNodesChange}
//         edges={edges}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//         // nodeTypes={{ custom: CustomNode }}
//         nodeTypes={nodeTypes}
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   )
// }

// export default App

import React, { useState, useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react"

import nodeTypes from "./nodeTypes" // Import custom node types
import "@xyflow/react/dist/style.css"
import "./App.css"

function App() {
  const initialNodes = [
    {
      id: "1",
      type: "input",
      data: { label: "Input Node" },
      position: { x: 100, y: 100 },
    },
    {
      id: "2",
      type: "custom",
      data: { label: "Custom Node" },
      position: { x: 300, y: 300 },
    },
  ]

  const initialEdges = []

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  console.log(edges)
  console.log(nodes)

  const onEdgeClick = (event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id))
  }

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   []
  // )

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "gray", strokeWidth: 1 },
          },
          eds
        )
      )
    },
    [setEdges]
  )

  // Handle node click to track selected node
  const onNodeClick = (_, node) => {
    setSelectedNodeId(node.id)
  }

  // Delete a selected node
  const deleteNode = () => {
    if (!selectedNodeId) return
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId))
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    )
    setSelectedNodeId(null) // Reset selection
  }

  // Clone a selected node
  const cloneNode = () => {
    if (!selectedNodeId) return
    const nodeToClone = nodes.find((node) => node.id === selectedNodeId)
    if (!nodeToClone) return

    const newNode = {
      ...nodeToClone,
      id: `${nodes.length + 1}`,
      position: {
        x: nodeToClone.position.x + 50,
        y: nodeToClone.position.y + 50,
      }, // Offset position
    }

    setNodes((nds) => [...nds, newNode])
  }

  const addNewNode = () => {
    const randomBgColor = `hsl(${Math.random() * 360}, 70%, 80%)` // Random pastel color
    const randomBorderColor = `hsl(${Math.random() * 360}, 80%, 50%)` // Vibrant border

    const newNode = {
      id: (nodes.length + 1).toString(),
      data: {
        label: `Hello ${Math.random()}`,
        bgColor: randomBgColor,
        borderColor: randomBorderColor,
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "custom", // Use a custom node
    }

    setNodes((nds) => [...nds, newNode])
  }

  // const addNewNode = () => {
  //   const newNode = {
  //     id: (nodes.length + 1).toString(),
  //     data: {
  //       label: `Hello ${Math.random()}`,
  //       bgColor: "yellow",
  //       borderColor: "green",
  //     },
  //     position: { x: Math.random() * 400, y: Math.random() * 400 },
  //     type: "output",
  //   }
  //   setNodes((nds) => [...nds, newNode])
  // }

  return (
    <div className='App'>
      <div className='controls'>
        <button onClick={addNewNode}>Push new node</button>
        <button onClick={deleteNode} disabled={!selectedNodeId}>
          🗑️ Delete Node
        </button>
        <button onClick={cloneNode} disabled={!selectedNodeId}>
          📄 Clone Node
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onNodeClick={onNodeClick} // Capture selected node
        fitView
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default App
