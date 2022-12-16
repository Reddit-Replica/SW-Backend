import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const postRepliesSchema = mongoose.Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  receiverUsername: {
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
  type: {
    type: String,
    required: true,
    default: "post reply",
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const PostReplies = mongoose.model("PostReplies", postRepliesSchema);

export default PostReplies;
