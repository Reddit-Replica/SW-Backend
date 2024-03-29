import User from "../models/User.js";
import mongoose from "mongoose";
import { createFollowUserNotification } from "./notificationServices.js";

/**
 * Service to search for a user object with his username and return it
 *
 * @param {Object} req Request
 * @param {String} username Username that we want find
 * @returns {Object} User found
 */
export async function searchForUserService(username) {
  const user = await User.findOne({ username: username, deletedAt: null });
  if (!user) {
    let error = new Error("Didn't find a user with that username");
    error.statusCode = 404;
    throw error;
  }
  return user;
}

/**
 * Service to get the user object from the jwt that was sent in the header
 *
 * @param {Object} req Request
 * @param {String} userId Id of the user
 * @returns {Object} User found
 */
export async function getUserFromJWTService(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    let error = new Error("Invalid id from the token");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    let error = new Error("Didn't find a user with that username");
    error.statusCode = 404;
    throw error;
  }
  return user;
}

/**
 * Service used to block or unblock a certain user after checking that
 * they are different users.
 * If the operation was block operation, then we check that the user was not blocked before first.
 *
 * @param {Object} user User Object
 * @param {Object} userToBlock User that we want to block or unblock
 * @param {Boolean} block Flag to know if the operation is block or unblock
 * @returns {Object} Response to the request containing [statusCode, message]
 */
// eslint-disable-next-line max-statements
export async function blockUserService(user, userToBlock, block) {
  if (user._id.toString() === userToBlock._id.toString()) {
    let error = new Error("User can not block himself");
    error.statusCode = 400;
    throw error;
  }

  // get the index of the id of the user to be blocked if he was blocked before
  const index = user.blockedUsers.findIndex(
    (elem) => elem.blockedUserId.toString() === userToBlock._id.toString()
  );

  if (block) {
    if (index === -1) {
      user.blockedUsers.push({
        blockedUserId: userToBlock._id,
        blockDate: Date.now(),
      });
      await user.save();
      return {
        statusCode: 200,
        message: "User blocked successfully",
      };
    } else {
      return {
        statusCode: 400,
        message: "User has been already blocked",
      };
    }
  } else {
    if (index !== -1) {
      user.blockedUsers.splice(index, 1);
      await user.save();
      return {
        statusCode: 200,
        message: "User unblocked successfully",
      };
    } else {
      return {
        statusCode: 400,
        message: "User was not blocked",
      };
    }
  }
}

/**
 * Service used to follow or unfollow a certain user after checking that
 * they are different users.
 * If the operation was followed operation, then we check that the user was not followeded before first.
 *
 * @param {Object} user User Object
 * @param {Object} userToFollow User that we want to follow or unfollow
 * @param {Boolean} follow Flag to know if the operation is follow or unfollow
 * @returns {Object} Response to the request containing [statusCode, message]
 */
// eslint-disable-next-line max-statements
export async function followUserService(user, userToFollow, follow) {
  if (user._id.toString() === userToFollow._id.toString()) {
    let error = new Error("User can not follow himself");
    error.statusCode = 400;
    throw error;
  }

  // get the index of the id of the current user in followers list for the user to follow
  const index = userToFollow.followers.findIndex(
    (elem) => elem.toString() === user._id.toString()
  );

  if (follow) {
    if (index === -1) {
      userToFollow.followers.push(user._id);
      await userToFollow.save();

      user.followedUsers.push(userToFollow._id);
      await user.save();
      await createFollowUserNotification(
        user.username,
        userToFollow._id.toString()
      );
      return {
        statusCode: 200,
        message: "User followed successfully",
      };
    } else {
      return {
        statusCode: 400,
        message: "User has been already followed",
      };
    }
  } else {
    if (index !== -1) {
      userToFollow.followers.splice(index, 1);
      await userToFollow.save();

      const followIndex = user.followedUsers.findIndex(
        (elem) => elem.toString() === userToFollow._id.toString()
      );
      user.followedUsers.splice(followIndex, 1);
      await user.save();
      return {
        statusCode: 200,
        message: "User unfollowed successfully",
      };
    } else {
      return {
        statusCode: 400,
        message: "User was not followed",
      };
    }
  }
}

