import { playerId } from "../state/network.js";
import { avatars } from "./assets.js";

const lastPositions = {};

export function drawPlayers(ctx, players) {

  if (!players) return;

  for (const id in players) {

    const p = players[id];
    if (!p || p.x == null || p.y == null) continue;

    // ----------------------
    // DIRECTION
    // ----------------------
    let direction = "down";

    const last = lastPositions[id];

    if (last) {

      const dx = p.x - last.x;
      const dy = p.y - last.y;

      const moving =
        Math.abs(dx) > 0.5 ||
        Math.abs(dy) > 0.5;

      if (moving) {

        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? "right" : "left";
        } else {
          direction = dy > 0 ? "down" : "up";
        }
      }
    }

    lastPositions[id] = { x: p.x, y: p.y };

    // ----------------------
    // SPRITE
    // ----------------------
    const avatar = avatars[direction];

    if (!avatar || !avatar.complete) {
      ctx.fillStyle = id === playerId ? "blue" : "red";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }

    const size = 130;
    const offsetY = -35;

    ctx.drawImage(
      avatar,
      p.x - size / 2,
      p.y - size / 2 + offsetY,
      size,
      size
    );
  }
}