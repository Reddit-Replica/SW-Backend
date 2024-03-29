import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const communitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  viewName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
  },
  picture: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  mainTopic: {
    type: String,
  },
  subTopics: [
    {
      type: String,
    },
  ],
  flairs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Flair",
    },
  ],
  flairSettings: {
    enablePostFlairInThisCommunity: {
      type: Boolean,
      required: true,
      default: true,
    },
    allowUsersToAssignTheirOwn: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  dateOfCreation: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  deletedAt: {
    type: Date,
  },
  views: {
    type: Number,
  },
  members: {
    type: Number,
    required: true,
    default: 1,
  },
  nsfw: {
    type: Boolean,
    required: true,
    default: false,
  },
  numberOfRules: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfFlairs: {
    type: Number,
    required: true,
    default: 0,
  },
  rules: [
    {
      ruleTitle: {
        type: String,
        required: true,
      },
      ruleDescription: {
        type: String,
      },
      ruleOrder: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        // default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
      deletedAt: {
        type: Date,
      },
      appliesTo: {
        type: String,
        required: true,
      },
      reportReason: {
        type: String,
      },
    },
  ],
  moderators: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      dateOfModeration: {
        type: Date,
        required: true,
        // default: Date.now(),
      },
      permissions: [
        {
          type: String,
        },
      ],
    },
  ],
  invitedModerators: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      dateOfInvitation: {
        type: Date,
        required: true,
        // default: Date.now(),
      },
      permissions: [
        {
          type: String,
        },
      ],
    },
  ],
  bannedUsers: [
    {
      username: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      bannedAt: {
        type: Date,
      },
      banPeriod: {
        type: Number,
      },
      modNote: {
        type: String,
      },
      noteInclude: {
        type: String,
      },
      reasonForBan: {
        type: String,
      },
    },
  ],
  mutedUsers: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      dateOfMute: {
        type: Date,
        required: true,
      },
      muteReason: {
        type: String,
      },
    },
  ],
  approvedUsers: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      dateOfApprove: {
        type: Date,
        required: true,
      },
    },
  ],
  waitedUsers: [
    {
      username: {
        type: String,
        required: true,
      },
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
      },
    },
  ],
  owner: {
    username: {
      type: String,
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  subredditPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  unmoderatedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  editedPosts: [
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
  editedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  spammedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  subredditSettings: {
    sendWelcomeMessage: {
      type: Boolean,
      required: true,
      default: false,
    },
    welcomeMessage: {
      type: String,
    },
    language: {
      type: String,
      required: true,
      default: "English",
    },
    region: {
      type: String,
    },
    acceptingRequestsToJoin: {
      type: Boolean,
      required: true,
      default: true,
    },
    acceptingRequestsToPost: {
      type: Boolean,
      required: true,
      default: true,
    },
    approvedUsersHaveTheAbilityTo: {
      type: String,
      required: true,
      default: "Post only",
    },
  },
  subredditPostSettings: {
    enableSpoiler: {
      type: Boolean,
      required: true,
      default: true,
    },
    suggestedSort: {
      type: String,
      required: true,
      default: "none",
      enum: ["none", "best", "top", "new", "old"],
    },
    allowImagesInComment: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  joinedUsers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      joinDate: {
        type: Date,
      },
    },
  ],
  leftUsers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      leaveDate: {
        type: Date,
      },
    },
  ],
  numberOfViews: {
    type: Number,
    default: 0,
    required: true,
  },
  //NEEDS TO BE AUTO INCREMENT
  //Is used to get random subreddit from categories
  randomIndex: {
    type: Number,
  },
});

const Subreddit = mongoose.model("Subreddit", communitySchema);

export default Subreddit;
