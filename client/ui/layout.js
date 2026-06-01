import { uiRegistry } from "./registry.js";

export function layoutUI(canvas) {

  // ----------------------
  // HUD
  // ----------------------
  const hudHeight = 140;

  const hud = {
    x: 0,
    y: canvas.height - hudHeight,
    width: canvas.width,
    height: hudHeight
  };

  // ----------------------
  // TOOLBAR
  // ----------------------
  const toolbar = {
    width: 950,
    height: 225
  };

  toolbar.x =
    hud.width / 2 -
    toolbar.width / 2;

  toolbar.y =
    hud.y;

  // ----------------------
  // TOOLBAR BUTTONS
  // ----------------------
  const toolbarButtons =
    uiRegistry.toolbarButtons;

  const buttonSize = 120;
  const spacing = 10;

  toolbarButtons.forEach((button, i) => {

    button.x =
      toolbar.x +
      i * (buttonSize + spacing);

    button.y =
      toolbar.y + 35;

    button.w = buttonSize;
    button.h = buttonSize;
  });

  // ----------------------
  // MAP BUTTON
  // ----------------------
  const mapButton =
    uiRegistry.map;

  mapButton.x =
    hud.width - 250;

  mapButton.y =
    hud.y + 35;

  mapButton.w = 120;
  mapButton.h = 120;

  return {
    hud,
    toolbar
  };
}