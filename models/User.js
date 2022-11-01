import mongoose from "mongoose";

// eslint-disable-next-line new-cap
const socialLinksSchema = mongoose.Schema(
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
  { _id: false }
);

// eslint-disable-next-line new-cap
const userSettingsSchema = mongoose.Schema(
  {
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
    socialLinks: [socialLinksSchema],
  },
  { _id: false }
);

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
  deletedAt: {
    type: Date,
  },
  userSettings: userSettingsSchema,
});

const User = mongoose.model("User", userSchema);

export default User;
