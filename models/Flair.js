import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const flairSchema = mongoose.Schema({
  flairName: {
    type: String,
    required: true,
  },
  subreddit: {
    type: Schema.Types.ObjectId,
    ref: "Subreddit",
  },
  flairOrder: {
    type: Number,
    required: true,
  },
  backgroundColor: {
    type: String,
  },
  textColor: {
    type: String,
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
    },
    emojisLimit: {
      type: Number,
    },
  },
});

const Flair = mongoose.model("Flair", flairSchema);

export default Flair;
