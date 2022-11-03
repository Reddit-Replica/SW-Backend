import jwt from "jsonwebtoken";

// Document this function [TODO]
export default function generateJWT(user) {
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.TOKEN_SECRET
  );

  return token;
}
