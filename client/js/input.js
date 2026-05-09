import { sendMove } from "./network.js";

const game = document.getElementById("game");

game.addEventListener("click", (e) => {
  const rect = game.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  sendMove(x, y);
});