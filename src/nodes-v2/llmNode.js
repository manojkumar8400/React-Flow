// llmNode.js

import { Node } from './node';

export const LLMNode = ({ id, data }) => {

  return (
    
  <Node
    config={{
      id,
      name: 'LLM-v2',
      handles: [
        { 
          id: `${id}-system`, 
          type: 'target',  
          position: 'Top',
          style: {left: `${25}%`} 
        },
        { 
          id: `${id}-prompt`, 
          type: 'target',  
          position: 'Top',
          style: {left: `${75}%`} 
        },
        { 
          id: `${id}-value`, 
          type: 'source',  
          position: 'Bottom' 
        },
      ],
      fields: [
        {
          type: 'text',
          label: 'This is an LLM.'
        },
        {
          type: 'button',
          label: 'Login to LLM',
          props: {
            onClick: () => {
              console.log('Open login modal')
            }
          },
        },
      ]
    }}
  />
  );
}
