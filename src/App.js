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

import { SendMessage } from "./components/SendMessageAction/SendMessage"
import CustomNode from "./CustomNode" // Import CustomNode component
import { Webhook } from "./components/Webhook/Webhook"

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
  const [nodeToEdit, setNodeToEdit] = useState(null)
  const [editNodeType, setEditNodeType] = useState(null)
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

  const addNewNode = (text, image, url, method) => {
    console.log("setting node to edit----")

    const randomBgColor = `hsl(${Math.random() * 360}, 70%, 80%)` // Random pastel color
    const randomBorderColor = `hsl(${Math.random() * 360}, 80%, 50%)` // Vibrant border

    const newNode = {
      id: (nodes.length + 1).toString(),
      data: {
        label: text || `Hello ${Math.random()}`,
        bgColor: randomBgColor,
        borderColor: randomBorderColor,
        image: image ? URL.createObjectURL(image) : null,
        url: url || null,
        method: method || null,
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "custom", // Use a custom node
    }

    setNodes((nds) => [...nds, newNode])
  }

  const onEditNode = (nodeData, type) => {
    setNodeToEdit(nodeData)
    setEditNodeType(type)
  }

  const editNode = (id, text, image, url, method) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: text,
                image: image ? URL.createObjectURL(image) : node.data.image,
                url: url || node.data.url,
                method: method || node.data.method,
              },
            }
          : node
      )
    )
    setNodeToEdit(null)
  }

  return (
    <div className='App'>
      <div className='controls'>
        <Webhook addNewNode={addNewNode} nodeToEdit={editNodeType === 'webhook' ? nodeToEdit : null} editNode={editNode} />
        <SendMessage addNewNode={addNewNode} editNode={editNode} nodeToEdit={editNodeType === 'sendMessage' ? nodeToEdit : null} />
        <button onClick={() => addNewNode()}>Push new node</button>
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
        nodeTypes={{
          ...nodeTypes,
          custom: (props) => (
            <CustomNode
              {...props}
              onEdit={(data) => onEditNode({ ...data, id: props.id }, props.data.label === 'Webhook' ? 'webhook' : 'sendMessage')}
            />
          ),
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default App
