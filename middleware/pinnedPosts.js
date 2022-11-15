import User from "../models/User.js";

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
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
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
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
