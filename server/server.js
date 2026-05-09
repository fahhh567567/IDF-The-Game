console.log("SERVER FILE LOADED");

let lastTime = Date.now();

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });



// ----------------------
// WORLD
// ----------------------
const world = {
  lobby: {
    exits: [
      { x: 560, y: 150, w: 40, h: 120, to: "room1" }
    ],
    players: {}
  },

  room1: {
    exits: [
      { x: 0, y: 150, w: 40, h: 120, to: "lobby" }
    ],
    players: {}
  }
};

// ----------------------
// EXIT CHECK
// ----------------------
function checkExit(player, roomName) {
  const room = world[roomName];

  for (const exit of room.exits) {
    const inside =
      player.x > exit.x &&
      player.x < exit.x + exit.w &&
      player.y > exit.y &&
      player.y < exit.y + exit.h;

    if (inside) return exit.to;
  }

  return null;
}

// ----------------------
// MOVE PLAYER BETWEEN ROOMS (FIXED)
// ----------------------
function movePlayerToRoom(client, id, fromRoom, toRoom) {
  const player = world[fromRoom].players[id];
  if (!player) return;

  delete world[fromRoom].players[id];

  world[toRoom].players[id] = player;
  client.room = toRoom;

  // spawn reset
  player.x = 200;
  player.y = 200;
  player.targetX = 200;
  player.targetY = 200;
}

// ----------------------
// CONNECTION
// ----------------------
wss.on("connection", (ws) => {
  const id = Math.random().toString(36).slice(2);

  ws.id = id;
  ws.room = "lobby";

  world.lobby.players[id] = {
    x: 200,
    y: 200,
    targetX: 200,
    targetY: 200,
    speed: 30
  };

  ws.send(JSON.stringify({
    type: "init",
    id
  }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "move") {
      const p = world[ws.room].players[ws.id];
      if (!p) return;

      p.targetX = data.x;
      p.targetY = data.y;
    }

    if (data.type === "joinRoom") {
      const newRoom = data.room;
      if (!world[newRoom]) return;

      movePlayerToRoom(ws, ws.id, ws.room, newRoom);
    }
  });

  ws.on("close", () => {
    delete world[ws.room].players[ws.id];
  });
});

// ----------------------
// WORLD UPDATE LOOP
// ----------------------
function updateWorld() {
  const now = Date.now();
  const dt = (now - lastTime) / 1000; // seconds
  lastTime = now;

  for (const roomName in world) {
    const room = world[roomName];

    for (const id in room.players) {
      const p = room.players[id];

      let dx = p.targetX - p.x;
      let dy = p.targetY - p.y;

      const dist = Math.hypot(dx, dy);

      // 🧠 ARRIVAL FIX (important)
      if (dist < 1) {
        p.x = p.targetX;
        p.y = p.targetY;
        continue;
      }

      dx /= dist;
      dy /= dist;

      // ✅ SPEED IS NOW PIXELS / SECOND
      const speed = p.speed || 200;

      p.x += dx * speed * dt;
      p.y += dy * speed * dt;

      const newRoom = checkExit(p, roomName);
      if (newRoom && newRoom !== roomName) {
        const client = [...wss.clients].find(c => c.id === id);
        if (client) movePlayerToRoom(client, id, roomName, newRoom);
        return;
      }

      console.log("SERVER MOVE:", id, p.x.toFixed(2), p.y.toFixed(2));
    }
  }
}
// ----------------------
// BROADCAST LOOP
// ----------------------
setInterval(() => {
  updateWorld();

  wss.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) return;

    const room = world[client.room];
    if (!room) return;

    client.send(JSON.stringify({
      type: "state",
      time: Date.now(),
      players: room.players
    }));
  });

}, 50);

console.log("Server running on ws://localhost:3000");