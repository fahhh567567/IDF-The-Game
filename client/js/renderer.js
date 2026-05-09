import { snapshots, playerId } from "./network.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ----------------------
// BACKGROUND IMAGE
// ----------------------
const bg = new Image();
bg.src = "assets/bg.png";

// ----------------------
// RESIZE
// ----------------------
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resize();

window.addEventListener("resize", resize);

// ----------------------
// RENDER
// ----------------------
export function render() {
  // clear frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw static background
  if (bg.complete) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  }

  // latest server snapshot ONLY
  const latest = snapshots[snapshots.length - 1];

  if (!latest) return;

  const state = latest.players;

  // draw players
  for (const id in state) {
    const p = state[id];

    ctx.fillStyle = id === playerId ? "blue" : "red";

    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}