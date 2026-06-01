module.exports = {
  lobby: {
    spawn: {
      x: 679,
      y: 749
    },

    interactions: [
      {
        id: "to_room1",
  type: "exit",

  x: 1460,
  y: 450,

  w: 60,
  h: 120,

        to: "room1",

        spawn: {
          x: 80,
          y: 200
        }
      }
    ],

    obstacles: []
  },

  room1: {
    spawn: {
      x: 679,
      y: 749
    },

    interactions: [
      {
        id: "to_lobby",
        type: "exit",

        x: 0,
        y: 650,
        w: 40,
        h: 120,

        to: "lobby",

        spawn: {
          x: 679,
          y: 749
        }
      }
    ],

    obstacles: []
  }
};