const socket = new WebSocket("ws://localhost:3000");

export let worldState = {};
export let playerId = null;
export let snapshots = [];

socket.onopen = () => {
  console.log("Connected to server");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    playerId = data.id;
  }

  if (data.type === "state") {

    // IMPORTANT: deep clone snapshot
    snapshots.push({
      time: data.time,
      players: structuredClone(data.players)
    });

    // keep only latest snapshots
    if (snapshots.length > 10) {
      snapshots.shift();
    }

    worldState = structuredClone(data.players);
  }
};

export function sendMove(x, y) {
  socket.send(JSON.stringify({
    type: "move",
    x,
    y
  }));
}

console.log("network.js loaded");