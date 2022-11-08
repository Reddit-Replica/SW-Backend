import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const postSchema = mongoose.Schema({
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
    enum: ["text", "image", "video", "post", "link"],
    default: "text",
    required: true,
  },
  content: {
    type: String,
  },
  images: [
    {
      path: {
        type: String,
        required: true,
      },
      caption: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
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
      default: 0,
    },
    upvoteRate: {
      type: Number,
      default: 0,
    },
    communityKarma: {
      type: Number,
      default: 0,
    },
    totalShares: {
      type: Number,
      default: 0,
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
});

const Post = mongoose.model("Post", postSchema);

export default Post;
