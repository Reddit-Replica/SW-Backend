import User from "../models/User.js";

/**
 * Service to search for a user object with his username and return it in the req
 *
 * @param {Object} req Request
 * @param {String} username Username that we want find
 * @returns {void}
 */
export async function searchForUserService(req, username) {
  const user = await User.findOne({ username: username });
  if (!user) {
    let error = new Error("Didn't find a user with that username");
    error.statusCode = 404;
    throw error;
  }
  req.foundUser = user;
}

/**
 * Service to get the user object from the jwt that was sent in the header
 *
 * @param {Object} req Request
 * @returns {void}
 */
export async function getUserFromJWTService(req) {
  const { userId } = req.payload;
  const user = await User.findById(userId);
  if (!user) {
    let error = new Error("Invalid id from the token");
    error.statusCode = 400;
    throw error;
  }
  req.user = user;
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
export async function blockUserService(user, userToBlock, block) {
  if (user._id.toString() === userToBlock._id.toString()) {
    let error = new Error("User can not block himself");
    error.statusCode = 400;
    throw error;
  }

  // get the index of the id of the user to be blocked if he was blocked before
  const index = user.blockedUsers.findIndex(
    (elem) => elem.toString() === userToBlock._id.toString()
  );

  if (block) {
    if (index === -1) {
      user.blockedUsers.push(userToBlock._id);
      await user.save();
    }
    return {
      statusCode: 200,
      message: "User blocked successfully",
    };
  } else {
    if (index !== -1) {
      user.blockedUsers.splice(index, 1);
      await user.save();
    }
    return {
      statusCode: 200,
      message: "User unblocked successfully",
    };
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
export async function followUserService(user, userToFollow, follow) {
  if (user._id.toString() === userToFollow._id.toString()) {
    let error = new Error("User can not himself himself");
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
    }
    return {
      statusCode: 200,
      message: "User followed successfully",
    };
  } else {
    if (index !== -1) {
      userToFollow.followers.splice(index, 1);
      await userToFollow.save();
    }
    return {
      statusCode: 200,
      message: "User unfollowed successfully",
    };
  }
}
