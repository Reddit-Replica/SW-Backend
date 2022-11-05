import jwt from "jsonwebtoken";

const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    // console.log(authorizationHeader);
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET);

    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid Token",
    });
  }
};

export default {
  verifyAuthToken,
};
