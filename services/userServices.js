import User from "../models/User.js";

export async function searchForUserService(req) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    let error = new Error("Didn't find a user with that username");
    error.statusCode = 404;
    throw error;
  }
  req.foundUser = user;
}

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
