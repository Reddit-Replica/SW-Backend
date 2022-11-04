import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const tokenSchema = mongoose.Schema({
  resetToken: {
    type: String,
    required: true,
  },
  resetTokenExpiration: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
