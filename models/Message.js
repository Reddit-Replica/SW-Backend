import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const messageSchema = mongoose.Schema({
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
  subject: {
    type: String,
    required: true,
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
  type: {
    type: String,
    required: true,
    default: "Message",
  },
  isReply: {
    type: Boolean,
    required: true,
    default: false,
  },
  repliedMsgId: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  isWaited:{
    type: Boolean,
    required: true,
    default: false,
  }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
