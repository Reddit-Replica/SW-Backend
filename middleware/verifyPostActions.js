import Post from "../models/Post.js";

/**
 * Middleware used to check if the post that we want to perform the action on
 * is exist or not deleted before.
 * It also check if the post belong to the user making the request or no.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function verifyPostActions(req, res, next) {
  const { id } = req.body;
  const { userId } = req.decodedPayload;
  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    return res.status(404).send("Post not found");
  }

  // check if the post does not belong to the user making the request
  if (post.ownerId.toString() !== userId) {
    return res.status(401).send("Access Denied");
  }

  req.post = post;
  next();
}
