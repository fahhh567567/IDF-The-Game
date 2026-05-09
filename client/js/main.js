import "./input.js";
import { render } from "./renderer.js";

function update() {
  // later: movement prediction + send input
}

setInterval(update, 1000 / 20);

function loop() {
  render();
  requestAnimationFrame(loop);
}

loop();

console.log("loop running");