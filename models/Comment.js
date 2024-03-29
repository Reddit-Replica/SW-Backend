import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const commentSchema = mongoose.Schema({
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  parentType: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  subredditName: {
    type: String,
  },
  level: {
    type: Number,
    required: true,
  },
  content: {
    type: Object,
  },
  numberOfVotes: {
    type: Number,
    required: true,
    default: 1,
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
  ownerUsername: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  markedSpam: {
    type: Boolean,
    required: true,
    default: false,
  },
  nsfw: {
    type: Boolean,
    required: true,
    default: false,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  moderation: {
    approve: {
      approvedBy: {
        type: String,
      },
      approvedDate: {
        type: Date,
      },
    },
    remove: {
      removedBy: {
        type: String,
      },
      removedDate: {
        type: Date,
      },
    },
    spam: {
      spammedBy: {
        type: String,
      },
      spammedDate: {
        type: Date,
      },
    },
    lock: {
      type: Boolean,
      default: false,
    },
  },
  followingUsers: [
    {
      username: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
