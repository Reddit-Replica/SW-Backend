import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const tokenSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 3600,
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
