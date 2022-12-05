/**
 * A Service function used to prepare the subreddit settings
 * @param {Object} subreddit the subreddit object
 * @returns {settings} The prepared object
 */
export function prepareSubredditSettings(subreddit) {
  const settings = {
    communityName: subreddit.title,
    communityDescription: subreddit.description,
    sendWelcomeMessage: subreddit.subredditSettings.sendWelcomeMessage,
    language: subreddit.subredditSettings.language,
    type: subreddit.type,
    NSFW: subreddit.nsfw,
    mainTopic: subreddit.mainTopic,
    sunTopics: subreddit.subTopics,
  };

  if (subreddit.type === "Private") {
    settings.acceptingRequestsToJoin =
      subreddit.subredditSettings.acceptingRequestsToJoin;
  } else if (subreddit.type === "Restricted") {
    settings.acceptingRequestsToPost =
      subreddit.subredditSettings.acceptingRequestsToPost;
    settings.approvedUsersHaveTheAbilityTo =
      subreddit.subredditSettings.approvedUsersHaveTheAbilityTo;
  }

  return settings;
}
