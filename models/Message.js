import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const messageSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  subreddit: {
    type: String,
  },
  postTitle: {
    type: String,
  },
  text: {
    type: String,
    required: true,
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
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  senderUsername: {
    type: String,
    required: true,
  },
  receiverUsername: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
  subject: {
    type: String,
    required: true,
  },
  isReply: {
    type: Boolean,
    required: true,
    default: false,
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false,
  },
  spamsCount: {
    type: Number,
    default: 0,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
