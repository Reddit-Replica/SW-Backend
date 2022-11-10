import { generateRandomUsernameUtil } from "../utils/generateRandomUsername.js";

const generateRandomUsername = async (req, res) => {
  try {
    while (true) {
      const RandomUsername = await generateRandomUsernameUtil();
      if (RandomUsername === "Couldn't generate") {
        throw new Error("Couldn't generate");
      }
      return res.status(200).json({ username: RandomUsername });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  generateRandomUsername,
};
