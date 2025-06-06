import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setEdges, setNodes } from "../slices/graphSlice";
import { saveState } from "./lsStorage";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setNodes, setEdges),
  effect: (_, listenerApi) => {
    saveState(listenerApi.getState());
  },
});
