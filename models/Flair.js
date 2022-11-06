import mongoose from "mongoose";

// eslint-disable-next-line new-cap
const flairSchema = mongoose.Schema({
  flairName: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "white",
  },
  textColor: {
    type: String,
    default: "black",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  editedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
  flairSettings: {
    modOnly: {
      type: Boolean,
      default: false,
    },
    allowUserEdits: {
      type: Boolean,
      default: false,
    },
    flairType: {
      type: String,
      default: "text and emojis",
    },
    emojisLimit: {
      type: Number,
      default: 10,
    },
  },
});

const Flair = mongoose.model("Flair", flairSchema);

export default Flair;
