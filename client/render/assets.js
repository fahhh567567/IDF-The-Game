function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// ----------------------
// BACKGROUNDS
// ----------------------
export const backgrounds = {
  lobby: loadImage("../assets/lobby.png"),
  room1: loadImage("../assets/room1.png")
};

// ----------------------
// PLAYER SPRITES
// ----------------------
export const avatars = {
  down: loadImage("../assets/player_down.png"),
  up: loadImage("../assets/player_up.png"),
  left: loadImage("../assets/player_left.png"),
  right: loadImage("../assets/player_right.png")
};

// ----------------------
// UI
// ----------------------
export const ui = {
  toolbar: loadImage("../assets/toolbar.png"),
  Map: loadImage("../assets/mapicon.png")
};