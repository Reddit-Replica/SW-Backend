import { validationResult } from "express-validator";

/**
 * Middleware used to check the request if there is an error
 * it will send a response with status code 400 with all errors
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function validateRequestSchema(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let message = result.array()[0].msg;

    for (let i = 1; i < result.array().length; i++) {
      message += ` - ${result.array()[i].msg}`;
    }

    return res.status(400).json({ error: message });
  }
  next();
}
