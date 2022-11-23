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
  try {
    let { id } = req.body;
    if (!id) {
      id = req.query.id;
    }
    const { userId } = req.payload;
    const post = await Post.findById(id);

    if (!post || post.deletedAt) {
      return res.status(404).json("Post not found");
    }

    // check if the post does not belong to the user making the request
    if (post.ownerId.toString() !== userId) {
      return res.status(401).json("Access Denied");
    }

    req.post = post;
    next();
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
}
