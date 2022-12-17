/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import { prepareLimit } from "../utils/prepareLimit.js";
import { postListing } from "../utils/preparePostListing.js";
import { extraPostsListing } from "../utils/prepareSubreddit.js";
import { MinKey } from "mongodb";

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

function compareTrending(post1, post2) {
  if (post1.numberOfViews < post2.numberOfViews) {
    return 1;
  }
  if (post1.numberOfViews > post2.numberOfViews) {
    return -1;
  }
  return 0;
}

//GET THE MOST IMPORTANT POSTS
//FILTER THEM DEPENDING ON BEFORE AND AFTER
//IF THEY ARE NOT ENOUGH
//GET MORE FROM POSTS
//THEN SORT ALL OF THE POSTS
//THEN RETURN THEM
export async function homePostsListing(
  user,
  listingParams,
  typeOfSorting,
  isLoggedIn
) {
  let posts = [];
  //WE WILL GET THE MOST IMPORTANT POSTS FIRST WHICH ARE SUBREDDIT POSTS AND FOLLOWING POSTS
  //GETTING SUBREDDIT POSTS
  if (isLoggedIn) {
    const { joinedSubreddits } = await User.findOne({ username: user.username })
      .select("joinedSubreddits")
      .populate({
        path: "joinedSubreddits",
        match: { deletedAt: null },
      });

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
    const { followedUsers } = await User.findOne({ username: user.username })
      .select("followedUsers")
      .populate({
        path: "followedUsers",
        match: { deletedAt: null },
      });
    //GETTING POSTS FROM FOLLOWING PEOPLE
    for (const user of followedUsers) {
      const userPosts = await User.findById(user)
        .select("posts")
        .populate({
          path: "posts",
          match: { deletedAt: null },
        });
      if (userPosts.length !== 0) {
        posts = [...posts, ...userPosts.posts];
      }
    }
  }
  const uniquePosts = new Set();
  posts = posts.filter((post) => {
    const isDuplicate = uniquePosts.has(post.id);
    uniquePosts.add(post.id);
    if (!isDuplicate) {
      return true;
    }
    return false;
  });

  if (typeOfSorting === "top") {
    let filteringDate = new Date();
    let changed = false;
    if (listingParams.time === "year") {
      filteringDate.setFullYear(filteringDate.getFullYear() - 1);
      changed = true;
    } else if (listingParams.time === "month") {
      filteringDate.setFullYear(
        filteringDate.getFullYear(),
        filteringDate.getMonth() - 1
      );
      changed = true;
    } else if (listingParams.time === "week") {
      filteringDate.setFullYear(
        filteringDate.getFullYear(),
        filteringDate.getMonth(),
        filteringDate.getDate() - 7
      );
      changed = true;
    } else if (listingParams.time === "day") {
      filteringDate.setFullYear(
        filteringDate.getFullYear(),
        filteringDate.getMonth(),
        filteringDate.getDate() - 1
      );
      changed = true;
    } else if (listingParams.time === "hour") {
      filteringDate.setHours(filteringDate.getHours() - 1);
      changed = true;
    }
    if (changed) {
      posts = posts.filter(function (post) {
        return post.createdAt >= filteringDate;
      });
    }
  }
  //THEN WE WILL GET OUR LIMIT
  let limit = await prepareLimit(listingParams.limit);
  //WE WILL GET EXTRA POSTS TO FILL THE GAP THAT IS BETWEEN THE FOLLOWED ONES AND THE LIMIT
  const extraPosts = await Post.find({});

  if (typeOfSorting === "new") {
    posts.sort(compareNew);
    extraPosts.sort(compareNew);
  } else if (typeOfSorting === "best") {
    posts.sort(compareBest);
    extraPosts.sort(compareBest);
  } else if (typeOfSorting === "hot") {
    posts.sort(compareHot);
    extraPosts.sort(compareHot);
  } else if (typeOfSorting === "top") {
    posts.sort(compareTop);
    extraPosts.sort(compareTop);
  } else if (typeOfSorting === "trending") {
    posts.sort(compareTrending);
    extraPosts.sort(compareTrending);
  }
  posts = [...posts, ...extraPosts];

  const unique = new Set();
  posts = posts.filter((post) => {
    const isDuplicate = unique.has(post.id);
    unique.add(post.id);
    if (!isDuplicate) {
      return true;
    }
    return false;
  });

  if (posts.length < limit) {
    limit = posts.length;
  }
  let start, end, secondStart;
  if (listingParams.before) {
    end = posts.findIndex(
      (post) => post.id.toString() === listingParams.before.toString()
    );
    start = end - limit;
  } else if (listingParams.after && !listingParams.before) {
    start =
      posts.findIndex(
        (post) => post.id.toString() === listingParams.after.toString()
      ) + 1;
    end = start + limit;
  } else {
    start = 0;
    end = limit;
  }
  if (start < 0) {
    start = 0;
  }
  if (end > posts.length) {
    end = posts.length;
  }
  secondStart = start;

  console.log(start, end);

  //OUR CHILDREN ARRAY THAT WE WILL SEND AS RESPONSE
  const children = [];
  for (start; start < end; start++) {
    //EACH ELEMENT THAT IS RETURNED MUST BE MARKED AS READ
    //NEED TO BE EDITED
    const post = posts[start];
    post.numberOfViews++;
    post.save();
    const postId = post.id.toString();
    let vote = 0,
      saved = false,
      hidden = false,
      spammed = false,
      inYourSubreddit = false;
    if (isLoggedIn) {
      if (user.savedPosts?.find((id) => id.toString() === postId)) {
        saved = true;
      }
      if (user.hiddenPosts?.find((id) => id.toString() === postId)) {
        hidden = true;
      }
      if (user.upvotedPosts?.find((id) => id.toString() === postId)) {
        vote = 1;
      }
      if (user.downvotedPosts?.find((id) => id.toString() === postId)) {
        vote = -1;
      }
      if (
        user.moderatedSubreddits?.find((sr) => sr.name === post.subredditName)
      ) {
        inYourSubreddit = true;
      }
      if (user.spammedPosts?.find((id) => id.toString() === postId)) {
        spammed = true;
      }
    }
    let postData = { id: postId };
    postData.data = {
      id: postId,
      subreddit: post.subredditName,
      postedBy: post.ownerUsername,
      title: post.title,
      link: post.link,
      content: post.content,
      images: post.images,
      video: post.video,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      votes: post.numberOfVotes,
      comments: post.numberOfComments,
      flair: post.flair,
      postedAt: post.createdAt,
      editedAt: post.editedAt,
      sharePostId: post.sharePostId,
      sendReplies: post.sendReplies,
      saved: saved,
      hidden: hidden,
      votingType: vote,
      moderation: post.moderation,
      markedSpam: post.markedSpam,
      inYourSubreddit: inYourSubreddit,
      spammed: spammed,
    };

    children.push(postData);
  }
  let after = "",
    before = "";
  if (posts.length && secondStart < posts.length && end > 0) {
    after = posts[end - 1].id.toString();
    before = posts[secondStart].id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      length: children.length,
      children: children,
    },
  };
}
