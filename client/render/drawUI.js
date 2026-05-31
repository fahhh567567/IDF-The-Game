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

  const toolbarY =
    hud.y;

  ctx.drawImage(
    ui.toolbar,
    toolbarX,
    toolbarY,
    toolbarWidth,
    toolbarHeight
  );

  // ----------------------
  // TOOLBAR Buttons
  // ----------------------
  const toolbarButtons = [
    ui.autochat,
    ui.avatarcard,
    ui.base,
    ui.emotions,
    ui.send,
    ui.settings,
    ui.snowball,
    ui.social,
    ui.wave
  ];

  console.log(toolbarButtons);

  // ----------------------
  // MAP ICON
  // ----------------------
  const iconSize = 120;

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