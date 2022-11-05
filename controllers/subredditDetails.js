import Subreddit from "../models/subreddit.js";

/*
{
  "children": {
    "nsfw": true,
    "type": "private",
    "isFavorite": true,
    "title": "string",
    "category": "string",
    "members": 0,
    "online": 0,
    "description": "string",
    "dateOfCreation": "string",
    "flairs": [
      "string"
    ],
    "rules": [
      {
        "ruleTitle": "string",
        "ruleDescription": "string",
        "questions": [
          "string"
        ],
        "ruleFullDescription": "string"
      }
    ],
    "bans": [
      {
        "banTitle": "string",
        "banFullDescription": "string"
      }
    ],
    "moderators": [
      {
        "username": "string",
        "nickname": "string",
        "dateOfModeration": "string",
        "permissions": [
          "string"
        ]
      }
    ],
    "isMember": true,
    "banner": "string",
    "picture": "string",
    "communityTheme": true,
    "views": 0,
    "mainTopic": {
      "topicTitle": "string",
      "subtopics": [
        {}
      ]
    }
  }
}
*/
const subredditDetails = async (req, res) => {
  const subreddit = req.subreddit;
  // console.log(subreddit);

  const resObject = {
    children: {
      title: subreddit.subredditName,
      nsfw: subreddit.communitySettings.NSFW,
      type: subreddit.type,
      category: subreddit.category,
      members: subreddit.numberOfMembers,
      online: subreddit.online,
      description: subreddit.description,
      dateOfCreation: subreddit.dateOfCreation,
      rules: subreddit.communitySettings.rules,
      banner: subreddit.banner,
      picture: subreddit.image,
      flairs: subreddit.communitySettings.flairs,
    },
  };
  // console.log(resObject);
  res.status(200).json(resObject);
};

export default {
  subredditDetails,
};
