/**
 * A Service function used to prepare the subreddit settings
 * @param {Object} subreddit the subreddit object
 * @returns {settings} The prepared object
 */
export function prepareSubredditSettings(subreddit) {
  const settings = {
    communityName: subreddit.viewName,
    communityDescription: subreddit.description,
    sendWelcomeMessage: subreddit.subredditSettings.sendWelcomeMessage,
    language: subreddit.subredditSettings.language,
    type: subreddit.type,
    region: subreddit.subredditSettings.region,
    NSFW: subreddit.nsfw,
    mainTopic: subreddit.mainTopic,
    subTopics: subreddit.subTopics,
    welcomeMessage: subreddit.subredditSettings.welcomeMessage,
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

/**
 * A function used to validate the settings of the subreddit before updating the subreddit settings and throws an error if the settings is invalid
 * @param {Object} settings the subreddit settings object
 * @returns {void}
 */
export function validateSubredditSettings(settings) {
  if (
    settings.Type === "Private" &&
    !settings.hasOwnProperty("acceptingRequestsToJoin")
  ) {
    const error = new Error("acceptingRequestsToJoin is required");
    error.statusCode = 400;
    throw error;
  }
  if (
    settings.Type === "Restricted" &&
    (!settings.hasOwnProperty("acceptingRequestsToPost") ||
      !settings.hasOwnProperty("approvedUsersHaveTheAbilityTo"))
  ) {
    const error = new Error(
      "acceptingRequestsToPost and approvedUsersHaveTheAbilityTo is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    (settings.sendWelcomeMessage === true ||
      settings.sendWelcomeMessage === "true") &&
    !settings.welcomeMessage
  ) {
    const error = new Error("welcomeMessage is required");
    error.statusCode = 400;
    throw error;
  }
}

/**
 * A Service function used to update the subreddit settings
 * @param {Object} subreddit the subreddit object
 * @param {Object} settings the subreddit settings object
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function updateSubredditSettings(subreddit, settings) {
  if (!settings.hasOwnProperty("communityDescription")) {
    const error = new Error("communityDescription is required");
    error.statusCode = 400;
    throw error;
  }
  validateSubredditSettings(settings);
  const subTopics = [...new Set(settings.subTopics)];
  subreddit.viewName = settings.communityName;
  subreddit.mainTopic = settings.mainTopic;
  subreddit.subTopics = subTopics;
  subreddit.description = settings.communityDescription;
  subreddit.nsfw = settings.NSFW;
  subreddit.type = settings.Type;
  subreddit.subredditSettings.sendWelcomeMessage = settings.sendWelcomeMessage;
  subreddit.subredditSettings.language = settings.language;
  if (
    settings.sendWelcomeMessage === true ||
    settings.sendWelcomeMessage === "true"
  ) {
    subreddit.subredditSettings.welcomeMessage = settings.welcomeMessage;
  }
  if (settings.Region) {
    subreddit.subredditSettings.region = settings.Region;
  }
  if (settings.Type === "Private") {
    subreddit.subredditSettings.acceptingRequestsToJoin =
      settings.acceptingRequestsToJoin;
  }
  if (settings.Type === "Restricted") {
    subreddit.subredditSettings.acceptingRequestsToPost =
      settings.acceptingRequestsToPost;
    subreddit.subredditSettings.approvedUsersHaveTheAbilityTo =
      settings.approvedUsersHaveTheAbilityTo;
  }
  // console.log(subreddit.subredditSettings);
  await subreddit.save();
}
