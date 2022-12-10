import Topics from "../models/Topics.js";

const topics = [
  "Activism",
  "Addition Support",
  "Animals And Pets",
  "Anime",
  "Art",
  "Beauty And Makeup",
  "Bussiness, Economics, And Finance",
  "Careers",
  "Cars And Motor Vehicles",
  "Celebrity",
  "Crafts And DIY",
  "Crypto",
  "Culture, Race, And Ethnicity",
  "Family And Relationships",
  "Fashion",
  "Fitness And Nutrition",
  "Funny/Humor",
  "Food And Drink",
  "Gaming",
  "Gender",
  "History",
  "Hobbies",
  "Home and Garden",
  "Internet Culture and Memes",
  "Law",
  "Learning and Education",
  "Marketplace and Deals",
  "Mature Themes and Adults",
  "Medical and Mental Health",
  "Men's Health",
  "Meta/Reddit",
  "Military",
  "Movies",
  "Music",
  "Ourdoors and Nature",
  "Place",
  "Podcasts and Streamers",
  "Politics",
  "Programming",
  "Reading, Writing and Literature",
  "Religion and Spirituality",
  "Science",
  "Sexual Orientation",
  "Sports",
  "Tabletop Games",
  "Technology",
  "Television",
  "Trauma Support",
  "Travel",
  "Woman's Health",
  "World News",
  "None Of These Topics",
];

/**
 * This function is used to insert a set of given topics to the database
 * if they do not already exist.
 *
 * @returns {void}
 */
export async function insertTopicsIfNotExists() {
  const count = await Topics.countDocuments();
  if (count === 0) {
    for (let i = 0; i < topics.length; i++) {
      await new Topics({
        topicName: topics[i],
      }).save();
    }
  }
}

/**
 * Function used to get all the topics stored in the database that can be used for this subreddit.
 *
 * @param {Object} subreddit Subreddit that we want to list its suggested topics
 * @returns {Object} Response object containing [statusCode, data]
 */
export async function getSuggestedTopicsService(subreddit) {
  const allTopics = await Topics.find({}).select("topicName");

  const readyData = allTopics
    .filter(
      (el) =>
        subreddit.mainTopic !== el.topicName &&
        !subreddit.subTopics.includes(el.topicName)
    )
    .map((el) => el.topicName);

  return {
    statusCode: 200,
    data: {
      communityTopics: readyData,
    },
  };
}
