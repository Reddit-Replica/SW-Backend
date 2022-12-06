import { body } from "express-validator";
import { validateId } from "../services/subredditFlairs.js";
// eslint-disable-next-line max-len
import {
  addToUserFollowedComments,
  addToCommentFollowedUsers,
} from "../services/commentActionsServices.js";
const followUnfollowValidator = [
  body("commentId").trim().not().isEmpty().withMessage("commentId is required"),
];

const followComment = async (req, res) => {
  try {
    validateId(req.body.commentId);

    const userAndComment = await addToUserFollowedComments(
      req.payload.userId,
      req.body.commentId
    );
    await addToCommentFollowedUsers(
      userAndComment.user,
      userAndComment.comment
    );
    res.status(200).json("Followed comment successfully");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
};

export default {
  followUnfollowValidator,
  followComment,
};
