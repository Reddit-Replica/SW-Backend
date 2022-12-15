/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import { prepareLimit } from "../utils/prepareLimit.js";
import { postListing } from "../utils/preparePostListing.js";
import { extraPostsListing } from "../utils/prepareSubreddit.js";

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

  let filteringString;
  //SELECTING ON WHICH ELEMENT WE WILL FILTER
  if (typeOfSorting === "new") {
    filteringString = "createdAt";
  } else if (typeOfSorting === "best") {
    filteringString = "bestScore";
  } else if (typeOfSorting === "hot") {
    filteringString = "hotScore";
  } else if (typeOfSorting === "top") {
    filteringString = "numberOfVotes";
  } else if (typeOfSorting === "trending") {
    filteringString = "numberOfViews";
  }

  let isBefore = false;
  //FILTERING THE POSTS ARRAY THAT WE MADE WITH BEFORE AND AFTER LIMITS
  //IN CASE OF BEFORE WE NEED TO GET THE LIMIT ELEMENTS BEFORE THE SELECTED ITEM
  //THEN WE NEED TO CHANGE THE VALUES OF STARTING AND ENDING INDICES OF THE POSTS
  //IF THERE EXIST POSTS BEFORE THEN THEY WILL BE FILTERED ELSE WE WILL ADD EXTRA POSTS
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
  const uniquePosts = new Set();
  posts = posts.filter((post) => {
    const isDuplicate = uniquePosts.has(post.id);
    uniquePosts.add(post.id);
    if (!isDuplicate) {
      return true;
    }
    return false;
  });
  //THEN WE WILL GET OUR LIMIT
  let limit = await prepareLimit(listingParams.limit);
  const result = await extraPostsListing(
    listingParams.before,
    listingParams.after,
    listingParams.limit,
    typeOfSorting
  );
  //WE WILL GET EXTRA POSTS TO FILL THE GAP THAT IS BETWEEN THE FOLLOWED ONES AND THE LIMIT
  const extraPosts = await Post.find(result.query)
    .limit(limit)
    .sort(result.sort);
  //LOOPING OVER THE EXTRA POSTS TO ADD THE NEEDED NUMBER OF THEM TO THE POSTS THAT WE WILL RETURN
  let ctr = 0;
  while (posts.length < limit) {
    if (ctr === extraPosts.length) {
      break;
    }
    posts.push(extraPosts[ctr]);
    const unique = new Set();
    posts = posts.filter((post) => {
      const isDuplicate = unique.has(post.id);
      unique.add(post.id);
      if (!isDuplicate) {
        return true;
      }
      return false;
    });
    ctr++;
  }

  //SORTING THE POSTS THAT WE GOT USING THE TYPE OF SORTING
  if (typeOfSorting === "new") {
    posts.sort(compareNew);
  } else if (typeOfSorting === "best") {
    posts.sort(compareBest);
  } else if (typeOfSorting === "hot") {
    posts.sort(compareHot);
  } else if (typeOfSorting === "top") {
    posts.sort(compareTop);
  } else if (typeOfSorting === "trending") {
    posts.sort(compareTrending);
  }

  if (posts.length < limit) {
    limit = posts.length;
  }
  //INITIALLY WE WILL START FROM 0 UNTIL THE LIMIT
  let startingIndex = 0,
    finishIndex = limit;
  //IN CASE OF BEFORE THEN WE WILL START FROM BEFORE INDEX-LIMIT TO THE BEFORE INDEX
  if (isBefore) {
    startingIndex = posts.length - limit;
    finishIndex = posts.length;
  }
  if (startingIndex < 0) {
    startingIndex = 0;
  }
  //OUR CHILDREN ARRAY THAT WE WILL SEND AS RESPONSE
  const children = [];
  for (startingIndex; startingIndex < finishIndex; startingIndex++) {
    //EACH ELEMENT THAT IS RETURNED MUST BE MARKED AS READ
    //NEED TO BE EDITED
    posts[startingIndex].numberOfViews++;
    await posts[startingIndex].save();
    //GETTING THE ID OF THE ELEMENT THAT WILL BE SENT
    const postData = { id: posts[startingIndex].id };
    postData.data = posts[startingIndex];
    children.push(postData);
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
      length: children.length,
      children: children,
    },
  };
}

export async function subredditPostListing(user, listingParams, isLoggedIn) {
  const listingResult = await postListing(listingParams);
  // GETTING THE DESIRED FIELD THAT WE WOULD GET DATA FROM
  const result = await User.findOne({ username: user.username })
    .select("posts")
    .populate({
      path: "posts",
      match: listingResult.find,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });
}
