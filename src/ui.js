// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from "react"
import ReactFlow, { Controls, Background, MiniMap } from "reactflow"
import { useStore } from "./store"

import ButtonEdge from "./edges/buttonEdge"

import { InputNode } from "./nodes-v2/inputNode"
import { LLMNode } from "./nodes-v2/llmNode"
import { OutputNode } from "./nodes-v2/outputNode"
import { TextNode } from "./nodes-v2/textNode"
import { PipelineNode } from "./nodes-v2/pipelineNode"
import { SearchNode } from "./nodes-v2/searchNode"
import { FileNode } from "./nodes-v2/fileNode"
import { CallNode } from "./nodes-v2/callNode"
import { NoteNode } from "./nodes-v2/noteNode"

// import './nodes-v2/styles.css';
import "reactflow/dist/style.css"

const gridSize = 10
const proOptions = { hideAttribution: true }
const edgeTypes = {
  buttonedge: ButtonEdge,
}
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  pipeline: PipelineNode,
  search: SearchNode,
  file: FileNode,
  call: CallNode,
  note: NoteNode,
}

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const { state, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore()

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` }
    return nodeData
  }

  // Add default InputNode on page load
  useEffect(() => {
    const nodeID = getNodeID("customInput")
    const defaultNode = {
      id: nodeID,
      type: "customInput",
      position: { x: 600, y: 200 },
      data: getInitNodeData(nodeID, "customInput"),
    }
    addNode(defaultNode)
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        )

        const type = appData?.nodeType

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        const nodeID = getNodeID(type)
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        }

        addNode(newNode)
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  console.log({state: state.nodes, edges: state.edges});
  
  return (
    <div
      ref={reactFlowWrapper}
      className='grid'
      style={{ width: "100wv", height: "100vh" }}
    >
      <ReactFlow
        nodes={state.nodes}
        edges={state.edges}
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
        // style={{ background: 'black' }}
      >
        <Background color='black' gap={gridSize} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
