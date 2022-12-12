import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const conversationSchema = mongoose.Schema({
  latestDate: {
    type: Date,
  },
  subject: {
    type: String,
    required: true,
  },
  firstUsername: {
    type: String,
    required: true,
  },
  secondUsername: {
    type: String,
    required: true,
  },
  messages: [
    {
        type: Schema.Types.ObjectId,
        ref: "Messages",
    },
  ],
  isFirstNameUser:{
    type: Boolean,
    required:true
  },
  isSecondNameUser:{
    type: Boolean,
    required:true
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
