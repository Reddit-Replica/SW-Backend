import User from "../models/User.js";

// eslint-disable-next-line max-statements
export async function getSubredditDetails(
  subreddit,
  isLoggedIn,
  payload = null
) {
  let isMember = false;
  let isFavorite = false;
  let isModerator = false;

  const details = {
    title: subreddit.title,
    nsfw: subreddit.nsfw,
    nickname: subreddit.viewName,
    type: subreddit.type,
    category: subreddit.category,
    members: subreddit.members,
    // online: subreddit.online,
    description: subreddit.description,
    dateOfCreation: subreddit.dateOfCreation,
    banner: subreddit.banner,
    picture: subreddit.picture,
    views: subreddit.views,
    mainTopic: subreddit.mainTopic,
    subTopics: subreddit.subTopics,
  };

  if (isLoggedIn) {
    const userId = payload.userId;
    const neededUser = await User.findById(userId);
    if (!neededUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    for (let i = 0; i < subreddit.moderators.length; i++) {
      if (subreddit.moderators[i].userID.toString() === userId) {
        isModerator = true;
        break;
      }
    }

    for (let i = 0; i < neededUser.joinedSubreddits.length; i++) {
      if (neededUser.joinedSubreddits[i].name === subreddit.title) {
        isMember = true;
        break;
      }
    }

    for (let i = 0; i < neededUser.favoritesSubreddits.length; i++) {
      if (neededUser.favoritesSubreddits[i].name === subreddit.title) {
        isFavorite = true;
        break;
      }
    }

    details.isModerator = isModerator;
    details.isMember = isMember;
    details.isFavorite = isFavorite;
  }

  return details;
}
