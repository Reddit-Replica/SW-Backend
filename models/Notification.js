import mongoose, { Schema } from "mongoose";

// eslint-disable-next-line new-cap
const notificationSchema = mongoose.Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    required: true,
    type: String,
  },
  link: {
    required: true,
    type: String,
  },
  read: {
    required: true,
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  },
});
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
