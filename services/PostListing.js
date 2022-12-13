/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { prepareLimit } from "../utils/prepareLimit.js";
export async function homePostsListing(user) {
  //GETTING SUBREDDIT POSTS
  const { joinedSubreddits } = await User.findOne({ username: user.username })
    .select("joinedSubreddits")
    .populate({
      path: "joinedSubreddits",
    });
  console.log(joinedSubreddits);
  let posts=[];
  for (const subreddit of joinedSubreddits){
    const { subredditPosts }=await Subreddit.findOne({ id:subreddit.subredditId }).select("subredditPosts")
    .populate({
      path: "subredditPosts",
    });
    posts=[...posts,...subredditPosts];
  }
  console.log(posts);
}


