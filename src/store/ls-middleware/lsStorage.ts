export const LS_STORAGE_KEY = "REDUX_STATE";

export function loadState() {
  try {
    const serializedState = localStorage.getItem(LS_STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export async function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LS_STORAGE_KEY, serializedState);
  } catch (e) {
    // Ignore
  }
}
