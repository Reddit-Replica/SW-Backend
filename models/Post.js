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
  },
  kind: {
    type: String,
    enum: ["hybrid", "image", "video", "post", "link"],
    default: "hybrid",
    required: true,
  },
  content: {
    type: Object,
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
  video: {
    type: String,
  },
  link: {
    type: String,
  },
  sharePostId: {
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
  usersCommented: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  scheduleDate: {
    type: Date,
  },
  scheduleTime: {
    type: Date,
  },
  scheduleTimeZone: {
    type: String,
  },
  hotScore: {
    type: Number,
    default: 0,
  },
  hotTimingScore: {
    type: Number,
    default: 0,
  },
  bestScore: {
    type: Number,
    default: 0,
  },
  bestTimingScore: {
    type: Number,
    default: 0,
  },
  numberOfVotes: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
