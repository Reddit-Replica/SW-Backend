/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import { prepareLimit } from "../utils/prepareLimit.js";

function compareNew(post1, post2) {
  if (post1.createdAt < post2.createdAt) {
    return 1;
  }
  if (post1.createdAt > post2.createdAt) {
    return -1;
  }
  return 0;
}

function compareBest(post1, post2) {
  if (post1.bestScore < post2.bestScore) {
    return 1;
  }
  if (post1.bestScore > post2.bestScore) {
    return -1;
  }
  return 0;
}

function compareHot(post1, post2) {
  if (post1.hotScore < post2.hotScore) {
    return 1;
  }
  if (post1.hotScore > post2.hotScore) {
    return -1;
  }
  return 0;
}

function compareTop(post1, post2) {
  if (post1.numberOfVotes < post2.numberOfVotes) {
    return 1;
  }
  if (post1.numberOfVotes > post2.numberOfVotes) {
    return -1;
  }
  return 0;
}

export async function homePostsListing(user, listingParams, typeOfSorting) {
  //GETTING SUBREDDIT POSTS
  const { joinedSubreddits } = await User.findOne({ username: user.username })
    .select("joinedSubreddits")
    .populate({
      path: "joinedSubreddits",
      match: { deletedAt: null },
    });
  let posts = [];
  //GETTING POSTS FROM SUBREDDITS
  for (const subreddit of joinedSubreddits) {
    const { subredditPosts } = await Subreddit.findById(subreddit.subredditId)
      .select("subredditPosts")
      .populate({
        path: "subredditPosts",
        match: { deletedAt: null },
      });
    if (subredditPosts.length !== 0) {
      posts = [...posts, ...subredditPosts];
    }
  }
  //GETTING FOLLOWED PEOPLE NEEDS TO BE EDITED TO FOLLOWING WHEN
  const { followers } = await User.findOne({ username: user.username })
    .select("followers")
    .populate({
      path: "followers",
      match: { deletedAt: null },
    });
  //GETTING POSTS FROM FOLLOWING PEOPLE
  for (const user of followers) {
    const { followedPosts } = await Subreddit.findById(user)
      .select("posts")
      .populate({
        path: "posts",
        match: { deletedAt: null },
      });
    if (followedPosts.length !== 0) {
      posts = [...posts, ...followedPosts];
    }
  }
  let filteringString;
  //SORTING THE POSTS THAT WE GOT USING THE TYPE OF SORTING
  if (typeOfSorting === "new") {
    posts.sort(compareNew);
    filteringString = "createdAt";
  } else if (typeOfSorting === "best") {
    posts.sort(compareBest);
    filteringString = "bestScore";
  } else if (typeOfSorting === "hot") {
    posts.sort(compareHot);
    filteringString = "hotScore";
  } else if (typeOfSorting === "top") {
    posts.sort(compareTop);
    filteringString = "numberOfVotes";
  }

  let isBefore = false;
  //FILTERING THE POSTS ARRAY THAT WE MADE WITH BEFORE AND AFTER LIMITS
  //IN CASE OF BEFORE WE NEED TO GET THE LIMIT ELEMENTS BEFORE THE SELECTED ITEM
  //THEN WE NEED TO CHANGE THE VALUES OF STARTING AND ENDING INDICES OF THE POSTS
  if (listingParams.before) {
    //HERE WE GET OUR SPLITTER
    const splitter = await searchForPost(listingParams.before);
    isBefore = true;
    posts = posts.filter((post) => {
      return post[filteringString] > splitter[filteringString];
    });
    //THIS IS THE CASE OF AFTER THEN WE WILL DEAL NORMALLY WITHOUT ANY CHANGES IN THE FOR LOOP BOUNDARIES
  } else if (listingParams.after && !listingParams.before) {
    const splitter = await searchForPost(listingParams.after);
    posts = posts.filter(function (post) {
      return post[filteringString] < splitter[filteringString];
    });
  }

  //EXTRA FILTER IN CASE OF TOP

  //THEN WE WILL GET OUR LIMIT
  let limit = await prepareLimit(listingParams.limit);
  //IF THE LIMIT IS GREATER THAN THE LENGTH OF THE Posts ARRAY THEN WE MUST MAKE IT THE SAME LENGTH
  if (limit > totalInbox.length) {
    limit = totalInbox.length;
  }
  //INITIALLY WE WILL START FROM 0 UNTIL THE LIMIT
  let startingIndex = 0,
    finishIndex = limit;
  //IN CASE OF BEFORE THEN WE WILL START FROM BEFORE INDEX-LIMIT TO THE BEFORE INDEX
  if (isBefore) {
    startingIndex = totalInbox.length - limit;
    finishIndex = totalInbox.length;
  }
  if (startingIndex < 0) {
    startingIndex = 0;
  }
  //OUR CHILDREN ARRAY THAT WE WILL SEND AS RESPONSE
  const children = [];
  for (startingIndex; startingIndex < finishIndex; startingIndex++) {
    //EACH ELEMENT THAT IS RETURNED MUST BE MARKED AS READ
    posts[startingIndex].numberOfViews++;
    await posts[startingIndex].save();
    //GETTING THE ID OF THE ELEMENT THAT WILL BE SENT
    const postData = { id: posts[startingIndex].id };
    postData.data = posts[startingIndex];
    children.push(messageData);
  }
  let after = "",
    before = "";
  if (posts.length) {
    if (isBefore) {
      after = posts[posts.length - 1]._id.toString();
      before = posts[posts.length - limit]._id.toString();
    } else {
      after = posts[limit - 1]._id.toString();
      before = posts[0]._id.toString();
    }
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}
