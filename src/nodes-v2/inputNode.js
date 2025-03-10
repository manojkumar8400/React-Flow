// inputNode.js

import { useState } from 'react';
import { Node } from './node';
import { useEnrollmentContext } from '../Context/UseEnrollmentTriggercontext';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const { isOpen, setIsOpen, selectedKeyword, keywordsList } = useEnrollmentContext();
  
  return (
    <Node
      config={{
        id,
        name: 'Enrollment Trigger',
        handles: [
          { 
            id: `${id}-value`, 
            type: 'source',  
            position: 'Right' 
          },
        ],
        fields: [
          {
            type: 'input',
            label: 'Trigger Enrollment for conversations',
            props: {
              type: 'text',
              value: selectedKeyword,
              keywords: keywordsList,
              onChange: (e) => setCurrName(e.target.value),
            },
          },
          {
            type: 'button',
            label: 'Enrollment Trigger',
            props: {
              onClick: () => {
                console.log('Enrollment Trigger')
                setIsOpen(!isOpen);
              }
            },
          },
          // {
          //   type: 'select',
          //   label: 'Entry Type',
          //   props: {
          //     value: inputType,
          //     onChange: (e) => setInputType(e.target.value),
          //     options: [
          //       { value: 'Text', label: 'Text' },
          //       { value: 'File', label: 'File' },
          //     ],
          //   },
          // },
        ],
      }}
    />
  );
}
