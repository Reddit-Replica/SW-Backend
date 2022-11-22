import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const conversationSchema = mongoose.Schema({
  latestDate: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  messages: [
    {
      messageID: {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    },
  ],
});

const Message = mongoose.model("Conversation", conversationSchema);

export default Message;
