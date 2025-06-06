import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

import {
  setNodes as setNodesAction,
  setEdges as setEdgesAction,
} from "@/store/slices/graphSlice.ts";

import { type NodeType, type EdgeType } from "@/schemas";
import { useState } from "react";

export const useGraph = () => {
  const dispatch = useAppDispatch();

  const nodesFromStore = useAppSelector((state) => state.graph.nodes);
  const edgesFromStore = useAppSelector((state) => state.graph.edges);

  const [nodes, setNodes] = useState<NodeType[]>(() => nodesFromStore);
  const [edges, setEdges] = useState<EdgeType[]>(() => edgesFromStore);

  const setNodesToStore = (newNodes: NodeType[]) => {
    dispatch(setNodesAction(newNodes));
  };

  const setEdgesToStore = (newEdges: EdgeType[]) => {
    dispatch(setEdgesAction(newEdges));
  };

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    setNodesToStore,
    setEdgesToStore,
  };
};
