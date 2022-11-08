import mongoose from "mongoose";

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
export function checkId(req, res, next) {
  const paramId = req.params.id;
  const bodyId = req.body.id;

  if (paramId) {
    if (!mongoose.Types.ObjectId.isValid(paramId)) {
      return res.status(400).json({
        error: "In valid id",
      });
    }
  }

  if (bodyId) {
    if (!mongoose.Types.ObjectId.isValid(bodyId)) {
      return res.status(400).json({
        error: "In valid id",
      });
    }
  }

  next();
}
