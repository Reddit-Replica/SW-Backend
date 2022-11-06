import mongoose from "mongoose";

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
    subreddit: {
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
    flairId: {
      type: String,
      ref: "Flair",
    },
    numberOfUpVotes: {
      type: Number,
      default: 0,
    },
    numberOfDownVotes: {
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
      upVoteRate: {
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
