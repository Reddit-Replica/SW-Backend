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
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  repliedMsgId: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  subredditName: {
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
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  senderUsername: {
    type: String,
    required: true,
  },
  isSenderUser: {
    type: Boolean,
    required: true,
  },
  receiverUsername: {
    type: String,
    required: true,
  },
  isReceiverUser: {
    type: Boolean,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
  subject: {
    type: String,
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
  isSpam: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
