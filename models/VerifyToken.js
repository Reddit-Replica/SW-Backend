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
  expireAt: {
    type: Date,
    required: true,
    default: Date.now() + 3600000, // token will be expired after one hour
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
