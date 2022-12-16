import User from "../models/User.js";

/**
 * This function is used to check if there is a loggedIn user and if yes, it makes another
 * check of whether there is a username sent with the query parameters to determine whether
 * the loggedIn user is viewing his pinned posts or someone else.
 * @param {boolean} loggedIn True if there's a logged in user
 * @param {string} userId LoggedIn user ID
 * @param {string} username Username of the user's pinned posts if found
 * @returns {object} The logged in user and the user if not the same
 */
// eslint-disable-next-line max-statements
export async function checkUserPinnedPosts(loggedIn, userId, username) {
  let loggedInUser, user;
  if (loggedIn) {
    loggedInUser = await User.findById(userId)?.populate("pinnedPosts");
    if (!loggedInUser || loggedInUser.deletedAt) {
      const error = new Error("User not found or may be deleted");
      error.statusCode = 400;
      throw error;
    }
    if (!username) {
      user = loggedInUser;
    } else {
      user = await User.findOne({ username: username })?.populate(
        "pinnedPosts"
      );
      // eslint-disable-next-line max-depth
      if (!user || user.deletedAt) {
        const error = new Error("User not found or may be deleted");
        error.statusCode = 400;
        throw error;
      }
    }
  } else if (!loggedIn && !username) {
    const error = new Error("Username is needed");
    error.statusCode = 400;
    throw error;
  } else {
    user = await User.findOne({ username: username })?.populate("pinnedPosts");
    if (!user || user.deletedAt) {
      const error = new Error("User not found or may be deleted");
      error.statusCode = 400;
      throw error;
    }
    loggedInUser = user;
  }
  return {
    loggedInUser: loggedInUser,
    user: user,
  };
}

/**
 * This function sets necessary flags in case there is a logged in user which include the vote
 * made on this post, if the user owns this post and if he is a moderator in the post's subreddit
 * @param {object} loggedInUser logged In user object
 * @param {object} post Current pinned post
 * @returns {object} Contains three flags: vote, yourPost and inYourSubreddit
 */
export function setPinnedPostsFlags(loggedInUser, post) {
  let vote = 0,
    yourPost = false,
    inYourSubreddit = false;
  if (
    loggedInUser.upvotedPosts.find(
      (postId) => postId.toString() === post.id.toString()
    )
  ) {
    vote = 1;
  } else if (
    loggedInUser.downvotedPosts.find(
      (postId) => postId.toString() === post.id.toString()
    )
  ) {
    vote = -1;
  }
  if (
    loggedInUser.posts.find(
      (postId) => postId.toString() === post.id.toString()
    )
  ) {
    yourPost = true;
  }
  if (
    loggedInUser.moderatedSubreddits?.find(
      (sr) => sr.name === post.subredditName
    )
  ) {
    inYourSubreddit = true;
  }
  return {
    vote: vote,
    yourPost: yourPost,
    inYourSubreddit: inYourSubreddit,
  };
}

/**
 * This function returns a pinned post details along with the flags associated with it
 * @param {object} post Pinned post object
 * @param {object} params three flags: vote, yourPost and inYourSubreddit
 */
export function getPinnedPostDetails(post, params) {
  return {
    id: post.id.toString(),
    kind: post.kind,
    subreddit: post.subredditName,
    link: post.link,
    images: post.images,
    video: post.video,
    content: post.content,
    nsfw: post.nsfw,
    spoiler: post.spoiler,
    title: post.title,
    sharePostId: post.sharePostId,
    flair: post.flair,
    comments: post.numberOfComments,
    votes: post.numberOfVotes,
    postedAt: post.createdAt,
    postedBy: post.ownerUsername,
    vote: params.vote,
    yourPost: params.yourPost,
    inYourSubreddit: params.inYourSubreddit,
    locked: post.moderation.lock,
  };
}
