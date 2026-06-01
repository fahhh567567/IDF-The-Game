import { ui } from "./assets.js";
import { uiRegistry } from "../ui/registry.js";
import { layoutUI } from "../ui/layout.js";

export function drawUI(ctx, canvas) {

  const layout =
    layoutUI(canvas);

  // ----------------------
  // DEBUG HUD BORDER
  // ----------------------
  ctx.strokeStyle = "red";

  ctx.strokeRect(
    layout.hud.x,
    layout.hud.y,
    layout.hud.width,
    layout.hud.height
  );

  // ----------------------
  // TOOLBAR BACKGROUND
  // ----------------------
  ctx.drawImage(
    ui.toolbar,
    layout.toolbar.x,
    layout.toolbar.y,
    layout.toolbar.width,
    layout.toolbar.height
  );

  // ----------------------
  // UI ELEMENTS
  // ----------------------
  for (const el of uiRegistry) {

    const img =
      ui[el.id];

    if (!img) continue;

    ctx.drawImage(
      img,
      el.x,
      el.y,
      el.w,
      el.h
    );
  }
}