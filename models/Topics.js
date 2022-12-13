import mongoose from "mongoose";

// eslint-disable-next-line new-cap
const topicsSchema = mongoose.Schema({
  topicName: {
    type: String,
    required: true,
  },
});

const Topics = mongoose.model("Topics", topicsSchema);

export default Topics;
