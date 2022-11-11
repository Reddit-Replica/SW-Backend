import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  googleEmail: {
    type: String,
  },
  facebookEmail: {
    type: String,
  },
  displayName: {
    type: String,
  },
  about: {
    type: String,
  },
  avatar: {
    type: String,
  },
  banner: {
    type: String,
  },
  karma: {
    type: Number,
    required: true,
    default: 1,
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
  userSettings: {
    gender: {
      type: String,
      required: true,
      default: "man",
    },
    country: {
      type: String,
      required: true,
      default: "Egypt",
    },
    nsfw: {
      type: Boolean,
      required: true,
      default: false,
    },
    verifiedEmail: {
      type: Boolean,
      required: true,
      default: false,
    },
    allowToFollowYou: {
      type: Boolean,
      required: true,
      default: true,
    },
    adultContent: {
      type: Boolean,
      required: true,
      default: true,
    },
    autoplayMedia: {
      type: Boolean,
      required: true,
      default: true,
    },
    newFollowerEmail: {
      type: Boolean,
      required: true,
      default: true,
    },
    unsubscribeFromEmails: {
      type: Boolean,
      required: true,
      default: false,
    },
    socialLinks: [
      {
        type: {
          type: String,
          required: true,
        },
        displayText: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    ],
  },
  joinedSubreddits: [
    {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Subreddit",
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  ownedSubreddits: [
    {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Subreddit",
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  pinnedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  hiddenPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  upvotedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  downvotedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  savedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  spammedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
