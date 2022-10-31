import mongoose from "mongoose";

// eslint-disable-next-line new-cap
const socialLinksSchema = mongoose.Schema(
  {
    type: {
      type: String,
    },
    displayText: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { _id: false }
);

// eslint-disable-next-line new-cap
const userSettingsSchema = mongoose.Schema(
  {
    gender: {
      type: String,
    },
    country: {
      type: String,
    },
    nsfw: {
      type: Boolean,
    },
    verifiedEmail: {
      type: Boolean,
    },
    allowToFollowYou: {
      type: Boolean,
    },
    adultContent: {
      type: Boolean,
    },
    autoplayMedia: {
      type: Boolean,
    },
    newFollowerEmail: {
      type: Boolean,
    },
    unsubscribeFromEmails: {
      type: Boolean,
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
    required: true,
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
  },
  createdAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
  userSettings: userSettingsSchema,
});

export const User = mongoose.model("User", userSchema);
