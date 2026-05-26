import "./input/mouse.js";
import "./input/movement.js";
import { render } from "./render/renderer.js";

// ----------------------
// GAME LOOP (single clock)
// ----------------------
let lastTime = performance.now();

// ----------------------
// UPDATE (logic)
// ----------------------
function update(dt) {

  // later:
  // - prediction
  // - movement smoothing
  // - client-side effects
}

// ----------------------
// MAIN LOOP
// ----------------------
function loop(now) {

  const dt = now - lastTime;
  lastTime = now;

  try {

    update(dt);
    render();

  } catch (err) {

    console.error("GAME LOOP ERROR:", err);
  }

  requestAnimationFrame(loop);
}

// start loop
requestAnimationFrame(loop);

console.log("game loop running");