import jwt from "jsonwebtoken";
import Token from "../models/VerifyToken.js";
import crypto from "crypto";

// Document this function [TODO]
export function generateJWT(user) {
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.TOKEN_SECRET
  );

  return token;
}

export async function generateVerifyToken(userId) {
  try {
    const token = await new Token({
      userId: userId,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    return token.token;
  } catch (error) {
    throw new Error("Could not create a token");
  }
}
