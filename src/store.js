import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
} from "react"
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow"

const initialState = {
  nodes: [],
  edges: [],
  nodeIDs: {},
}

const StoreContext = createContext()

const storeReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NODE":
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      }
    case "REMOVE_NODE":
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter(
          (edge) =>
            edge.source !== action.payload && edge.target !== action.payload
        ),
      }
    case "UPDATE_NODE_FIELD":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.nodeId) {
            node.data = {
              ...node.data,
              [action.payload.fieldName]: action.payload.fieldValue,
            }
          }
          return node
        }),
      }
    case "NODES_CHANGE":
      return {
        ...state,
        nodes: applyNodeChanges(action.payload, state.nodes),
      }
    case "EDGES_CHANGE":
      return {
        ...state,
        edges: applyEdgeChanges(action.payload, state.edges),
      }
    case "CONNECT":
      return {
        ...state,
        edges: addEdge(
          {
            ...action.payload,
            type: "buttonedge",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              height: "20px",
              width: "20px",
              color: "#8080ff",
            },
            style: {
              strokeWidth: 2,
              stroke: "#8080ff",
            },
          },
          state.edges
        ),
      }
    case "GET_NODE_ID":
      const newIDs = { ...state.nodeIDs }
      newIDs[action.payload] = (newIDs[action.payload] || 0) + 1
      return {
        ...state,
        nodeIDs: newIDs,
      }
    default:
      return state
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  const getNodeID = useCallback(
    (type) => {
      dispatch({ type: "GET_NODE_ID", payload: type })
      return `${type}-${(state.nodeIDs[type] || 0) + 1}`
    },
    [state.nodeIDs]
  )

  // Add new node
  const addNode = useCallback(
    (node) => dispatch({ type: "ADD_NODE", payload: node }),
    []
  )

  const removeNode = useCallback(
    (node) => dispatch({ type: "REMOVE_NODE", payload: node }),
    []
  )

  // Update nodes
  const onNodesChange = useCallback(
    (changes) => dispatch({ type: "NODES_CHANGE", payload: changes }),
    []
  )

  // Update edges
  const onEdgesChange = useCallback(
    (changes) => dispatch({ type: "EDGES_CHANGE", payload: changes }),
    []
  )

  // Handle new connections
  const onConnect = useCallback(
    (connection) => dispatch({ type: "CONNECT", payload: connection }),
    []
  )

  return (
    <StoreContext.Provider
      value={{
        state,
        getNodeID,
        addNode,
        removeNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
