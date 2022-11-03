import jwt from "jsonwebtoken";

// Document this function [TODO]
function generateJWT(user) {
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.TOKEN_SECRET
  );

  return token;
}

// Document this function [TODO]
function verifyJWT(id, token) {
  try {
    const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decodedPayload.userId === id) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export default {
  generateJWT,
  verifyJWT,
};
