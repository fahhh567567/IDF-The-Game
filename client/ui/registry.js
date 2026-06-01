import { openMap } from "./actions.js";

export const uiRegistry = {

  toolbar: {
    id: "toolbar"
  },

  toolbarButtons: [
    { id: "autochat" },
    { id: "avatarcard" },
    { id: "base" },
    { id: "emotions" },
    { id: "send" },
    { id: "settings" },
    { id: "snowball" },
    { id: "social" },
    { id: "wave" }
  ],

  map: {
    id: "map",
    action: openMap
  }
};