import { uiState } from "./uiState.js";

export function openMap() {
  uiState.mapOpen = !uiState.mapOpen;
  console.log("MAP:", uiState.mapOpen);
}