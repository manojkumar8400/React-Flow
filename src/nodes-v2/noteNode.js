// textNode.js

import { useState, useEffect, useRef } from 'react';

import { Node } from './node';

export const NoteNode = ({ id, data }) => {
  const [currText, setCurrText] = useState('');
  const textareaRef = useRef(null);

  const handletext = (val) => {
    setCurrText(val)    
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const textarea = textareaRef.current;
      // textarea.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      textarea.style.height = `${(textarea.scrollHeight - lineHeight)}px`;
    }    
  },[currText])

  return (
    <Node
      config={{
        id,
        name: 'End',
        handles: [ { 
          id: `${id}-value`, 
          type: 'target',  
          position: 'Top' 
        },],
        color: '#ffffcc',
        isRemoved: false,
        fields: [
          {
            type: 'textarea',
            label: '',
            props: {
              ref: textareaRef,
              rows: 1,
              value: currText,
              onChange: (e) => handletext(e.target.value),
            },
          },
        ],        
      }}
    />
  );
}
