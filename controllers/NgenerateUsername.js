import User from "./../models/User.js";
import { generateUsername } from "unique-username-generator";

const generateRandomUsername = async (req, res) => {
  try {
    while (true) {
      const typeOfUsername = Math.floor(Math.random() * 2);
      const numOfDigits = Math.floor(Math.random() * 6);
      let RandomUsername;
      if (typeOfUsername) {
        RandomUsername = generateUsername("", numOfDigits, 15);
      } else {
        RandomUsername = generateUsername("-", numOfDigits, 15);
      }
      const user = await User.findOne({ username: RandomUsername });
      if (!user) {
        return res.status(200).json({ username: RandomUsername });
        break;
      }
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  generateRandomUsername,
};
