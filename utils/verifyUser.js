import jwt from "jsonwebtoken";

export default verifyUser = (req) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return null;
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodedPayload.userId;
  } catch (err) {
    return null;
  }
};
