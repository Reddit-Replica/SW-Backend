/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import Post from "../models/Post.js";
import { prepareLimit } from "../utils/prepareLimit.js";

export async function homePostsListing(
  user,
  listingParams,
  typeOfSorting,
  isLoggedIn
) {
  let posts = [];
  const filteringProperties = await prepareFiltering(
    typeOfSorting,
    listingParams
  );
  let extraPostsIndex = filteringProperties.skip;
  let extraPostsLimit = filteringProperties.limit;
  let extraPostsUsersFilter, extraPostsSubredditFilter,hiddenPostsFilter;
  //WE WILL GET THE MOST IMPORTANT POSTS FIRST WHICH ARE SUBREDDIT POSTS AND FOLLOWING POSTS
  //GETTING SUBREDDIT POSTS
  if (isLoggedIn) {
    var { joinedSubreddits } = await User.findOne({ username: user.username })
      .select("joinedSubreddits")
      .populate({
        path: "joinedSubreddits",
        match: { deletedAt: null },
      });
    //GETTING FOLLOWED PEOPLE NEEDS TO BE EDITED TO FOLLOWING WHEN
    var { followedUsers } = await User.findOne({ username: user.username })
      .select("followedUsers")
      .populate({
        path: "followedUsers",
        match: { deletedAt: null },
      });

    let userJoinedSubreddits = joinedSubreddits.map(
      (subreddit) => subreddit.name
    );
    var hiddenArr=[];
    var { hiddenPosts }=await User.findOne({ username:user.username }).select("hiddenPosts");
    for (let i=0;i<hiddenPosts.length;i++){
      hiddenArr.push(hiddenPosts[i].toString());
    }

    extraPostsUsersFilter = followedUsers;
    extraPostsSubredditFilter = userJoinedSubreddits;
    hiddenPostsFilter=hiddenArr;

    const importantPosts = await Post.find({
      $or: [
        {
          $and: [
            { subredditName: { $in: userJoinedSubreddits } },
            { ownerId: { $nin: [...followedUsers] } },
          ],
        },
        { ownerId: { $in: [...followedUsers] } },
      ],
      deletedAt: null,
      createdAt: { $gt: filteringProperties.filteringDate },
      _id:{ $nin:[...hiddenArr] },
    }).sort(filteringProperties.sort);
    if (
      importantPosts.length >=
      filteringProperties.skip + filteringProperties.limit
    ) {
      extraPostsLimit = 0;
      posts = [
        ...importantPosts.slice(
          filteringProperties.skip,
          filteringProperties.skip + filteringProperties.limit
        ),
      ];
    } else if (importantPosts.length <= filteringProperties.skip) {
      extraPostsIndex = filteringProperties.skip - importantPosts.length;
    } else if (
      importantPosts.length > filteringProperties.skip &&
      importantPosts.length <
        filteringProperties.skip + filteringProperties.limit
    ) {
      extraPostsIndex = 0;
      extraPostsLimit =
        filteringProperties.limit -
        (importantPosts.length - filteringProperties.skip);
      posts = [
        ...importantPosts.slice(
          filteringProperties.skip,
          importantPosts.length
        ),
      ];
    }
  }
  let extraPosts;
  if (extraPostsLimit !== 0) {
    if (isLoggedIn) {
      extraPosts = await Post.find({
        subredditName: { $nin: extraPostsSubredditFilter },
        ownerId: { $nin: [...extraPostsUsersFilter] },
        deletedAt: null,
        createdAt: { $gt: filteringProperties.filteringDate },
        _id:{ $nin:[...hiddenPostsFilter] },
      })
        .sort(filteringProperties.sort)
        .limit(extraPostsLimit)
        .skip(extraPostsIndex);
    } else {
      extraPosts = await Post.find({
        deletedAt: null,
        createdAt: { $gt: filteringProperties.filteringDate },
      })
        .sort(filteringProperties.sort)
        .limit(extraPostsLimit)
        .skip(extraPostsIndex);
    }
    posts = [...posts, ...extraPosts];
  }

  //OUR CHILDREN ARRAY THAT WE WILL SEND AS RESPONSE
  const children = [];
  for (let i = 0; i < posts.length; i++) {
    //EACH ELEMENT THAT IS RETURNED MUST BE MARKED AS READ
    //NEED TO BE EDITED
    const post = posts[i];
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
    let flair;
    if (post.flair) {
      flair = await flair.findById(post.flair);
    }
    let postData = { id: postId };
    postData.data = {
      id: postId,
      kind: post.kind,
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
      flair: flair,
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
  if (!listingParams.after) {
    listingParams.after = 0;
  }
  if (!listingParams.before) {
    listingParams.before = 0;
  }
  if (posts.length) {
    if (listingParams.after) {
      after = parseInt(filteringProperties.skip) + posts.length;
      before = parseInt(filteringProperties.skip);
    } else if (listingParams.before) {
      after = parseInt(listingParams.before);
      before = parseInt(listingParams.before) - posts.length;
    } else {
      after = parseInt(listingParams.after) + posts.length;
      before = parseInt(listingParams.after);
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

async function prepareFiltering(typeOfSorting, listingParams) {
  const result = {};
  result.sort = {};
  if (typeOfSorting === "new") {
    result.sort = { createdAt: -1, title: 1 };
  } else if (typeOfSorting === "best") {
    result.sort = { bestScore: -1, title: 1 };
  } else if (typeOfSorting === "hot") {
    result.sort = { hotScore: -1, title: 1 };
  } else if (typeOfSorting === "top") {
    result.sort = { numberOfVotes: -1, title: 1 };
  } else if (typeOfSorting === "trending") {
    result.sort = { numberOfViews: -1, title: 1 };
  }

  result.query = { deletedAt: null };

  let filteringDate = new Date();

  let changed = false;
  if (typeOfSorting === "top") {
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
  }
  if (!changed) {
    filteringDate.setFullYear(1970);
  }
  result.filteringDate = filteringDate;

  result.limit = prepareLimit(parseInt(listingParams.limit));

  result.skip = 0;
  if (listingParams.after) {
    if (parseInt(listingParams.after) < 0) {
      listingParams.after = 0;
    }
    if (!isNaN(parseInt(listingParams.after))) {
    result.skip = parseInt(listingParams.after);
    }

  } else if (listingParams.before) {
    if (parseInt(listingParams.before) < 0) {
      listingParams.before = 0;
    }
    if (!isNaN(parseInt(listingParams.before))&&!isNaN(parseInt(listingParams.limit))) {
result.skip =
      parseInt(listingParams.before) - parseInt(listingParams.limit);
}
  }

  if (result.skip < 0) {
    result.skip = 0;
  }
  if (listingParams.before < result.limit) {
    result.limit = listingParams.before;
  }

  return result;
}
