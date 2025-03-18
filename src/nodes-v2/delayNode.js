// llmNode.js

import { Node } from "./node"

export const DelayNode = ({ id, data }) => {
  return (
    <Node
      config={{
        id,
        name: "Delay",
        handles: [
          {
            id: `${id}-system`,
            type: "target",
            position: "Left",
          },
          {
            id: `${id}-value`,
            type: "source",
            position: "Right",
          },
        ],
        fields: [
          {
            type: "text",
            label: "This is an LLM.",
          },
          {
            type: "button",
            label: "Login to LLM",
            props: {
              onClick: () => {
                console.log("Open login modal")
              },
            },
          },
        ],
      }}
    />
  )
}
