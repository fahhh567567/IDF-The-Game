import { ui } from "./assets.js";

export function drawUI(ctx, canvas) {

  // ----------------------
  // HUD AREA
  // ----------------------
  const hud = {
    x: 0,
    y: canvas.height - 140,
    width: canvas.width,
    height: 140
  };

  // ----------------------
  // DEBUG HUD BORDER
  // ----------------------
  // remove later if you want
  ctx.strokeStyle = "red";

  ctx.strokeRect(
    hud.x,
    hud.y,
    hud.width,
    hud.height
  );

  // ----------------------
  // TOOLBAR
  // ----------------------
  const toolbarWidth = 950;
  const toolbarHeight = 225;

  const toolbarX =
    hud.width / 2 -
    toolbarWidth / 2;

  // freely move toolbar inside HUD
  const toolbarY =
    hud.y ;

  ctx.drawImage(
    ui.toolbar,
    toolbarX,
    toolbarY,
    toolbarWidth,
    toolbarHeight
  );

  // ----------------------
  // MAP ICON
  // ----------------------
  const iconSize = 120;

  // freely move map inside HUD
  const mapX =
  hud.width - 250;

  const mapY =
    hud.y + 35;

  ctx.drawImage(
    ui.mapIcon,
    mapX,
    mapY,
    iconSize,
    iconSize
  );
}