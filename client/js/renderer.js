console.log("RENDERER LOADED");

import {
  stateBuffer,
  playerId,
  exits,
  currentRoom,
  sendMove
} from "./network.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// ----------------------
// SIZE
// ----------------------
const GAME_WIDTH = 1520;
const GAME_HEIGHT = 960;

// ----------------------
// MOUSE
// ----------------------
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  mouseX = (e.clientX - rect.left) * scaleX;
  mouseY = (e.clientY - rect.top) * scaleY;
});

// ----------------------
// CLICK EXITS
// ----------------------
canvas.addEventListener("click", () => {
  for (const exit of exits || []) {

    const hovered =
      mouseX > exit.x &&
      mouseX < exit.x + exit.w &&
      mouseY > exit.y &&
      mouseY < exit.y + exit.h;

    if (hovered) {
      sendMove(
        exit.x + exit.w / 2,
        exit.y + exit.h / 2
      );
      break;
    }
  }
});

// ----------------------
// RESIZE
// ----------------------
function resize() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
}

resize();
window.addEventListener("resize", resize);

// ----------------------
// IMAGES
// ----------------------
const backgrounds = {
  lobby: loadImage("./assets/lobby.png"),
  room1: loadImage("./assets/room1.png")
};

const ui = {
  toolbar: loadImage("./assets/toolbar.png")
};

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// ----------------------
// DRAW PLAYERS
// ----------------------
function drawPlayers(players) {
  for (const id in players) {

    const p = players[id];
    if (!p || p.x == null || p.y == null) continue;

    ctx.fillStyle = id === playerId ? "blue" : "red";

    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ----------------------
// DRAW EXITS (GLOW + CLICKABLE)
// ----------------------
function drawExits() {

  let hoveringExit = false;

  for (const exit of exits || []) {

    const hovered =
      mouseX > exit.x &&
      mouseX < exit.x + exit.w &&
      mouseY > exit.y &&
      mouseY < exit.y + exit.h;

    if (hovered) hoveringExit = true;

    const centerX = exit.x + exit.w / 2;
    const centerY = exit.y + exit.h / 2;

    const time = Date.now() * 0.005;
    const pulse = 0.55 + Math.sin(time) * 0.15;

    const intensity = hovered ? 1 : 0.45;

    // ----------------------
    // SUN GLOW
    // ----------------------
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      10,
      centerX,
      centerY,
      hovered ? 160 : 110
    );

    gradient.addColorStop(0, `rgba(255,255,220,${pulse * intensity})`);
    gradient.addColorStop(0.2, `rgba(255,220,120,${0.7 * intensity})`);
    gradient.addColorStop(0.5, `rgba(255,180,50,${0.35 * intensity})`);
    gradient.addColorStop(1, "rgba(255,140,0,0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(centerX, centerY, hovered ? 160 : 110, 0, Math.PI * 2);
    ctx.fill();

    // ----------------------
    // EXIT CORE
    // ----------------------
    ctx.shadowColor = "rgba(255,220,120,1)";
    ctx.shadowBlur = hovered ? 45 : 20;

    ctx.fillStyle = hovered
      ? `rgba(255,240,180,${pulse})`
      : "rgba(255,220,140,0.45)";

    ctx.fillRect(exit.x, exit.y, exit.w, exit.h);

    // ----------------------
    // OUTLINE (CLICKABLE LOOK)
    // ----------------------
    ctx.strokeStyle = hovered
      ? "rgba(255,255,255,1)"
      : "rgba(255,240,180,0.45)";

    ctx.lineWidth = hovered ? 3 : 2;
    ctx.strokeRect(exit.x, exit.y, exit.w, exit.h);

    ctx.shadowBlur = 0;
  }

  canvas.style.cursor = hoveringExit ? "pointer" : "default";
}

// ----------------------
// DRAW UI (TOOLBAR FIX)
// ----------------------
function drawUI() {

  const toolbar = ui.toolbar;
  if (!toolbar || !toolbar.complete) return;

  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const imgW = toolbar.naturalWidth * scaleX;
  const imgH = toolbar.naturalHeight * scaleY;

  const x = (canvas.width - imgW) / 2;
  const y = canvas.height - imgH;
  const OFFSET_Y = 110; // adjust until it visually snaps

ctx.drawImage(
  toolbar,
  x,
  canvas.height - imgH + OFFSET_Y,
  imgW,
  imgH
);
}
// ----------------------
// MAIN RENDER
// ----------------------
export function render() {

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // ----------------------
  // BACKGROUND
  // ----------------------
  const room = currentRoom || "lobby";
  const bg = backgrounds[room];

  if (bg && bg.complete) {
    ctx.drawImage(bg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  // ----------------------
  // WORLD
  // ----------------------
  drawExits();

  const latest = stateBuffer[stateBuffer.length - 1];

  if (!latest || !latest.players) return;

  if (stateBuffer.length < 2) {
    drawPlayers(latest.players);
    drawUI();
    return;
  }

  // ----------------------
  // INTERPOLATION
  // ----------------------
  const renderTime = Date.now() - 100;

  let a = null;
  let b = null;

  for (let i = 0; i < stateBuffer.length - 1; i++) {

    const s1 = stateBuffer[i];
    const s2 = stateBuffer[i + 1];

    if (s1.time <= renderTime && renderTime <= s2.time) {
      a = s1;
      b = s2;
      break;
    }
  }

  if (!a || !b) {
    drawPlayers(latest.players);
    drawUI();
    return;
  }

  const delta = b.time - a.time;

  const alpha =
    delta <= 0 ? 0 : (renderTime - a.time) / delta;

  const interpolated = {};

  for (const id in a.players) {

    const p1 = a.players[id];
    const p2 = b.players[id];

    if (!p1 || !p2) continue;

    interpolated[id] = {
      x: p1.x + (p2.x - p1.x) * alpha,
      y: p1.y + (p2.y - p1.y) * alpha
    };
  }

  drawPlayers(interpolated);

  // ----------------------
  // UI ALWAYS LAST
  // ----------------------
  drawUI();
}
console.log("canvas.height =", canvas.height);
console.log("GAME_HEIGHT =", GAME_HEIGHT);