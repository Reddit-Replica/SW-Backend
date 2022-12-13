import User from "../models/User.js";

/**
 * Middleware used to check if the post is already pinned in the
 * user's collection of pinned posts and return an appropriate response.
 * The postId and user object are passed with the request as well.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkPinnedPosts(req, res, next) {
  const userId = req.payload.userId;
  const postId = req.body.id;
  try {
    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(404).json("User not found or deleted");
    }
    if (
      req.body.pin &&
      user.pinnedPosts.find((id) => id.toString() === postId)
    ) {
      return res.status(409).json("Post is already pinned");
    }
    req.postId = postId;
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check if the post is already unpinned and not found in the
 * user's collection of pinned posts then return an appropriate response.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkUnpinnedPosts(req, res, next) {
  try {
    if (
      !req.body.pin &&
      !req.user.pinnedPosts.find((id) => id.toString() === req.postId)
    ) {
      return res.status(409).json("Post is already pinned");
    }
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
