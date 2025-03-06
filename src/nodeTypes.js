import CustomNode from "./CustomNode"; // Import custom node component
import GroupNode from "./GroupNode"; // Import group node component
import ResizableNode from "./ResizableNode"; // Import resizable node component
import ImageNode from "./ImageNode"; // Import image node component

const nodeTypes = {
  custom: CustomNode,    // Custom node with styling and logic
  group: GroupNode,      // Group node for grouping multiple nodes
  resizable: ResizableNode, // Resizable node with dynamic resizing
  image: ImageNode       // Image node for displaying images
};

export default nodeTypes;
