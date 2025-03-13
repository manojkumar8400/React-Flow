// toolbar.js

import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';

export const PipelineToolbar = ({ selectedNode }) => {

    return (
        <div className='toolbar'>
            <div className='node-grabber-panel'>
                <div className=''>
                    {/*<DraggableNode type='customInput' label='Input' />*/}
                    <DraggableNode type='customOutput' label='Output' selectedNode={selectedNode}/>
                    <DraggableNode type='text' label='Text' selectedNode={selectedNode} />
                    <DraggableNode type='llm' label='LLM' selectedNode={selectedNode} />
                    </div>
                    <div>
                    <DraggableNode type='pipeline' label='Pipeline' selectedNode={selectedNode} />
                    <DraggableNode type='search' label='Search' selectedNode={selectedNode} />
                    <DraggableNode type='file' label='File' selectedNode={selectedNode} />
                    <DraggableNode type='call' label='Call' selectedNode={selectedNode} />
                    <DraggableNode type='note' label='Note' selectedNode={selectedNode} />
                </div>
                
            </div>
            <div className='node-submit-panel'>
                <div className=''>
                    <SubmitButton />
                </div>
            </div>
        </div>
    );
};
