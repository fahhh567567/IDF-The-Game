import { sendMove } from "./network.js";

export function updateMovement(input) {
  if (!input) return;

  // send intention only (not position)
  sendMove(input.x, input.y);
}