/**
 * Service used to get the data of a certain user,
 * check if the logged in user is following him or no, and
 * check if the logged in user blocked him or no
 *
 * @param {String} username User name to get his data
 * @param {String} loggedInUserId Id of the logged in user
 * @returns {Object} Response to the request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function getUserAboutDataService(username, loggedInUserId) {
  const user = await User.findOne({
    username: username,
    deletedAt: null,
  }).populate("moderatedSubreddits.subredditId");
  if (!user) {
    return {
      statusCode: 404,
      data: "Didn't find a user with that username",
    };
  }

  let loggedInUser = null;
  if (loggedInUserId) {
    if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
      let error = new Error("Invalid id from the token");
      error.statusCode = 400;
      throw error;
    }
    loggedInUser = await User.findById(loggedInUserId).select(
      "joinedSubreddits blockedUsers"
    );
  }

  let moderatorOf = [];
  for (let i = 0; i < user.moderatedSubreddits.length; i++) {
    if (!user.moderatedSubreddits[i].subredditId.deletedAt) {
      // check if the logged in user follows that subreddit
      let followed = false;
      if (loggedInUser) {
        const index = loggedInUser.joinedSubreddits.findIndex((ele) => {
          return (
            ele.subredditId.toString() ===
            user.moderatedSubreddits[i].subredditId._id.toString()
          );
        });
        followed = index !== -1;
      }

      moderatorOf.push({
        subredditId: user.moderatedSubreddits[i].subredditId._id,
        subredditName: user.moderatedSubreddits[i].subredditId.title,
        numOfMembers: user.moderatedSubreddits[i].subredditId.members,
        nsfw: user.moderatedSubreddits[i].subredditId.nsfw,
        followed: followed,
      });
    }
  }

  // check if the user was blocked by the logged in user
  // then check if the user was followed by the logged in user
  let blocked = false,
    followed = false;
  if (loggedInUser) {
    const index = loggedInUser.blockedUsers.findIndex(
      (elem) => elem.blockedUserId.toString() === user._id.toString()
    );
    blocked = index !== -1;

    // eslint-disable-next-line new-cap
    followed = user.followers.includes(mongoose.Types.ObjectId(loggedInUserId));
  }

  return {
    statusCode: 200,
    data: {
      displayName: user.displayName,
      about: user.about,
      banner: user.banner,
      picture: user.avatar,
      karma: user.karma,
      cakeDate: user.createdAt,
      socialLinks: user.userSettings.socialLinks,
      nsfw: user.userSettings.nsfw,
      followed: followed,
      blocked: blocked,
      moderatorOf: moderatorOf,
    },
  };
}

/**
 * Function used to clear user's history posts
 *
 * @param {Object} user User object that we want to clear his history
 * @returns {Object} Response to the request containing [statusCode, message]
 */
export async function clearHistoyService(user) {
  user.historyPosts = [];
  await user.save();

  return {
    statusCode: 200,
    message: "History cleared successfully",
  };
}

/**
 * A service function used to get the karma and the join date of any user
 *
 * @param {String} username the username of the user to get details
 * @returns {Object} containing karma and joinDate
 */
export async function getUserDetailsService(username) {
  const neededUser = await User.findOne({
    username: username,
    deletedAt: null,
  });
  if (!neededUser) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return {
    karma: neededUser.karma,
    joinDate: neededUser.createdAt,
  };
}

/**
 *  A Service function to get the user followed users
 *
 * @param {String} userId Id of the user
 * @returns {Object} preparedResponse the prepared response for the controller
 */
export async function getUserFollowedUsersService(userId) {
  const preparedResponse = [];
  const neededUser = await User.findById(userId);
  if (!neededUser || neededUser.deletedAt) {
    const error = new Error("User isn't found");
    error.statusCode = 404;
    throw error;
  }

  await neededUser.populate("followedUsers");
  neededUser.followedUsers.forEach((user) => {
    preparedResponse.push({
      username: user.username,
      displayName: user.displayName,
      picture: user.avatar,
    });
  });

  return preparedResponse;
}
