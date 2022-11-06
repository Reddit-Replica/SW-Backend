import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
    subredditName: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    sharePostId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    suggestedSort: {
      type: String,
      default: "best",
    },
    nsfw: {
      type: Boolean,
      default: false,
    },
    spoiler: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    markedSpam: {
      type: Boolean,
      default: false,
    },
    sendReplies: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },
    flair: {
      type: Schema.Types.ObjectId,
      ref: "Flair",
    },
    numberOfUpvotes: {
      type: Number,
      default: 0,
    },
    numberOfDownvotes: {
      type: Number,
      default: 0,
    },
    numberOfComments: {
      type: Number,
      default: 0,
    },
    insights: {
      totalViews: {
        type: Number,
      },
      upvoteRate: {
        type: Number,
      },
      communityKarma: {
        type: Number,
      },
      totalShares: {
        type: Number,
      },
    },
    scheduleDate: {
      type: Date,
    },
    scheduleTime: {
      type: Date,
    },
    scheduleTimeZone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
