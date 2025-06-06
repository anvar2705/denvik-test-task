import { useCallback } from "react";

import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  Panel,
  BackgroundVariant,
  type NodeChange,
  type EdgeChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import FPSCounter from "@/components/FPSCounter.tsx";
import Node from "@/components/Node.tsx";

import { useGraph } from "@/hooks";

import { type NodeType, type EdgeType, type NodeData } from "@/schemas";

import { createRandomDictionary } from "@/utils";

function App() {
  const { nodes, edges, setNodes, setEdges, setNodesToStore, setEdgesToStore } =
    useGraph();

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge<EdgeType>(connection, edges);

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) {
        console.error(
          "Source or target node not found for connection:",
          connection
        );
        return;
      }

      const sourceNodeData = sourceNode.data as NodeData;
      const targetNodeData = targetNode.data as NodeData;

      const newNode: NodeType = {
        id: connection.target,
        position: targetNode.position,
        type: "custom",
        data: {
          displayName: targetNodeData.displayName,
          values: {
            ...sourceNodeData.values,
            ...targetNodeData.values,
          },
        },
      };

      const newNodes = nodes.map((node) =>
        node.id === newNode.id ? newNode : node
      );
      setNodes(newNodes);
      setNodesToStore(newNodes);

      setEdges(newEdges);
      setEdgesToStore(newEdges);
    },
    [edges, nodes, setNodesToStore, setEdgesToStore]
  );

  const onNodesChangeInternal = useCallback(
    (changes: NodeChange<NodeType>[]) => {
      setNodes((prevNodes) => {
        const changedNodes = applyNodeChanges(changes, prevNodes);
        return changedNodes;
      });
    },
    []
  );

  const onEdgesChangeInternal = useCallback(
    (changes: EdgeChange<EdgeType>[]) => {
      const changedEdges = applyEdgeChanges(changes, edges);
      setEdges(changedEdges);
      setEdgesToStore(changedEdges);
    },
    [edges, setEdgesToStore]
  );

  const addNode = useCallback(() => {
    const newNode: NodeType = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "custom",
      data: {
        displayName: `Node ${nodes.length + 1}`,
        values: createRandomDictionary(2),
      },
    };

    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setNodesToStore(newNodes);
  }, [nodes, setNodesToStore]);

  const onNodeDragStop = useCallback<OnNodeDrag<NodeType>>(
    (_, __, draggedNodes) => {
      const changedNodes = applyNodeChanges(
        draggedNodes.map((node) => ({ ...node, type: "position" })),
        nodes
      );
      setNodesToStore(changedNodes);
    },
    [nodes, setNodesToStore]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeInternal}
          onEdgesChange={onEdgesChangeInternal}
          onConnect={onConnect}
          nodeTypes={{ custom: Node }}
          deleteKeyCode={"Delete"}
          onNodeDragStop={onNodeDragStop}
        >
          <Panel>
            <FPSCounter />
            <button onClick={addNode}>Add Node</button>
          </Panel>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
